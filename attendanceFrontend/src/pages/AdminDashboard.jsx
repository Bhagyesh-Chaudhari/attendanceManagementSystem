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
        <div className="admin-card" onClick={() => navigate("/add-class")}>
          Add Class
        </div>
        <div className="admin-card" onClick={() => navigate("/add-subject")}>
          Add Subjects
        </div>
        <div className="admin-card" onClick={() => navigate("/assign-teacher")}>
          Assign Teachers
        </div>
        <div className="admin-card" onClick={() => navigate("/manage-data")}>
          Manage Data
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
