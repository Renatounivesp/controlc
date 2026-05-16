import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useMediaStore, type MediaItem } from '../store/useMediaStore';
import { Image as ImageIcon, Video, CheckCircle2, MessageCircle, X, Plus, Trash2, ChevronDown, ChevronUp, Pencil, Save } from 'lucide-react';

export default function MediaArea() {
  const [searchParams] = useSearchParams();
  const { categories, mediaList, addCategory, removeCategory, addMedia, removeMedia, updateMedia, fetchMedia, isLoading } = useMediaStore();
  const initialTab = searchParams.get('tab') === 'videos' ? 'videos' : 'photos';
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>(initialTab);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MediaItem>>({});
  
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categoryColors = [
    '#4facfe', '#f5576c', '#38ef7d', '#ffd200', '#a5b4fc', '#f093fb', '#00f2fe'
  ];
  const getColor = (index: number) => categoryColors[index % categoryColors.length];

  const renderCategoryItem = (category: string, idx: number, isMobileItem: boolean = false) => {
    const color = getColor(idx);
    const isActive = activeCategory === category;
    
    return (
      <div key={category} style={{ position: 'relative', display: 'flex', alignItems: 'center', width: isMobileItem ? '100%' : 'auto' }}>
        <button
          onClick={() => { setActiveCategory(category); setIsCategoryMenuOpen(false); }}
          style={{
            width: isMobileItem ? '100%' : 'auto',
            padding: isMobileItem ? '12px 16px' : '8px 18px',
            borderRadius: isMobileItem ? '12px' : '24px',
            background: isActive ? `${color}20` : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${isActive ? color : 'rgba(255, 255, 255, 0.08)'}`,
            color: isActive ? color : 'white',
            fontSize: '0.85rem',
            fontWeight: isActive ? 600 : 500,
            display: 'flex',
            justifyContent: isMobileItem ? 'space-between' : 'center',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: isActive ? `0 0 10px ${color}30` : 'none'
          }}
        >
          {category}
          {category !== 'Todos' && isActive && (
            <X 
              size={14} 
              onClick={(e) => { e.stopPropagation(); removeCategory(category); setActiveCategory('Todos'); }} 
              style={{ cursor: 'pointer', opacity: 0.8 }}
            />
          )}
        </button>
      </div>
    );
  };

  const renderAddCategory = (isMobileItem: boolean = false) => {
    return isAddingCategory ? (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: isMobileItem ? '8px 0' : '0' }}>
        <input 
          autoFocus
          type="text" 
          placeholder="Nova categoria..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          className="glass-panel"
          style={{ padding: '8px 14px', fontSize: '0.85rem', color: 'white', border: '1px solid var(--primary)', borderRadius: '20px', width: isMobileItem ? '100%' : '150px' }}
        />
        <button onClick={handleAddCategory} style={{ color: 'var(--success)' }}><CheckCircle2 size={24} /></button>
        <button onClick={() => setIsAddingCategory(false)} style={{ color: 'var(--danger)' }}><X size={24} /></button>
      </div>
    ) : (
      <button 
        onClick={() => setIsAddingCategory(true)}
        style={{ 
          width: isMobileItem ? '100%' : 'auto',
          padding: isMobileItem ? '12px 16px' : '8px 18px', 
          borderRadius: isMobileItem ? '12px' : '24px', 
          border: '1px dashed rgba(255,255,255,0.2)', 
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobileItem ? 'flex-start' : 'center',
          gap: '6px'
        }}
      >
        <Plus size={16} /> Categoria
      </button>
    );
  };

  useEffect(() => {
    fetchMedia().catch(console.error);
  }, [fetchMedia]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev: number[]) => 
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const type = file.type.startsWith('video') ? 'video' : 'photo';
      const itemData = {
        type: type as 'photo' | 'video',
        title: file.name,
        category: activeCategory === 'Todos' ? 'Clientes' : activeCategory,
      };
      await addMedia(file, itemData);
    }
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

  const handleOpenEdit = (media: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMedia(media);
    setEditFormData({ title: media.title, category: media.category });
  };

  const handleUpdateMedia = () => {
    if (editingMedia && editFormData.title) {
      updateMedia(editingMedia.id, { 
        title: editFormData.title, 
        category: editFormData.category 
      });
      setEditingMedia(null);
    }
  };

  const handleDeleteMedia = () => {
    if (editingMedia && window.confirm('Deseja realmente excluir esta mídia?')) {
      removeMedia(editingMedia.id);
      setEditingMedia(null);
    }
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
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px',
            opacity: isLoading ? 0.7 : 1
          }}>
            <ImageIcon size={20} /> {isLoading ? 'Subindo...' : '+ Subir Foto'}
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              disabled={isLoading}
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

      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 10 }}>
        {isMobile ? (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="glass"
              style={{ width: '100%', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', borderRadius: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filtro:</span>
                <span style={{ fontWeight: 600, color: getColor(categories.indexOf(activeCategory)), fontSize: '1rem' }}>{activeCategory}</span>
              </div>
              {isCategoryMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            <AnimatePresence>
              {isCategoryMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-panel"
                  style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto', zIndex: 20 }}
                >
                  {categories.map((cat, idx) => renderCategoryItem(cat, idx, true))}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
                  {renderAddCategory(true)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {categories.map((cat, idx) => renderCategoryItem(cat, idx, false))}
            {renderAddCategory(false)}
          </div>
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
                  onClick={(e) => handleOpenEdit(media, e)}
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    left: '12px', 
                    color: 'white', 
                    background: 'rgba(0, 102, 255, 0.8)', 
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isSelected ? 0 : 1,
                    transition: 'opacity 0.2s',
                    zIndex: 10
                  }}
                >
                  <Pencil size={16} />
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMedia && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setEditingMedia(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass"
              style={{ width: '100%', maxWidth: '400px', padding: '28px', zIndex: 1001, backgroundColor: 'rgba(15,15,20,0.95)', borderRadius: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Editar Mídia</h2>
                <button onClick={() => setEditingMedia(null)} style={{ color: 'var(--text-muted)' }}><X /></button>
              </div>

              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', height: '150px' }}>
                <img src={editingMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Título</label>
                  <input 
                    type="text" 
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="glass-panel"
                    style={{ width: '100%', padding: '12px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Categoria</label>
                  <select 
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="glass-panel"
                    style={{ width: '100%', padding: '12px', color: 'white', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                    onClick={handleUpdateMedia}
                    style={{ flex: 1, padding: '14px', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Save size={18} /> Salvar
                  </button>
                  <button 
                    onClick={handleDeleteMedia}
                    style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
