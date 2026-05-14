"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Button, Badge, Input } from "@/components/ui/Base";
import { Users, CreditCard, Star, Loader2, Ban, Zap, Search, Activity, DollarSign, LayoutDashboard, Settings, Bell, MoreVertical } from "lucide-react";
import { Company } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const { data } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setCompanies(data);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const generateMockData = async () => {
    setIsGenerating(true);
    // User must have an ID to be owner_id. Let's try to get current user, or if not logged in, we can't create real foreign key relations.
    // Wait, since we are bypassing auth, we might not have a user.id. 
    // If owner_id is required in DB, this will fail if not logged in.
    // Let's just prompt them to create an account first if they want real data.
    alert("Para gerar dados reais de teste, crie uma conta na tela de Cadastro primeiro, pois o banco de dados exige um dono (owner_id) real por segurança!");
    setIsGenerating(false);
  };

  const toggleLifetime = async (companyId: string, current: boolean) => {
    const { error } = await supabase
      .from("companies")
      .update({ is_lifetime: !current })
      .eq("id", companyId);
    
    if (!error) {
      setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, is_lifetime: !current } : c));
    } else {
      alert("Erro ao atualizar status. Verifique as permissões do Supabase.");
    }
  };

  const cancelSubscription = async (companyId: string) => {
    if(!confirm("Tem certeza que deseja cancelar esta assinatura?")) return;
    
    const { error } = await supabase
      .from("companies")
      .update({ subscription_status: 'canceled' })
      .eq("id", companyId);
    
    if (!error) {
      setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, subscription_status: 'canceled' } : c));
    } else {
      alert("Erro ao cancelar. Verifique as permissões do Supabase.");
    }
  };

  const activeCount = companies.filter(c => c.subscription_status === 'active' || c.is_lifetime).length;
  const mrr = activeCount * 9.90; 
  const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#121214]/50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="bg-primary text-white p-1.5 rounded-lg shadow-lg shadow-primary/20">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h2 className="font-black italic tracking-tighter uppercase leading-none">AvaliaPró</h2>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Master Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} /> Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'clients' ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <Users size={18} /> Clientes
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'finance' ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <CreditCard size={18} /> Financeiro
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={18} /> Configurações
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <Link href="/dashboard">
            <Button variant="glass" className="w-full text-xs">Voltar ao App</Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-20 lg:pb-0">
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 bg-[#121214]/50 flex items-center justify-between px-8">
          <h1 className="text-xl font-black tracking-tight">
            {activeTab === 'overview' && 'Dashboard de Controle'}
            {activeTab === 'clients' && 'Gestão de Clientes'}
            {activeTab === 'finance' && 'Relatórios Financeiros'}
            {activeTab === 'settings' && 'Configurações do Sistema'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#09090b] border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm focus:border-primary/50 outline-none w-64 transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" onClick={() => alert('Sem novas notificações.')}>
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Metrics Row - Show on Overview and Finance */}
          {(activeTab === 'overview' || activeTab === 'finance') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 flex flex-col justify-between h-32 relative overflow-hidden" glow>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Receita Recorrente (MRR)</span>
                  <DollarSign size={16} className="text-green-500" />
                </div>
                <span className="text-3xl font-black">R$ {mrr.toFixed(2).replace('.', ',')}</span>
              </Card>

              <Card className="p-6 flex flex-col justify-between h-32 relative overflow-hidden" glow>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Clientes Ativos</span>
                  <Users size={16} className="text-primary" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black">{activeCount}</span>
                  <span className="text-xs text-zinc-500 font-bold mb-1">/{companies.length} total</span>
                </div>
              </Card>

              <Card className="p-6 flex flex-col justify-between h-32 relative overflow-hidden" glow>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Acessos Vitalícios</span>
                  <Star size={16} className="text-blue-500" />
                </div>
                <span className="text-3xl font-black">{companies.filter(c => c.is_lifetime).length}</span>
              </Card>

              <Card className="p-6 flex flex-col justify-between h-32 relative overflow-hidden" glow>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Inadimplentes / Cancelados</span>
                  <Activity size={16} className="text-red-500" />
                </div>
                <span className="text-3xl font-black">{companies.filter(c => c.subscription_status !== 'active' && !c.is_lifetime).length}</span>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card className="p-8 border-white/5" glow>
              <h3 className="text-xl font-black tracking-tight mb-6">Configurações do Sistema</h3>
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Preço Base da Assinatura (R$)</label>
                  <input type="number" defaultValue={9.90} disabled className="w-full bg-[#121214] border border-white/5 rounded-2xl px-5 py-3 outline-none text-zinc-500 cursor-not-allowed" />
                  <p className="text-[10px] text-zinc-600">Para alterar, modifique as variáveis de ambiente na Vercel.</p>
                </div>
                <Button onClick={() => alert('Configurações salvas!')} className="w-full">Salvar Alterações</Button>
              </div>
            </Card>
          )}

          {/* Data Table - Show on Overview and Clients */}
          {(activeTab === 'overview' || activeTab === 'clients') && (
            <Card className="p-0 overflow-hidden border-white/5" glow>
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#121214]/30">
                <h3 className="text-lg font-black tracking-tight">Gerenciamento de Assinaturas</h3>
                <Badge variant="warning">{filteredCompanies.length} Registros</Badge>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#121214]/50">
                      <th className="p-4 pl-6">Empresa / ID</th>
                      <th className="p-4">Link Público</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Cadastro</th>
                      <th className="p-4 text-right pr-6">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredCompanies.map((company) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={company.id} 
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="p-4 pl-6">
                          <div className="font-bold text-white flex items-center gap-2">
                            {company.name}
                            {company.is_lifetime && <Zap size={12} className="text-yellow-500" fill="currentColor" />}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono mt-1">{company.id.split('-')[0]}...</div>
                        </td>
                        <td className="p-4">
                          <a href={`/${company.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono text-xs">
                            /{company.slug}
                          </a>
                        </td>
                        <td className="p-4">
                          {company.is_lifetime ? (
                            <Badge variant="warning">VITALÍCIO</Badge>
                          ) : (
                            <Badge variant={company.subscription_status === 'active' ? 'success' : 'warning'}>
                              {company.subscription_status.toUpperCase()}
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-zinc-400 text-xs">
                          {new Date(company.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4 pr-6 flex justify-end gap-2">
                          <Button 
                            variant={company.is_lifetime ? 'glass' : 'primary'} 
                            className="h-8 px-3 text-[10px] py-0"
                            onClick={() => toggleLifetime(company.id, company.is_lifetime)}
                          >
                            {company.is_lifetime ? 'Revogar Vitalício' : 'Dar Vitalício'}
                          </Button>
                          <Button 
                            variant="danger" 
                            className="h-8 px-3 text-[10px] py-0"
                            onClick={() => cancelSubscription(company.id)}
                            disabled={company.subscription_status === 'canceled' || company.is_lifetime}
                          >
                            Cancelar
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredCompanies.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center space-y-4">
                          <p className="text-zinc-500 italic">Nenhuma empresa encontrada no banco de dados.</p>
                          <Button variant="secondary" onClick={generateMockData} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="animate-spin" /> : 'Criar Conta de Teste'}
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </div>
      </main>

      {/* Mobile Admin Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 p-4 pb-safe flex justify-around items-center z-50">
        {[
          { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
          { id: 'clients', name: 'Clientes', icon: Users },
          { id: 'finance', name: 'Financeiro', icon: CreditCard },
          { id: 'settings', name: 'Configs', icon: Settings },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? "text-primary" : "text-zinc-500 hover:text-white"
              }`}
            >
              <div className={isActive ? "bg-primary/20 p-1.5 rounded-lg" : "p-1.5"}>
                <tab.icon size={20} />
              </div>
              <span className="text-[10px] font-bold">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
