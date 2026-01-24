import React from 'react';
import { headers } from 'next/headers';
import ClientPage from './client-page';

// --- GEO-LOCATION CONFIG ---
const STATE_COPY: Record<string, { hero: string, authority: string, risk: string }> = {
    TX: {
        hero: "FMCSA inspection patterns impacting Texas carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across Texas.",
        risk: "In Texas, a single inspection can change your risk profile overnight."
    },
    CA: {
        hero: "FMCSA inspection patterns impacting California carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across California.",
        risk: "In California, a single inspection can change your risk profile overnight."
    },
    FL: {
        hero: "FMCSA inspection patterns impacting Florida carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across Florida.",
        risk: "In Florida, a single inspection can change your risk profile overnight."
    },
    IL: {
        hero: "FMCSA inspection patterns impacting Illinois carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across Illinois.",
        risk: "In Illinois, a single inspection can change your risk profile overnight."
    },
    GA: {
        hero: "FMCSA inspection patterns impacting Georgia carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across Georgia.",
        risk: "In Georgia, a single inspection can change your risk profile overnight."
    },
    PA: {
        hero: "FMCSA inspection patterns impacting Pennsylvania carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across Pennsylvania.",
        risk: "In Pennsylvania, a single inspection can change your risk profile overnight."
    },
    OH: {
        hero: "FMCSA inspection patterns impacting Ohio carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across Ohio.",
        risk: "In Ohio, a single inspection can change your risk profile overnight."
    },
    NJ: {
        hero: "FMCSA inspection patterns impacting New Jersey carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across New Jersey.",
        risk: "In New Jersey, a single inspection can change your risk profile overnight."
    },
    NY: {
        hero: "FMCSA inspection patterns impacting New York carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across New York.",
        risk: "In New York, a single inspection can change your risk profile overnight."
    },
    NC: {
        hero: "FMCSA inspection patterns impacting North Carolina carriers — translated into real-time risk intelligence.",
        authority: "Used by owner-operators & small fleets across North Carolina.",
        risk: "In North Carolina, a single inspection can change your risk profile overnight."
    }
};

const DEFAULT_COPY = {
    hero: "Public FMCSA inspection signals translated into a real-time risk radar for your operation.",
    authority: "Used by owner-operators & small fleets across the U.S.",
    risk: "FMCSA data updates often — risk can shift after a single inspection."
};


export default async function LandingPage() {
    const headersList = await headers();
    const region = headersList.get('x-vercel-ip-region') || 'DEFAULT';
    const copy = STATE_COPY[region] || DEFAULT_COPY;

    return <ClientPage copy={copy} />;
}
