import useTaxStore from '../store/taxStore';
import RegimeComparison from './RegimeComparison';
import Charts from './Charts';
import InvestmentRecos from './InvestmentRecos';
import AIAdvisor from './AIAdvisor';
import PDFExport from './PDFExport';

export default function TaxResults() {
  const { oldRegimeResult, newRegimeResult, isCalculated } = useTaxStore();

  if (!isCalculated || !oldRegimeResult || !newRegimeResult) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Complete the salary and investment forms to see your tax results.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 24px',
    }}>
      {/* Regime Comparison */}
      <RegimeComparison />

      {/* Charts */}
      <Charts />

      {/* Investment Recommendations */}
      <InvestmentRecos />

      {/* AI Advisor */}
      <AIAdvisor />

      {/* PDF Export */}
      <PDFExport />
    </div>
  );
}
