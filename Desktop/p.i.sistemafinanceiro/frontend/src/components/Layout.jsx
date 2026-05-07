import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Target, 
  LogOut, 
  Menu, 
  X, 
  DollarSign,
  Sun,
  Moon,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Geral', icon: LayoutDashboard, path: '/' },
    { name: 'Movimentações', icon: Receipt, path: '/transactions' },
    { name: 'Meus Sonhos', icon: Target, path: '/goals' },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      
      {/* Premium Sidebar */}
      <motion.aside 
        initial={false}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 transform transition-all duration-500 ease-in-out md:relative md:translate-x-0 shadow-2xl md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-8">
          {/* Logo */}
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="bg-primary-600 p-3 rounded-[1.25rem] shadow-lg shadow-primary-600/30 group-hover:rotate-12 transition-transform">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white block leading-none">Ctrl + $</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Premium Auth</span>
              </div>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "nav-item group relative overflow-hidden",
                    isActive ? "nav-item-active" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6 transition-transform group-hover:scale-110",
                    isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400"
                  )} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <motion.div layoutId="activeNav" className="absolute right-0 w-1.5 h-8 bg-primary-600 rounded-l-full" />}
                  <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0", isActive && "hidden")} />
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile Section */}
          <div className="mt-auto space-y-6 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                {user?.username?.[0] || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{user?.username || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">Plano Pro</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleDarkMode}
                aria-label="Alternar Tema"
                className="flex-1 flex items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-800/50 text-slate-500 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-100 dark:border-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-8 md:px-12 bg-[#f8fafc]/50 dark:bg-[#020617]/50 backdrop-blur-md z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span className="font-bold text-sm uppercase tracking-widest">{location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1]}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </button>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Status do Sistema</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-green-500 uppercase">Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 md:px-12 py-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Layout;
