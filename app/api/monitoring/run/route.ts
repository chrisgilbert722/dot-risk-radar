import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { fetchFMCSACarrierData, FMCSACarrierData } from '@/lib/fmcsa/client';
import { resend, EMAIL_FROM } from '@/lib/email';
import {
    computeSeverity,
    computeFingerprint,
    maybeEscalateSeverity,
    shouldCreateAlert,
    AlertType
} from '@/lib/alerts/intelligence';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPayload(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // User-scoped client (cookies-based)
    const supabase = createRouteHandlerClient({ cookies });

    // Admin client (service role)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { data: dots, error: dotError } = await supabaseAdmin
            .from('monitored_dots')
            .select('dot_number')
            .order('dot_number');

        if (dotError) throw dotError;

        if (!dots || dots.length === 0) {
            return NextResponse.json({ ok: true, message: 'No monitored DOTs found.' });
        }

        const uniqueDots = Array.from(new Set(dots.map(d => d.dot_number)));
        const results = [];
        let emailsSent = 0;

        console.log(`[Monitoring Engine] Starting run for ${uniqueDots.length} DOTs.`);

        for (const dot of uniqueDots) {
            const result = await fetchFMCSACarrierData(dot);

            if (!result.success) {
                console.error(`[Monitoring Engine] Failed to fetch DOT ${dot}: ${result.error}`);
                results.push({ dot, status: 'error', error: result.error });
                continue;
            }

            const currentData = result.data;
            const currentHash = hashPayload(currentData);

            const { data: latestSnapshot } = await supabase
                .from('dot_snapshots')
                .select('*')
                .eq('dot_number', dot)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (latestSnapshot && latestSnapshot.snapshot_hash === currentHash) {
                results.push({ dot, status: 'skipped', reason: 'no_change' });
                continue;
            }

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

            if (latestSnapshot) {
                const oldData = latestSnapshot.raw_data as FMCSACarrierData;
                const rawAlerts: { type: AlertType, summary: string, diffKey: string }[] = [];

                if (oldData.operatingStatus !== currentData.operatingStatus) {
                    rawAlerts.push({
                        type: 'risk_increase',
                        summary: `Operating Status changed from "${oldData.operatingStatus}" to "${currentData.operatingStatus}"`,
                        diffKey: 'status_change'
                    });
                }

                if (oldData.outOfServiceDate !== currentData.outOfServiceDate) {
                    rawAlerts.push({
                        type: 'oos_spike',
                        summary: `Out of Service Date updated: ${currentData.outOfServiceDate}`,
                        diffKey: `oos_${currentData.outOfServiceDate}`
                    });
                }

                if (rawAlerts.length === 0) {
                    rawAlerts.push({
                        type: 'violation',
                        summary: `FMCSA data profile updated (minor changes).`,
                        diffKey: `generic_update_${currentHash}`
                    });
                }

                if (rawAlerts.length > 0) {
                    const { data: subscribers } = await supabase
                        .from('monitored_dots')
                        .select('user_id')
                        .eq('dot_number', dot);

                    if (subscribers && subscribers.length > 0) {
                        for (const sub of subscribers) {
                            const { data: userData } = await supabaseAdmin.auth.admin.getUserById(sub.user_id);
                            const email = userData?.user?.email;

                            // Fetch recent alerts count for escalation context
                            const { count } = await supabase
                                .from('alerts')
                                .select('*', { count: 'exact', head: true })
                                .eq('user_id', sub.user_id)
                                .eq('dot_number', dot)
                                .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()); // 14 days

                            const recentCount = count || 0;

                            for (const rawAlert of rawAlerts) {
                                // 1. Compute Fingerprint
                                const fingerprint = computeFingerprint(dot, rawAlert.type, rawAlert.diffKey);

                                // 2. Compute Base Severity
                                let severity = computeSeverity(rawAlert.type);

                                // 3. Escalate?
                                severity = maybeEscalateSeverity(severity, recentCount);

                                // 4. Check Dedupe (Optimistic - we rely on DB unique constraint to skip if exists)
                                // We proceed to attempt insert.

                                const alertRow = {
                                    user_id: sub.user_id,
                                    dot_number: dot,
                                    alert_type: rawAlert.type,
                                    summary: rawAlert.summary,
                                    severity: severity,
                                    fingerprint: fingerprint,
                                    is_read: false,
                                    is_emailed: false
                                };

                                // 5. Send Email (Only Warning/Critical)
                                if (email && (severity === 'warning' || severity === 'critical')) {
                                    try {
                                        await resend.emails.send({
                                            from: EMAIL_FROM,
                                            to: email,
                                            subject: `[${severity.toUpperCase()}] DOT Risk Alert: ${dot}`,
                                            html: `<p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
                                                   <p><strong>Type:</strong> ${rawAlert.type}</p>
                                                   <p>${rawAlert.summary}</p>
                                                   <p><a href="https://dotriskradar.com/dashboard">View Dashboard</a></p>`
                                        });
                                        alertRow.is_emailed = true;
                                        emailsSent++;
                                    } catch (emailErr) {
                                        console.error(`[Monitoring Engine] Failed to send email to ${email}`, emailErr);
                                    }
                                }

                                // 6. Insert (Upsert to handle uniqueness safely or just Insert and ignore error)
                                // "treat as success/no-op"
                                const { error: insertError } = await supabase.from('alerts').insert(alertRow);

                                if (insertError) {
                                    // Postgres 23505 is Unique Violation
                                    if (insertError.code === '23505') {
                                        console.log(`[Monitoring Engine] Duplicate alert skipped: ${fingerprint}`);
                                    } else {
                                        console.error(`[Monitoring Engine] Alert insert failed:`, insertError);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            results.push({ dot, status: 'processed' });
        }

        return NextResponse.json({ ok: true, results, emailsSent });

    } catch (error: any) {
        console.error('[Monitoring Engine] Fatal error:', error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
