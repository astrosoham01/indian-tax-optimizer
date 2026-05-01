import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '48px auto 0',
      padding: '0 24px 32px',
    }}>
      <div style={{
        background: 'rgba(245,158,11,0.04)',
        border: '1px solid rgba(245,158,11,0.12)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}>
        <AlertTriangle size={16} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#fbbf24',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Disclaimer
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
          }}>
            This tool provides tax calculations for educational and planning purposes only. 
            It is not a substitute for professional tax advice. Tax laws change annually — 
            always verify with the latest Finance Act. Consult a Chartered Accountant or 
            Certified Financial Planner for personalized advice before making financial decisions.
          </p>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '6px',
            opacity: 0.7,
          }}>
            Based on Finance Act 2024 (FY 2024-25 / AY 2025-26) •{' '}
            <a
              href="https://www.incometax.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#a5b4fc', textDecoration: 'none' }}
            >
              incometax.gov.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
