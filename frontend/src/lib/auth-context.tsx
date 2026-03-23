import React, { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router"

interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("ClipLink_jwt")
  )
  const navigate = useNavigate()

  const login = (newToken: string) => {
    localStorage.setItem("ClipLink_jwt", newToken)
    setToken(newToken)
    navigate("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("ClipLink_jwt")
    setToken(null)
    navigate("/signin")
  }

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
