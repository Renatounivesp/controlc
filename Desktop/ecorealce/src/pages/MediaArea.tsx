import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useMediaStore, type MediaItem } from '../store/useMediaStore';
import { Image as ImageIcon, Video, CheckCircle2, X, Plus, Trash2, ChevronDown, ChevronUp, Pencil, Save, Eye, MessageCircle, Folder, ArrowLeft } from 'lucide-react';

export default function MediaArea() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, mediaList, addCategory, removeCategory, addMedia, removeMedia, updateMedia, fetchMedia, isLoading } = useMediaStore();
  const initialTab = (searchParams.get('tab') as 'photos' | 'videos') || 'photos';
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>(initialTab);

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MediaItem>>({});
  
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categoryColors = [
    '#4facfe', '#f5576c', '#38ef7d', '#ffd200', '#a5b4fc', '#f093fb', '#00f2fe'
  ];
  const getColor = (index: number) => {
    if (index < 0) return '#4facfe';
    return categoryColors[index % categoryColors.length];
  };

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

    try {
      for (const file of Array.from(files)) {
        const type = file.type.startsWith('video') ? 'video' : 'photo';
        const itemData = {
          type: type as 'photo' | 'video',
          title: file.name,
          category: activeCategory === 'Todos' ? 'Clientes' : activeCategory,
        };
        await addMedia(file, itemData);
      }
    } catch (err) {
      console.error('Upload handler error:', err);
      alert('Erro crítico no upload. Verifique sua conexão.');
    } finally {
      // Clear input so same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };



  const handleGenericShare = async () => {
    const selectedMedia = (mediaList || []).filter(m => m && selectedIds.includes(m.id));
    if (selectedMedia.length === 0) return;

    const shareText = `Olá! Veja estas opções da Realce Film:\n\n${selectedMedia.map(m => `*${m.title || 'Mídia'}*\n${m.url}`).join('\n\n')}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Realce Film - Mídias',
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Links copiados para a área de transferência!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      await navigator.clipboard.writeText(shareText);
      alert('Links copiados!');
    }
  };

  const handleFileShare = async () => {
    const selectedMedia = (mediaList || []).filter(m => m && selectedIds.includes(m.id));
    if (selectedMedia.length === 0) return;

    setIsSharing(true);
    
    try {
      if (navigator.share && navigator.canShare) {
        const files: File[] = [];
        
        // Limitar a 5 arquivos por vez para evitar travamentos
        const toProcess = selectedMedia.slice(0, 5);
        
        for (const item of toProcess) {
          try {
            // Fetch com CORS e cache-busting
            const response = await fetch(`${item.url}?t=${Date.now()}`, {
              mode: 'cors',
              credentials: 'omit'
            });
            const blob = await response.blob();
            const ext = item.type === 'video' ? 'mp4' : 'jpg';
            const fileName = `${(item.title || 'midia').replace(/[^a-z0-9]/gi, '_')}.${ext}`;
            files.push(new File([blob], fileName, { type: blob.type }));
          } catch (e) {
            console.error('Erro ao baixar arquivo:', e);
          }
        }

        if (files.length > 0 && navigator.canShare({ files })) {
          await navigator.share({
            files,
            title: 'Realce Film',
            text: 'Veja estas mídias da Realce Film:'
          });
          setIsSharing(false);
          return;
        }
      }
      
      throw new Error('Navegador não suporta compartilhamento de arquivos.');
    } catch (err) {
      console.error('File share error:', err);
      alert('Seu celular não suporta o envio direto da foto. Vou enviar os links para você compartilhar.');
      handleGenericShare();
    } finally {
      setIsSharing(false);
    }
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

  const filteredMedia = (mediaList || []).filter(item => {
    if (!item) return false;
    const isTypeMatch = activeTab === 'photos' ? item.type === 'photo' : item.type === 'video';
    const isCategoryMatch = activeCategory === 'Todos' || item.category === activeCategory;
    return isTypeMatch && isCategoryMatch;
  });

  return (
    <div style={{ paddingBottom: selectedIds.length > 0 ? '100px' : '0' }}>
      <header style={{ 
        marginBottom: '32px', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        gap: '20px' 
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {activeCategory !== 'Todos' && (
              <button 
                onClick={() => setActiveCategory('Todos')}
                style={{ color: 'var(--primary)', background: 'rgba(0, 102, 255, 0.1)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 700 }}>Área de Mídias</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: isMobile ? '0.85rem' : '1rem' }}>
            {activeCategory === 'Todos' ? 'Escolha uma pasta para visualizar as mídias.' : `Visualizando pasta: ${activeCategory}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto', flexWrap: 'wrap' }}>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setSelectedIds([])}
              style={{ 
                padding: '8px 12px', 
                color: '#ef4444', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '0.85rem',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '10px'
              }}
            >
              <X size={16} /> Limpar ({selectedIds.length})
            </button>
          )}
          <label className="glass" style={{ 
            flex: isMobile ? 1 : 'initial',
            padding: isMobile ? '10px 16px' : '12px 24px', 
            color: 'white', 
            fontWeight: 600, 
            background: 'var(--primary)', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '12px',
            opacity: isLoading ? 0.7 : 1,
            fontSize: isMobile ? '0.85rem' : '1rem',
            whiteSpace: 'nowrap'
          }}>
            {activeTab === 'photos' ? <ImageIcon size={18} /> : <Video size={18} />} 
            {isLoading ? 'Subindo...' : `+ Subir ${activeTab === 'photos' ? 'Foto' : 'Vídeo'}`}
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
              style={{ width: '100%', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', opacity: 0.7 }}>Filtrar:</span>
                <span style={{ fontWeight: 600, color: getColor(categories.indexOf(activeCategory)), fontSize: '0.95rem' }}>{activeCategory}</span>
              </div>
              {isCategoryMenuOpen ? <ChevronUp size={18} style={{ opacity: 0.6 }} /> : <ChevronDown size={18} style={{ opacity: 0.6 }} />}
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
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: isMobile ? '12px' : '20px',
      }}>
        {activeCategory === 'Todos' ? (
          // Folder View
          categories.filter(cat => cat !== 'Todos').map((cat, idx) => {
            const color = getColor(idx + 1);
            const itemCount = (mediaList || []).filter(m => m && m.category === cat && (activeTab === 'photos' ? m.type === 'photo' : m.type === 'video')).length;
            
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: isMobile ? '16px 12px' : '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isMobile ? '10px' : '16px',
                  textAlign: 'center',
                  background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: isMobile ? '20px' : '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={{ y: -8, background: 'rgba(255,255,255,0.06)', borderColor: `${color}30` }}
              >
                <div style={{
                  width: isMobile ? '48px' : '64px',
                  height: isMobile ? '48px' : '64px',
                  borderRadius: isMobile ? '14px' : '20px',
                  background: `${color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: color,
                  marginBottom: isMobile ? '4px' : '8px',
                  boxShadow: `0 8px 20px ${color}05`,
                  opacity: 0.8
                }}>
                  <Folder size={isMobile ? 24 : 32} fill={color} fillOpacity={0.15} style={{ opacity: 0.7 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{cat}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.8 }}>{itemCount} {activeTab === 'photos' ? 'fotos' : 'vídeos'}</p>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: color,
                  opacity: 0.3
                }} />
              </motion.div>
            );
          })
        ) : filteredMedia.length === 0 && !isLoading ? (
          <div style={{ gridColumn: '1/-1', padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Nenhuma mídia encontrada nesta categoria.</p>
            <button 
              onClick={() => setActiveCategory('Todos')}
              style={{ marginTop: '16px', color: 'var(--primary)', fontWeight: 600 }}
            >
              Voltar para Pastas
            </button>
          </div>
        ) : (
          filteredMedia.map((media, index) => {
            if (!media || !media.url) return null;
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
                <div style={{ height: '180px', width: '100%', position: 'relative', background: '#000' }}>
                  {media.type === 'video' ? (
                    <video 
                      src={media.url} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isSelected ? 0.6 : 1 }} 
                      muted 
                      playsInline
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    />
                  ) : (
                    <img src={media.url} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isSelected ? 0.6 : 1 }} />
                  )}
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--primary)', background: 'white', borderRadius: '50%', zIndex: 20 }}>
                      <CheckCircle2 size={24} fill="currentColor" color="white" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 20, opacity: isSelected ? 0 : 1, transition: 'opacity 0.2s' }}>
                    <button 
                      onClick={(e) => handleOpenEdit(media, e)}
                      style={{ 
                        color: 'white', 
                        background: 'rgba(0, 102, 255, 0.8)', 
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Editar"
                    >
                      <Pencil size={14} style={{ opacity: 0.9 }} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingMedia(media); setEditFormData({ title: media.title, category: media.category }); }}
                      style={{ 
                        color: 'white', 
                        background: 'rgba(255, 255, 255, 0.1)', 
                        backdropFilter: 'blur(8px)',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                      title="Visualizar"
                    >
                      <Eye size={14} style={{ opacity: 0.9 }} />
                    </button>
                  </div>
                  {media.type === 'video' && !isSelected && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '12px', pointerEvents: 'none' }}>
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
          })
        )}
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: 100, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: isMobile ? '12px' : '24px',
              left: '50%',
              width: '95%',
              maxWidth: '500px',
              zIndex: 100,
            }}
          >
            <div className="glass" style={{ 
              padding: isMobile ? '12px 16px' : '16px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'rgba(10, 10, 15, 0.95)',
              border: '1px solid var(--primary)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 102, 255, 0.2)'
            }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem' }}>{selectedIds.length} selecionados</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                <button 
                   onClick={handleFileShare}
                   style={{
                     background: '#25D366',
                     color: 'white',
                     padding: isMobile ? '12px 20px' : '12px 32px',
                     borderRadius: '14px',
                     fontWeight: 700,
                     fontSize: isMobile ? '0.9rem' : '1rem',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: '10px',
                     boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)',
                     opacity: isSharing ? 0.7 : 1,
                     cursor: isSharing ? 'wait' : 'pointer',
                     width: isMobile ? '100%' : 'auto',
                     border: 'none',
                     transition: 'all 0.3s'
                   }}
                   title="Enviar Mídias Selecionadas"
                   disabled={isSharing}
                 >
                   {isSharing ? (
                     <>Processando...</>
                   ) : (
                     <>
                       <MessageCircle size={22} />
                       {selectedIds.length === 1 ? 'Enviar no WhatsApp' : `Enviar ${selectedIds.length} no WhatsApp`}
                     </>
                   )}
                 </button>
               </div>
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
              style={{ width: '100%', maxWidth: '500px', padding: '32px', zIndex: 1001, backgroundColor: 'rgba(15,15,20,0.98)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Visualizar / Editar</h2>
                <button onClick={() => setEditingMedia(null)} style={{ color: 'var(--text-muted)' }}><X /></button>
              </div>

              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', height: '250px', background: '#000', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                {editingMedia.type === 'video' ? (
                  <video src={editingMedia.url} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <img src={editingMedia.url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
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
