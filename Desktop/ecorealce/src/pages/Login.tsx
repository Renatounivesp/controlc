import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, rgba(10,10,15,0) 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(10,10,15,0) 70%)', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass"
        style={{ width: '100%', maxWidth: '440px', padding: '48px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(0,102,255,0.1)', borderRadius: '20px', marginBottom: '24px' }}>
            <ShieldCheck size={40} color="var(--primary)" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Realce Film</h1>
          <p style={{ color: 'var(--text-muted)' }}>Bem-vindo de volta à Central de Controle</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Email Profissional</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                required
                placeholder="nome@realcefilm.com.br"
                className="glass-panel"
                style={{
                  width: '100%', padding: '14px 16px 14px 48px', color: 'white',
                  outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Senha</label>
              <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Esqueceu?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="glass-panel"
                style={{
                  width: '100%', padding: '14px 16px 14px 48px', color: 'white',
                  outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s',
                  letterSpacing: '0.2em'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '16px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            marginTop: '8px',
            transition: 'background 0.2s',
            boxShadow: '0 8px 24px rgba(0, 102, 255, 0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
          >
            Entrar no Sistema
          </button>
        </form>
      </motion.div>
    </div>
  );
}
