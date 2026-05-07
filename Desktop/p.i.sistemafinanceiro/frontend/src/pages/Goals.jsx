import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Target, 
  Trash2, 
  Edit2, 
  X, 
  Loader2, 
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '',
    deadline: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.warn('Erro ao buscar metas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/goals/${editingId}`, formData);
      } else {
        await api.post('/goals', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchGoals();
    } catch (err) {
      alert('Erro ao salvar meta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta meta?')) return;
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      alert('Erro ao excluir');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', target_amount: '', current_amount: '', deadline: '' });
    setEditingId(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Meus Sonhos</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Transforme seus objetivos em realidade.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-premium"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(goals) && goals.map((goal, index) => (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card group relative overflow-hidden"
            >
              <div className="absolute top-6 right-6">
                {goal.progress >= 100 ? (
                  <div className="bg-green-500/20 text-green-500 p-2 rounded-full shadow-lg shadow-green-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Em Progresso
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black">{goal.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                    <Calendar className="w-3 h-3" />
                    {goal.deadline ? format(new Date(goal.deadline), "MMM yyyy", { locale: ptBR }) : 'Sem prazo'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Já poupado</p>
                    <p className="text-2xl font-black">R$ {goal.current_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-600">{Math.round(goal.progress)}%</p>
                  </div>
                </div>

                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={
                      cn("h-full rounded-full relative",
                      goal.progress >= 100 ? "bg-green-500" : "bg-gradient-to-r from-primary-600 to-blue-400")
                    }
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs font-bold text-slate-400">Objetivo: <span className="text-slate-900 dark:text-white">R$ {goal.target_amount.toLocaleString()}</span></p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingId(goal.id);
                        setFormData({
                          name: goal.name,
                          target_amount: goal.target_amount,
                          current_amount: goal.current_amount,
                          deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 bg-red-50 dark:bg-red-900/10 rounded-xl text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card !p-10 w-full max-w-xl shadow-2xl relative border-white/20"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black mb-8">{editingId ? 'Editar Sonho' : 'Planejar Novo Sonho'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Qual o seu objetivo?" 
                  className="input-premium" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" 
                    placeholder="Valor Total R$" 
                    className="input-premium" 
                    value={formData.target_amount}
                    onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                    required 
                  />
                  <input 
                    type="number" 
                    placeholder="Já Poupado R$" 
                    className="input-premium" 
                    value={formData.current_amount}
                    onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                  />
                </div>
                <input 
                  type="date" 
                  className="input-premium" 
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
                <button type="submit" disabled={submitting} className="btn-premium w-full py-5 text-lg">
                  {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : (editingId ? 'Salvar Alterações' : 'Criar Meta')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Goals;
