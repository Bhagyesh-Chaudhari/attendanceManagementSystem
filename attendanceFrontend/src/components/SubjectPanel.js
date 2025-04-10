"use client"

import { useEffect, useState } from "react"
import API from "../api"
import "../styles/SubjectPanel.css"

function SubjectPanel({ token, setSelected }) {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get("/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSubjects(res.data)
      } catch (err) {
        setError("Failed to load subjects. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [token])

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
              <div key={subj.subject_id} className="subject-card" onClick={() => setSelected(subj)}>
                <h3>{subj.class_name}</h3>
                <p>{subj.subject_name}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SubjectPanel
