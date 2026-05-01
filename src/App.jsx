import useTaxStore from './store/taxStore';
import Header from './components/Header';
import Stepper from './components/Stepper';
import SalaryForm from './components/SalaryForm';
import InvestmentForm from './components/InvestmentForm';
import TaxResults from './components/TaxResults';
import Disclaimer from './components/Disclaimer';

export default function App() {
  const { currentStep } = useTaxStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SalaryForm />;
      case 2:
        return <InvestmentForm />;
      case 3:
      case 4:
      case 5:
        return <TaxResults />;
      default:
        return <SalaryForm />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '20px' }}>
      <Header />
      <Stepper />
      
      <main style={{
        animation: 'fadeIn 0.3s ease-out',
      }}>
        {renderStep()}
      </main>

      <Disclaimer />
    </div>
  );
}
