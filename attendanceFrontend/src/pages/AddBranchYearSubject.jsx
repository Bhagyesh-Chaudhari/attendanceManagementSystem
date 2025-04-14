import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBranchYearSubject.css";

const AddBranchYearSubject = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Fetch branches, years and subjects when the component mounts
  useEffect(() => {
    const fetchBranchesYearsSubjects = async () => {
      try {
        const branchYearRes = await fetch(
          "http://localhost:5000/admin/getBranchesAndYears",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const branchYearData = await branchYearRes.json();
        if (branchYearRes.ok) {
          setBranches(branchYearData.branches);
          setYears(branchYearData.years);
        } else {
          setMessage(branchYearData.message || "Error fetching branches and years.");
        }

        const subjectRes = await fetch("http://localhost:5000/admin/getAllSubjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const subjectData = await subjectRes.json();
        if (subjectRes.ok) {
          setSubjects(subjectData);
          console.log(subjectData);
        } else {
          setMessage(subjectData.message || "Error fetching subjects.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Server error.");
      }
    };

    fetchBranchesYearsSubjects();
  }, []);

  return (
    <div className="assign-container">
      <h2>Select Branch, Year and View Subjects</h2>

      <div className="assign-form">
        <label>
          Branch:
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year:
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year.year_id} value={year.year_id}>
                {year.year_name}
              </option>
            ))}
          </select>
        </label>

        <div className="subjects-list">
          <h3>Available Subjects:</h3>
          {subjects.length === 0 ? (
            <p>No subjects found.</p>
          ) : (
            <ul>
              {subjects.map((subject) => (
                <li key={subject.id}>{subject.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="assign-buttons">
          <button
            className="back-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBranchYearSubject;
