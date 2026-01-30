
import * as React from 'react';

interface RiskAlertEmailProps {
    companyName: string;
    dotNumber: string;
    alertType: string;
    message: string;
    alertId: string;
}

export const RiskAlertEmail: React.FC<Readonly<RiskAlertEmailProps>> = ({
    companyName,
    dotNumber,
    alertType,
    message,
    alertId,
}) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h2 style={{ color: '#E11D48' }}>Risk Alert: {companyName}</h2>
        <p><strong>DOT Number:</strong> {dotNumber}</p>

        <div style={{ padding: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', margin: '20px 0' }}>
            <strong>{alertType}</strong>
            <p style={{ margin: '8px 0 0' }}>{message}</p>
        </div>

        <p>This change in risk profile may impact your insurance premiums or audit risk. Please review the details immediately.</p>

        <a
            href={`https://dot-risk-radar.vercel.app/dashboard/alerts?id=${alertId}`}
            style={{
                display: 'inline-block',
                backgroundColor: '#4F46E5',
                color: '#fff',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                marginTop: '16px'
            }}
        >
            View Full Alert
        </a>

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #eee' }} />
        <p style={{ fontSize: '12px', color: '#666' }}>
            DOT Risk Radar Monitoring System
        </p>
    </div>
);
