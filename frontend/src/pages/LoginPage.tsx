import { useState } from "react"
import { Link } from "react-router"
import { useAuth } from "@/lib/auth-context"
import { authApi } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { AxiosError } from "axios"

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { token } = await authApi.signin({ username, password })
      toast.success("Logged in successfully")
      login(token)
    } catch (err: unknown) {
      let errorMsg = "Login failed"
      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err instanceof AxiosError && err.response?.status === 401) {
        errorMsg = "Invalid credentials"
      }
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Log in to ClipLink
          </CardTitle>
          <CardDescription>
            Enter your username and password below to log in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            form="login-form"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
