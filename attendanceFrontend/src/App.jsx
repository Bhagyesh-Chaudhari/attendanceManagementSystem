"use client"

import { useState } from "react"
import { Login } from "./pages/login"
import { SubjectPanel } from "./pages/subject-panel"
import { AttendanceForm } from "./pages/attendance-form"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "./context/auth-context"

function App() {
  const [token, setToken] = useState("")
  const [teacher, setTeacher] = useState(null)
  const [selected, setSelected] = useState(null)

  const handleLogout = () => {
    setToken("")
    setTeacher(null)
    setSelected(null)
  }

  const handleBack = () => {
    setSelected(null)
  }

  return (
    <AuthProvider value={{ token, teacher, setToken, setTeacher, handleLogout }}>
      <div className="min-h-screen bg-background">
        {!token ? (
          <Login />
        ) : !selected ? (
          <SubjectPanel setSelected={setSelected} />
        ) : (
          <AttendanceForm selected={selected} onBack={handleBack} />
        )}
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App
