import { useState } from 'react';
import { FileDown, Loader2, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import useTaxStore from '../store/taxStore';
import { formatINR } from '../engine/constants';

export default function PDFExport() {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const { oldRegimeResult, newRegimeResult, recommendations, aiAdvice, salaryData } = useTaxStore();

  if (!oldRegimeResult || !newRegimeResult) return null;

  const generatePDF = async () => {
    setGenerating(true);
    setDone(false);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // Helper functions
      const addTitle = (text) => {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(55, 65, 81);
        doc.text(text, pageWidth / 2, y, { align: 'center' });
        y += 10;
      };

      const addSubtitle = (text) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(text, pageWidth / 2, y, { align: 'center' });
        y += 8;
      };

      const addSectionTitle = (text) => {
        y += 4;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(text, margin, y);
        y += 2;
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
      };

      const addRow = (label, value, bold = false) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(55, 65, 81);
        doc.text(label, margin + 2, y);
        doc.text(value, pageWidth - margin - 2, y, { align: 'right' });
        y += 6;
      };

      const checkPageBreak = (needed = 20) => {
        if (y + needed > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = 20;
        }
      };

      // ===== PAGE 1: Header =====
      // Header bar
      doc.setFillColor(55, 48, 163);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Indian Tax Optimizer', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Tax Planning Report • FY 2024-25', pageWidth / 2, 23, { align: 'center' });
      doc.setFontSize(8);
      doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, 30, { align: 'center' });

      y = 45;

      // ===== Salary Breakup =====
      addSectionTitle('Salary Breakup');
      addRow('Basic Salary', formatINR(Number(salaryData.basicAnnual) || 0));
      addRow('HRA', formatINR(Number(salaryData.hraAnnual) || 0));
      addRow('LTA', formatINR(Number(salaryData.ltaAnnual) || 0));
      addRow('Special Allowance', formatINR(Number(salaryData.specialAllowanceAnnual) || 0));
      addRow('Other Allowances', formatINR(Number(salaryData.otherAllowanceAnnual) || 0));
      if (Number(salaryData.otherIncome) > 0) {
        addRow('Other Income', formatINR(Number(salaryData.otherIncome)));
      }
      addRow('Gross Salary', formatINR(oldRegimeResult.grossSalary), true);

      // ===== Regime Comparison =====
      checkPageBreak(60);
      addSectionTitle('Tax Comparison — Old vs New Regime');

      const betterRegime = oldRegimeResult.totalTax <= newRegimeResult.totalTax ? 'Old' : 'New';
      const savings = Math.abs(oldRegimeResult.totalTax - newRegimeResult.totalTax);

      // Table header
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y - 4, pageWidth - 2 * margin, 8, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(55, 65, 81);
      doc.text('', margin + 2, y);
      doc.text('Old Regime', pageWidth / 2, y, { align: 'center' });
      doc.text('New Regime', pageWidth - margin - 15, y, { align: 'center' });
      y += 8;

      const addComparisonRow = (label, oldVal, newVal) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(75, 85, 99);
        doc.text(label, margin + 2, y);
        doc.text(oldVal, pageWidth / 2, y, { align: 'center' });
        doc.text(newVal, pageWidth - margin - 15, y, { align: 'center' });
        y += 6;
      };

      addComparisonRow('Taxable Income', formatINR(oldRegimeResult.taxableIncome), formatINR(newRegimeResult.taxableIncome));
      addComparisonRow('Slab Tax', formatINR(oldRegimeResult.slabTax), formatINR(newRegimeResult.slabTax));
      addComparisonRow('Rebate 87A', formatINR(oldRegimeResult.rebate87A), formatINR(newRegimeResult.rebate87A));
      addComparisonRow('Surcharge', formatINR(oldRegimeResult.surcharge), formatINR(newRegimeResult.surcharge));
      addComparisonRow('Cess', formatINR(oldRegimeResult.cess), formatINR(newRegimeResult.cess));

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(55, 48, 163);
      addComparisonRow('TOTAL TAX', formatINR(oldRegimeResult.totalTax), formatINR(newRegimeResult.totalTax));

      y += 4;
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(margin, y - 4, pageWidth - 2 * margin, 12, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`★ ${betterRegime} Regime Recommended — You save ${formatINR(savings)}`, pageWidth / 2, y + 4, { align: 'center' });
      y += 16;

      // ===== Investment Recommendations =====
      checkPageBreak(40);
      if (recommendations && recommendations.recommendations.length > 0) {
        addSectionTitle('Investment Recommendations');
        
        recommendations.recommendations.forEach((reco, i) => {
          checkPageBreak(18);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(55, 65, 81);
          doc.text(`${i + 1}. ${reco.name} (${reco.section})`, margin + 2, y);
          y += 5;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(107, 114, 128);
          
          const messageLines = doc.splitTextToSize(
            `Invest: ${formatINR(reco.amountToInvest)} | Tax Saved: ${formatINR(reco.taxSaved)} | Returns: ${reco.expectedReturns} | Risk: ${reco.riskLevel} | Lock-in: ${reco.lockIn}`,
            pageWidth - 2 * margin - 4
          );
          doc.text(messageLines, margin + 2, y);
          y += messageLines.length * 5 + 4;
        });

        if (recommendations.totalPotentialSavings > 0) {
          y += 2;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(16, 185, 129);
          doc.text(`Total Potential Additional Savings: ${formatINR(recommendations.totalPotentialSavings)}`, margin + 2, y);
          y += 8;
        }
      }

      // ===== AI Advisory =====
      checkPageBreak(30);
      if (aiAdvice) {
        addSectionTitle('AI Tax Advisory');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(107, 114, 128);
        const adviceLines = doc.splitTextToSize(aiAdvice, pageWidth - 2 * margin - 4);
        doc.text(adviceLines, margin + 2, y);
        y += adviceLines.length * 5 + 4;
      }

      // ===== Disclaimer =====
      checkPageBreak(25);
      y += 6;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      const disclaimer = 'DISCLAIMER: This report is generated for educational and planning purposes only. It is not a substitute for professional tax advice. Tax laws change annually — always verify with the latest Finance Act. Consult a Chartered Accountant or Certified Financial Planner for personalized advice before making financial decisions.';
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
      doc.text(disclaimerLines, margin, y);

      // Save
      doc.save('Indian-Tax-Plan-FY2024-25.pdf');
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in-up" style={{ marginTop: '28px' }}>
      <div className="glass-card-static" style={{
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            📄 Download Tax Planning Report
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            One-page PDF with salary breakup, regime comparison, recommendations & AI advice
          </p>
        </div>

        <button
          onClick={generatePDF}
          disabled={generating}
          className={done ? 'btn-success' : 'btn-primary'}
          style={{ minWidth: '180px' }}
        >
          {generating ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Generating...
            </>
          ) : done ? (
            <>
              <CheckCircle size={16} />
              Downloaded!
            </>
          ) : (
            <>
              <FileDown size={16} />
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
