// ============================================================================
// HRA Exemption Calculator
// ============================================================================

import { HRA_METRO_PERCENT, HRA_NON_METRO_PERCENT } from './constants';

/**
 * Calculate HRA exemption under Old Regime
 * HRA Exemption = MINIMUM of:
 *   a) Actual HRA received from employer
 *   b) Rent paid - 10% of Basic Salary
 *   c) 50% of Basic (Metro) or 40% of Basic (Non-Metro)
 * 
 * @param {number} basicAnnual - Annual basic salary
 * @param {number} hraReceived - Annual HRA received
 * @param {number} rentPaidAnnual - Annual rent paid
 * @param {boolean} isMetro - Whether city is Metro (Mumbai, Delhi, Kolkata, Chennai)
 * @returns {object} - { exemption, breakdown }
 */
export function calculateHRAExemption(basicAnnual, hraReceived, rentPaidAnnual, isMetro) {
  // If no rent is paid or no HRA received, no exemption
  if (!rentPaidAnnual || rentPaidAnnual <= 0 || !hraReceived || hraReceived <= 0) {
    return {
      exemption: 0,
      breakdown: {
        actualHRA: hraReceived || 0,
        rentMinus10Percent: 0,
        percentOfBasic: 0,
      },
    };
  }

  const actualHRA = hraReceived;
  const rentMinus10Percent = Math.max(0, rentPaidAnnual - (0.10 * basicAnnual));
  const percentOfBasic = basicAnnual * (isMetro ? HRA_METRO_PERCENT : HRA_NON_METRO_PERCENT);

  const exemption = Math.min(actualHRA, rentMinus10Percent, percentOfBasic);

  return {
    exemption,
    breakdown: {
      actualHRA,
      rentMinus10Percent,
      percentOfBasic,
    },
  };
}
