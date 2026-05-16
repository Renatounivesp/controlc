import { useState } from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

type CalcEntry = { expression: string; result: string };

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [history, setHistory] = useState<CalcEntry[]>([]);

  const handleButton = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      setExpression('');
      setJustEvaluated(false);
      return;
    }

    if (value === '⌫') {
      if (display.length > 1) setDisplay(display.slice(0, -1));
      else setDisplay('0');
      return;
    }

    if (value === '=') {
      try {
        const expr = expression + display;
        // eslint-disable-next-line no-eval
        const result = String(eval(expr.replace(/×/g, '*').replace(/÷/g, '/')));
        setHistory(h => [{ expression: expr + ' =', result }, ...h].slice(0, 10));
        setDisplay(result);
        setExpression('');
        setJustEvaluated(true);
      } catch {
        setDisplay('Erro');
        setExpression('');
      }
      return;
    }

    if (value === '%') {
      try {
        const val = parseFloat(display) / 100;
        setDisplay(String(val));
      } catch {
        setDisplay('Erro');
      }
      return;
    }

    if (['+', '-', '×', '÷'].includes(value)) {
      setExpression(expression + display + value);
      setDisplay('0');
      setJustEvaluated(false);
      return;
    }

    if (value === '.') {
      if (display.includes('.')) return;
      setDisplay(display + '.');
      return;
    }

    // Number input
    if (justEvaluated) {
      setDisplay(value);
      setJustEvaluated(false);
    } else {
      setDisplay(display === '0' ? value : display + value);
    }
  };

  const buttons = [
    ['C', '%', '⌫', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const isOperator = (v: string) => ['÷', '×', '-', '+', '='].includes(v);
  const isFunction = (v: string) => ['C', '%', '⌫'].includes(v);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Calculadora</h1>
        <p style={{ color: 'var(--text-muted)' }}>Ferramenta de cálculos rápidos.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ borderRadius: '28px', overflow: 'hidden', maxWidth: '360px', margin: '0 auto', width: '100%' }}
        >
          {/* Display */}
          <div style={{
            padding: '28px 24px 20px',
            background: 'linear-gradient(135deg, rgba(17,153,142,0.12) 0%, rgba(56,239,125,0.08) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minHeight: '18px', textAlign: 'right', marginBottom: '8px', fontFamily: 'monospace' }}>
              {expression}
            </p>
            <p style={{
              fontSize: display.length > 10 ? '1.8rem' : '3rem',
              fontWeight: 300,
              color: 'white',
              textAlign: 'right',
              lineHeight: 1,
              letterSpacing: '-1px',
              fontFamily: 'monospace',
              transition: 'font-size 0.2s',
              wordBreak: 'break-all'
            }}>
              {display}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {buttons.map((row, ri) => (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: row.length === 3 ? '2fr 1fr 1fr' : 'repeat(4, 1fr)', gap: '8px' }}>
                {row.map((btn) => (
                  <motion.button
                    key={btn}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ brightness: 1.1 }}
                    onClick={() => handleButton(btn)}
                    style={{
                      padding: '0',
                      height: '64px',
                      borderRadius: '16px',
                      fontSize: btn === '⌫' ? '1rem' : '1.3rem',
                      fontWeight: isOperator(btn) || isFunction(btn) ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(btn === '='
                        ? {
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            color: '#0a0a0f',
                            boxShadow: '0 6px 20px rgba(56, 239, 125, 0.4)',
                          }
                        : isOperator(btn)
                        ? {
                            background: 'rgba(56, 239, 125, 0.12)',
                            color: '#38ef7d',
                            border: '1px solid rgba(56, 239, 125, 0.2)',
                          }
                        : isFunction(btn)
                        ? {
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--text-muted)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }),
                    }}
                  >
                    {btn === '⌫' ? <Delete size={20} /> : btn}
                  </motion.button>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass"
            style={{ borderRadius: '24px', padding: '20px', minWidth: '220px' }}
          >
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>Histórico</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((h, i) => (
                <div
                  key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px', cursor: 'pointer' }}
                  onClick={() => { setDisplay(h.result); setJustEvaluated(true); }}
                >
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{h.expression}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#38ef7d', fontFamily: 'monospace' }}>{h.result}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
