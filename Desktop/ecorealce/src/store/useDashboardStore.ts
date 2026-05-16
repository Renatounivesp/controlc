import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { 
  Globe, Share2, Presentation, CheckCircle, Calculator, MessageCircle, 
  Cloud, Image, Video, BookOpen, Mic, Megaphone, FileSignature, 
  Download, LayoutList, DollarSign, FileText, Briefcase, Type, Calendar, NotebookPen
} from 'lucide-react';

export interface DashboardItem {
  id: string;
  title: string;
  iconName: string;
  link: string;
  color: string;
  imageUrl?: string;
  order_index?: number;
  is_quick_access?: boolean;
}

interface DashboardState {
  items: DashboardItem[];
  isLoading: boolean;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  fetchItems: () => Promise<void>;
  addItem: (item: DashboardItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItems: (items: DashboardItem[]) => Promise<void>;
  updateItem: (id: string, updates: Partial<DashboardItem>) => Promise<void>;
  syncData: () => Promise<boolean>;
  pushToCloud: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isEditMode: false,
      theme: 'dark',
      
      setIsEditMode: (isEditMode) => set({ isEditMode }),

      fetchItems: async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          if (get().items.length === 0) {
             set({ items: [
                { id: 'photos', title: 'Fotos', iconName: 'Image', link: '/media?tab=photos', color: '#667eea', is_quick_access: true, order_index: 0 },
                { id: 'videos', title: 'Vídeos', iconName: 'Video', link: '/media?tab=videos', color: '#f5576c', is_quick_access: true, order_index: 1 },
                { id: 'orcamentos', title: 'Orçamentos', iconName: 'FileText', link: '/documents', color: '#4facfe', is_quick_access: true, order_index: 2 },
                { id: 'calculator', title: 'Calculadora', iconName: 'Calculator', link: '/calculator', color: '#38ef7d', is_quick_access: true, order_index: 3 },
                { id: 'notepad', title: 'Anotações', iconName: 'NotebookPen', link: '/notepad', color: '#ffd200', is_quick_access: true, order_index: 4 },
                { id: 'agenda', title: 'Agenda', iconName: 'Calendar', link: '/agenda', color: '#00c6ff', is_quick_access: true, order_index: 5 },
                { id: 'textos', title: 'Textos', iconName: 'Type', link: '/notepad', color: '#a855f7', is_quick_access: true, order_index: 6 },
              ] });
          }
          return;
        }

        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('shortcuts')
            .select('*')
            .order('order_index', { ascending: true });
          
          if (error) throw error;

          if (data && data.length > 0) {
            set({ items: data, isLoading: false });
          } else {
            // DB está vazio ou inacessível, mantemos os locais
            set({ isLoading: false });
            // Se realmente não houver nada nem local, carregamos os padrões
            if (get().items.length === 0) {
               const defaults = [
                { id: 'photos', title: 'Fotos', iconName: 'Image', link: '/media?tab=photos', color: '#667eea', is_quick_access: true, order_index: 0 },
                { id: 'videos', title: 'Vídeos', iconName: 'Video', link: '/media?tab=videos', color: '#f5576c', is_quick_access: true, order_index: 1 },
                { id: 'orcamentos', title: 'Orçamentos', iconName: 'FileText', link: '/documents', color: '#4facfe', is_quick_access: true, order_index: 2 },
                { id: 'calculator', title: 'Calculadora', iconName: 'Calculator', link: '/calculator', color: '#38ef7d', is_quick_access: true, order_index: 3 },
                { id: 'notepad', title: 'Anotações', iconName: 'NotebookPen', link: '/notepad', color: '#ffd200', is_quick_access: true, order_index: 4 },
                { id: 'agenda', title: 'Agenda', iconName: 'Calendar', link: '/agenda', color: '#00c6ff', is_quick_access: true, order_index: 5 },
                { id: 'textos', title: 'Textos', iconName: 'Type', link: '/notepad', color: '#a855f7', is_quick_access: true, order_index: 6 },
              ];
              set({ items: defaults });
            }
          }
        } catch (err) {
          console.error('Fetch error:', err);
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        const newItem = { ...item, order_index: get().items.length };
        set((state) => ({ items: [...state.items, newItem] }));
        
        const { error } = await supabase.from('shortcuts').upsert([newItem]);
        if (error) {
          console.error('Sync Error:', error);
          alert('Erro ao sincronizar com a nuvem. O atalho ficará apenas neste aparelho. Verifique se o banco de dados permite gravações.');
        }
      },

      removeItem: async (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        await supabase.from('shortcuts').delete().eq('id', id);
      },

      updateItems: async (items) => {
        const itemsWithOrder = items.map((item, index) => ({ ...item, order_index: index }));
        set({ items: itemsWithOrder });
        await supabase.from('shortcuts').upsert(itemsWithOrder);
      },

      updateItem: async (id, updates) => {
        set((state) => ({
          items: state.items.map((i) => i.id === id ? { ...i, ...updates } : i)
        }));
        await supabase.from('shortcuts').update(updates).eq('id', id);
      },

      syncData: async () => {
        const { data } = await supabase.from('shortcuts').select('*').order('order_index', { ascending: true });
        if (data && data.length > 0) {
          set({ items: data });
          return true;
        }
        return false;
      },
      
      resetToDefaults: async () => {
        const defaults = [
          { id: 'photos', title: 'Fotos', iconName: 'Image', link: '/media?tab=photos', color: '#667eea', is_quick_access: true, order_index: 0 },
          { id: 'videos', title: 'Vídeos', iconName: 'Video', link: '/media?tab=videos', color: '#f5576c', is_quick_access: true, order_index: 1 },
          { id: 'orcamentos', title: 'Orçamentos', iconName: 'FileText', link: '/documents', color: '#4facfe', is_quick_access: true, order_index: 2 },
          { id: 'calculator', title: 'Calculadora', iconName: 'Calculator', link: '/calculator', color: '#38ef7d', is_quick_access: true, order_index: 3 },
          { id: 'notepad', title: 'Anotações', iconName: 'NotebookPen', link: '/notepad', color: '#ffd200', is_quick_access: true, order_index: 4 },
          { id: 'agenda', title: 'Agenda', iconName: 'Calendar', link: '/agenda', color: '#00c6ff', is_quick_access: true, order_index: 5 },
          { id: 'textos', title: 'Textos', iconName: 'Type', link: '/notepad', color: '#a855f7', is_quick_access: true, order_index: 6 },
        ];
        set({ items: defaults });
        await supabase.from('shortcuts').delete().not('id', 'is', null);
        await supabase.from('shortcuts').insert(defaults);
      },

      pushToCloud: async () => {
        set({ isLoading: true });
        const items = get().items;
        await supabase.from('shortcuts').delete().not('id', 'is', null);
        await supabase.from('shortcuts').insert(items);
        set({ isLoading: false });
      },
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'realce-dashboard-storage',
    }
  )
);

// Helper to get icon component by name
export const getIconByName = (name: string) => {
  const icons: Record<string, any> = {
    Globe, Share2, Presentation, CheckCircle, Calculator, MessageCircle, 
    Cloud, Image, Video, BookOpen, Mic, Megaphone, FileSignature, 
    Download, LayoutList, DollarSign, FileText, Briefcase, Type, Calendar, NotebookPen
  };
  return icons[name] || Globe;
};
