import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { urlsApi } from "@/lib/api/urls"
import type { UrlMappingDto, ClickEventDto } from "@/lib/api/types"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { AxiosError } from "axios"
import {
  DatePickerWithRange,
  type DateRange,
} from "@/components/ui/date-range-picker"

export function AnalyticsPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const navigate = useNavigate()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(subDays(new Date(), 2)),
    to: endOfDay(new Date()),
  })

  const [clicks, setClicks] = useState<ClickEventDto[]>([])
  const [urlDetails, setUrlDetails] = useState<UrlMappingDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!shortUrl || !dateRange?.from || !dateRange?.to) return

      setLoading(true)
      setError(null)
      try {
        const fromIso = format(dateRange.from, "yyyy-MM-dd'T'HH:mm:ss")
        const toIso = format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss")

        const [clicksData, urlsData] = await Promise.all([
          urlsApi.getAnalytics(shortUrl, fromIso, toIso),
          urlsApi.getMyUrls(), // Getting all to find the specific one for details
        ])

        setClicks(clicksData.response || []) // getAnalytics returns GenericResponse<ClickEventDto[]> probably wait
        const foundUrl = (urlsData.response || []).find(
          (u) => u.shortUrl === shortUrl
        )
        if (foundUrl) {
          setUrlDetails(foundUrl)
        }
      } catch (err: unknown) {
        let errorMsg = "Failed to load analytics"
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMsg = err.response.data.message
        }
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [shortUrl, dateRange])

  // Since the backend already groups clicks by date (ClickEventDto has clickDate and count):
  const chartData = clicks
    .map((c) => ({
      date: c.clickDate,
      clicks: c.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // We don't have browser or detailed recent clicks info in ClickEventDto
  // Just show total clicks for this timeframe
  const totalClicksThisPeriod = clicks.reduce((acc, c) => acc + c.count, 0)

  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/analytics")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Analytics for {shortUrl}
            </h1>
            <p className="text-muted-foreground">
              {urlDetails?.originalUrl || "Loading details..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      {loading && !clicks.length && <p>Loading analytics...</p>}
      {error && <p className="text-destructive">{error}</p>}

      {!loading && clicks.length === 0 && !error && (
        <Card className="shadow-md">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No clicks recorded for this date range.
          </CardContent>
        </Card>
      )}

      {clicks.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md md:col-span-2">
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>Number of visits per day</CardDescription>
            </CardHeader>
            <CardContent className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorClicks"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        className="text-primary"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        className="text-primary"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => format(new Date(val), "MMM dd")}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                    labelStyle={{ color: "var(--foreground)" }}
                    labelFormatter={(val) =>
                      format(new Date(val), "MMM dd, yyyy")
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    className="text-primary"
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">
                    Total Clicks this period
                  </span>
                  <span className="text-2xl font-bold">
                    {totalClicksThisPeriod}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
