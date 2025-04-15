import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Welcome, Admin</h1>
      </div>
      <div className="admin-content">
        <div className="admin-card" onClick={() => navigate("/create-class")}>
          Create Class
        </div>
        <div className="admin-card" onClick={() => navigate("/create-subject")}>
          Create Subjects
        </div>
        <div className="admin-card" onClick={() => navigate("/add-subject-branch")}>
          Add Subjects To Branches
        </div>
        <div className="admin-card" onClick={() => navigate("/assign-teacher")}>
          Assign Teachers
        </div>
        <div className="admin-card" onClick={() => navigate("/create-teacher")}>
          Create Teacher
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
