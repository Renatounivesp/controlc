import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, NotebookPen, Loader2 } from 'lucide-react';
import { useNoteStore, type Note } from '../store/useNoteStore';

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function Notepad() {
  const { notes, isLoading, fetchNotes, addNote, updateNote, removeNote } = useNoteStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Set first note as active once loaded if none is active
  useEffect(() => {
    if (!activeId && notes.length > 0) {
      setActiveId(notes[0].id);
    }
  }, [notes, activeId]);

  const activeNote = notes.find(n => n.id === activeId) ?? null;

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(36),
      title: 'Nova nota',
      content: '',
      updated_at: Date.now(),
    };
    addNote(newNote);
    setActiveId(newNote.id);
  };

  const deleteNote = (id: string) => {
    if (window.confirm('Deseja excluir esta nota?')) {
      removeNote(id);
      if (activeId === id) setActiveId(notes.find(n => n.id !== id)?.id ?? null);
    }
  };

  const handleUpdate = (field: 'title' | 'content', value: string) => {
    if (!activeId) return;
    
    // Optimistic local update via store
    updateNote(activeId, { [field]: value });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Anotações</h1>
          <p style={{ color: 'var(--text-muted)' }}>Notas sincronizadas na nuvem.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLoading && <Loader2 size={20} className="animate-spin" style={{ color: 'var(--primary)' }} />}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createNote}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
              color: '#0a0a0f',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(255, 210, 0, 0.35)',
              cursor: 'pointer',
            }}
          >
            <Plus size={18} /> Nova Nota
          </motion.button>
        </div>
      </header>

      {notes.length === 0 && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}
        >
          <NotebookPen size={56} strokeWidth={1} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>Nenhuma anotação</h2>
          <p style={{ maxWidth: '280px', margin: '0 auto 20px' }}>Crie sua primeira nota clicando no botão acima.</p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', height: 'calc(100vh - 280px)', minHeight: '400px' }}>
          {/* Sidebar */}
          <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {notes.length} nota{notes.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <AnimatePresence>
                {notes.map(note => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => setActiveId(note.id)}
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      borderLeft: `3px solid ${note.id === activeId ? '#ffd200' : 'transparent'}`,
                      background: note.id === activeId ? 'rgba(255,210,0,0.06)' : 'transparent',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: note.id === activeId ? 'white' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {note.title || 'Sem título'}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {formatDate(note.updated_at)}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.7 }}>
                        {note.content.slice(0, 40) || 'Sem conteúdo'}
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                      style={{ color: 'var(--danger)', opacity: 0.5, padding: '2px', flexShrink: 0, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Editor */}
          {activeNote ? (
            <motion.div
              key={activeNote.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass"
              style={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {/* Title */}
              <div style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'linear-gradient(135deg, rgba(247,151,30,0.08) 0%, rgba(255,210,0,0.05) 100%)',
              }}>
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={e => handleUpdate('title', e.target.value)}
                  placeholder="Título da nota..."
                  style={{
                    width: '100%',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'white',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                  }}
                />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Última edição: {formatDate(activeNote.updated_at)}
                </p>
              </div>
              {/* Content */}
              <textarea
                value={activeNote.content}
                onChange={e => handleUpdate('content', e.target.value)}
                placeholder="Escreva sua anotação aqui..."
                style={{
                  flex: 1,
                  padding: '24px',
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.85)',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.7,
                  fontFamily: 'inherit',
                }}
              />
            </motion.div>
          ) : (
            <div className="glass" style={{ borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Selecione ou crie uma nota para editar
            </div>
          )}
        </div>
      )}
    </div>
  );
}
