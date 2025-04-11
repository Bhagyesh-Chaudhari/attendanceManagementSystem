import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AttendanceForm() {
  const { state } = useLocation();
  const selected = state?.selected;
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    if (!selected) return;

    const fetchStudents = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:5000/teacher/students?class_id=${selected.class_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStudents(data || []);
        } else {
          setError(data.message || "Failed to load students.");
        }
      } catch (err) {
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selected]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    // ✅ Validate that all students are marked
    if (Object.keys(attendance).length !== students.length) {
      alert("Please mark attendance for all students.");
      return;
    }

    // ✅ Prepare attendanceList as per backend format
    const attendanceList = students.map((student) => ({
      student_name: student.name,
      status: attendance[student.id],
    }));

    const payload = {
      class_id: selected.class_id,
      subjectId: selected.subject_id,
      attendanceList,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    };

    try {
      const response = await fetch("http://localhost:5000/teacher/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Attendance submitted successfully!");
        navigate("/subject-panel");
      } else {
        alert(result.message || "Failed to submit attendance.");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/subject-panel")}>← Back</button>
      <h2>
        Attendance for {selected?.class_name} - {selected?.subject_name}
      </h2>

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {students.map((student) => (
            <div key={student.id}>
              <span>{student.name}</span>
              <label>
                <input
                  type="radio"
                  name={`attend-${student.id}`}
                  value="present"
                  onChange={() => handleAttendanceChange(student.id, "present")}
                />
                Present
              </label>
              <label>
                <input
                  type="radio"
                  name={`attend-${student.id}`}
                  value="absent"
                  onChange={() => handleAttendanceChange(student.id, "absent")}
                />
                Absent
              </label>
            </div>
          ))}

          <button onClick={handleSubmit}>Submit Attendance</button>
        </div>
      )}
    </div>
  );
}

export default AttendanceForm;
