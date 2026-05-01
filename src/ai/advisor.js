// ============================================================================
// Gemini AI Tax Advisor
// ============================================================================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Get personalized tax advice from Gemini AI
 * 
 * @param {object} taxData - Computed tax data from both regimes
 * @returns {string} - AI-generated advice text
 */
export async function getAIAdvice(taxData) {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  
  if (!apiKey) {
    return getFallbackAdvice(taxData);
  }

  const prompt = `You are an expert Indian tax advisor (CFP certified, CA qualified).
User's financial profile for FY 2024-25:

- Annual Gross Salary: ₹${(taxData.grossSalary || 0).toLocaleString('en-IN')}
- Taxable Income (Old Regime): ₹${(taxData.oldTaxableIncome || 0).toLocaleString('en-IN')}
- Taxable Income (New Regime): ₹${(taxData.newTaxableIncome || 0).toLocaleString('en-IN')}
- Old Regime Tax: ₹${(taxData.oldTax || 0).toLocaleString('en-IN')}
- New Regime Tax: ₹${(taxData.newTax || 0).toLocaleString('en-IN')}
- Tax Saving if choosing better regime: ₹${(Math.abs((taxData.oldTax || 0) - (taxData.newTax || 0))).toLocaleString('en-IN')}
- Current 80C investments: ₹${(taxData.sec80C || 0).toLocaleString('en-IN')} out of ₹1,50,000 limit
- NPS contribution: ₹${(taxData.nps || 0).toLocaleString('en-IN')} out of ₹50,000 limit  
- Health insurance (self): ₹${(taxData.healthInsuranceSelf || 0).toLocaleString('en-IN')}
- Health insurance (parents): ₹${(taxData.healthInsuranceParents || 0).toLocaleString('en-IN')}
- Home loan interest: ₹${(taxData.homeLoanInterest || 0).toLocaleString('en-IN')}
- HRA Exemption claimed: ₹${(taxData.hraExemption || 0).toLocaleString('en-IN')}
- Total potential additional savings from optimizer: ₹${(taxData.potentialSavings || 0).toLocaleString('en-IN')}

Give a 4-5 line personalized tax advice in a warm, conversational tone:
1. Which regime to choose and why (be specific about the exact saving amount)
2. Top 2 specific investment actions to take NOW (with exact amounts and sections)
3. One often-missed deduction or tip they might be overlooking
4. A reminder about ITR filing deadline

Keep it specific to their numbers, actionable, and use ₹ symbol for amounts. Do NOT use markdown formatting, bullet points, or headers — write in flowing paragraphs. Do not start with "Based on your profile" — be more creative.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return getFallbackAdvice(taxData);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return getFallbackAdvice(taxData);
  } catch (error) {
    console.error('AI Advisor error:', error);
    return getFallbackAdvice(taxData);
  }
}

/**
 * Fallback advice when API is unavailable
 */
function getFallbackAdvice(taxData) {
  const oldTax = taxData.oldTax || 0;
  const newTax = taxData.newTax || 0;
  const savings = Math.abs(oldTax - newTax);
  const betterRegime = oldTax <= newTax ? 'Old' : 'New';
  
  const sec80CUsed = taxData.sec80C || 0;
  const sec80CRemaining = Math.max(0, 150000 - sec80CUsed);
  const npsUsed = taxData.nps || 0;
  const npsRemaining = Math.max(0, 50000 - npsUsed);

  let advice = `The ${betterRegime} Regime saves you ₹${savings.toLocaleString('en-IN')} this year — that's your clear winner. `;

  if (sec80CRemaining > 0) {
    advice += `You still have ₹${sec80CRemaining.toLocaleString('en-IN')} of unused 80C limit — consider ELSS mutual funds for the best returns with just a 3-year lock-in. `;
  }

  if (npsRemaining > 0) {
    advice += `Adding ₹${npsRemaining.toLocaleString('en-IN')} to NPS under Section 80CCD(1B) gives you an extra deduction beyond 80C. `;
  }

  advice += `Don't forget to claim the ₹5,000 preventive health checkup deduction under 80D — most people miss this! File your ITR by July 31st, 2025 to avoid penalties.`;

  return advice;
}
