# 🇮🇳 Indian Tax Optimizer Bot

> **Smart Tax Planning for FY 2024-25** — Calculate, compare, and optimize your Indian income tax.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Dual Regime Calculator** — Computes tax under both Old & New Regime with full deduction tree
- **Side-by-Side Comparison** — Instantly see which regime saves you more
- **Smart Investment Optimizer** — Prioritized recommendations (80C, NPS, 80D, 24b) with exact tax savings
- **AI Tax Advisor** — Personalized advice powered by Google Gemini AI
- **Visual Dashboards** — Salary pie charts, regime bar charts, deduction utilization graphs
- **PDF Export** — Download a one-page tax planning report
- **Beautiful Dark UI** — Glassmorphism design with smooth animations

## 🧮 Tax Engine Covers

| Section | Deduction | Limit |
|---------|-----------|-------|
| 80C | EPF, PPF, ELSS, LIC, NSC, etc. | ₹1,50,000 |
| 80CCD(1B) | NPS Tier-I (additional) | ₹50,000 |
| 80D | Health Insurance (self + parents) | ₹25K + ₹50K |
| 24(b) | Home Loan Interest | ₹2,00,000 |
| 80E | Education Loan Interest | No limit |
| 80TTA | Savings Account Interest | ₹10,000 |
| 80G | Donations | 50% / 100% |
| HRA | Rent Allowance Exemption | Min of 3 conditions |
| Std. Deduction | Old: ₹50K / New: ₹75K | Flat |
| 87A Rebate | Old: ₹12.5K / New: ₹25K | Income-based |
| Surcharge | 10% to 37% | Income-based |
| Cess | Health & Education | 4% |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free [Google Gemini API key](https://aistudio.google.com/apikey) (for AI advice)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/indian-tax-optimizer.git
cd indian-tax-optimizer

# Install dependencies
npm install

# Create .env file with your API key
cp .env.example .env
# Edit .env and add your Gemini API key

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Architecture

```
src/
├── engine/           ← Pure JS tax calculation logic
│   ├── constants.js      FY 2024-25 slabs, limits, rates
│   ├── oldRegime.js      Old regime with full deduction tree
│   ├── newRegime.js      New regime (simplified)
│   ├── hraExemption.js   HRA exemption calculator
│   ├── surcharge.js      Surcharge + cess
│   └── optimizer.js      Investment recommendation engine
├── ai/
│   └── advisor.js    ← Gemini API for personalized advice
├── store/
│   └── taxStore.js   ← Zustand global state
├── components/
│   ├── SalaryForm.jsx        Step 1: Salary inputs
│   ├── InvestmentForm.jsx    Step 2: Investments & deductions
│   ├── TaxResults.jsx        Step 3: Results dashboard
│   ├── RegimeComparison.jsx  Old vs New comparison cards
│   ├── Charts.jsx            Recharts visualizations
│   ├── InvestmentRecos.jsx   Ranked recommendations
│   ├── AIAdvisor.jsx         AI advice with typing animation
│   ├── PDFExport.jsx         Download PDF report
│   ├── Header.jsx            App header
│   ├── Stepper.jsx           Multi-step navigation
│   └── Disclaimer.jsx        Legal footer
└── App.jsx
```

## 📱 User Flow

1. **Salary Details** — Enter annual salary breakup + HRA details
2. **Investments** — Input current 80C, NPS, health insurance, home loan, etc.
3. **Results** — View Old vs New regime comparison, charts & recommendations
4. **AI Advice** — Get personalized tax advice from Gemini AI
5. **Export** — Download one-page PDF report

## 🛠️ Tech Stack

- **React 18** + **Vite** — Fast development
- **Tailwind CSS v4** — Utility-first styling
- **Recharts** — Charting library
- **Zustand** — State management
- **React Hook Form** — Form handling
- **jsPDF** — PDF generation
- **Gemini API** — AI-powered tax advice
- **Lucide React** — Icons

## ⚠️ Disclaimer

This tool provides tax calculations for **educational and planning purposes only**. It is not a substitute for professional tax advice. Tax laws change annually — always verify with the latest Finance Act. Consult a Chartered Accountant or Certified Financial Planner for personalized advice before making financial decisions.

Based on **Finance Act 2024** (FY 2024-25 / AY 2025-26)

## 📄 License

MIT License — feel free to use, modify, and distribute.
