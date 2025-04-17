import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBranchYearSubject.css";

const AddBranchYearSubject = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const dropdownRef = useRef();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchYearRes = await fetch(
          "http://localhost:5000/admin/getBranchesAndYears",
          {
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
          setMessage(
            branchYearData.message || "Error fetching branches and years."
          );
        }

        const subjectRes = await fetch(
          "http://localhost:5000/admin/getAllSubjects",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const subjectData = await subjectRes.json();
        if (subjectRes.ok) {
          setSubjects(subjectData);
        } else {
          setMessage(subjectData.message || "Error fetching subjects.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Server error.");
      }
    };

    fetchData();
  }, []);

  const handleSubjectClick = (subject) => {
    if (!selectedSubjects.includes(subject.id)) {
      setSelectedSubjects([...selectedSubjects, subject.id]);
      setSearchTerm(""); // Clear input after selection
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/admin/addBranchYearSubject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            branchId: selectedBranch,
            yearId: selectedYear,
            subjectIds: selectedSubjects,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Subjects assigned successfully!");
        setSelectedSubjects([]); // Clear selection
        setSearchTerm("");
      } else {
        setMessage(data.message || "Failed to assign subjects.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error.");
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSubjects.includes(subject.id)
  );

  const selectedSubjectNames = selectedSubjects
    .map((id) => subjects.find((s) => s.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="assign-container">
      <h2>Select Branch, Year and Assign Subjects</h2>

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

        {selectedBranch && selectedYear && (
          <div className="subject-dropdown-wrapper">
            <label>
              Assign Subjects:
              <input
                type="text"
                placeholder="Type to search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="subject-search-input"
              />
            </label>

            {filteredSubjects.length > 0 && searchTerm && (
              <div className="dropdown" ref={dropdownRef}>
                {filteredSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="dropdown-item"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    {subject.name}
                  </div>
                ))}
              </div>
            )}

            {selectedSubjectNames.length > 0 && (
              <div className="selected-subjects">
                <strong>Selected:</strong> {selectedSubjectNames.join(", ")}
              </div>
            )}

            {selectedSubjects.length > 0 && (
              <button className="assign-buttons" onClick={handleSubmit}>
                Assign Subjects
              </button>
            )}

            <div className="back-button-container">
              <button
                className="back-btn"
                onClick={() => navigate("/admin-dashboard")}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
};

export default AddBranchYearSubject;
