import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rchfnxemcnssaixgibyg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjaGZueGVtY25zc2FpeGdpYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MzIxNjcsImV4cCI6MjEwNzEwODE2N30.nKiwBN6is4p77lo_AnF2auO4NSm_MdA_cZ1ToHhxNJs';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false
      }
    })
  : null;
