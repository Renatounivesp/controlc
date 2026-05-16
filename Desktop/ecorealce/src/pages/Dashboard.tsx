import { useState, useEffect } from 'react';
import { Settings2, Plus, Trash2, X, Check, Pencil, Image as ImageIcon } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useDashboardStore, getIconByName, type DashboardItem } from '../store/useDashboardStore';
import { AnimatePresence, motion } from 'framer-motion';

function DashboardItemCard({ item, isEditMode, removeItem, onEdit, index, moveItem }: { 
  item: DashboardItem, 
  isEditMode: boolean, 
  removeItem: (id: string) => void,
  onEdit: (item: DashboardItem) => void,
  index: number,
  moveItem: (dragIndex: number, hoverIndex: number) => void
}) {
  const Icon = getIconByName(item.iconName);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'relative' }}
    >
      <GlassCard 
        delay={0}
        onClick={isEditMode ? undefined : () => {
          let url = item.link;
          if (!url || url === '#') return;
          
          if (!url.startsWith('http') && !url.startsWith('/')) {
            url = `https://${url}`;
          }
          
          if (url.startsWith('http')) {
            const win = window.open(url, '_blank', 'noopener,noreferrer');
            if (!win) window.location.href = url; // Fallback if popup blocked
          } else {
            window.location.href = url;
          }
        }}
        style={{
          padding: item.imageUrl ? '0' : '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          borderRadius: '24px',
          height: '140px',
          border: isEditMode ? '2px dashed var(--primary)' : '1px solid rgba(255,255,255,0.05)',
          backgroundColor: isEditMode ? 'rgba(0,102,255,0.05)' : 'rgba(255,255,255,0.02)',
          textAlign: 'center',
          overflow: 'hidden',
          cursor: isEditMode ? 'default' : 'pointer',
          userSelect: 'none'
        }}
      >
        {item.imageUrl ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '12px'
            }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>{item.title}</h3>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '6px',
              height: '40%',
              background: item.color,
              borderRadius: '0 4px 4px 0',
              boxShadow: `0 0 15px ${item.color}`,
              marginTop: '30%'
            }} />
            <div style={{
              color: item.color,
              filter: `drop-shadow(0 0 8px ${item.color}80)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <Icon size={32} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', padding: '0 8px' }}>{item.title}</h3>
          </>
        )}

        {isEditMode && (
          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 30 }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              style={{
                background: 'var(--primary)',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0, 102, 255, 0.3)',
              }}
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
              style={{
                background: 'var(--danger)',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)',
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        {isEditMode && (
          <div style={{ display: 'flex', gap: '4px', position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
             <button 
               onClick={() => index > 0 && moveItem(index, index - 1)}
               style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '2px 8px', fontSize: '10px' }}
             >
               ◀
             </button>
             <button 
               onClick={() => moveItem(index, index + 1)}
               style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', padding: '2px 8px', fontSize: '10px' }}
             >
               ▶
             </button>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default function Dashboard() {
  const { items, addItem, removeItem, updateItems, updateItem, fetchItems } = useDashboardStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);
  const [formData, setFormData] = useState<Partial<DashboardItem>>({
    title: '',
    link: '',
    iconName: 'Globe',
    color: '#0066ff',
    imageUrl: ''
  });

  useEffect(() => {
    fetchItems().catch(console.error);
  }, [fetchItems]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', link: '', iconName: 'Globe', color: '#0066ff', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DashboardItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const newItems = [...items];
    const [removed] = newItems.splice(from, 1);
    newItems.splice(to, 0, removed);
    updateItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = formData.title?.trim();
    const link = formData.link?.trim();

    if (title && link) {
      const itemData = {
        ...formData,
        title,
        link,
        iconName: formData.iconName || 'Globe',
        color: formData.color || '#0066ff'
      };

      if (editingItem) {
        await updateItem(editingItem.id, itemData);
      } else {
        await addItem({
          id: Math.random().toString(36).substr(2, 9),
          ...itemData as any
        });
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ 
        marginBottom: '32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 4px'
      }}>
        <div />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '20px',
              background: isEditMode ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            {isEditMode ? <Check size={16} /> : <Settings2 size={16} />}
            {isEditMode ? 'Salvar' : 'Editar'}
          </button>
        </div>
      </header>

      <div className="grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
        padding: '4px'
      }}>
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <DashboardItemCard 
              key={item.id} 
              item={item} 
              isEditMode={isEditMode} 
              removeItem={removeItem}
              onEdit={handleOpenEdit}
              index={index}
              moveItem={moveItem}
            />
          ))}
          {items.length === 0 && !isEditMode && (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '60px 20px', 
              textAlign: 'center', 
              color: 'var(--text-muted)',
              border: '1px dashed rgba(255,255,255,0.05)',
              borderRadius: '24px'
            }}>
              <p>Nenhum atalho configurado.</p>
              <button 
                onClick={() => setIsEditMode(true)}
                style={{ color: 'var(--primary)', marginTop: '8px', fontWeight: 600 }}
              >
                Clique em Editar para começar +
              </button>
            </div>
          )}
          {isEditMode && (
            <motion.button 
              layout
              onClick={handleOpenAdd}
              style={{
                height: '140px',
                borderRadius: '24px',
                border: '2px dashed rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Plus size={24} />
              <span style={{ fontSize: '0.8rem' }}>Novo Atalho</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

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
              className="glass"
              style={{ width: '100%', maxWidth: '400px', padding: '32px', zIndex: 1001, backgroundColor: 'rgba(15,15,20,0.95)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{editingItem ? 'Editar Atalho' : 'Novo Atalho'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nome do Atalho</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass-panel"
                    style={{ width: '100%', padding: '12px', color: 'white', outline: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Link (URL)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="glass-panel"
                    style={{ width: '100%', padding: '12px', color: 'white', outline: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Imagem do Atalho</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {formData.imageUrl && (
                      <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <label className="glass-panel" style={{ 
                      flex: 1, 
                      padding: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <ImageIcon size={16} /> {formData.imageUrl ? 'Alterar Imagem' : 'Subir Imagem'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, imageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {formData.imageUrl && (
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        style={{ color: 'var(--danger)', padding: '8px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>Ou cole um link abaixo:</p>
                  <input 
                    type="text" 
                    placeholder="https://exemplo.com/imagem.png"
                    value={formData.imageUrl && !formData.imageUrl.startsWith('data:') ? formData.imageUrl : ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="glass-panel"
                    style={{ width: '100%', padding: '12px', color: 'white', outline: 'none', border: '1px solid rgba(255,255,255,0.1)', marginTop: '4px' }}
                  />
                </div>
                {!formData.imageUrl && (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cor</label>
                      <input 
                        type="color" 
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        style={{ width: '100%', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                )}
                <button 
                  type="submit"
                  style={{
                    padding: '16px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: 600,
                    marginTop: '8px',
                    boxShadow: '0 8px 20px rgba(0, 102, 255, 0.3)'
                  }}
                >
                  {editingItem ? 'Salvar Alterações' : 'Criar Atalho'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
