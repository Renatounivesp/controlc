import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  ArrowUpCircle, 
  ArrowDownCircle,
  X,
  Loader2,
  Filter,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_TRANSACTIONS = [
  { id: 1, description: 'Salário Mensal', amount: 8500, type: 'income', date: new Date().toISOString(), category: { name: 'Salário', color: '#10b981' } },
  { id: 2, description: 'Supermercado', amount: 450.20, type: 'expense', date: new Date().toISOString(), category: { name: 'Alimentação', color: '#ef4444' } },
  { id: 3, description: 'Assinatura Netflix', amount: 55.90, type: 'expense', date: new Date().toISOString(), category: { name: 'Lazer', color: '#8b5cf6' } },
  { id: 4, description: 'Uber Trabalho', amount: 32.50, type: 'expense', date: new Date().toISOString(), category: { name: 'Transporte', color: '#3b82f6' } },
  { id: 5, description: 'Venda de Notebook', amount: 2500, type: 'income', date: new Date().toISOString(), category: { name: 'Outros', color: '#6b7280' } },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, catRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/transactions/categories')
        ]);
        setTransactions(transRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.warn('Backend offline, using mock transactions');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Para mock, apenas simula sucesso
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitting(false);
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category_id: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Transações</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Controle total sobre suas movimentações.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-premium"
        >
          <Plus className="w-5 h-5" />
          Nova Transação
        </button>
      </header>

      {/* Advanced Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium pl-14"
          />
        </div>
        <button className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-600 transition-colors">
          <Filter className="w-6 h-6" />
        </button>
      </div>

      {/* Transactions Table/List */}
      <div className="glass-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-5">Movimentação</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5">Data</th>
                <th className="px-8 py-5">Valor</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence>
                {filteredTransactions.map((t) => (
                  <motion.tr 
                    key={t.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                          t.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                          {t.type === 'income' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{t.description}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{t.type === 'income' ? 'Entrada' : 'Saída'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider" 
                            style={{ backgroundColor: `${t.category.color}15`, color: t.category.color }}>
                        {t.category.name}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-slate-500">
                        {format(new Date(t.date), "dd 'de' MMM", { locale: ptBR })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className={cn(
                        "text-lg font-black",
                        t.type === 'income' ? "text-green-600" : "text-slate-900 dark:text-white"
                      )}>
                        {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Simplified for aesthetic demo */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-3xl font-black mb-8">Nova Movimentação</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-3xl">
                  <button type="button" onClick={() => setFormData({...formData, type: 'expense'})}
                    className={cn("py-4 rounded-2xl font-bold transition-all", formData.type === 'expense' ? "bg-white dark:bg-slate-700 shadow-xl text-red-600 scale-[1.02]" : "text-slate-500")}>
                    Despesa
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'income'})}
                    className={cn("py-4 rounded-2xl font-bold transition-all", formData.type === 'income' ? "bg-white dark:bg-slate-700 shadow-xl text-green-600 scale-[1.02]" : "text-slate-500")}>
                    Receita
                  </button>
                </div>

                <input type="text" placeholder="O que você comprou ou recebeu?" className="input-premium" required />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input type="number" placeholder="0,00" className="input-premium pl-12" required />
                  </div>
                  <input type="date" className="input-premium" required />
                </div>

                <select className="input-premium appearance-none">
                  <option value="">Selecione a Categoria</option>
                  <option value="1">Alimentação</option>
                  <option value="2">Transporte</option>
                  <option value="3">Lazer</option>
                </select>

                <button type="submit" disabled={submitting} className="btn-premium w-full py-5 text-lg mt-4">
                  {submitting ? <Loader2 className="animate-spin" /> : 'Confirmar Lançamento'}
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

export default Transactions;
