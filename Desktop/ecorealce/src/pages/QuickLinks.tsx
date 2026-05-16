import { Plus, ExternalLink, MoreVertical } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const mockLinks = [
  { id: 1, title: 'Sistema de Orçamentos V2', url: 'https://orcamento.realcefilm.com.br', category: 'Sistemas', color: '#3b82f6' },
  { id: 2, title: 'Tabela de Preços 2026', url: '#', category: 'Documentos', color: '#10b981' },
  { id: 3, title: 'CRM de Vendas', url: '#', category: 'Vendas', color: '#f59e0b' },
  { id: 4, title: 'Portal do Fornecedor', url: '#', category: 'Administrativo', color: '#8b5cf6' },
  { id: 5, title: 'Calculadora de Películas', url: '#', category: 'Ferramentas', color: '#ec4899' },
  { id: 6, title: 'Marketing Pack', url: '#', category: 'Marketing', color: '#f43f5e' },
];

export default function QuickLinks() {
  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Links Rápidos</h1>
          <p style={{ color: 'var(--text-muted)' }}>Acesso direto a todos os sistemas e documentos importantes.</p>
        </div>
        <button className="glass" style={{ padding: '12px 24px', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)' }}>
          <Plus size={20} /> Novo Link
        </button>
      </header>

      <div className="grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {mockLinks.map((link, index) => (
          <GlassCard key={link.id} delay={index * 0.05} className="group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: `${link.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: link.color
              }}>
                <ExternalLink size={24} />
              </div>
              <button style={{ color: 'var(--text-muted)' }}>
                <MoreVertical size={20} />
              </button>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: link.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{link.category}</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginTop: '4px', marginBottom: '16px' }}>{link.title}</h3>
            </div>
            <a 
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                width: '100%',
                padding: '12px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            >
              Acessar
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
