import { Smartphone, Moon, Sun, Settings2, RefreshCw, Check } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useDashboardStore } from '../store/useDashboardStore';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { theme, toggleTheme, isEditMode, setIsEditMode, syncData, isLoading } = useDashboardStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

            {/* Sync Data */}
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
                    color: 'var(--success)'
                  }}>
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Sincronizar Dados</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Forçar atualização com o servidor</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    setIsSyncing(true);
                    await syncData();
                    setTimeout(() => setIsSyncing(false), 2000);
                  }}
                  disabled={isSyncing}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    background: isSyncing ? 'var(--success)' : 'rgba(255,255,255,0.05)', 
                    color: 'white',
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSyncing ? <><Check size={14} /> Sincronizado</> : 'Sincronizar'}
                </button>
              </div>
            </GlassCard>

            {/* Manager Mode */}
            <GlassCard style={{ padding: '16px 24px', border: isEditMode ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)' }}>
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
                    color: isEditMode ? 'var(--primary)' : 'var(--text-muted)'
                  }}>
                    <Settings2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Modo Gestor</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ativar edição de atalhos no dashboard</p>
                  </div>
                </div>
                <div 
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{ 
                    width: '50px',
                    height: '26px',
                    background: isEditMode ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ 
                    width: '18px',
                    height: '18px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '4px',
                    left: isEditMode ? '28px' : '4px',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            </GlassCard>

            {/* Emergency Cloud Push */}
            <GlassCard style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: 'rgba(0,102,255,0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Enviar para Nuvem</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sobe seus atalhos locais para o servidor</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (window.confirm('Isso irá substituir os atalhos da nuvem pelos que você tem agora neste navegador. Continuar?')) {
                      await (useDashboardStore.getState() as any).pushToCloud();
                      alert('Dados enviados com sucesso!');
                    }
                  }}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    background: 'rgba(255,255,255,0.05)', 
                    color: 'white',
                    fontSize: '0.8rem', 
                    fontWeight: 600
                  }}
                >
                  Enviar
                </button>
              </div>
            </GlassCard>

            {/* Reset to Defaults */}
            <GlassCard style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: 'rgba(239,68,68,0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--danger)'
                  }}>
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Restaurar Padrões</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Limpa tudo e volta aos atalhos originais</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (window.confirm('TEM CERTEZA? Isso apagará todos os seus atalhos e voltará aos originais da Realce Film.')) {
                      await (useDashboardStore.getState() as any).resetToDefaults();
                      alert('Sistema restaurado!');
                      window.location.reload();
                    }
                  }}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: 'var(--danger)',
                    fontSize: '0.8rem', 
                    fontWeight: 600
                  }}
                >
                  Restaurar
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
