import { useState } from "react"
import API from "../api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login({ setTeacher, setToken }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await API.post("/login", { email, password })
      setTeacher(res.data.teacher)
      setToken(res.data.token)
    } catch (err) {
      alert("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-primary/5">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="space-y-1 pb-2">
          {/* College Logo Placement */}
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center border-2 border-primary/20 overflow-hidden">
              {/* Replace with your actual logo */}
              <img src="/placeholder.svg?height=96&width=96" alt="College Logo" className="h-20 w-20 object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-primary">Attendance Management System</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Secure Teacher Attendance Management</p>
        </CardFooter>
      </Card>
    </div>
  )
}