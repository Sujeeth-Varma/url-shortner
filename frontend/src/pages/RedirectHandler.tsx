import { useEffect } from "react"
import { useParams } from "react-router"

export function RedirectHandler() {
  const { shortUrl } = useParams()

  useEffect(() => {
    if (shortUrl) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL 
        ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") 
        : "http://localhost:8080"
      window.location.href = `${backendUrl}/${shortUrl}`
    }
  }, [shortUrl])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <h2 className="text-2xl font-semibold tracking-tight">Redirecting...</h2>
        <p className="text-muted-foreground">Taking you to your destination</p>
      </div>
    </div>
  )
}
