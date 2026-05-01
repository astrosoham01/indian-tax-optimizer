import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Bot } from 'lucide-react';
import useTaxStore from '../store/taxStore';

export default function AIAdvisor() {
  const { aiAdvice, aiLoading, fetchAIAdvice, isCalculated } = useTaxStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isCalculated && !aiAdvice && !aiLoading) {
      fetchAIAdvice();
    }
  }, [isCalculated]);

  // Typing animation effect
  useEffect(() => {
    if (aiAdvice && !aiLoading) {
      setIsTyping(true);
      setDisplayedText('');
      let index = 0;
      const timer = setInterval(() => {
        if (index < aiAdvice.length) {
          setDisplayedText(aiAdvice.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 12);
      return () => clearInterval(timer);
    }
  }, [aiAdvice]);

  return (
    <div className="animate-fade-in-up" style={{ marginTop: '28px' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.06), rgba(139,92,246,0.03))',
        border: '1px solid rgba(167,139,250,0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative gradient blob */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(139,92,246,0.25))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'sparkle 2s ease-in-out infinite',
            }}>
              <Sparkles size={18} color="#a78bfa" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                AI Tax Advisor
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Bot size={11} />
                Powered by Gemini AI
              </p>
            </div>
          </div>

          <button
            onClick={fetchAIAdvice}
            disabled={aiLoading}
            style={{
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              color: '#a78bfa',
              cursor: aiLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={13} style={{
              animation: aiLoading ? 'spin 1s linear infinite' : 'none',
            }} />
            {aiLoading ? 'Thinking...' : 'Regenerate'}
          </button>
        </div>

        {/* Content */}
        {aiLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="skeleton" style={{ width: '100%', height: '16px' }} />
            <div className="skeleton" style={{ width: '90%', height: '16px' }} />
            <div className="skeleton" style={{ width: '95%', height: '16px' }} />
            <div className="skeleton" style={{ width: '60%', height: '16px' }} />
          </div>
        ) : (
          <div style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: 'var(--text-secondary)',
            fontWeight: '400',
          }}>
            {displayedText}
            {isTyping && (
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '16px',
                background: '#a78bfa',
                marginLeft: '2px',
                animation: 'pulse-glow 1s ease-in-out infinite',
                verticalAlign: 'text-bottom',
              }} />
            )}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '16px',
          fontStyle: 'italic',
          opacity: 0.7,
        }}>
          ⚠️ AI-generated advice is for informational purposes only. Consult a CA for professional tax guidance.
        </p>
      </div>
    </div>
  );
}
