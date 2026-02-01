from supabase import create_client, Client
import httpx

original_init = httpx.Client.__init__
def new_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_init(self, *args, **kwargs)
httpx.Client.__init__ = new_init

def apply_policies():
    url = "https://supabase.yedirenklicinar.digitalalem.com"
    service_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw"
    
    supabase: Client = create_client(url, service_key)
    
    with open("supabase/migrations/20260201000001_rls_policies.sql", "r", encoding="utf-8") as f:
        sql = f.read()
        
    queries = [q.strip() for q in sql.split(";") if q.strip()]
    
    print("Applying RLS Policies...")
    for q in queries:
        try:
            supabase.rpc("exec_sql", {"sql_query": q}).execute()
            print(f"Success: {q[:50]}...")
        except Exception as e:
            print(f"Error executing: {q[:50]}...\n  Error: {e}")

if __name__ == "__main__":
    apply_policies()
