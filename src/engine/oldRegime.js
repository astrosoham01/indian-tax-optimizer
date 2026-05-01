// ============================================================================
// Old Regime Tax Calculator — FY 2024-25
// ============================================================================

import {
  OLD_REGIME_SLABS,
  STANDARD_DEDUCTION_OLD,
  REBATE_87A_OLD,
  DEDUCTION_LIMITS,
} from './constants';
import { calculateHRAExemption } from './hraExemption';
import { calculateTotalTax } from './surcharge';

/**
 * Calculate tax under Old Regime
 * 
 * @param {object} salary - Salary components
 * @param {object} investments - Current investments/deductions
 * @returns {object} - Complete tax breakdown
 */
export function calculateOldRegimeTax(salary, investments) {
  // 1. Calculate Gross Salary
  const grossSalary = (
    (Number(salary.basicAnnual) || 0) +
    (Number(salary.hraAnnual) || 0) +
    (Number(salary.ltaAnnual) || 0) +
    (Number(salary.specialAllowanceAnnual) || 0) +
    (Number(salary.otherAllowanceAnnual) || 0)
  );

  // 2. HRA Exemption
  const hraResult = calculateHRAExemption(
    Number(salary.basicAnnual) || 0,
    Number(salary.hraAnnual) || 0,
    Number(salary.rentPaidAnnual) || 0,
    salary.isMetro || false
  );

  // 3. Section 80C — Capped at ₹1,50,000
  const raw80C = (
    (Number(investments.epf) || 0) +
    (Number(investments.ppf) || 0) +
    (Number(investments.elss) || 0) +
    (Number(investments.lic) || 0) +
    (Number(investments.nsc) || 0) +
    (Number(investments.homeLoanPrincipal) || 0) +
    (Number(investments.others80C) || 0)
  );
  const sec80C = Math.min(raw80C, DEDUCTION_LIMITS.sec80C);

  // 4. Section 80CCD(1B) — NPS additional, capped at ₹50,000
  const sec80CCD1B = Math.min(
    Number(investments.nps) || 0,
    DEDUCTION_LIMITS.sec80CCD1B
  );

  // 5. Section 80D — Health Insurance
  const sec80D_self = Math.min(
    Number(investments.healthInsuranceSelf) || 0,
    DEDUCTION_LIMITS.sec80D_self
  );
  const parentLimit = investments.parentsAreSenior
    ? DEDUCTION_LIMITS.sec80D_parentsSenior
    : DEDUCTION_LIMITS.sec80D_parents;
  const sec80D_parents = Math.min(
    Number(investments.healthInsuranceParents) || 0,
    parentLimit
  );
  const sec80D = sec80D_self + sec80D_parents;

  // 6. Section 24(b) — Home Loan Interest, capped at ₹2,00,000
  const sec24b = Math.min(
    Number(investments.homeLoanInterest) || 0,
    DEDUCTION_LIMITS.sec24b
  );

  // 7. Section 80E — Education Loan Interest (no limit)
  const sec80E = Number(investments.educationLoanInterest) || 0;

  // 8. Section 80TTA — Savings Account Interest
  const sec80TTA = Math.min(
    Number(investments.savingsInterest) || 0,
    DEDUCTION_LIMITS.sec80TTA
  );

  // 9. Section 80G — Donations (50% deductible simplified)
  const sec80G = Math.round((Number(investments.donations) || 0) * 0.5);

  // 10. Other income
  const otherIncome = Number(salary.otherIncome) || 0;

  // Total Deductions
  const totalDeductions = (
    STANDARD_DEDUCTION_OLD +
    hraResult.exemption +
    sec80C +
    sec80CCD1B +
    sec80D +
    sec24b +
    sec80E +
    sec80TTA +
    sec80G
  );

  // Taxable Income
  const taxableIncome = Math.max(0, grossSalary + otherIncome - totalDeductions);

  // Apply slab tax
  let slabTax = 0;
  let remainingIncome = taxableIncome;

  for (const slab of OLD_REGIME_SLABS) {
    if (remainingIncome <= 0) break;
    const slabWidth = slab.max === Infinity
      ? remainingIncome
      : Math.min(remainingIncome, slab.max - slab.min + 1);
    slabTax += slabWidth * slab.rate;
    remainingIncome -= slabWidth;
  }

  slabTax = Math.round(slabTax);

  // 87A Rebate
  let rebate87A = 0;
  if (taxableIncome <= REBATE_87A_OLD.maxIncome) {
    rebate87A = Math.min(slabTax, REBATE_87A_OLD.maxRebate);
  }

  const taxAfterRebate = Math.max(0, slabTax - rebate87A);

  // Surcharge + Cess
  const { surcharge, cess, totalTax } = calculateTotalTax(taxableIncome, taxAfterRebate, false);

  return {
    regime: 'old',
    grossSalary,
    otherIncome,
    totalIncome: grossSalary + otherIncome,
    standardDeduction: STANDARD_DEDUCTION_OLD,
    hraExemption: hraResult.exemption,
    hraBreakdown: hraResult.breakdown,
    deductions: {
      sec80C: { amount: sec80C, raw: raw80C, limit: DEDUCTION_LIMITS.sec80C },
      sec80CCD1B: { amount: sec80CCD1B, limit: DEDUCTION_LIMITS.sec80CCD1B },
      sec80D: { amount: sec80D, selfAmount: sec80D_self, parentsAmount: sec80D_parents },
      sec24b: { amount: sec24b, limit: DEDUCTION_LIMITS.sec24b },
      sec80E: { amount: sec80E },
      sec80TTA: { amount: sec80TTA, limit: DEDUCTION_LIMITS.sec80TTA },
      sec80G: { amount: sec80G },
    },
    totalDeductions,
    taxableIncome,
    slabTax,
    rebate87A,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    effectiveRate: taxableIncome > 0 ? ((totalTax / (grossSalary + otherIncome)) * 100).toFixed(1) : '0.0',
  };
}
