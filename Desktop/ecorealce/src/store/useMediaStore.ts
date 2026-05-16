import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface MediaItem {
  id: number;
  type: 'photo' | 'video';
  title: string;
  category: string;
  url: string;
}

interface MediaState {
  categories: string[];
  mediaList: MediaItem[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  addMedia: (item: MediaItem) => void;
  removeMedia: (id: number) => void;
  fetchMedia: () => Promise<void>;
}

const defaultCategories = [
  'Todos', 'Automotivo', 'Residencial', 'Comercial', 'Nano Cerâmica', 
  'Nano Carbono', 'Antivandalismo', 'Antes e Depois', 'Fachadas', 
  'Sacadas', 'Escritórios', 'Clientes'
];

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      mediaList: [],

      addCategory: (category) => set((state) => ({ 
        categories: [...state.categories, category] 
      })),

      removeCategory: (category) => set((state) => ({ 
        categories: state.categories.filter((c) => c !== category) 
      })),

      addMedia: async (item) => {
        set((state) => ({ mediaList: [item, ...state.mediaList] }));
        await supabase.from('media').insert([item]);
      },

      removeMedia: async (id) => {
        set((state) => ({ mediaList: state.mediaList.filter((m) => m.id !== id) }));
        await supabase.from('media').delete().eq('id', id);
      },

      fetchMedia: async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) return;

        const { data, error } = await supabase.from('media').select('*').order('id', { ascending: false });
        if (!error && data && data.length > 0) {
          set({ mediaList: data });
        }
      }
    }),
    {
      name: 'realce-media-storage',
    }
  )
);
