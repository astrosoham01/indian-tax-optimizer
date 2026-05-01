import { useForm } from 'react-hook-form';
import { ArrowRight, Building2, MapPin, IndianRupee, HelpCircle } from 'lucide-react';
import useTaxStore from '../store/taxStore';

// InputField defined OUTSIDE the component to prevent re-creation on each render
function CurrencyInput({ label, name, placeholder, required, tooltip, register, errors }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label className="form-label" htmlFor={name}>
        {label}
        {tooltip && (
          <span className="tooltip-wrapper" style={{ marginLeft: '6px', cursor: 'help' }}>
            <HelpCircle size={13} color="var(--text-muted)" />
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
          {...register(name, required ? { required: `${label} is required` } : {})}
          type="number"
          className="form-input"
          placeholder={placeholder || '0'}
          style={{ paddingLeft: '32px' }}
          min="0"
          step="any"
        />
      </div>
      {errors?.[name] && (
        <p style={{ color: 'var(--accent-rose)', fontSize: '12px', marginTop: '4px' }}>
          {errors[name].message}
        </p>
      )}
    </div>
  );
}

export default function SalaryForm() {
  const { salaryData, setSalaryData, nextStep } = useTaxStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: salaryData,
  });

  const watchBasic = watch('basicAnnual');

  const onSubmit = (data) => {
    setSalaryData(data);
    nextStep();
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
      <div className="glass-card-static" style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Building2 size={18} color="#a5b4fc" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Salary Details
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Enter your annual salary breakup
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Salary Components */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0 24px',
          }}>
            <CurrencyInput
              label="Basic Salary (Annual)"
              name="basicAnnual"
              register={register}
              errors={errors}
              required
              placeholder="600000"
              tooltip="Your basic salary per year before any allowances"
            />
            <CurrencyInput
              label="HRA Received (Annual)"
              name="hraAnnual"
              register={register}
              errors={errors}
              placeholder="240000"
              tooltip="House Rent Allowance received from employer"
            />
            <CurrencyInput
              label="LTA (Annual)"
              name="ltaAnnual"
              register={register}
              errors={errors}
              placeholder="50000"
              tooltip="Leave Travel Allowance"
            />
            <CurrencyInput
              label="Special Allowance (Annual)"
              name="specialAllowanceAnnual"
              register={register}
              errors={errors}
              placeholder="300000"
              tooltip="Special allowance component of your salary"
            />
            <CurrencyInput
              label="Other Allowances (Annual)"
              name="otherAllowanceAnnual"
              register={register}
              errors={errors}
              placeholder="0"
              tooltip="Any other allowances (conveyance, medical, etc.)"
            />
            <CurrencyInput
              label="Other Income (Annual)"
              name="otherIncome"
              register={register}
              errors={errors}
              placeholder="0"
              tooltip="FD interest, capital gains, rental income, etc."
            />
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            margin: '24px 0',
          }} />

          {/* HRA Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MapPin size={16} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                HRA Details
              </h3>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}>
                (for HRA exemption calculation)
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0 24px',
            }}>
              <CurrencyInput
                label="Rent Paid (Annual)"
                name="rentPaidAnnual"
                register={register}
                errors={errors}
                placeholder="240000"
                tooltip="Total rent paid in a year. Leave blank if you don't pay rent."
              />
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" htmlFor="isMetro">City Type</label>
                <select
                  id="isMetro"
                  {...register('isMetro')}
                  className="form-select"
                >
                  <option value="true">Metro (Mumbai, Delhi, Kolkata, Chennai)</option>
                  <option value="false">Non-Metro (Other cities)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {watchBasic && Number(watchBasic) > 0 && (
            <div style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <IndianRupee size={18} color="#a5b4fc" />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Basic Salary: <span className="currency" style={{ color: '#a5b4fc' }}>
                  ₹{Number(watchBasic).toLocaleString('en-IN')}
                </span> per year
              </span>
            </div>
          )}

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">
              Next: Investments
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
