import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Prevent crash if keys are missing
const isMock = !supabaseUrl || !supabaseAnonKey;

export const supabase = !isMock
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      isMock: true,
      from: () => ({ 
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ error: new Error('Supabase keys missing - Running in Mock Mode') }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        upsert: () => Promise.resolve({ error: null })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    } as any;

(supabase as any).isMock = isMock;
