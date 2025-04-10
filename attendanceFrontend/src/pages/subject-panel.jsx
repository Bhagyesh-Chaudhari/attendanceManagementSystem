"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import API from "@/services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { BookOpen, LogOut, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function SubjectPanel({ setSelected }) {
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { token, teacher, handleLogout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get("/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSubjects(res.data)
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to load subjects",
          description: "There was an error loading your subjects. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [token, toast])

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{teacher?.name || "Teacher"}</h2>
            <p className="text-sm text-muted-foreground">{teacher?.email || "teacher@school.edu"}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Classes & Subjects</CardTitle>
          <CardDescription>Select a class and subject to take attendance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No subjects assigned</h3>
              <p className="text-muted-foreground mt-1">You don't have any classes or subjects assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subj) => (
                <Button
                  key={subj.subject_id}
                  variant="outline"
                  className="h-auto p-4 justify-start flex-col items-start text-left"
                  onClick={() => setSelected(subj)}
                >
                  <div className="font-medium">{subj.class_name}</div>
                  <div className="text-sm text-muted-foreground">{subj.subject_name}</div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
