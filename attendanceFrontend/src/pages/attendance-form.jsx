"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import API from "@/services/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon, Check, Loader2, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function AttendanceForm({ selected, onBack }) {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [date, setDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

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
        toast({
          variant: "destructive",
          title: "Failed to load students",
          description: "There was an error loading the student list. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [selected, token, toast])

  const handleCheck = (i, status) => {
    const updated = [...attendance]
    updated[i].status = status
    setAttendance(updated)
  }

  const handleSubmit = async () => {
    // Validate that all students have a status
    const incomplete = attendance.some((a) => !a.status)
    if (incomplete) {
      toast({
        variant: "destructive",
        title: "Incomplete attendance",
        description: "Please mark all students as present or absent.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await API.post(
        "/attendance",
        {
          classId: selected.class_id,
          subjectId: selected.subject_id,
          attendanceList: attendance,
          date: format(date, "yyyy-MM-dd"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      toast({
        title: "Attendance submitted",
        description: `Attendance for ${format(date, "MMMM d, yyyy")} has been recorded.`,
      })

      // Go back to subject selection
      onBack()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting the attendance. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button variant="ghost" size="sm" className="mb-6" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Subjects
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Attendance</CardTitle>
          <CardDescription>
            {selected.class_name} - {selected.subject_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Select Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allPresent = [...attendance].map((a) => ({ ...a, status: "present" }))
                  setAttendance(allPresent)
                }}
              >
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allAbsent = [...attendance].map((a) => ({ ...a, status: "absent" }))
                  setAttendance(allAbsent)
                }}
              >
                Mark All Absent
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <Skeleton className="h-5 w-[200px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No students found</h3>
              <p className="text-muted-foreground mt-1">There are no students assigned to this class.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={attendance[i]?.status === "present" ? "default" : "outline"}
                          className={cn(
                            "w-24",
                            attendance[i]?.status === "present" && "bg-green-600 hover:bg-green-700",
                          )}
                          onClick={() => handleCheck(i, "present")}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[i]?.status === "absent" ? "default" : "outline"}
                          className={cn("w-24", attendance[i]?.status === "absent" && "bg-red-600 hover:bg-red-700")}
                          onClick={() => handleCheck(i, "absent")}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Absent
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Attendance
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
