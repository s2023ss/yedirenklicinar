-- Allow public access to academic structure (Admin/Manage)
CREATE POLICY "Manage grades" ON public.grades FOR ALL USING (true);
CREATE POLICY "Manage courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Manage units" ON public.units FOR ALL USING (true);
CREATE POLICY "Manage topics" ON public.topics FOR ALL USING (true);
CREATE POLICY "Manage learning_outcomes" ON public.learning_outcomes FOR ALL USING (true);

-- Allow public access to questions and options (Admin/Manage)
CREATE POLICY "Manage questions" ON public.questions FOR ALL USING (true);
CREATE POLICY "Manage options" ON public.options FOR ALL USING (true);

-- Allow public access to tests and test_questions (Admin/Manage)
CREATE POLICY "Manage tests" ON public.tests FOR ALL USING (true);
CREATE POLICY "Manage test_questions" ON public.test_questions FOR ALL USING (true);

-- Allow public read access to achievements
CREATE POLICY "Allow public read access to achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Manage achievements" ON public.achievements FOR ALL USING (true);

-- Profiles policies (Users can read all profiles, but only update their own)
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
