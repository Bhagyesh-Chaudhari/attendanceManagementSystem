import React, { useState } from "react";
import "./AddClasses.css";
import { useNavigate } from "react-router-dom";

const AddClasses = () => {
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [division, setDivision] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleAddClass = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const className = `${branch} ${year} ${division}`;

    try {
      const res = await fetch("http://localhost:5000/admin/addClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ className }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Class added successfully!");
        setBranch("");
        setYear("");
        setDivision("");
      } else {
        setMessage(data.message || "Error adding class.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error.");
    }
  };

  return (
    <div className="add-class-container">
      <form onSubmit={handleAddClass} className="add-class-form">
        <h2>Add New Class</h2>

        <select value={branch} onChange={(e) => setBranch(e.target.value)} required>
          <option value="">Select Branch</option>
          <option value="CMPN">CMPN</option>
          <option value="INFT">INFT</option>
          <option value="EXCS">EXCS</option>
          <option value="EXTC">EXTC</option>
          <option value="BIOMED">BIOMED</option>
          <option value="VIIE">VIIE</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="">Select Year</option>
          <option value="F.E.">F.E.</option>
          <option value="S.E.">S.E.</option>
          <option value="T.E.">T.E.</option>
          <option value="B.Tech">B.Tech</option>
        </select>

        <select value={division} onChange={(e) => setDivision(e.target.value)} required>
          <option value="">Select Division</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

        <button type="submit" className="addClassButton">Add Class</button>
        {message && <p className="message">{message}</p>}
        <button type="button" className="back-btn" onClick={() => navigate("/admin-dashboard")}>
          Back to Dashboard
        </button>
      </form>
    </div>
  );
};

export default AddClasses;
