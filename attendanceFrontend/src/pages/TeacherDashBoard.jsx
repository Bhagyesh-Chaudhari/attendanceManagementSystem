import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashBoard.css";

function TeacherDashBoard() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/teacher/subjects", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setSubjects(data);
        } else {
          setError(data.message || "Failed to load subjects.");
        }
      } catch (err) {
        setError("Failed to load subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="subject-container">
      <div className="subject-header">
        <h2>Your Classes & Subjects</h2>
        <p>Select a class and subject to take attendance</p>
      </div>

      {loading ? (
        <div className="loading">Loading subjects...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="subject-grid">
          {subjects.length === 0 ? (
            <div className="no-subjects">
              <p>No classes or subjects assigned to you.</p>
            </div>
          ) : (
            subjects.map((subj) => (
              <div
                key={subj.subject_id}
                className="subject-card"
                onClick={() =>
                  navigate("/attendanceForm", { state: { selected: subj } })
                }
              >
                <h3>{subj.class_name}</h3>
                <p>{subj.subject_name}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TeacherDashBoard;
