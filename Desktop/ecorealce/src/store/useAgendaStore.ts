import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  time: string;
  type: 'appointment' | 'payment' | 'reminder';
  completed: boolean;
  notify: boolean;
}

interface AgendaState {
  items: AgendaItem[];
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (item: AgendaItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
}

export const useAgendaStore = create<AgendaState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchItems: async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) return;

        set({ isLoading: true });
        const { data, error } = await supabase
          .from('agenda')
          .select('*')
          .order('date', { ascending: true })
          .order('time', { ascending: true });
        
        if (!error && data) {
          set({ items: data, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        set((state) => ({ items: [...state.items, item].sort((a, b) => a.date.localeCompare(b.date)) }));
        await supabase.from('agenda').insert([item]);
      },

      removeItem: async (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        await supabase.from('agenda').delete().eq('id', id);
      },

      toggleComplete: async (id) => {
        const item = get().items.find(i => i.id === id);
        if (!item) return;

        const updatedItem = { ...item, completed: !item.completed };
        set((state) => ({
          items: state.items.map((i) => i.id === id ? updatedItem : i)
        }));
        await supabase.from('agenda').update({ completed: updatedItem.completed }).eq('id', id);
      },
    }),
    {
      name: 'realce-agenda-storage',
    }
  )
);
