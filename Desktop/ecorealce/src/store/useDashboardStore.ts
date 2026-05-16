import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { 
  Globe, Share2, Presentation, CheckCircle, Calculator, MessageCircle, 
  Cloud, Image, Video, BookOpen, Mic, Megaphone, FileSignature, 
  Download, LayoutList, DollarSign, FileText, Briefcase 
} from 'lucide-react';

export interface DashboardItem {
  id: string;
  title: string;
  iconName: string;
  link: string;
  color: string;
  imageUrl?: string;
  order_index?: number;
}

interface DashboardState {
  items: DashboardItem[];
  isLoading: boolean;
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
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        await supabase.from('shortcuts').delete().eq('id', id);
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
      
      theme: 'dark',
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
    Download, LayoutList, DollarSign, FileText, Briefcase
  };
  return icons[name] || Globe;
};
