from supabase import create_client, Client
import httpx

original_init = httpx.Client.__init__
def new_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_init(self, *args, **kwargs)
httpx.Client.__init__ = new_init

def check():
    url = "https://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o"
    supabase: Client = create_client(url, key)
    
    res = supabase.table("grades").select("*").execute()
    print(f"Grades found: {len(res.data)}")
    for g in res.data:
        print(f" - {g['name']}")

if __name__ == "__main__":
    check()
