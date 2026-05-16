import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaStore, type MediaItem } from '../store/useMediaStore';
import { Image as ImageIcon, Video, CheckCircle2, MessageCircle, X, Plus, Trash2 } from 'lucide-react';

export default function MediaArea() {
  const { categories, mediaList, addCategory, removeCategory, addMedia, removeMedia, fetchMedia } = useMediaStore();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchMedia().catch(console.error);
  }, [fetchMedia]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev: number[]) => 
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const newItem: MediaItem = {
        id: Date.now() + index,
        type: file.type.startsWith('video') ? 'video' : 'photo',
        title: file.name,
        category: activeCategory === 'Todos' ? 'Clientes' : activeCategory,
        url: URL.createObjectURL(file)
      };
      addMedia(newItem);
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const shareOnWhatsApp = () => {
    const selectedMedia = mediaList.filter(m => selectedIds.includes(m.id));
    const message = `Olá! Veja estas opções da Realce Film:\n\n${selectedMedia.map(m => `*${m.title}*\n${m.url}`).join('\n\n')}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const filteredMedia = mediaList.filter(item => {
    const isTypeMatch = activeTab === 'photos' ? item.type === 'photo' : item.type === 'video';
    const isCategoryMatch = activeCategory === 'Todos' || item.category === activeCategory;
    return isTypeMatch && isCategoryMatch;
  });

  return (
    <div style={{ paddingBottom: selectedIds.length > 0 ? '100px' : '0' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Área de Mídias</h1>
          <p style={{ color: 'var(--text-muted)' }}>Organize fotos por categoria e envie para clientes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setSelectedIds([])}
              style={{ padding: '12px 20px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <X size={20} /> Limpar ({selectedIds.length})
            </button>
          )}
          <label className="glass" style={{ 
            padding: '12px 24px', 
            color: 'white', 
            fontWeight: 600, 
            background: 'var(--primary)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px'
          }}>
            <ImageIcon size={20} /> + Subir Foto
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('photos')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '30px',
            background: activeTab === 'photos' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'photos' ? 'white' : 'var(--text-muted)',
            fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap'
          }}
        >
          <ImageIcon size={18} /> Fotos
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '30px',
            background: activeTab === 'videos' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
            color: activeTab === 'videos' ? 'white' : 'var(--text-muted)',
            fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap'
          }}
        >
          <Video size={18} /> Vídeos
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px', alignItems: 'center' }}>
        {categories.map(category => (
          <div key={category} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '6px 16px', borderRadius: '20px', whiteSpace: 'nowrap',
                background: activeCategory === category ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: `1px solid ${activeCategory === category ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                color: activeCategory === category ? 'white' : 'var(--text-muted)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {category}
              {category !== 'Todos' && activeCategory === category && (
                <X 
                  size={14} 
                  onClick={(e) => { e.stopPropagation(); removeCategory(category); setActiveCategory('Todos'); }} 
                  style={{ cursor: 'pointer', opacity: 0.6 }}
                />
              )}
            </button>
          </div>
        ))}
        
        {isAddingCategory ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              autoFocus
              type="text" 
              placeholder="Nova categoria..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              className="glass-panel"
              style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'white', border: '1px solid var(--primary)', borderRadius: '20px', width: '150px' }}
            />
            <button onClick={handleAddCategory} style={{ color: 'var(--success)' }}><CheckCircle2 size={20} /></button>
            <button onClick={() => setIsAddingCategory(false)} style={{ color: 'var(--danger)' }}><X size={20} /></button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingCategory(true)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '20px', 
              border: '1px dashed rgba(255,255,255,0.2)', 
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={14} /> Categoria
          </button>
        )}
      </div>

      <div className="grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
      }}>
        {filteredMedia.map((media, index) => {
          const isSelected = selectedIds.includes(media.id);
          return (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass"
              onClick={() => toggleSelection(media.id)}
              style={{ 
                overflow: 'hidden', 
                padding: 0, 
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative'
              }}
              whileHover={{ y: -4 }}
            >
              <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                <img src={media.url} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isSelected ? 0.6 : 1 }} />
                {isSelected && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--primary)', background: 'white', borderRadius: '50%' }}>
                    <CheckCircle2 size={24} fill="currentColor" color="white" />
                  </div>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); removeMedia(media.id); }}
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    left: '12px', 
                    color: 'white', 
                    background: 'rgba(239, 68, 68, 0.8)', 
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isSelected ? 0 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <Trash2 size={16} />
                </button>
                {media.type === 'video' && !isSelected && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '12px' }}>
                    <Video size={24} color="white" />
                  </div>
                )}
              </div>
              <div style={{ padding: '12px' }}>
                <span style={{ fontSize: '0.7rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{media.category}</span>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'white', marginTop: '2px' }}>{media.title}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '500px',
              zIndex: 100,
            }}
          >
            <div className="glass" style={{ 
              padding: '16px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'rgba(10, 10, 15, 0.9)',
              border: '1px solid var(--primary)'
            }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{selectedIds.length} selecionados</span>
              </div>
              <button 
                onClick={shareOnWhatsApp}
                style={{
                  background: 'var(--success)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                <MessageCircle size={20} /> Enviar WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
