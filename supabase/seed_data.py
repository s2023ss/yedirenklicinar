from supabase import create_client, Client
import httpx
import json

# Setup SSL bypass as in apply_migration.py
original_init = httpx.Client.__init__
def new_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_init(self, *args, **kwargs)
httpx.Client.__init__ = new_init

def seed():
    url = "https://supabase.yedirenklicinar.digitalalem.com"
    service_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw"
    
    supabase: Client = create_client(url, service_key)

    print("--- Seeding Grades ---")
    grade_names = ["9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"]
    grades = []
    for name in grade_names:
        # Check if exists
        existing = supabase.table("grades").select("*").eq("name", name).execute()
        if existing.data:
            grades.append(existing.data[0])
            print(f"Grade exists: {name}")
        else:
            res = supabase.table("grades").insert({"name": name}).execute()
            grades.append(res.data[0])
            print(f"Added Grade: {name}")

    grade_12 = next(g for g in grades if "12" in g["name"])

    print("\n--- Seeding Courses for 12. Grade ---")
    course_names = ["Matematik", "Fizik", "Türk Dili ve Edebiyatı"]
    courses = []
    for name in course_names:
        existing = supabase.table("courses").select("*").eq("grade_id", grade_12["id"]).eq("name", name).execute()
        if existing.data:
            courses.append(existing.data[0])
            print(f"Course exists: {name}")
        else:
            res = supabase.table("courses").insert({"grade_id": grade_12["id"], "name": name}).execute()
            courses.append(res.data[0])
            print(f"Added Course: {name}")

    math_course = next(c for c in courses if "Matematik" in c["name"])

    print("\n--- Seeding Units for Matematik ---")
    unit_names = ["Sayılar ve Cebir", "Trigonometri", "Geometri"]
    units = []
    for name in unit_names:
        existing = supabase.table("units").select("*").eq("course_id", math_course["id"]).eq("name", name).execute()
        if existing.data:
            units.append(existing.data[0])
            print(f"Unit exists: {name}")
        else:
            res = supabase.table("units").insert({"course_id": math_course["id"], "name": name}).execute()
            units.append(res.data[0])
            print(f"Added Unit: {name}")

    algebra_unit = next(u for u in units if "Sayılar" in u["name"])

    print("\n--- Seeding Topics for Sayılar ve Cebir ---")
    topic_names = ["Karmaşık Sayılar", "Logaritma", "Diziler"]
    topics = []
    for name in topic_names:
        existing = supabase.table("topics").select("*").eq("unit_id", algebra_unit["id"]).eq("name", name).execute()
        if existing.data:
            topics.append(existing.data[0])
            print(f"Topic exists: {name}")
        else:
            res = supabase.table("topics").insert({"unit_id": algebra_unit["id"], "name": name}).execute()
            topics.append(res.data[0])
            print(f"Added Topic: {name}")

    log_topic = next(t for t in topics if "Logaritma" in t["name"])

    print("\n--- Seeding Learning Outcomes ---")
    outcomes = [
        {"topic_id": log_topic["id"], "code": "M.12.1.1.1", "description": "Logaritma fonksiyonu ile üstel fonksiyonu ilişkilendirir."},
        {"topic_id": log_topic["id"], "code": "M.12.1.1.2", "description": "Logaritma fonksiyonunun özelliklerini kullanarak işlemler yapar."}
    ]
    outcome_data = []
    for outcome in outcomes:
        existing = supabase.table("learning_outcomes").select("*").eq("code", outcome["code"]).execute()
        if existing.data:
            outcome_data.append(existing.data[0])
            print(f"Outcome exists: {outcome['code']}")
        else:
            res = supabase.table("learning_outcomes").insert(outcome).execute()
            outcome_data.append(res.data[0])
            print(f"Added Outcome: {outcome['code']}")

    print("\n--- Seeding Questions for Logaritma ---")
    questions = [
        {
            "learning_outcome_id": outcome_data[0]["id"],
            "content": "log2(8) + log3(9) işleminin sonucu kaçtır?",
            "difficulty_level": 2,
            "options": [
                {"text": "3", "correct": False},
                {"text": "4", "correct": False},
                {"text": "5", "correct": True},
                {"text": "6", "correct": False}
            ]
        },
        {
            "learning_outcome_id": outcome_data[1]["id"],
            "content": "log(x) + log(y) ifadesinin eşiti nedir?",
            "difficulty_level": 1,
            "options": [
                {"text": "log(x+y)", "correct": False},
                {"text": "log(x*y)", "correct": True},
                {"text": "log(x-y)", "correct": False},
                {"text": "log(x/y)", "correct": False}
            ]
        }
    ]

    for q in questions:
        # Simple check by content
        existing = supabase.table("questions").select("*").eq("content", q["content"]).execute()
        if existing.data:
            print(f"Question exists: {q['content'][:30]}...")
            continue

        res = supabase.table("questions").insert({
            "learning_outcome_id": q["learning_outcome_id"],
            "content": q["content"],
            "difficulty_level": q["difficulty_level"]
        }).execute()
        q_id = res.data[0]["id"]
        print(f"Added Question: {q['content'][:30]}...")
        
        for opt in q["options"]:
            supabase.table("options").insert({
                "question_id": q_id,
                "option_text": opt["text"],
                "is_correct": opt["correct"]
            }).execute()
        print(f"  Added {len(q['options'])} options.")

    print("\n--- Seeding Test Users ---")
    test_users = [
        {"email": "admin@yedirenklicinar.com", "password": "Password123!", "full_name": "Sistem Yöneticisi", "role": "admin"},
        {"email": "ogretmen@yedirenklicinar.com", "password": "Password123!", "full_name": "Örnek Öğretmen", "role": "teacher"},
        {"email": "ogrenci@yedirenklicinar.com", "password": "Password123!", "full_name": "Örnek Öğrenci", "role": "student"}
    ]

    for user_info in test_users:
        try:
            # We don't have a direct way to check in auth.users easily without fetching all, 
            # so we'll try to create and catch the error if it exists.
            res = supabase.auth.admin.create_user({
                "email": user_info["email"],
                "password": user_info["password"],
                "user_metadata": {"full_name": user_info["full_name"]},
                "email_confirm": True
            })
            # Also update the profile role as the trigger sets it to 'student' by default
            user_id = res.user.id
            supabase.table("profiles").update({"role": user_info["role"]}).eq("id", user_id).execute()
            print(f"Added User: {user_info['email']} ({user_info['role']})")
        except Exception as e:
            if "already registered" in str(e).lower() or "already exists" in str(e).lower():
                print(f"User already exists: {user_info['email']}")
            else:
                print(f"Error adding user {user_info['email']}: {e}")

    print("\nSeeding completed successfully!")

if __name__ == "__main__":
    seed()
