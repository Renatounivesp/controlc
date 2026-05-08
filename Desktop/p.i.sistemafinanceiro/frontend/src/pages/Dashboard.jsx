import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  AlertCircle, 
  ArrowUpRight,
  Download,
  Plus,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';

// Mock data for immediate visualization without backend
const MOCK_STATS = {
  totals: { income: 12500, expenses: 8450, balance: 4050 },
  categories: [
    { name: 'Alimentação', value: 2500 },
    { name: 'Transporte', value: 1200 },
    { name: 'Lazer', value: 1800 },
    { name: 'Saúde', value: 950 },
    { name: 'Educação', value: 2000 }
  ],
  monthly: [
    { month: 'Jan', income: 10000, expenses: 7000 },
    { month: 'Fev', income: 11000, expenses: 7500 },
    { month: 'Mar', income: 12500, expenses: 8450 }
  ]
};

const Dashboard = () => {
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/statistics');
        setStats(response.data);
      } catch (err) {
        console.warn('Backend offline, using mock data');
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const handleExport = async (type) => {
    try {
      const response = await api.get(`/statistics/export/${type}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${type}_${new Date().toISOString().split('T')[0]}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao exportar:', err);
      alert('Não foi possível exportar os dados. Verifique se o backend está online.');
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-10"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Olá, <span className="gradient-text">Investidor</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Aqui está o resumo da sua jornada financeira.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-premium" onClick={() => window.location.href='/transactions'}>
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
        </div>
      </header>

      {/* Hero Balance Card */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-blue-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary-600/20"
      >
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 opacity-80">
              <Wallet className="w-5 h-5" />
              <span className="font-semibold uppercase tracking-wider text-xs">Saldo Disponível</span>
            </div>
            <h2 className="text-6xl font-black">R$ {stats?.totals?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</h2>
            <div className="flex items-center gap-2 text-green-300 font-bold text-lg">
              <TrendingUp className="w-5 h-5" />
              <span>+12.5% este mês</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 border-l border-white/20 pl-10 hidden md:grid">
            <div>
              <p className="text-white/60 text-sm font-bold uppercase mb-1">Entradas</p>
              <p className="text-2xl font-bold">R$ {stats?.totals?.income?.toLocaleString('pt-BR') || '0,00'}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm font-bold uppercase mb-1">Saídas</p>
              <p className="text-2xl font-bold">R$ {stats?.totals?.expenses?.toLocaleString('pt-BR') || '0,00'}</p>
            </div>
          </div>
        </div>
        {/* Decorative Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Atividade Mensal</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="font-medium text-slate-500">Receitas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-300" />
                <span className="font-medium text-slate-500">Despesas</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Carregando dados...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthly || []}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontWeight: 600}} 
                    dy={10} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#cbd5e1" 
                    strokeWidth={2} 
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card">
          <h3 className="text-xl font-bold mb-8">Distribuição</h3>
          <div className="h-[300px] relative flex items-center justify-center">
            {loading ? (
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : stats?.categories?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.categories || []}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                      {stats?.categories?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-6">
                <p className="text-slate-400 text-sm">Sem dados de categorias</p>
              </div>
            )}
            {!loading && stats?.categories?.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black">100%</span>
              </div>
            )}
          </div>
          <div className="space-y-3 mt-6">
            {stats?.categories?.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="text-sm font-semibold">{cat.name}</span>
                </div>
                <span className="text-sm font-bold">R$ {cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="glass-card bg-primary-600/5 border-primary-600/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary-600 rounded-2xl text-white">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Insight da IA</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Seus gastos com <span className="font-bold text-primary-600">Alimentação</span> representam 30% do seu orçamento. 
            Economizar R$ 200 aqui este mês ajudará você a atingir sua meta de "Viagem" 2 semanas mais cedo!
          </p>
          <button className="flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
            Ver detalhes da análise <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Exportar Dados</h3>
            <Download className="w-5 h-5 text-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleExport('csv')}
              className="p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl text-center hover:scale-105 transition-all"
            >
              <div className="font-black text-2xl mb-1">CSV</div>
              <div className="text-xs text-slate-500 font-bold uppercase">Relatório Planilha</div>
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl text-center hover:scale-105 transition-all"
            >
              <div className="font-black text-2xl mb-1">PDF</div>
              <div className="text-xs text-slate-500 font-bold uppercase">Relatório Simples</div>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
