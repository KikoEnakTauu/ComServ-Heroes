import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com/project/_/settings/api
const SUPABASE_URL = 'https://szdqzhvrsdnscmxwwopi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZHF6aHZyc2Ruc2NteHd3b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNTg1MjksImV4cCI6MjA4MDgzNDUyOX0.kG07CqoAr5H8epX9iFDtTh8mS2CAA2GV-z5dmbedqhE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
