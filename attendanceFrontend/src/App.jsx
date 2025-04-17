import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/login';
import TeacherDashBoard from "./pages/Teacher/TeacherDashBoard";
import AttendanceForm from './pages/Teacher/AttendanceForm';
import AttendancePage from './pages/Teacher/AttendancePage';
import ChangePasswordPage from './pages/Teacher/ChangePasswordPage';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AddClasses from './pages/Admin/AddClasses';
import AddSubjects from './pages/Admin/AddSubjects';
import AddBranchYearSubject from './pages/Admin/AddBranchYearSubject';
import AddTeacher from './pages/Admin/AddTeacher';
import AssignTeacher from './pages/Admin/AssignTeacher';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashBoard />} />
        <Route path="/attendanceForm" element={<AttendanceForm />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/attendance-page" element={<AttendancePage />} />
        {/* Admin Routes */}
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
