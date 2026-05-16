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
  isLoading: boolean;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  addMedia: (file: File, itemData: Omit<MediaItem, 'id' | 'url'>) => Promise<void>;
  removeMedia: (id: number) => void;
  updateMedia: (id: number, updates: Partial<MediaItem>) => void;
  fetchMedia: () => Promise<void>;
}

const defaultCategories = ['Todos'];

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      mediaList: [],
      isLoading: false,

      addCategory: (category) => set((state) => ({ 
        categories: [...state.categories, category] 
      })),

      removeCategory: (category) => set((state) => ({ 
        categories: state.categories.filter((c) => c !== category) 
      })),

      addMedia: async (file: File, itemData: Omit<MediaItem, 'id' | 'url'>) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) return;

        set({ isLoading: true });

        try {
          // 1. Upload to Supabase Storage
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `${itemData.type}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // 2. Get Public URL
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

          // 3. Save to DB
          const newItem: MediaItem = {
            id: Date.now(),
            ...itemData,
            url: publicUrl
          };

          const { error: dbError } = await supabase.from('media').insert([newItem]);
          if (dbError) throw dbError;

          set((state) => ({ 
            mediaList: [newItem, ...state.mediaList],
            isLoading: false 
          }));
        } catch (error: any) {
          console.error('Error uploading media:', error);
          set({ isLoading: false });
          const errorMessage = error.message || 'Erro desconhecido';
          alert(`Erro ao subir arquivo: ${errorMessage}\n\nDica: Verifique no Supabase se o bucket "media" é público e se o limite de tamanho de arquivo permite vídeos.`);
        }
      },

      removeMedia: async (id) => {
        set((state) => ({ mediaList: state.mediaList.filter((m) => m.id !== id) }));
        await supabase.from('media').delete().eq('id', id);
      },

      updateMedia: async (id, updates) => {
        set((state) => ({
          mediaList: state.mediaList.map((m) => m.id === id ? { ...m, ...updates } : m)
        }));
        await supabase.from('media').update(updates).eq('id', id);
      },

      fetchMedia: async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) return;

        set({ isLoading: true });
        try {
          const { data, error } = await supabase.from('media').select('*').order('id', { ascending: false });
          if (error) throw error;
          
          const media = data || [];
          const dbCategories = [...new Set(media.map((m: any) => m.category))].filter(Boolean) as string[];
          
          set((state) => ({ 
            mediaList: media, 
            categories: [...new Set(['Todos', ...state.categories, ...dbCategories])],
            isLoading: false 
          }));
        } catch (err) {
          console.error('Error fetching media:', err);
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'realce-media-storage',
    }
  )
);
