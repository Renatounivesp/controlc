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
        // If Supabase is not configured, don't try to fetch and overwrite local state
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) return;

        set({ isLoading: true });
        const { data, error } = await supabase
          .from('shortcuts')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (!error && data && data.length > 0) {
          set({ items: data, isLoading: false });
        } else if (!error) {
          const currentItems = get().items;
          if (currentItems.length > 0) {
            // We have local items, let's sync them to the DB instead of using defaults
            set({ isLoading: false });
            await supabase.from('shortcuts').insert(currentItems);
            return;
          }

          // Initialize with defaults if DB and local storage are empty
          const defaults: DashboardItem[] = [
            { id: 'photos', title: 'Fotos', iconName: 'Image', link: '/media?tab=photos', color: '#667eea', is_quick_access: true, order_index: 0 },
            { id: 'videos', title: 'Vídeos', iconName: 'Video', link: '/media?tab=videos', color: '#f5576c', is_quick_access: true, order_index: 1 },
            { id: 'orcamentos', title: 'Orçamentos', iconName: 'FileText', link: '/documents', color: '#4facfe', is_quick_access: true, order_index: 2 },
            { id: 'calculator', title: 'Calculadora', iconName: 'Calculator', link: '/calculator', color: '#38ef7d', is_quick_access: true, order_index: 3 },
            { id: 'notepad', title: 'Anotações', iconName: 'NotebookPen', link: '/notepad', color: '#ffd200', is_quick_access: true, order_index: 4 },
            { id: 'agenda', title: 'Agenda', iconName: 'Calendar', link: '/agenda', color: '#00c6ff', is_quick_access: true, order_index: 5 },
            { id: 'textos', title: 'Textos', iconName: 'Type', link: '/notepad', color: '#a855f7', is_quick_access: true, order_index: 6 },
          ];
          set({ items: defaults, isLoading: false });
          await supabase.from('shortcuts').insert(defaults);
        } else {
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        const newItem = { ...item, order_index: get().items.length };
        set((state) => ({ items: [...state.items, newItem] }));
        
        await supabase.from('shortcuts').insert([newItem]);
      },

      removeItem: async (id) => {
        // Update local state immediately for better UX
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          if (supabaseUrl) {
            const { error } = await supabase.from('shortcuts').delete().eq('id', id);
            if (error) throw error;
          }
        } catch (error) {
          console.error('Error removing item from database:', error);
          // Optional: Re-fetch items if you want to be sure UI matches DB after error
          // get().fetchItems(); 
        }
      },

      updateItems: async (items) => {
        const itemsWithOrder = items.map((item, index) => ({ ...item, order_index: index }));
        set({ items: itemsWithOrder });
        
        // Sync order to DB
        for (const item of itemsWithOrder) {
          await supabase.from('shortcuts').update({ order_index: item.order_index }).eq('id', item.id);
        }
      },

      updateItem: async (id, updates) => {
        set((state) => ({
          items: state.items.map((i) => i.id === id ? { ...i, ...updates } : i)
        }));
        await supabase.from('shortcuts').update(updates).eq('id', id);
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
