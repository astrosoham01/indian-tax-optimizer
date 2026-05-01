// ============================================================================
// Surcharge & Cess Calculator
// ============================================================================

import { SURCHARGE_TIERS, NEW_REGIME_MAX_SURCHARGE_RATE, CESS_RATE } from './constants';

/**
 * Calculate surcharge on income tax
 * Includes marginal relief calculation
 * 
 * @param {number} taxableIncome - Total taxable income
 * @param {number} baseTax - Tax before surcharge
 * @param {boolean} isNewRegime - Whether using new regime (caps surcharge at 25%)
 * @returns {number} - Surcharge amount
 */
export function calculateSurcharge(taxableIncome, baseTax, isNewRegime = false) {
  if (taxableIncome <= 5000000 || baseTax <= 0) return 0;

  let applicableRate = 0;
  
  for (const tier of SURCHARGE_TIERS) {
    if (taxableIncome >= tier.min && taxableIncome <= tier.max) {
      applicableRate = tier.rate;
      break;
    }
  }

  // New regime caps surcharge at 25%
  if (isNewRegime && applicableRate > NEW_REGIME_MAX_SURCHARGE_RATE) {
    applicableRate = NEW_REGIME_MAX_SURCHARGE_RATE;
  }

  let surcharge = baseTax * applicableRate;

  // Marginal relief: Tax + Surcharge should not exceed tax on ₹50L + excess income
  // This is a simplified marginal relief check
  if (taxableIncome > 5000000 && taxableIncome <= 5100000) {
    const excessIncome = taxableIncome - 5000000;
    const taxAt50L = calculateSlabTax(5000000);
    const totalWithSurcharge = baseTax + surcharge;
    const marginalLimit = taxAt50L + excessIncome;
    if (totalWithSurcharge > marginalLimit) {
      surcharge = Math.max(0, marginalLimit - baseTax);
    }
  }

  return Math.round(surcharge);
}

/**
 * Helper: Calculate slab tax at a given income (old regime slabs for marginal relief)
 */
function calculateSlabTax(income) {
  let tax = 0;
  const slabs = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250001, max: 500000, rate: 0.05 },
    { min: 500001, max: 1000000, rate: 0.20 },
    { min: 1000001, max: Infinity, rate: 0.30 },
  ];
  
  for (const slab of slabs) {
    if (income <= 0) break;
    const taxableInSlab = Math.min(income, slab.max) - slab.min + 1;
    if (taxableInSlab > 0) {
      tax += taxableInSlab * slab.rate;
    }
    income -= (slab.max - slab.min + 1);
  }
  
  return tax;
}

/**
 * Calculate Health & Education Cess
 * @param {number} taxPlusSurcharge - Tax + Surcharge amount
 * @returns {number} - Cess amount
 */
export function calculateCess(taxPlusSurcharge) {
  return Math.round(taxPlusSurcharge * CESS_RATE);
}

/**
 * Calculate total tax with surcharge and cess
 * @param {number} taxableIncome - Taxable income
 * @param {number} baseTax - Base slab tax
 * @param {boolean} isNewRegime - New regime flag
 * @returns {object} - { surcharge, cess, totalTax }
 */
export function calculateTotalTax(taxableIncome, baseTax, isNewRegime = false) {
  const surcharge = calculateSurcharge(taxableIncome, baseTax, isNewRegime);
  const cess = calculateCess(baseTax + surcharge);
  const totalTax = baseTax + surcharge + cess;

  return {
    surcharge,
    cess,
    totalTax: Math.round(totalTax),
  };
}
