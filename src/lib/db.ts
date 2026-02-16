import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// This will be used when Supabase is set up with the schema from supabase/schema.sql
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client - will be null if env vars not set
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side write client (service role key) for webhook and admin operations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const adminSupabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : null;
