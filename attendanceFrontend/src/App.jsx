import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import SignupPage from './pages/signup'; // Make sure this file exists
import SubjectPanel from "./pages/SubjectPanel";
import AttendanceForm from './pages/AttendanceForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/subject-panel" element={<SubjectPanel />} />
        <Route path="/attendanceForm" element={<AttendanceForm/>}/>
      </Routes>
    </Router>
  );
}

export default App;
