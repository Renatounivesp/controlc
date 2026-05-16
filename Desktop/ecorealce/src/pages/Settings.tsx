import { Smartphone, Moon, Sun } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useDashboardStore } from '../store/useDashboardStore';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { theme, toggleTheme } = useDashboardStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Configurações</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gerencie as preferências da sua central.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Preferências do App
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Theme Toggle */}
            <GlassCard style={{ padding: '16px 24px' }}>
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
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Aparência</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Alterne entre modo claro e escuro</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    background: 'var(--primary)', 
                    color: 'white',
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(0, 102, 255, 0.3)'
                  }}
                >
                  {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
                </button>
              </div>
            </GlassCard>

            {/* PWA Configuration */}
            <GlassCard style={{ padding: '16px 24px' }}>
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
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Configuração PWA</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instalar central na tela inicial</p>
                  </div>
                </div>
                <button 
                  onClick={handleInstall}
                  disabled={isInstalled || !deferredPrompt}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    background: isInstalled ? 'rgba(255,255,255,0.05)' : 'var(--primary)', 
                    color: isInstalled ? 'var(--text-muted)' : 'white',
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    opacity: (!isInstalled && !deferredPrompt) ? 0.5 : 1,
                    cursor: isInstalled ? 'default' : 'pointer'
                  }}
                >
                  {isInstalled ? 'Instalado' : deferredPrompt ? 'Instalar Agora' : 'PWA Ativo'}
                </button>
              </div>
            </GlassCard>

          </div>
        </div>
      </div>

      <div style={{ marginTop: '60px', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Realce Film HUB - Versão 2.5.0</p>
      </div>
    </div>
  );
}
