import { useForm } from 'react-hook-form';
import { ArrowLeft, Calculator, Shield, Heart, Home, PiggyBank, HelpCircle } from 'lucide-react';
import useTaxStore from '../store/taxStore';
import { DEDUCTION_LIMITS, formatINR } from '../engine/constants';

// Input component defined OUTSIDE to prevent re-mount on each render
function CurrencyInput({ label, name, placeholder, tooltip, register }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label className="form-label" htmlFor={name}>
        {label}
        {tooltip && (
          <span className="tooltip-wrapper" style={{ marginLeft: '6px', cursor: 'help' }}>
            <HelpCircle size={12} color="var(--text-muted)" />
            <span className="tooltip-text">{tooltip}</span>
          </span>
        )}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none',
        }}>₹</span>
        <input
          id={name}
          {...register(name)}
          type="number"
          className="form-input"
          placeholder={placeholder || '0'}
          style={{ paddingLeft: '32px' }}
          min="0"
          step="any"
        />
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, color, badge }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '16px',
      paddingBottom: '10px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <Icon size={16} color={color} />
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {badge && (
        <span className="section-badge">{badge}</span>
      )}
    </div>
  );
}

export default function InvestmentForm() {
  const { investmentData, setInvestmentData, prevStep, calculateTax } = useTaxStore();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: investmentData,
  });

  const watchAll = watch();

  // Calculate 80C usage
  const current80C = (
    (Number(watchAll.epf) || 0) +
    (Number(watchAll.ppf) || 0) +
    (Number(watchAll.elss) || 0) +
    (Number(watchAll.lic) || 0) +
    (Number(watchAll.nsc) || 0) +
    (Number(watchAll.homeLoanPrincipal) || 0) +
    (Number(watchAll.others80C) || 0)
  );
  const sec80CPercent = Math.min((current80C / DEDUCTION_LIMITS.sec80C) * 100, 100);

  const onSubmit = (data) => {
    setInvestmentData(data);
    calculateTax();
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
      <div className="glass-card-static" style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PiggyBank size={18} color="#34d399" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Current Investments & Deductions
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Enter your existing tax-saving investments for FY 2024-25
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
          }}>
            {/* Section 80C */}
            <div style={{
              background: 'rgba(99,102,241,0.04)',
              border: '1px solid rgba(99,102,241,0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}>
              <SectionHeader icon={Shield} title="Section 80C" color="#a5b4fc" badge="Limit ₹1,50,000" />
              
              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Used: <span className="currency" style={{ color: sec80CPercent >= 100 ? '#34d399' : '#a5b4fc' }}>
                      {formatINR(current80C)}
                    </span>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {formatINR(DEDUCTION_LIMITS.sec80C)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill ${sec80CPercent >= 100 ? 'full' : ''}`}
                    style={{ width: `${Math.min(sec80CPercent, 100)}%` }}
                  />
                </div>
              </div>

              <CurrencyInput label="EPF (Employee)" name="epf" register={register} placeholder="21600" tooltip="Employee Provident Fund contribution" />
              <CurrencyInput label="PPF" name="ppf" register={register} placeholder="0" tooltip="Public Provident Fund deposits" />
              <CurrencyInput label="ELSS Mutual Funds" name="elss" register={register} placeholder="0" tooltip="Equity Linked Savings Scheme" />
              <CurrencyInput label="LIC Premium" name="lic" register={register} placeholder="0" />
              <CurrencyInput label="NSC" name="nsc" register={register} placeholder="0" tooltip="National Savings Certificate" />
              <CurrencyInput label="Home Loan Principal" name="homeLoanPrincipal" register={register} placeholder="0" />
              <CurrencyInput label="Others (Tuition, ULIP, SSY)" name="others80C" register={register} placeholder="0" />
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* NPS */}
              <div style={{
                background: 'rgba(139,92,246,0.04)',
                border: '1px solid rgba(139,92,246,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
              }}>
                <SectionHeader icon={PiggyBank} title="NPS (National Pension)" color="#a78bfa" badge="80CCD" />
                <CurrencyInput label="NPS — Self (80CCD(1B))" name="nps" register={register} placeholder="0" tooltip="Additional ₹50K deduction beyond 80C" />
                <CurrencyInput label="NPS — Employer (80CCD(2))" name="employerNPS" register={register} placeholder="0" tooltip="Employer NPS contribution (up to 10% of basic)" />
              </div>

              {/* Health Insurance */}
              <div style={{
                background: 'rgba(244,63,94,0.04)',
                border: '1px solid rgba(244,63,94,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
              }}>
                <SectionHeader icon={Heart} title="Health Insurance" color="#fb7185" badge="80D" />
                <CurrencyInput label="Self, Spouse & Children" name="healthInsuranceSelf" register={register} placeholder="0" tooltip="Up to ₹25,000" />
                <CurrencyInput label="Parents" name="healthInsuranceParents" register={register} placeholder="0" tooltip="₹25K (below 60) or ₹50K (senior 60+)" />
                <div style={{ marginBottom: '14px' }}>
                  <label className="toggle-switch">
                    <input type="checkbox" {...register('parentsAreSenior')} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Parents are Senior Citizens (60+)
                    </span>
                  </label>
                </div>
              </div>

              {/* Home Loan & Education */}
              <div style={{
                background: 'rgba(245,158,11,0.04)',
                border: '1px solid rgba(245,158,11,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
              }}>
                <SectionHeader icon={Home} title="Loan & Other Deductions" color="#fbbf24" />
                <CurrencyInput label="Home Loan Interest" name="homeLoanInterest" register={register} placeholder="0" tooltip="Section 24(b) — max ₹2L for self-occupied" />
                <CurrencyInput label="Education Loan Interest" name="educationLoanInterest" register={register} placeholder="0" tooltip="Section 80E — no limit, 8 years" />
                <CurrencyInput label="Savings A/c Interest" name="savingsInterest" register={register} placeholder="0" tooltip="Section 80TTA — max ₹10,000" />
                <CurrencyInput label="Donations" name="donations" register={register} placeholder="0" tooltip="Section 80G — 50% deductible" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '28px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <button type="button" onClick={prevStep} className="btn-secondary">
              <ArrowLeft size={16} />
              Back: Salary
            </button>
            <button type="submit" className="btn-success">
              <Calculator size={16} />
              Calculate Tax & Optimize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
