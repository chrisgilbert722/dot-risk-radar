import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchFMCSACarrierData } from "@/lib/fmcsa/client";
import { resend, EMAIL_FROM } from "@/lib/email";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
    try {
        const { data: monitoredDots, error } = await supabaseAdmin
            .from("monitored_dots")
            .select("dot_number");

        if (error) throw error;

        for (const row of monitoredDots ?? []) {
            const carrier = await fetchFMCSACarrierData(row.dot_number);

            await supabaseAdmin.from("dot_snapshots").insert({
                dot_number: row.dot_number,
                payload: carrier,
            });
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message ?? "Monitoring failed" },
            { status: 500 }
        );
    }
}
