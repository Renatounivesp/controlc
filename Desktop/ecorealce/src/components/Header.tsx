import { Search, Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header style={{
      height: '80px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <button 
        onClick={onMenuClick}
        className="show-mobile"
        style={{ color: 'white', marginRight: '16px' }}
      >
        <Menu size={24} />
      </button>

      <div className="hide-mobile" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar ferramentas, arquivos ou contatos..." 
          className="glass-panel"
          style={{
            width: '100%',
            padding: '12px 16px 12px 48px',
            color: 'white',
            outline: 'none',
            fontSize: '0.875rem',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          Ctrl K
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ color: 'var(--text-muted)', position: 'relative' }}>
          <Bell size={24} />
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%',
            border: '2px solid var(--bg-dark)'
          }}></span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="hide-mobile" style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Admin User</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gestor</p>
          </div>
          <div className="blue-gradient" style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
