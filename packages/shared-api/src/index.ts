import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.yedirenklicinar.digitalalem.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export * from './types';
