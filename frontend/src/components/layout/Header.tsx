import { Link } from "react-router"
import { useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header() {
  const { isAuthenticated, logout, token } = useAuth()

  const userPayload = useMemo(() => {
    if (!token) return null
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")

      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c: string) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join("")
      )

      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  }, [token])

  const username = userPayload?.sub || "User"
  const initials = username.substring(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <div className="mr-4 flex">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="mr-6 flex items-center space-x-2"
          >
            <img src="/favicon.svg" alt="ClipLink Logo" className="h-6 w-6" />
            <span className="font-bold sm:inline-block">ClipLink</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/analytics">Analytics</Link>
                </Button>
                <div className="mx-2 max-h-9">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer border border-border">
                        <AvatarFallback className="bg-primary/20 font-medium text-primary transition-colors hover:bg-primary/30">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end" className="mt-1">
                      <p className="font-medium">{username}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button variant="outline" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/signin">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
