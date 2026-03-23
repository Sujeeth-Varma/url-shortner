import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { AuthProvider, useAuth } from "./lib/auth-context"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { SignupPage } from "@/pages/SignupPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { AnalyticsPage } from "@/pages/AnalyticsPage"
import { GlobalAnalyticsPage } from "@/pages/GlobalAnalyticsPage"
import { RedirectHandler } from "@/pages/RedirectHandler"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/layout/Header"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/signin" />
  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <GlobalAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytics/:shortUrl"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/:shortUrl" element={<RedirectHandler />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
