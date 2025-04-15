import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTeacher.css";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tempPassword: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { name, email, tempPassword } = formData;

    if (!name || !email || !tempPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/admin/createTeacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, tempPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({ name: "", email: "", tempPassword: "" });
      } else {
        setMessage(data.message || "Failed to add teacher.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error.");
    }
  };

  return (
    <div className="add-teacher-container">
      <h2>Add New Teacher</h2>

      <div className="add-teacher-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter teacher's name"
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter teacher's email"
            onChange={handleChange}
          />
        </label>

        <label>
          Temporary Password:
          <input
            type="text"
            name="tempPassword"
            value={formData.tempPassword}
            placeholder="Set temporary password"
            onChange={handleChange}
          />
        </label>

        <button className="submit-btn" onClick={handleSubmit}>
          Create Teacher
        </button>

        {message && <p className="status-message">{message}</p>}

        <div className="back-button">
          <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
