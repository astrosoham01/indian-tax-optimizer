// ============================================================================
// Indian Tax Constants — FY 2024-25
// ============================================================================

// Old Regime Tax Slabs
export const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 0.05 },
  { min: 500001, max: 1000000, rate: 0.20 },
  { min: 1000001, max: Infinity, rate: 0.30 },
];

// New Regime Tax Slabs (post Budget 2023, updated Budget 2024)
export const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 600000, rate: 0.05 },
  { min: 600001, max: 900000, rate: 0.10 },
  { min: 900001, max: 1200000, rate: 0.15 },
  { min: 1200001, max: 1500000, rate: 0.20 },
  { min: 1500001, max: Infinity, rate: 0.30 },
];

// Standard Deductions
export const STANDARD_DEDUCTION_OLD = 50000;
export const STANDARD_DEDUCTION_NEW = 75000;

// Section 87A Rebate
export const REBATE_87A_OLD = {
  maxIncome: 500000,
  maxRebate: 12500,
};

export const REBATE_87A_NEW = {
  maxIncome: 700000,
  maxRebate: 25000,
};

// Health & Education Cess
export const CESS_RATE = 0.04;

// Surcharge Tiers (on income tax)
export const SURCHARGE_TIERS = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000001, max: 10000000, rate: 0.10 },
  { min: 10000001, max: 20000000, rate: 0.15 },
  { min: 20000001, max: 50000000, rate: 0.25 },
  { min: 50000001, max: Infinity, rate: 0.37 },
];

// New Regime Surcharge cap at 25% for income > 2Cr
export const NEW_REGIME_MAX_SURCHARGE_RATE = 0.25;

// Section-wise Deduction Limits
export const DEDUCTION_LIMITS = {
  sec80C: 150000,       // EPF + PPF + ELSS + LIC + NSC + Home Loan Principal + others
  sec80CCD1B: 50000,    // NPS additional contribution
  sec80D_self: 25000,   // Health insurance — self, spouse, children
  sec80D_parents: 25000, // Parents below 60
  sec80D_parentsSenior: 50000, // Parents 60+
  sec24b: 200000,       // Home loan interest (self-occupied)
  sec80E: Infinity,     // Education loan interest (no limit, 8 years)
  sec80TTA: 10000,      // Savings account interest
  sec80G: Infinity,     // Donations (50% or 100%)
};

// Metro cities for HRA calculation
export const METRO_CITIES = ['mumbai', 'delhi', 'kolkata', 'chennai'];

// HRA percentage based on city type
export const HRA_METRO_PERCENT = 0.50;
export const HRA_NON_METRO_PERCENT = 0.40;

// Investment Recommendations Data
export const INVESTMENT_OPTIONS = {
  sec80C: [
    {
      name: 'ELSS Mutual Funds',
      section: '80C',
      expectedReturns: '12-15%',
      riskLevel: 'Moderate',
      lockIn: '3 years',
      description: 'Equity Linked Savings Scheme — best returns with shortest lock-in among 80C options',
    },
    {
      name: 'PPF (Public Provident Fund)',
      section: '80C',
      expectedReturns: '7.1%',
      riskLevel: 'Low',
      lockIn: '15 years',
      description: 'Government-backed, tax-free returns. EEE benefit (Exempt-Exempt-Exempt)',
    },
    {
      name: 'NSC (National Savings Certificate)',
      section: '80C',
      expectedReturns: '7.7%',
      riskLevel: 'Low',
      lockIn: '5 years',
      description: 'Fixed income government instrument, interest reinvested counts as 80C next year',
    },
    {
      name: 'Tax-Saver Fixed Deposit',
      section: '80C',
      expectedReturns: '6.5-7%',
      riskLevel: 'Low',
      lockIn: '5 years',
      description: 'Bank FD with 5-year lock-in. Interest is taxable.',
    },
  ],
  sec80CCD1B: [
    {
      name: 'NPS Tier-I Account',
      section: '80CCD(1B)',
      expectedReturns: '9-12%',
      riskLevel: 'Moderate',
      lockIn: 'Till 60 years',
      description: 'Additional ₹50,000 deduction over 80C. Great for retirement planning.',
    },
  ],
  sec80D: [
    {
      name: 'Health Insurance (Self & Family)',
      section: '80D',
      expectedReturns: 'N/A — Insurance',
      riskLevel: 'None',
      lockIn: '1 year',
      description: 'Medical cover + tax saving. Preventive health checkup ₹5,000 included.',
    },
    {
      name: 'Health Insurance (Parents)',
      section: '80D',
      expectedReturns: 'N/A — Insurance',
      riskLevel: 'None',
      lockIn: '1 year',
      description: 'Up to ₹50,000 if parents are senior citizens (60+).',
    },
  ],
  sec24b: [
    {
      name: 'Home Loan Interest',
      section: '24(b)',
      expectedReturns: 'N/A — Loan benefit',
      riskLevel: 'None',
      lockIn: 'Loan tenure',
      description: 'Deduction up to ₹2,00,000 on interest for self-occupied property.',
    },
  ],
};

// Format currency in Indian style
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const str = absAmount.toString();
  let result = '';
  
  if (str.length <= 3) {
    result = str;
  } else {
    result = str.slice(-3);
    let remaining = str.slice(0, -3);
    while (remaining.length > 2) {
      result = remaining.slice(-2) + ',' + result;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
  }
  
  return (isNegative ? '-₹' : '₹') + result;
}
