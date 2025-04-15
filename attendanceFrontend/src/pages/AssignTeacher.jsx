import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AssignTeacher.css";

const AssignTeacher = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [branchYearRes, teacherRes] = await Promise.all([
          fetch("http://localhost:5000/admin/getBranchesAndYears", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5000/admin/getAllTeachers", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const branchYearData = await branchYearRes.json();
        const teacherData = await teacherRes.json();

        if (branchYearRes.ok) {
          setBranches(branchYearData.branches);
          setYears(branchYearData.years);
        } else {
          setMessage(
            branchYearData.message || "Failed to load branch/year data."
          );
        }

        if (teacherRes.ok) {
          setTeachers(teacherData);
        } else {
          setMessage(teacherData.message || "Failed to load teachers.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Server error.");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchDivisionsAndSubjects = async () => {
      if (!selectedBranch || !selectedYear) return;

      // Get branch and year names (for divisions API)
      const branchName = branches.find(
        (b) => b.branch_id === Number(selectedBranch)
      )?.branch_name;
      const yearName = years.find(
        (y) => y.year_id === Number(selectedYear)
      )?.year_name;

      if (!branchName || !yearName) {
        setMessage("Invalid branch or year selected.");
        return;
      }

      try {
        // Fetch Divisions
        const divisionRes = await fetch(
          "http://localhost:5000/admin/getFilteredClasses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              branch_name: branchName,
              year_name: yearName,
            }),
          }
        );

        const divisionData = await divisionRes.json();
        if (divisionRes.ok) {
          setDivisions(
            Array.isArray(divisionData.divisions) ? divisionData.divisions : []
          );
        } else {
          setMessage(divisionData.message || "Failed to load divisions.");
        }

        // Fetch Subjects (using branch ID and year ID)
        const subjectRes = await fetch(
          "http://localhost:5000/admin/getSubjectsByBranchYear",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              branch_id: selectedBranch,
              year_id: selectedYear,
            }),
          }
        );

        const subjectData = await subjectRes.json();
        console.log("Subject Data:", subjectData); // Debug the response structure
        if (subjectRes.ok) {
          setSubjects(subjectData); // Directly set the array of subjects
        } else {
          setMessage(subjectData.message || "Failed to load subjects.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Server error.");
      }
    };

    fetchDivisionsAndSubjects();
  }, [selectedBranch, selectedYear]);

  // Handle form submission to assign teacher
  const handleAssignTeacher = async () => {
    if (!selectedTeacher || !selectedDivision || !selectedSubject) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/admin/assignSubjectToTeacher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            teacher_id: selectedTeacher,
            branch_year_subject_id: selectedSubject,
            class_id: selectedDivision,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Teacher assigned successfully!");
        // Optionally redirect after success
        navigate("/admin-dashboard");
      } else {
        setMessage(data.message || "Failed to assign teacher.");
      }
    } catch (error) {
      console.error("Error assigning teacher:", error);
      setMessage("Error while assigning teacher.");
    }
  };

  return (
    <div className="assign-teacher-container">
      <h2>Assign Teacher</h2>

      <div className="form-group">
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
      </div>

      <div className="form-group">
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
      </div>

      <div className="form-group">
        <label>
          Division:
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="">Select Division</option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>
                {div.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-group">
        <label>
          Teacher:
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-group">
        <label>
          Subject:
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option
                key={subject.branch_year_subjects_id}
                value={subject.branch_year_subjects_id}
              >
                {subject.subject_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button onClick={() => navigate("/admin-dashboard")}>Back</button>
        <button onClick={handleAssignTeacher}>Assign Teacher</button>
      </div>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default AssignTeacher;
