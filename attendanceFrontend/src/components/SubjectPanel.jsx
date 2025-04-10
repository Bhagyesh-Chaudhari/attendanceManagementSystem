import { useEffect, useState } from "react"
import API from "../api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, LogOut } from "lucide-react"

export default function SubjectPanel({ token, setSelected }) {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    API.get("/subjects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setSubjects(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err)
        setLoading(false)
      })
  }, [token])

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-center mb-6">
        {/* College Logo */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center border border-primary/20 overflow-hidden">
            <img src="/placeholder.svg?height=48&width=48" alt="College Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-primary">College Name</h1>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="bg-primary text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Your Classes & Subjects</CardTitle>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary-foreground/10">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
          <CardDescription className="text-primary-foreground/80">
            Select a class and subject to take attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Loading subjects...</div>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No classes or subjects assigned to you</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subj) => (
                <Button
                  key={subj.subject_id}
                  variant="outline"
                  className="h-auto py-6 flex items-center justify-start gap-3 text-left border-primary/20 hover:bg-primary/5 hover:border-primary"
                  onClick={() => setSelected(subj)}
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{subj.class_name}</div>
                    <div className="text-sm text-muted-foreground">{subj.subject_name}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}