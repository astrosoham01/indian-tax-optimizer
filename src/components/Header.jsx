import { Calculator, RotateCcw } from 'lucide-react';
import useTaxStore from '../store/taxStore';

export default function Header() {
  const { isCalculated, reset } = useTaxStore();

  return (
    <header style={{
      padding: '20px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      marginBottom: '32px',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
          }}>
            <Calculator size={22} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #f1f5f9, #a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              Indian Tax Optimizer
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              marginTop: '2px',
            }}>
              FY 2024-25 • Smart Tax Planning
            </p>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            background: 'rgba(16,185,129,0.12)',
            color: '#34d399',
            border: '1px solid rgba(16,185,129,0.25)',
          }}>
            🇮🇳 INDIA
          </span>
          {isCalculated && (
            <button
              onClick={reset}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
