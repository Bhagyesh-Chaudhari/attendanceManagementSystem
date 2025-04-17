import React, { useState, useEffect } from "react";
import "./AddClasses.css";
import { useNavigate } from "react-router-dom";

const AddClasses = () => {
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [division, setDivision] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch branches and years when the component mounts
  useEffect(() => {
    const fetchBranchesAndYears = async () => {

      try {
        const res = await fetch("http://localhost:5000/admin/getBranchesAndYears", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          // Assuming the response contains both branches and years
          setBranches(data.branches);
          setYears(data.years);
        } else {
          setMessage(data.message || "Error fetching data.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Server error.");
      }
    };

    fetchBranchesAndYears();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();

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
          {branches.map((b) => (
            <option key={b.branch_id} value={b.branch_name}>
              {b.branch_name}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y.year_id} value={y.year_name}>
              {y.year_name}
            </option>
          ))}
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
