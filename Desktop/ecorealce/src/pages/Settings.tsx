import { Bell, Shield, Smartphone, Palette, Globe, Database } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function Settings() {
  const settingsGroups = [
    {
      title: 'Preferências do App',
      items: [
        { icon: Smartphone, name: 'Configuração PWA', description: 'Gerenciar instalação na tela inicial', status: 'Ativo' },
        { icon: Palette, name: 'Aparência', description: 'Modo Escuro / Luxury Glass', status: 'Dark' },
        { icon: Globe, name: 'Idioma', description: 'Português (Brasil)', status: 'PT-BR' },
      ]
    },
    {
      title: 'Persistência de Dados',
      items: [
        { icon: Database, name: 'Supabase Cloud', description: 'Conectar banco de dados real', status: import.meta.env.VITE_SUPABASE_URL ? 'Conectado' : 'Local Only' },
      ]
    },
    {
      title: 'Segurança',
      items: [
        { icon: Shield, name: 'Senha de Acesso', description: 'Alterar senha da central', status: 'Protegido' },
        { icon: Bell, name: 'Notificações', description: 'Alertas de novos orçamentos', status: 'Ativado' },
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Configurações</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gerencie as preferências da sua central.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <GlassCard key={iIdx} style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '10px', 
                          background: 'rgba(255,255,255,0.03)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'var(--primary)'
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{item.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.description}</p>
                        </div>
                      </div>
                      <div style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        background: 'rgba(255,255,255,0.05)', 
                        fontSize: '0.75rem', 
                        color: 'var(--primary)',
                        fontWeight: 600
                      }}>
                        {item.status}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '60px', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Realce Film HUB - Versão 2.4.0</p>
      </div>
    </div>
  );
}
