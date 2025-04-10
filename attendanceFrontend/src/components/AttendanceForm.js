"use client"

import { useEffect, useState } from "react"
import API from "../api"
import "../styles/AttendanceForm.css"

function AttendanceForm({ token, selected, onBack }) {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get(`/students?classId=${selected.class_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStudents(res.data)
        setAttendance(
          res.data.map((s) => ({
            student_id: s.id,
            student_name: s.name,
            status: "",
          })),
        )
      } catch (err) {
        setError("Failed to load students. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [selected.class_id, token])

  const handleCheck = (studentId, status) => {
    setAttendance((prev) => prev.map((item) => (item.student_id === studentId ? { ...item, status } : item)))
  }

  const handleSubmit = async () => {
    // Validate that all students have a status
    const incomplete = attendance.some((a) => !a.status)
    if (incomplete) {
      setError("Please mark attendance for all students.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      await API.post(
        "/attendance",
        {
          classId: selected.class_id,
          subjectId: selected.subject_id,
          attendanceList: attendance,
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setSuccess(true)
      setTimeout(() => {
        onBack()
      }, 2000)
    } catch (err) {
      setError("Failed to submit attendance. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const markAll = (status) => {
    setAttendance((prev) => prev.map((item) => ({ ...item, status })))
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <button className="back-button" onClick={onBack}>
          &larr; Back to Subjects
        </button>
        <h2>Attendance</h2>
        <p>
          {selected.class_name} - {selected.subject_name}
        </p>
      </div>

      {success ? (
        <div className="success-message">Attendance has been submitted successfully!</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : null}

      <div className="date-selector">
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="mark-all-buttons">
        <button onClick={() => markAll("present")}>Mark All Present</button>
        <button onClick={() => markAll("absent")}>Mark All Absent</button>
      </div>

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Student Name</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{student.name}</td>
                  <td className="attendance-options">
                    <label className={`present ${attendance[i]?.status === "present" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[i]?.status === "present"}
                        onChange={() => handleCheck(student.id, "present")}
                      />
                      Present
                    </label>
                    <label className={`absent ${attendance[i]?.status === "absent" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[i]?.status === "absent"}
                        onChange={() => handleCheck(student.id, "absent")}
                      />
                      Absent
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="submit-button" onClick={handleSubmit} disabled={loading || submitting}>
        {submitting ? "Submitting..." : "Submit Attendance"}
      </button>
    </div>
  )
}

export default AttendanceForm
