import os

def clean_file(path, content):
    with open(path, 'wb') as f:
        f.write(content.encode('utf-8'))

ui_kit_index = """export * from './Button';
export * from './Card';
export * from './Input';
export * from './Modal';
"""

shared_api_index = """import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export * from './types';
"""

clean_file('packages/ui-kit/src/index.ts', ui_kit_index)
clean_file('packages/shared-api/src/index.ts', shared_api_index)
print("Files cleaned successfully.")
