// ============================================================================
// New Regime Tax Calculator — FY 2024-25
// ============================================================================

import {
  NEW_REGIME_SLABS,
  STANDARD_DEDUCTION_NEW,
  REBATE_87A_NEW,
} from './constants';
import { calculateTotalTax } from './surcharge';

/**
 * Calculate tax under New Regime
 * New Regime allows very few deductions:
 *   - Standard Deduction: ₹75,000 (Budget 2024)
 *   - NPS employer contribution (80CCD(2)): up to 10% of basic
 *   - No 80C, 80D, HRA, LTA exemptions
 * 
 * @param {object} salary - Salary components
 * @param {object} investments - Current investments (only employer NPS matters)
 * @returns {object} - Complete tax breakdown
 */
export function calculateNewRegimeTax(salary, investments) {
  // 1. Calculate Gross Salary
  const grossSalary = (
    (Number(salary.basicAnnual) || 0) +
    (Number(salary.hraAnnual) || 0) +
    (Number(salary.ltaAnnual) || 0) +
    (Number(salary.specialAllowanceAnnual) || 0) +
    (Number(salary.otherAllowanceAnnual) || 0)
  );

  // 2. Employer NPS (80CCD(2)) — up to 10% of basic
  const employerNPS = Math.min(
    Number(investments.employerNPS) || 0,
    Math.round((Number(salary.basicAnnual) || 0) * 0.10)
  );

  // 3. Other income
  const otherIncome = Number(salary.otherIncome) || 0;

  // Total Deductions (very limited in new regime)
  const totalDeductions = STANDARD_DEDUCTION_NEW + employerNPS;

  // Taxable Income
  const taxableIncome = Math.max(0, grossSalary + otherIncome - totalDeductions);

  // Apply slab tax
  let slabTax = 0;
  let remainingIncome = taxableIncome;

  for (const slab of NEW_REGIME_SLABS) {
    if (remainingIncome <= 0) break;
    const slabWidth = slab.max === Infinity
      ? remainingIncome
      : Math.min(remainingIncome, slab.max - slab.min + 1);
    slabTax += slabWidth * slab.rate;
    remainingIncome -= slabWidth;
  }

  slabTax = Math.round(slabTax);

  // 87A Rebate — if taxable income ≤ ₹7,00,000
  let rebate87A = 0;
  if (taxableIncome <= REBATE_87A_NEW.maxIncome) {
    rebate87A = Math.min(slabTax, REBATE_87A_NEW.maxRebate);
  }

  const taxAfterRebate = Math.max(0, slabTax - rebate87A);

  // Surcharge + Cess
  const { surcharge, cess, totalTax } = calculateTotalTax(taxableIncome, taxAfterRebate, true);

  return {
    regime: 'new',
    grossSalary,
    otherIncome,
    totalIncome: grossSalary + otherIncome,
    standardDeduction: STANDARD_DEDUCTION_NEW,
    employerNPS,
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
