import { useEffect, useState } from "react"
import API from "../api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Save, XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function AttendanceForm({ token, selected, onBack }) {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    API.get(`/students?classId=${selected.class_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setStudents(res.data)
        setAttendance(res.data.map((s) => ({ student_name: s.name, status: "" })))
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching students:", err)
        setLoading(false)
      })

    // Set today's date as default
    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]
    setDate(formattedDate)
  }, [selected.class_id, token])

  const handleCheck = (i, status) => {
    const updated = [...attendance]
    updated[i].status = status
    setAttendance(updated)
  }

  const handleSubmit = async () => {
    // Validate if all students have attendance marked
    const incomplete = attendance.some((a) => !a.status)
    if (incomplete) {
      alert("Please mark attendance for all students")
      return
    }

    // Validate date
    if (!date) {
      alert("Please select a date")
      return
    }

    setSubmitting(true)
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
      alert("Attendance submitted successfully!")
    } catch (err) {
      console.error("Error submitting attendance:", err)
      alert("Failed to submit attendance. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        {/* College Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center border border-primary/20 overflow-hidden">
            <img src="/placeholder.svg?height=48&width=48" alt="College Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-primary">College Name</h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-primary/20 text-primary"
          onClick={() => window.location.reload()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="bg-primary text-white">
          <CardTitle>Attendance</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {selected.class_name} - {selected.subject_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <Label htmlFor="date" className="block mb-2 font-medium">
              Select Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full max-w-xs border-primary/20"
            />
          </div>

          <Separator className="my-4 bg-primary/10" />

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Loading students...</div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No students found in this class</div>
          ) : (
            <div className="space-y-4">
              {students.map((student, i) => (
                <div key={i} className="p-4 border rounded-lg border-primary/20 hover:bg-primary/5">
                  <div className="font-medium mb-2 text-primary">{student.name}</div>
                  <RadioGroup className="flex gap-4" onValueChange={(value) => handleCheck(i, value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="present" id={`present-${i}`} className="text-primary border-primary/50" />
                      <Label htmlFor={`present-${i}`} className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Present
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="absent" id={`absent-${i}`} className="text-primary border-primary/50" />
                      <Label htmlFor={`absent-${i}`} className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Absent
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-primary/5 border-t border-primary/20">
          <Button
            onClick={handleSubmit}
            disabled={loading || submitting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {submitting ? "Submitting..." : "Submit Attendance"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}