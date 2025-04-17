import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AttendancePage = () => {
  const { state } = useLocation(); // 👈 This is how you get passed state
  const classId = state?.classId;
  const subjectId = state?.subjectId;

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const sortedSessions = [
    ...new Set(
      attendanceData.map((entry) => `${entry.date} | ${entry.time_slot}`)
    ),
  ].sort((a, b) => {
    const [dateA] = a.split(" | ");
    const [dateB] = b.split(" | ");
    return new Date(dateA) - new Date(dateB);
  });

  useEffect(() => {

    const fetchAttendanceData = async () => {
      const token = localStorage.getItem("token");
      if (!classId || !subjectId) {
        alert("Invalid class or subject ID");
        navigate(-1);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/teacher/attendancePage",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              classId,
              subjectId,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setAttendanceData(data.data);
        } else {
          alert("No attendance found");
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        alert("Error fetching attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [classId, subjectId, navigate]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Student Name", "Status", "Date", "Time Slot"]],
      body: attendanceData.map((item) => [
        item.student_name,
        item.status,
        item.date,
        item.time_slot,
      ]),
    });
    doc.save("attendance.pdf");
  };

  return (
    <div className="attendance-container">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">🏫 VIT</div>
        </div>
        <div className="navbar-right">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="print-button" onClick={generatePDF}>
            Print PDF
          </button>
        </div>
      </nav>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              {sortedSessions.map((session, index) => (
                <th key={index}>
                  {(() => {
                    const [rawDate, slot] = session.split(" | ");
                    return `${formatDate(rawDate)} | ${slot}`;
                  })()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ...new Set(attendanceData.map((entry) => entry.student_name)),
            ].map((student, idx) => (
              <tr key={idx}>
                <td>{student}</td>
                {sortedSessions.map((session, sidx) => {
                  const attendanceEntry = attendanceData.find(
                    (entry) =>
                      entry.student_name === student &&
                      `${entry.date} | ${entry.time_slot}` === session
                  );
                  return (
                    <td key={sidx}>
                      {attendanceEntry ? attendanceEntry.status : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
    
  );
};

export default AttendancePage;
