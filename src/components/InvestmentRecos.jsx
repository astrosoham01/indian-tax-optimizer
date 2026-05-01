import { TrendingUp, Zap, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import useTaxStore from '../store/taxStore';
import { formatINR } from '../engine/constants';

export default function InvestmentRecos() {
  const { recommendations } = useTaxStore();

  if (!recommendations || !recommendations.recommendations || recommendations.recommendations.length === 0) {
    return null;
  }

  const { recommendations: recos, totalPotentialSavings, totalAdditionalInvestment } = recommendations;

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'badge-risk-low';
      case 'moderate': return 'badge-risk-moderate';
      case 'high': return 'badge-risk-high';
      default: return 'badge-risk-none';
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: '#fbbf24' };
      case 2: return { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', icon: '#cbd5e1' };
      case 3: return { bg: 'rgba(180,130,100,0.08)', border: 'rgba(180,130,100,0.2)', icon: '#d4a574' };
      default: return { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', icon: '#a5b4fc' };
    }
  };

  return (
    <div className="animate-fade-in-up delay-3" style={{ marginTop: '28px' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
          💡 Investment Recommendations to Save Even More
        </h3>
        {totalPotentialSavings > 0 && (
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Zap size={14} color="#34d399" />
            <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '600' }}>
              Potential: {formatINR(totalPotentialSavings)} more saved
            </span>
          </div>
        )}
      </div>

      {/* Recommendation Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recos.map((reco, index) => {
          const rankStyle = getRankColor(reco.rank);
          
          return (
            <div
              key={index}
              className="glass-card"
              style={{
                padding: '20px 24px',
                borderLeft: `3px solid ${rankStyle.icon}`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                {/* Left */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: rankStyle.bg,
                      border: `1px solid ${rankStyle.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: rankStyle.icon,
                    }}>
                      #{reco.rank}
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {reco.name}
                    </h4>
                    <span className="section-badge">{reco.section}</span>
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginBottom: '10px',
                  }}>
                    {reco.message}
                  </p>

                  {reco.description && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      lineHeight: '1.5',
                      fontStyle: 'italic',
                    }}>
                      {reco.description}
                    </p>
                  )}
                </div>

                {/* Right — Stats */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  {reco.amountToInvest > 0 && (
                    <StatBadge
                      label="Invest"
                      value={formatINR(reco.amountToInvest)}
                      color="#a5b4fc"
                    />
                  )}
                  {reco.taxSaved > 0 && (
                    <StatBadge
                      label="Tax Saved"
                      value={formatINR(reco.taxSaved)}
                      color="#34d399"
                    />
                  )}
                </div>
              </div>

              {/* Bottom tags */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                flexWrap: 'wrap',
              }}>
                {reco.expectedReturns && reco.expectedReturns !== 'N/A' && (
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <TrendingUp size={11} /> {reco.expectedReturns}
                  </span>
                )}
                <span className={`badge ${getRiskBadgeClass(reco.riskLevel)}`} style={{ fontSize: '10px' }}>
                  {reco.riskLevel} Risk
                </span>
                {reco.lockIn && reco.lockIn !== 'N/A' && (
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Clock size={11} /> {reco.lockIn}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  return (
    <div style={{
      textAlign: 'center',
      minWidth: '80px',
    }}>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </p>
      <p className="currency" style={{ fontSize: '14px', color, fontWeight: '600' }}>
        {value}
      </p>
    </div>
  );
}
