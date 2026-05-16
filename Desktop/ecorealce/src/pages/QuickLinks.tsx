import { Plus, ExternalLink, X, Trash2, Pencil } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useQuickLinksStore, type QuickLink } from '../store/useQuickLinksStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickLinks() {
  const { links, addLink, removeLink, updateLink, fetchLinks } = useQuickLinksStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [formData, setFormData] = useState<Partial<QuickLink>>({
    title: '',
    url: '',
    category: '',
    color: '#3b82f6'
  });

  useEffect(() => {
    fetchLinks().catch(console.error);
  }, [fetchLinks]);

  const handleOpenAdd = () => {
    setEditingLink(null);
    setFormData({ title: '', url: '', category: '', color: '#3b82f6' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: QuickLink) => {
    setEditingLink(link);
    setFormData(link);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.url) {
      if (editingLink) {
        await updateLink(editingLink.id, formData);
      } else {
        await addLink({
          id: Math.random().toString(36).substr(2, 9),
          title: formData.title,
          url: formData.url,
          category: formData.category || 'Geral',
          color: formData.color || '#3b82f6'
        });
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>Links Rápidos</h1>
          <p style={{ color: 'var(--text-muted)' }}>Acesso direto a todos os seus sistemas e documentos.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="glass" 
          style={{ 
            padding: '12px 24px', 
            color: 'white', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'var(--primary)',
            borderRadius: '14px',
            boxShadow: '0 8px 20px rgba(0, 102, 255, 0.3)'
          }}
        >
          <Plus size={20} /> Novo Link
        </button>
      </header>

      {links.length === 0 ? (
        <div style={{ 
          padding: '80px 20px', 
          textAlign: 'center', 
          border: '2px dashed rgba(255,255,255,0.05)', 
          borderRadius: '28px',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Nenhum link configurado.</p>
          <button 
            onClick={handleOpenAdd}
            style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1rem' }}
          >
            Adicionar o primeiro link +
          </button>
        </div>
      ) : (
        <div className="grid-responsive" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {links.map((link, index) => (
            <GlassCard key={link.id} delay={index * 0.05} className="group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: `${link.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: link.color,
                  border: `1px solid ${link.color}30`,
                  boxShadow: `0 8px 20px ${link.color}15`
                }}>
                  <ExternalLink size={28} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleOpenEdit(link)}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => removeLink(link.id)}
                    style={{ color: 'rgba(239, 68, 68, 0.6)', padding: '4px' }}
                    title="Remover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: link.color, 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em',
                  background: `${link.color}10`,
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  {link.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginTop: '12px', marginBottom: '20px', minHeight: '3rem' }}>{link.title}</h3>
              </div>
              <a 
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Acessar Sistema
              </a>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '450px', padding: '32px', zIndex: 1001, backgroundColor: 'rgba(15,15,20,0.98)', borderRadius: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{editingLink ? 'Editar Link' : 'Novo Link Rápido'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nome do Sistema/Link</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass-panel"
                    style={{ width: '100%', padding: '14px', color: 'white', outline: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    placeholder="Ex: CRM de Vendas"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>URL (Link)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="glass-panel"
                    style={{ width: '100%', padding: '14px', color: 'white', outline: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    placeholder="https://sistema.exemplo.com"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Categoria</label>
                    <input 
                      type="text" 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="glass-panel"
                      style={{ width: '100%', padding: '14px', color: 'white', outline: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      placeholder="Ex: Vendas"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cor de Destaque</label>
                    <input 
                      type="color" 
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      style={{ width: '100%', height: '50px', border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  style={{
                    padding: '16px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '14px',
                    fontWeight: 700,
                    marginTop: '8px',
                    boxShadow: '0 8px 25px rgba(0, 102, 255, 0.4)',
                    fontSize: '1rem'
                  }}
                >
                  {editingLink ? 'Salvar Alterações' : 'Adicionar Link'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
