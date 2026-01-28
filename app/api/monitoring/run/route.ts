import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchFMCSACarrierData, FMCSACarrierData } from '@/lib/fmcsa/client';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Helper to hash JSON payload
function hashPayload(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export async function POST(request: NextRequest) {
    // SECURITY: This endpoint should ideally be protected by a cron secret.
    // For MVP/Debug, we allow it to be called openly (or simple manual check).
    // In production, check request.headers.get('authorization') === process.env.CRON_SECRET

    const supabase = await createClient();

    try {
        // 1. Get all unique monitored DOTs
        // We only care about distinct DOTs to avoid duplicate fetching
        const { data: dots, error: dotError } = await supabase
            .from('monitored_dots')
            .select('dot_number')
            .order('dot_number'); // ordering for stability

        if (dotError) throw dotError;

        if (!dots || dots.length === 0) {
            return NextResponse.json({ ok: true, message: 'No monitored DOTs found.' });
        }

        // De-duplicate (though SQL distinct could do this, Set is safer if multiple users watch same dot)
        const uniqueDots = Array.from(new Set(dots.map(d => d.dot_number)));
        const results = [];

        console.log(`[Monitoring Engine] Starting run for ${uniqueDots.length} DOTs.`);

        for (const dot of uniqueDots) {
            // 2. Fetch latest FMCSA data
            const result = await fetchFMCSACarrierData(dot);

            if (!result.success) {
                console.error(`[Monitoring Engine] Failed to fetch DOT ${dot}: ${result.error}`);
                results.push({ dot, status: 'error', error: result.error });
                continue;
            }

            const currentData = result.data;
            const currentHash = hashPayload(currentData);

            // 3. Get latest snapshot from DB
            const { data: latestSnapshot } = await supabase
                .from('dot_snapshots')
                .select('*')
                .eq('dot_number', dot)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // 4. Compare Hash
            if (latestSnapshot && latestSnapshot.snapshot_hash === currentHash) {
                // No change
                // console.log(`[Monitoring Engine] No change for DOT ${dot}`);
                results.push({ dot, status: 'skipped', reason: 'no_change' });
                continue;
            }

            // 5. Change Detected -> Insert new snapshot
            console.log(`[Monitoring Engine] Change detected for DOT ${dot}. Saving snapshot.`);
            const { error: snapError } = await supabase
                .from('dot_snapshots')
                .insert({
                    dot_number: dot,
                    snapshot_hash: currentHash,
                    raw_data: currentData
                });

            if (snapError) {
                console.error(`[Monitoring Engine] Snapshot insert failed for ${dot}:`, snapError);
                results.push({ dot, status: 'error', error: 'snapshot_failed' });
                continue;
            }

            // 6. Generate Alerts (Diff Logic)
            // If there was a previous snapshot, compare key fields
            if (latestSnapshot) {
                const oldData = latestSnapshot.raw_data as FMCSACarrierData;
                const alertsToCreate = [];

                // 6a. OOS Rate Spike (Example logic)
                // Note: normalized interface doesn't strictly have OOS rates yet (carrier object is partial).
                // Assuming we might have parsed them or accessing raw properties if available.
                // For MVP, we'll alert on 'operatingStatus' change or 'outOfServiceDate' change.

                if (oldData.operatingStatus !== currentData.operatingStatus) {
                    alertsToCreate.push({
                        type: 'risk_increase',
                        summary: `Operating Status changed from "${oldData.operatingStatus}" to "${currentData.operatingStatus}"`
                    });
                }

                if (oldData.outOfServiceDate !== currentData.outOfServiceDate) {
                    alertsToCreate.push({
                        type: 'oos_spike', // Reusing type for OOS event
                        summary: `Out of Service Date updated: ${currentData.outOfServiceDate}`
                    });
                }

                // 6b. Generic "New Data" alert if everything else matches but hash differs
                if (alertsToCreate.length === 0) {
                    alertsToCreate.push({
                        type: 'violation', // Generic bucket for now
                        summary: `FMCSA data profile updated (minor changes).`
                    });
                }

                // 7. Fan-out alerts to all users watching this DOT
                if (alertsToCreate.length > 0) {
                    const { data: subscribers } = await supabase
                        .from('monitored_dots')
                        .select('user_id')
                        .eq('dot_number', dot);

                    if (subscribers && subscribers.length > 0) {
                        const alertRows = [];
                        for (const sub of subscribers) {
                            for (const alert of alertsToCreate) {
                                alertRows.push({
                                    user_id: sub.user_id,
                                    dot_number: dot,
                                    alert_type: alert.type,
                                    summary: alert.summary,
                                    is_read: false
                                });
                            }
                        }

                        if (alertRows.length > 0) {
                            await supabase.from('alerts').insert(alertRows);
                            console.log(`[Monitoring Engine] Generated ${alertRows.length} alerts for DOT ${dot}`);
                        }
                    }
                }
            }

            results.push({ dot, status: 'processed', alerts: 1 }); // Simplification
        }

        return NextResponse.json({ ok: true, results });

    } catch (error: any) {
        console.error('[Monitoring Engine] Fatal error:', error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
