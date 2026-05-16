import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: number;
}

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  fetchNotes: () => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      notes: [],
      isLoading: false,

      fetchNotes: async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) return;

        set({ isLoading: true });
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (!error && data) {
          set({ notes: data, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      addNote: async (note) => {
        set((state) => ({ notes: [note, ...state.notes] }));
        await supabase.from('notes').insert([note]);
      },

      updateNote: async (id, updates) => {
        const timestampedUpdates = { ...updates, updated_at: Date.now() };
        set((state) => ({
          notes: state.notes.map((n) => n.id === id ? { ...n, ...timestampedUpdates } : n)
        }));
        await supabase.from('notes').update(timestampedUpdates).eq('id', id);
      },

      removeNote: async (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
        await supabase.from('notes').delete().eq('id', id);
      },
    }),
    {
      name: 'realce-notes-storage',
    }
  )
);
