import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import SubjectPanel from "./pages/SubjectPanel";
import AttendanceForm from './pages/AttendanceForm';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AddClasses from './pages/AddClasses';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/subject-panel" element={<SubjectPanel />} />
        <Route path="/attendanceForm" element={<AttendanceForm />} />
        <Route path="/change-password/:id" element={<ChangePasswordPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/add-class" element={<AddClasses />} />
      </Routes>
    </Router>
  );
}

export default App;
