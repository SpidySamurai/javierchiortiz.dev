import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Plain anon client — no cookie/session handling, for public read-only queries
export const publicClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
