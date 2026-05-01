import { Briefcase, PiggyBank, BarChart3, Sparkles, FileDown, Check } from 'lucide-react';
import useTaxStore from '../store/taxStore';

const steps = [
  { id: 1, label: 'Salary', icon: Briefcase },
  { id: 2, label: 'Investments', icon: PiggyBank },
  { id: 3, label: 'Results', icon: BarChart3 },
  { id: 4, label: 'AI Advice', icon: Sparkles },
  { id: 5, label: 'Export', icon: FileDown },
];

export default function Stepper() {
  const { currentStep, setCurrentStep, isCalculated } = useTaxStore();

  const handleStepClick = (stepId) => {
    // Only allow clicking on steps that are accessible
    if (stepId <= 2 || (isCalculated && stepId <= 5)) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto 40px',
      padding: '0 24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Connection line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '40px',
          right: '40px',
          height: '2px',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 0,
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            width: `${((Math.min(currentStep, 5) - 1) / 4) * 100}%`,
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '1px',
          }} />
        </div>

        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = step.id <= 2 || (isCalculated && step.id <= 5);

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={!isClickable}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: isClickable ? 'pointer' : 'default',
                opacity: isClickable ? 1 : 0.35,
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCompleted
                  ? 'linear-gradient(135deg, #10b981, #34d399)'
                  : isActive
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.05)',
                border: isActive
                  ? '2px solid rgba(99,102,241,0.5)'
                  : isCompleted
                    ? '2px solid rgba(16,185,129,0.5)'
                    : '2px solid rgba(255,255,255,0.08)',
                boxShadow: isActive
                  ? '0 0 20px rgba(99,102,241,0.3)'
                  : isCompleted
                    ? '0 0 15px rgba(16,185,129,0.2)'
                    : 'none',
                transition: 'all 0.3s ease',
              }}>
                {isCompleted ? (
                  <Check size={18} color="white" />
                ) : (
                  <Icon size={18} color={isActive ? 'white' : '#64748b'} />
                )}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#a5b4fc' : isCompleted ? '#34d399' : '#64748b',
                letterSpacing: '0.03em',
                transition: 'color 0.3s ease',
              }}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
