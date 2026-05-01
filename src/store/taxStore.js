// ============================================================================
// Zustand Global State Store
// ============================================================================

import { create } from 'zustand';
import { calculateOldRegimeTax } from '../engine/oldRegime';
import { calculateNewRegimeTax } from '../engine/newRegime';
import { getInvestmentRecommendations } from '../engine/optimizer';
import { getAIAdvice } from '../ai/advisor';

const useTaxStore = create((set, get) => ({
  // Current step in multi-step form
  currentStep: 1,
  
  // Salary form data
  salaryData: {
    basicAnnual: '',
    hraAnnual: '',
    ltaAnnual: '',
    specialAllowanceAnnual: '',
    otherAllowanceAnnual: '',
    rentPaidAnnual: '',
    isMetro: true,
    otherIncome: '',
  },

  // Investment form data
  investmentData: {
    // 80C
    epf: '',
    ppf: '',
    elss: '',
    lic: '',
    nsc: '',
    homeLoanPrincipal: '',
    others80C: '',
    // 80CCD
    nps: '',
    employerNPS: '',
    // 80D
    healthInsuranceSelf: '',
    healthInsuranceParents: '',
    parentsAreSenior: false,
    // 24(b)
    homeLoanInterest: '',
    // 80E
    educationLoanInterest: '',
    // 80TTA
    savingsInterest: '',
    // 80G
    donations: '',
  },

  // Computed results
  oldRegimeResult: null,
  newRegimeResult: null,
  recommendations: null,
  aiAdvice: '',
  aiLoading: false,
  isCalculated: false,

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, 5) 
  })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) 
  })),

  setSalaryData: (data) => set((state) => ({
    salaryData: { ...state.salaryData, ...data },
  })),

  setInvestmentData: (data) => set((state) => ({
    investmentData: { ...state.investmentData, ...data },
  })),

  // Calculate taxes for both regimes
  calculateTax: () => {
    const { salaryData, investmentData } = get();
    
    const oldResult = calculateOldRegimeTax(salaryData, investmentData);
    const newResult = calculateNewRegimeTax(salaryData, investmentData);
    const recos = getInvestmentRecommendations(oldResult, investmentData);

    set({
      oldRegimeResult: oldResult,
      newRegimeResult: newResult,
      recommendations: recos,
      isCalculated: true,
      currentStep: 3,
    });
  },

  // Fetch AI advice
  fetchAIAdvice: async () => {
    const { oldRegimeResult, newRegimeResult, investmentData, recommendations } = get();
    
    if (!oldRegimeResult || !newRegimeResult) return;

    set({ aiLoading: true });

    try {
      const taxData = {
        grossSalary: oldRegimeResult.grossSalary,
        oldTaxableIncome: oldRegimeResult.taxableIncome,
        newTaxableIncome: newRegimeResult.taxableIncome,
        oldTax: oldRegimeResult.totalTax,
        newTax: newRegimeResult.totalTax,
        sec80C: oldRegimeResult.deductions.sec80C.raw,
        nps: Number(investmentData.nps) || 0,
        healthInsuranceSelf: Number(investmentData.healthInsuranceSelf) || 0,
        healthInsuranceParents: Number(investmentData.healthInsuranceParents) || 0,
        homeLoanInterest: Number(investmentData.homeLoanInterest) || 0,
        hraExemption: oldRegimeResult.hraExemption,
        potentialSavings: recommendations?.totalPotentialSavings || 0,
      };

      const advice = await getAIAdvice(taxData);
      set({ aiAdvice: advice, aiLoading: false });
    } catch (error) {
      console.error('Failed to fetch AI advice:', error);
      set({ 
        aiAdvice: 'Unable to generate AI advice at this time. Please try again later.',
        aiLoading: false 
      });
    }
  },

  // Reset everything
  reset: () => set({
    currentStep: 1,
    salaryData: {
      basicAnnual: '',
      hraAnnual: '',
      ltaAnnual: '',
      specialAllowanceAnnual: '',
      otherAllowanceAnnual: '',
      rentPaidAnnual: '',
      isMetro: true,
      otherIncome: '',
    },
    investmentData: {
      epf: '',
      ppf: '',
      elss: '',
      lic: '',
      nsc: '',
      homeLoanPrincipal: '',
      others80C: '',
      nps: '',
      employerNPS: '',
      healthInsuranceSelf: '',
      healthInsuranceParents: '',
      parentsAreSenior: false,
      homeLoanInterest: '',
      educationLoanInterest: '',
      savingsInterest: '',
      donations: '',
    },
    oldRegimeResult: null,
    newRegimeResult: null,
    recommendations: null,
    aiAdvice: '',
    aiLoading: false,
    isCalculated: false,
  }),
}));

export default useTaxStore;
