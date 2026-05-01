import { TrendingDown, TrendingUp, Award, ArrowRight, IndianRupee } from 'lucide-react';
import useTaxStore from '../store/taxStore';
import { formatINR } from '../engine/constants';

export default function RegimeComparison() {
  const { oldRegimeResult, newRegimeResult } = useTaxStore();

  if (!oldRegimeResult || !newRegimeResult) return null;

  const oldTax = oldRegimeResult.totalTax;
  const newTax = newRegimeResult.totalTax;
  const savings = Math.abs(oldTax - newTax);
  const betterRegime = oldTax <= newTax ? 'old' : 'new';
  const betterLabel = betterRegime === 'old' ? 'Old Regime' : 'New Regime';

  const RegimeCard = ({ result, label, isBetter }) => (
    <div
      className="glass-card-static"
      style={{
        padding: '28px',
        flex: '1 1 320px',
        position: 'relative',
        overflow: 'hidden',
        border: isBetter ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Recommended badge */}
      {isBetter && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
        }}>
          <span className="badge badge-recommended" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <Award size={12} />
            RECOMMENDED
          </span>
        </div>
      )}

      {/* Glow effect for recommended */}
      {isBetter && (
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <span className="badge badge-regime" style={{ marginBottom: '10px' }}>
          {label}
        </span>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginTop: '10px',
        }}>
          {label === 'Old Regime' ? 'With Deductions & Exemptions' : 'Simplified Taxation'}
        </h3>
      </div>

      {/* Tax Amount */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Total Tax Payable
        </p>
        <p className="currency-large" style={{
          color: isBetter ? 'var(--accent-emerald)' : 'var(--accent-rose)',
        }}>
          {formatINR(result.totalTax)}
        </p>
      </div>

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gap: '12px',
      }}>
        <DetailRow label="Gross Salary" value={formatINR(result.grossSalary)} />
        {result.otherIncome > 0 && (
          <DetailRow label="Other Income" value={formatINR(result.otherIncome)} />
        )}
        <DetailRow label="Standard Deduction" value={`-${formatINR(result.standardDeduction)}`} highlight />
        {result.hraExemption > 0 && (
          <DetailRow label="HRA Exemption" value={`-${formatINR(result.hraExemption)}`} highlight />
        )}
        {result.deductions && (
          <>
            {result.deductions.sec80C.amount > 0 && (
              <DetailRow label="Section 80C" value={`-${formatINR(result.deductions.sec80C.amount)}`} highlight />
            )}
            {result.deductions.sec80CCD1B?.amount > 0 && (
              <DetailRow label="Section 80CCD(1B)" value={`-${formatINR(result.deductions.sec80CCD1B.amount)}`} highlight />
            )}
            {result.deductions.sec80D?.amount > 0 && (
              <DetailRow label="Section 80D" value={`-${formatINR(result.deductions.sec80D.amount)}`} highlight />
            )}
            {result.deductions.sec24b?.amount > 0 && (
              <DetailRow label="Section 24(b)" value={`-${formatINR(result.deductions.sec24b.amount)}`} highlight />
            )}
          </>
        )}
        {result.employerNPS > 0 && (
          <DetailRow label="Employer NPS" value={`-${formatINR(result.employerNPS)}`} highlight />
        )}

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        <DetailRow label="Taxable Income" value={formatINR(result.taxableIncome)} bold />
        <DetailRow label="Slab Tax" value={formatINR(result.slabTax)} />
        {result.rebate87A > 0 && (
          <DetailRow label="87A Rebate" value={`-${formatINR(result.rebate87A)}`} highlight />
        )}
        {result.surcharge > 0 && (
          <DetailRow label="Surcharge" value={`+${formatINR(result.surcharge)}`} />
        )}
        <DetailRow label="Health & Edu Cess (4%)" value={`+${formatINR(result.cess)}`} />

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        <DetailRow label="Effective Tax Rate" value={`${result.effectiveRate}%`} bold />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in-up">
      {/* Savings Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.04))',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrendingDown size={20} color="#34d399" />
          </div>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
              You save by choosing <strong style={{ color: '#34d399' }}>{betterLabel}</strong>
            </p>
            <p className="currency" style={{ fontSize: '24px', color: '#34d399', fontWeight: '700' }}>
              {formatINR(savings)}
            </p>
          </div>
        </div>
        <div style={{
          background: 'rgba(16,185,129,0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
        }}>
          <p style={{ fontSize: '11px', color: '#34d399', fontWeight: '500' }}>
            {betterRegime === 'old' ? 'Deductions make Old Regime better for you' : 'Simplified New Regime is more beneficial'}
          </p>
        </div>
      </div>

      {/* Side by side cards */}
      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        <RegimeCard result={oldRegimeResult} label="Old Regime" isBetter={betterRegime === 'old'} />
        <RegimeCard result={newRegimeResult} label="New Regime" isBetter={betterRegime === 'new'} />
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight, bold }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontWeight: bold ? '600' : '400',
      }}>
        {label}
      </span>
      <span className="currency" style={{
        fontSize: '13px',
        color: highlight ? 'var(--accent-emerald)' : bold ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontWeight: bold ? '600' : '500',
      }}>
        {value}
      </span>
    </div>
  );
}
