import { Link, useLocation } from 'react-router-dom';
import { Home, Image, Link2, FileText, Settings as SettingsIcon, LogOut, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Mídias', path: '/media', icon: Image },
  { name: 'Links Rápidos', path: '/links', icon: Link2 },
  { name: 'Documentos', path: '/documents', icon: FileText },
];

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ onClose, isMobile }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={isMobile ? "" : "glass"} style={{
      width: isMobile ? '100%' : '280px',
      height: isMobile ? '100%' : 'calc(100vh - 32px)',
      margin: isMobile ? '0' : '16px',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      backgroundColor: isMobile ? 'var(--bg-dark-secondary)' : undefined,
      borderRadius: isMobile ? '0 24px 24px 0' : '28px',
      boxShadow: isMobile ? '20px 0 50px rgba(0,0,0,0.5)' : undefined,
      border: isMobile ? 'none' : undefined,
      borderRight: isMobile ? '1px solid var(--border-color)' : undefined
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', marginBottom: '32px' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Realce Film</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Central de Controle</p>
        </div>
        <button 
          onClick={onClose}
          className="show-mobile"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                color: isActive ? 'white' : 'var(--text-muted)',
                backgroundColor: 'transparent', // No contour
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 500,
                boxShadow: isActive ? '0 4px 12px -2px rgba(0, 102, 255, 0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon 
                size={20} 
                color={isActive ? 'var(--primary)' : 'currentColor'} 
                style={{ filter: isActive ? 'drop-shadow(0 0 5px var(--primary))' : 'none' }}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link 
          to="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            color: location.pathname === '/settings' ? 'white' : 'var(--text-muted)',
            width: '100%',
            transition: 'all 0.2s',
            fontWeight: location.pathname === '/settings' ? 600 : 500,
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => { if(location.pathname !== '/settings') e.currentTarget.style.color = 'white' }}
          onMouseLeave={(e) => { if(location.pathname !== '/settings') e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <SettingsIcon size={20} color={location.pathname === '/settings' ? 'var(--primary)' : 'currentColor'} /> 
          Configurações
        </Link>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '12px',
          color: 'var(--danger)',
          width: '100%',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} /> Sair
        </button>
      </div>
    </aside>
  );
}
