import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useDashboardStore } from '../store/useDashboardStore';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useDashboardStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? '' : 'light-theme'} style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden', 
      position: 'relative',
      backgroundColor: 'var(--bg-dark)',
      color: 'var(--text-main)',
      transition: 'all 0.3s'
    }}>
      {/* Sidebar Desktop */}
      <div className="sidebar-desktop">
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}
      
      {/* Sidebar Mobile Content */}
      <div style={{
        position: 'absolute',
        left: isSidebarOpen ? 0 : '-100%',
        top: 0,
        bottom: 0,
        zIndex: 50,
        transition: 'left 0.3s ease',
        width: '280px',
      }}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
