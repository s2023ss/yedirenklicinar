import httpx
from supabase import create_client, Client
import os
import postgrest

# Deeply monkeypatch postgrest and httpx to ignore SSL
original_init = httpx.Client.__init__
def new_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_init(self, *args, **kwargs)
httpx.Client.__init__ = new_init

original_async_init = httpx.AsyncClient.__init__
def new_async_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_async_init(self, *args, **kwargs)
httpx.AsyncClient.__init__ = new_async_init

def apply_schema():
    url: str = "https://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me"
    # Using service role key for migrations
    key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw"
    
    supabase: Client = create_client(url, key)
    
    migration_path = "supabase/migrations/20260201000000_initial_schema.sql"
    
    with open(migration_path, "r", encoding="utf-8") as f:
        sql = f.read()
    
    # Supabase Python client doesn't have a direct 'query' method for raw SQL execution 
    # unless an RPC is set up. However, we can try to use postgres-py if needed or
    # check if the skill's mentioned 'exec_sql' RPC exists.
    
    print("Attempting to execute migration SQL via RPC 'exec_sql'...")
    try:
        # Split by semicolon only if not inside dollar-quoted string ($$)
        # A simpler way is to split by a custom delimiter or handle blocks
        # For this specific file, we have one big block at the end.
        
        # Strategy: Separate the TRIGGER/FUNCTION block from the rest
        parts = sql.split("CREATE OR REPLACE FUNCTION")
        base_sql = parts[0]
        func_sql = "CREATE OR REPLACE FUNCTION" + parts[1] if len(parts) > 1 else ""
        
        # Also handle triggers separately if needed
        trig_parts = func_sql.split("CREATE OR REPLACE TRIGGER")
        func_body = trig_parts[0]
        trig_body = "CREATE OR REPLACE TRIGGER" + trig_parts[1] if len(trig_parts) > 1 else ""

        def run_block(block):
            lines = block.split(";")
            current_query = ""
            for line in lines:
                current_query += line + ";"
                # Simple check for balanced $$ 
                if current_query.count("$$") % 2 == 0:
                    q = current_query.strip(";") .strip()
                    if q:
                        try:
                            supabase.rpc("exec_sql", {"sql_query": q}).execute()
                            print(f"Executed: {q[:50]}...")
                        except Exception as inner_e:
                            print(f"SQL Error: {inner_e}")
                    current_query = ""

        run_block(base_sql)
        if func_body:
             try:
                 supabase.rpc("exec_sql", {"sql_query": func_body.strip()}).execute()
                 print("Executed Function Block.")
             except Exception as e:
                 print(f"Function Error: {e}")
        if trig_body:
             try:
                 supabase.rpc("exec_sql", {"sql_query": trig_body.strip()}).execute()
                 print("Executed Trigger Block.")
             except Exception as e:
                 print(f"Trigger Error: {e}")

        print("Migration process finished.")
    except Exception as e:
        print(f"Critical error during migration: {e}")

if __name__ == "__main__":
    apply_schema()
