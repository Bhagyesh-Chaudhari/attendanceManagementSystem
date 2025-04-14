import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddSubjects.css";

const AddSubjects = () => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = { subjectName, subjectCode };

    try {
      const res = await fetch("http://localhost:5000/admin/addSubject", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Subject added successfully!");
        setSubjectName("");
        setSubjectCode("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="add-subject-container">
      <h2>Add New Subject</h2>
      <form onSubmit={handleSubmit} className="add-subject-form">
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value.toUpperCase())}
          required
        />
        <input
          type="text"
          placeholder="Subject Code"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
          required
        />
        <div className="button-group">
          <button type="submit">Add Subject</button>
        </div>
        {message && <p className="message">{message}</p>}
        <div className="button-group">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubjects;
