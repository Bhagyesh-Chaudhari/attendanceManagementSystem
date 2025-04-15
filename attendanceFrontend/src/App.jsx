import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import TeacherDashBoard from "./pages/TeacherDashBoard";
import AttendanceForm from './pages/AttendanceForm';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AddClasses from './pages/AddClasses';
import AddSubjects from './pages/AddSubjects';
import AddBranchYearSubject from './pages/AddBranchYearSubject';
import AddTeacher from './pages/AddTeacher';
import AssignTeacher from './pages/AssignTeacher';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashBoard />} />
        <Route path="/attendanceForm" element={<AttendanceForm />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/create-class" element={<AddClasses />} />
        <Route path="/create-subject" element={<AddSubjects />} />
        <Route path="/add-subject-branch" element={<AddBranchYearSubject />} /> 
        <Route path="/create-teacher" element={<AddTeacher />} /> 
        <Route path="/assign-teacher" element={<AssignTeacher />} />
      </Routes>
    </Router>
  );
}

export default App;
