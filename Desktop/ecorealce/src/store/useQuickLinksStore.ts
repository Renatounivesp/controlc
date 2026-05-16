import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: string;
  color: string;
}

interface QuickLinksState {
  links: QuickLink[];
  isLoading: boolean;
  fetchLinks: () => Promise<void>;
  addLink: (link: QuickLink) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  updateLink: (id: string, updates: Partial<QuickLink>) => Promise<void>;
}

export const useQuickLinksStore = create<QuickLinksState>()(
  persist(
    (set, get) => ({
      links: [],
      isLoading: false,

      fetchLinks: async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) return;

        set({ isLoading: true });
        const { data, error } = await supabase
          .from('quick_links')
          .select('*')
          .order('title', { ascending: true });
        
        if (!error && data) {
          set({ links: data, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      addLink: async (link) => {
        set((state) => ({ links: [...state.links, link] }));
        await supabase.from('quick_links').insert([link]);
      },

      removeLink: async (id) => {
        set((state) => ({ links: state.links.filter((l) => l.id !== id) }));
        await supabase.from('quick_links').delete().eq('id', id);
      },

      updateLink: async (id, updates) => {
        set((state) => ({
          links: state.links.map((l) => l.id === id ? { ...l, ...updates } : l)
        }));
        await supabase.from('quick_links').update(updates).eq('id', id);
      },
    }),
    {
      name: 'realce-quick-links-storage',
    }
  )
);
