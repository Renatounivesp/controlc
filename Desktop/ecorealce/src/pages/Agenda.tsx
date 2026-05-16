import { useState, useEffect } from 'react';
import { Plus, Bell, DollarSign, Clock, CheckCircle2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAgendaStore, type AgendaItem } from '../store/useAgendaStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Agenda() {
  const { items, addItem, removeItem, toggleComplete, fetchItems } = useAgendaStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState<Partial<AgendaItem>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'appointment',
    notify: true
  });

  useEffect(() => {
    fetchItems().catch(console.error);
  }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date) {
      await addItem({
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description || '',
        date: formData.date,
        time: formData.time || '12:00',
        type: formData.type as any,
        completed: false,
        notify: formData.notify || false
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'appointment',
        notify: true
      });
    }
  };

  const filteredItems = items.filter(item => item.date === selectedDate.toISOString().split('T')[0]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Agenda Interativa</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Gerencie seus compromissos e lembretes financeiros.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass" 
          style={{ 
            padding: '14px 28px', 
            background: 'var(--primary)', 
            color: 'white', 
            borderRadius: '16px', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 25px rgba(0, 102, 255, 0.4)'
          }}
        >
          <Plus size={22} /> Novo Evento
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', alignItems: 'start' }}>
        <GlassCard style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Calendário</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(selectedDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="glass" 
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(selectedDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="glass" 
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
              <div key={day} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingBottom: '8px' }}>{day}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasEvents = items.some(item => item.date === dateStr);
              const isSelected = selectedDate.getDate() === day;
              
              return (
                <button 
                  key={day}
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(day);
                    setSelectedDate(newDate);
                  }}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: isSelected ? 'white' : 'inherit',
                    fontWeight: isSelected ? 700 : 500,
                    position: 'relative',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  {day}
                  {hasEvents && !isSelected && (
                    <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{filteredItems.length} Eventos</span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}
              >
                Nada planejado para este dia.
              </motion.div>
            ) : (
              filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GlassCard style={{ padding: '16px 20px', borderLeft: `4px solid ${item.type === 'payment' ? '#ef4444' : item.type === 'appointment' ? 'var(--primary)' : '#10b981'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '44px', 
                          height: '44px', 
                          borderRadius: '12px', 
                          background: 'rgba(255,255,255,0.03)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: item.type === 'payment' ? '#ef4444' : 'var(--primary)'
                        }}>
                          {item.type === 'payment' ? <DollarSign size={20} /> : <Clock size={20} />}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: item.completed ? 'var(--text-muted)' : 'white', textDecoration: item.completed ? 'line-through' : 'none' }}>
                            {item.title}
                          </h3>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {item.time}</span>
                            {item.notify && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}><Bell size={12} /> Alerta Ativo</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => toggleComplete(item.id)}
                          style={{ color: item.completed ? '#10b981' : 'var(--text-muted)', transition: 'color 0.2s' }}
                        >
                          <CheckCircle2 size={22} />
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          style={{ color: 'rgba(239, 68, 68, 0.5)' }}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    {item.description && (
                      <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '60px' }}>{item.description}</p>
                    )}
                  </GlassCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass"
              style={{ width: '100%', maxWidth: '450px', padding: '32px', zIndex: 1001, backgroundColor: 'rgba(15,15,20,0.98)', borderRadius: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Novo Compromisso</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Título</label>
                  <input 
                    type="text" required value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="glass-panel"
                    style={{ width: '100%', padding: '14px', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    placeholder="Ex: Reunião com Cliente"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Data</label>
                    <input 
                      type="date" required value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="glass-panel"
                      style={{ width: '100%', padding: '14px', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hora</label>
                    <input 
                      type="time" value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="glass-panel"
                      style={{ width: '100%', padding: '14px', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tipo de Evento</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="glass-panel"
                    style={{ width: '100%', padding: '14px', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(0,0,0,0.3)' }}
                  >
                    <option value="appointment">Compromisso</option>
                    <option value="payment">Pagamento / Financeiro</option>
                    <option value="reminder">Lembrete Geral</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" id="notify" checked={formData.notify}
                    onChange={e => setFormData({...formData, notify: e.target.checked})}
                  />
                  <label htmlFor="notify" style={{ fontSize: '0.85rem', color: 'white' }}>Me avisar no horário</label>
                </div>
                <button 
                  type="submit"
                  style={{
                    padding: '16px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '16px',
                    fontWeight: 700,
                    boxShadow: '0 10px 25px rgba(0, 102, 255, 0.4)',
                    fontSize: '1rem',
                    marginTop: '8px'
                  }}
                >
                  Salvar na Agenda
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
