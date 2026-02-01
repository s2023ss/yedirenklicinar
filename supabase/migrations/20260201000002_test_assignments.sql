-- 1. Add grade_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade_id INTEGER REFERENCES public.grades(id) ON DELETE SET NULL;

-- 2. Create test_assignments table
CREATE TABLE IF NOT EXISTS public.test_assignments (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES public.tests(id) ON DELETE CASCADE,
    grade_id INTEGER REFERENCES public.grades(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure either grade_id or student_id is set
    CONSTRAINT test_assignment_target_check CHECK (
        (grade_id IS NOT NULL AND student_id IS NULL) OR
        (grade_id IS NULL AND student_id IS NOT NULL)
    )
);

-- 3. Enable RLS
ALTER TABLE public.test_assignments ENABLE ROW LEVEL SECURITY;

-- 4. Initial RLS Policies (Allow manage for all for now, similar to tests)
CREATE POLICY "Manage test_assignments" ON public.test_assignments FOR ALL USING (true);
