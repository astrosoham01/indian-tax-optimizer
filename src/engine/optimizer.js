// ============================================================================
// Smart Investment Optimizer — Suggests tax-saving investments
// ============================================================================

import { DEDUCTION_LIMITS, INVESTMENT_OPTIONS, CESS_RATE } from './constants';

/**
 * Get the marginal tax rate for a given taxable income (Old Regime)
 */
function getMarginalRate(taxableIncome) {
  if (taxableIncome <= 250000) return 0;
  if (taxableIncome <= 500000) return 0.05;
  if (taxableIncome <= 1000000) return 0.20;
  return 0.30;
}

/**
 * Calculate exact tax saved for a given investment at the user's marginal rate
 */
function calculateTaxSaved(amount, taxableIncome) {
  const marginalRate = getMarginalRate(taxableIncome);
  const taxSaved = amount * marginalRate;
  const cessSaved = taxSaved * CESS_RATE;
  return Math.round(taxSaved + cessSaved);
}

/**
 * Generate personalized investment recommendations
 * Only recommends for Old Regime (New Regime doesn't benefit from most deductions)
 * 
 * @param {object} oldRegimeResult - Result from oldRegime calculator
 * @param {object} investments - Current user investments
 * @returns {Array} - Sorted recommendations by priority
 */
export function getInvestmentRecommendations(oldRegimeResult, investments) {
  const recommendations = [];
  const taxableIncome = oldRegimeResult.taxableIncome;

  // If income is below taxable limit, no need for recommendations
  if (taxableIncome <= 250000) {
    return [{
      rank: 0,
      name: 'No Tax Liability',
      section: 'N/A',
      message: 'Your taxable income is below ₹2,50,000. No additional tax-saving investments needed!',
      amountToInvest: 0,
      taxSaved: 0,
      expectedReturns: 'N/A',
      riskLevel: 'None',
      lockIn: 'N/A',
    }];
  }

  // RANK 1 — Section 80C bucket (₹1,50,000 limit)
  const current80C = oldRegimeResult.deductions.sec80C.raw;
  const remaining80C = Math.max(0, DEDUCTION_LIMITS.sec80C - current80C);
  
  if (remaining80C > 0) {
    const taxSaved = calculateTaxSaved(remaining80C, taxableIncome);
    
    // Recommend the best 80C option based on remaining amount
    const topOption = INVESTMENT_OPTIONS.sec80C[0]; // ELSS first
    recommendations.push({
      rank: 1,
      name: topOption.name,
      section: '80C',
      message: `You have ₹${remaining80C.toLocaleString('en-IN')} of unused 80C limit. Invest in ELSS for best returns with shortest lock-in.`,
      amountToInvest: remaining80C,
      taxSaved,
      expectedReturns: topOption.expectedReturns,
      riskLevel: topOption.riskLevel,
      lockIn: topOption.lockIn,
      description: topOption.description,
    });
  }

  // RANK 2 — NPS 80CCD(1B) — Extra ₹50,000
  const currentNPS = Number(investments.nps) || 0;
  const remainingNPS = Math.max(0, DEDUCTION_LIMITS.sec80CCD1B - currentNPS);
  
  if (remainingNPS > 0) {
    const taxSaved = calculateTaxSaved(remainingNPS, taxableIncome);
    const option = INVESTMENT_OPTIONS.sec80CCD1B[0];
    recommendations.push({
      rank: 2,
      name: option.name,
      section: '80CCD(1B)',
      message: `Additional ₹${remainingNPS.toLocaleString('en-IN')} NPS investment saves ₹${taxSaved.toLocaleString('en-IN')} in tax. Also builds retirement corpus.`,
      amountToInvest: remainingNPS,
      taxSaved,
      expectedReturns: option.expectedReturns,
      riskLevel: option.riskLevel,
      lockIn: option.lockIn,
      description: option.description,
    });
  }

  // RANK 3 — Health Insurance 80D
  const currentHealthSelf = Number(investments.healthInsuranceSelf) || 0;
  const currentHealthParents = Number(investments.healthInsuranceParents) || 0;
  const remainingHealthSelf = Math.max(0, DEDUCTION_LIMITS.sec80D_self - currentHealthSelf);
  const parentLimit = investments.parentsAreSenior
    ? DEDUCTION_LIMITS.sec80D_parentsSenior
    : DEDUCTION_LIMITS.sec80D_parents;
  const remainingHealthParents = Math.max(0, parentLimit - currentHealthParents);
  const totalRemainingHealth = remainingHealthSelf + remainingHealthParents;

  if (totalRemainingHealth > 0) {
    const taxSaved = calculateTaxSaved(totalRemainingHealth, taxableIncome);
    recommendations.push({
      rank: 3,
      name: 'Health Insurance (Self + Parents)',
      section: '80D',
      message: `Top up health insurance by ₹${totalRemainingHealth.toLocaleString('en-IN')} for tax saving plus medical coverage.`,
      amountToInvest: totalRemainingHealth,
      taxSaved,
      expectedReturns: 'N/A — Insurance coverage',
      riskLevel: 'None',
      lockIn: '1 year (annual renewal)',
      description: 'Health insurance gives dual benefit — tax saving and medical coverage for emergencies.',
    });
  }

  // RANK 4 — Home Loan Interest 24(b)
  const currentHomeLoan = Number(investments.homeLoanInterest) || 0;
  const remainingHomeLoan = Math.max(0, DEDUCTION_LIMITS.sec24b - currentHomeLoan);
  
  if (remainingHomeLoan > 0 && currentHomeLoan > 0) {
    // Only show if user already has a home loan
    const taxSaved = calculateTaxSaved(remainingHomeLoan, taxableIncome);
    recommendations.push({
      rank: 4,
      name: 'Home Loan Interest',
      section: '24(b)',
      message: `You can claim up to ₹${remainingHomeLoan.toLocaleString('en-IN')} more in home loan interest deduction.`,
      amountToInvest: remainingHomeLoan,
      taxSaved,
      expectedReturns: 'N/A — Loan benefit',
      riskLevel: 'None',
      lockIn: 'Loan tenure',
      description: 'Self-occupied property allows up to ₹2,00,000 deduction on interest paid.',
    });
  }

  // RANK 5 — Additional 80C options (if there's still remaining 80C)
  if (remaining80C > 30000) {
    const ppfOption = INVESTMENT_OPTIONS.sec80C[1]; // PPF
    recommendations.push({
      rank: 5,
      name: ppfOption.name,
      section: '80C (Alternative)',
      message: `Consider splitting your 80C investments. PPF offers guaranteed tax-free returns with EEE benefit.`,
      amountToInvest: Math.min(remaining80C, 150000),
      taxSaved: 0, // Already counted in rank 1
      expectedReturns: ppfOption.expectedReturns,
      riskLevel: ppfOption.riskLevel,
      lockIn: ppfOption.lockIn,
      description: ppfOption.description,
    });
  }

  // Sort by tax saved (descending), then by rank
  recommendations.sort((a, b) => {
    if (b.taxSaved !== a.taxSaved) return b.taxSaved - a.taxSaved;
    return a.rank - b.rank;
  });

  // Calculate total potential savings
  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.taxSaved, 0);

  return {
    recommendations: recommendations.slice(0, 5), // Top 5 recommendations
    totalPotentialSavings,
    totalAdditionalInvestment: recommendations.reduce((sum, rec) => sum + rec.amountToInvest, 0),
  };
}
