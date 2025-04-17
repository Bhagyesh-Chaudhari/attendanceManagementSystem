import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AttendanceForm.css";

function AttendanceForm() {
  const { state } = useLocation();
  const selected = state?.selected;
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

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

  const selectAll = (status) => {
    const newAttendance = {};
    students.forEach((s) => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!date || !timeSlot) {
      alert("Please select date and time slot.");
      return;
    }

    if (Object.keys(attendance).length !== students.length) {
      alert("Please mark attendance for all students.");
      return;
    }

    const attendanceList = students.map((student) => ({
      student_name: student.name,
      status: attendance[student.id],
    }));

    const payload = {
      class_id: selected.class_id,
      subjectId: selected.subject_id,
      attendanceList,
      date,
      time_slot: timeSlot,
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
        navigate("/teacher-dashboard");
      } else {
        alert(result.message || "Failed to submit attendance.");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="attendance-page">
      <div className="top-navbar">
        <div className="logo">🏫 VIT</div>
        <div className="heading">
          Attendance for {selected?.class_name} - {selected?.subject_name}
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/teacher-dashboard")}
        >
          ← Back
        </button>
      </div>

      <div className="form-controls">
        <label>
          Select Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Select Time Slot:
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            <option value="">-- Select Slot --</option>
            <option value="1st Lecture">1st Lecture</option>
            <option value="2nd Lecture">2nd Lecture</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="status-msg">Loading students...</p>
      ) : error ? (
        <p className="status-msg">{error}</p>
      ) : (
        <>
          <div className="controls">
            <button onClick={() => selectAll("present")}>
              Select All Present
            </button>
            <button onClick={() => selectAll("absent")}>
              Select All Absent
            </button>
          </div>

          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="radio"
                        name={`attend-${student.id}`}
                        value="present"
                        checked={attendance[student.id] === "present"}
                        onChange={() =>
                          handleAttendanceChange(student.id, "present")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`attend-${student.id}`}
                        value="absent"
                        checked={attendance[student.id] === "absent"}
                        onChange={() =>
                          handleAttendanceChange(student.id, "absent")
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="submit-container">
            <button onClick={handleSubmit}>Submit Attendance</button>
          </div>

          {/* New Button to navigate to Attendance Page */}
          <div className="attendance-page-link">
            <button
              onClick={() =>
                navigate("/attendance-page", {
                  state: {
                    classId: selected.class_id,
                    subjectId: selected.subject_id,
                  },
                })
              }
            >
              Go to Attendance Page
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AttendanceForm;
