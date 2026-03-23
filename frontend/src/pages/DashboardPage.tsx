import { useState } from "react"
import { useNavigate } from "react-router"
import { CreateUrlForm } from "@/components/dashboard/CreateUrlForm"
import { UrlList } from "@/components/dashboard/UrlList"
import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics"
import { Separator } from "@/components/ui/separator"

export function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const navigate = useNavigate()

  const handleUrlCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your URLs and track their performance.
        </p>
      </div>

      <div className="grid cursor-default gap-8 md:grid-cols-12">
        <div className="space-y-8 md:col-span-4">
          <CreateUrlForm onCreated={handleUrlCreated} />
        </div>
        <div className="md:col-span-8">
          <UrlList
            key={`list-${refreshKey}`}
            onSelect={(shortUrl) =>
              navigate(`/dashboard/analytics/${shortUrl}`)
            }
            limit={3}
          />
        </div>
      </div>

      <Separator />

      <DashboardAnalytics />
    </div>
  )
}
