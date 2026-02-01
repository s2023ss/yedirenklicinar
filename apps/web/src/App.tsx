import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { AcademicStructure, CourseDetail } from './pages';
import { Dashboard, QuestionBank, QuestionCreate, QuestionEdit, Exams, ExamCreate, Users, StudentExams, QuizSolve, Login, QuestionBulkUpload } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Student Routes (Full Screen / Different Layout) */}
        <Route path="/quiz/solve/:id" element={<QuizSolve />} />

        {/* Admin & Student List Routes */}
        <Route path="/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/academic" element={<AcademicStructure />} />
              <Route path="/academic/course/:id" element={<CourseDetail />} />
              <Route path="/questions" element={<QuestionBank />} />
              <Route path="/questions/new" element={<QuestionCreate />} />
              <Route path="/questions/edit/:id" element={<QuestionEdit />} />
              <Route path="/questions/bulk" element={<QuestionBulkUpload />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/exams/new" element={<ExamCreate />} />
              <Route path="/users" element={<Users />} />
              <Route path="/student/exams" element={<StudentExams />} />
              <Route path="/achievements" element={<div className="p-6">Rozetler yakında burada.</div>} />
              <Route path="/settings" element={<div className="p-6">Ayarlar yakında burada.</div>} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

