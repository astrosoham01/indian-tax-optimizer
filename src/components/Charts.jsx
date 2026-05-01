import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import useTaxStore from '../store/taxStore';
import { formatINR, DEDUCTION_LIMITS } from '../engine/constants';

const COLORS = {
  salary: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#6d28d9'],
  comparison: ['#f43f5e', '#6366f1'],
  deductions: ['#10b981', '#34d399'],
};

export default function Charts() {
  const { oldRegimeResult, newRegimeResult, investmentData } = useTaxStore();

  if (!oldRegimeResult || !newRegimeResult) return null;

  // Salary Pie Data
  const salaryData = [
    { name: 'Basic', value: Number(oldRegimeResult.grossSalary) ? Number(useTaxStore.getState().salaryData.basicAnnual) || 0 : 0 },
    { name: 'HRA', value: Number(useTaxStore.getState().salaryData.hraAnnual) || 0 },
    { name: 'LTA', value: Number(useTaxStore.getState().salaryData.ltaAnnual) || 0 },
    { name: 'Special Allow.', value: Number(useTaxStore.getState().salaryData.specialAllowanceAnnual) || 0 },
    { name: 'Other Allow.', value: Number(useTaxStore.getState().salaryData.otherAllowanceAnnual) || 0 },
  ].filter(d => d.value > 0);

  // Tax Comparison Bar Data
  const taxComparisonData = [
    { name: 'Old Regime', tax: oldRegimeResult.totalTax, fill: '#f43f5e' },
    { name: 'New Regime', tax: newRegimeResult.totalTax, fill: '#6366f1' },
  ];

  // Deductions Bar Data (used vs available)
  const deductionsData = [
    {
      name: '80C',
      used: oldRegimeResult.deductions.sec80C.amount,
      available: DEDUCTION_LIMITS.sec80C,
    },
    {
      name: 'NPS',
      used: oldRegimeResult.deductions.sec80CCD1B.amount,
      available: DEDUCTION_LIMITS.sec80CCD1B,
    },
    {
      name: '80D',
      used: oldRegimeResult.deductions.sec80D.amount,
      available: DEDUCTION_LIMITS.sec80D_self + (investmentData.parentsAreSenior ? DEDUCTION_LIMITS.sec80D_parentsSenior : DEDUCTION_LIMITS.sec80D_parents),
    },
    {
      name: '24(b)',
      used: oldRegimeResult.deductions.sec24b.amount,
      available: DEDUCTION_LIMITS.sec24b,
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={{
        background: 'rgba(15,15,35,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '12px 16px',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>
          {label || payload[0]?.name}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{
            color: entry.color || 'var(--text-secondary)',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
          }}>
            {entry.name}: {formatINR(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={{
        background: 'rgba(15,15,35,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '12px 16px',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px' }}>
          {payload[0]?.name}
        </p>
        <p style={{
          color: payload[0]?.payload?.fill || 'var(--text-secondary)',
          fontSize: '14px',
          fontFamily: 'var(--font-mono)',
          fontWeight: '600',
        }}>
          {formatINR(payload[0]?.value)}
        </p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up delay-2" style={{ marginTop: '28px' }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '20px',
      }}>
        📊 Visual Breakdown
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
      }}>
        {/* Salary Pie Chart */}
        <div className="glass-card-static" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Salary Components
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={salaryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {salaryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS.salary[index % COLORS.salary.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tax Comparison Bar */}
        <div className="glass-card-static" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Tax: Old vs New Regime
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taxComparisonData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tax" name="Tax Payable" radius={[6, 6, 0, 0]}>
                {taxComparisonData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Deductions Used vs Available */}
        <div className="glass-card-static" style={{ padding: '24px', gridColumn: 'span 1' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Deductions: Used vs Available
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deductionsData} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => (
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>
              )} />
              <Bar dataKey="used" name="Used" fill="#10b981" radius={[0, 4, 4, 0]} />
              <Bar dataKey="available" name="Limit" fill="rgba(255,255,255,0.08)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
