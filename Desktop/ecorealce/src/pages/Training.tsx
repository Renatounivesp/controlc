import { PlayCircle, FileText, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const mockTraining = [
  { id: 1, title: 'Onboarding para Novos Funcionários', type: 'video', duration: '45 min', progress: 100 },
  { id: 2, title: 'Técnicas de Venda: Película Automotiva', type: 'video', duration: '1h 20m', progress: 60 },
  { id: 3, title: 'Manual de Instalação Nano Cerâmica', type: 'pdf', pages: 24, progress: 0 },
  { id: 4, title: 'Script de Atendimento via WhatsApp', type: 'script', progress: 100 },
];

export default function Training() {
  return (
    <div>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Treinamentos</h1>
        <p style={{ color: 'var(--text-muted)' }}>Capacitação contínua para a equipe Realce Film.</p>
      </header>

      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mockTraining.map((item, index) => (
            <GlassCard key={item.id} delay={index * 0.1} className="flex-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '100%' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.progress === 100 ? 'var(--success)' : 'var(--primary)'
                }}>
                  {item.type === 'video' ? <PlayCircle size={32} /> : <FileText size={32} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.type === 'video' ? `Vídeo • ${item.duration}` : item.type === 'pdf' ? `PDF • ${item.pages} páginas` : 'Script'}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginTop: '4px' }}>{item.title}</h3>
                    </div>
                    {item.progress === 100 && <CheckCircle2 color="var(--success)" size={24} />}
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: item.progress === 100 ? 'var(--success)' : 'var(--primary)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Seu Progresso</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', position: 'relative' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--primary)" strokeWidth="12" strokeDasharray="314" strokeDashoffset={314 - (314 * 65) / 100} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>65%</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
