

import { useState } from "react"
import Login from "./components/login"
import SubjectPanel from "./components/SubjectPanel"
import AttendanceForm from "./components/AttendanceForm"
import { ThemeProvider } from "./components/theme-provider"
import "./app/globals.css"

function App() {
  const [token, setToken] = useState("")
  const [teacher, setTeacher] = useState(null)
  const [selected, setSelected] = useState(null)

  return (
    <ThemeProvider defaultTheme="light" storageKey="attendance-theme">
      <div className="min-h-screen bg-slate-50">
        {!token ? (
          <Login setTeacher={setTeacher} setToken={setToken} />
        ) : !selected ? (
          <SubjectPanel token={token} setSelected={setSelected} />
        ) : (
          <AttendanceForm token={token} selected={selected} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App