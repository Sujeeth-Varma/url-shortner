import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { urlsApi } from "@/lib/api/urls"
import type { UrlMappingDto } from "@/lib/api/types"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format, subDays } from "date-fns"
import { AxiosError } from "axios"
import {
  DatePickerWithRange,
  type DateRange,
} from "@/components/ui/date-range-picker"
import { UrlList } from "@/components/dashboard/UrlList"

// 8 pleasing distinct colors for gradient lines
const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#ef4444", // red-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
]

export function GlobalAnalyticsPage() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const [allUrls, setAllUrls] = useState<UrlMappingDto[]>([])
  // We'll store data like [{ date: "2026-03-20", "url1": 5, "url2": 10 }, ...]
  const [chartData, setChartData] = useState<Record<string, string | number>[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange?.from || !dateRange?.to) return

      setLoading(true)
      setError(null)
      try {
        const fromIso = format(dateRange.from, "yyyy-MM-dd'T'HH:mm:ss")
        const toIso = format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss")

        // 1. Fetch URLs
        const userUrlsData = await urlsApi.getMyUrls()
        const urls = userUrlsData.response || []
        setAllUrls(urls)

        if (urls.length === 0) {
          setChartData([])
          setLoading(false)
          return
        }

        // 2. Fetch specific analytics for each URL
        const topUrls = [...urls]
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 8)

        // Let's cap at top 8 URLs to not clutter the chart too much.
        const analyticsPromises = topUrls.map((u) =>
          urlsApi.getAnalytics(u.shortUrl, fromIso, toIso)
        )

        const analyticsResults = await Promise.all(analyticsPromises)

        // 3. Aggregate into chart sequence
        // Date -> { date: dateStr, [url.shortUrl]: clicks }
        const mapByDate: Record<string, Record<string, string | number>> = {}

        topUrls.forEach((url, i) => {
          const events = analyticsResults[i].response || []
          events.forEach((ev) => {
            const d = ev.clickDate
            if (!mapByDate[d]) mapByDate[d] = { date: d }
            mapByDate[d][url.shortUrl] = ev.count
          })
        })

        const mappedData = Object.values(mapByDate).sort((a, b) =>
          String(a.date).localeCompare(String(b.date))
        )
        // Fill empty gaps with 0
        mappedData.forEach((dayRow) => {
          topUrls.forEach((u) => {
            if (dayRow[u.shortUrl] === undefined) {
              dayRow[u.shortUrl] = 0
            }
          })
        })

        setChartData(mappedData)
      } catch (err: unknown) {
        let errorMsg = "Failed to load global analytics"
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMsg = err.response.data.message
        }
        setError(errorMsg)
      } finally {
        ;<ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="currentColor"
                  className="text-primary"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="currentColor"
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
              labelFormatter={(val) => format(new Date(val), "MMM dd, yyyy")}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="currentColor"
              className="text-primary"
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  // Get the top URLs we are plotting
  const visibleUrlKeys = allUrls
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8)
    .map((u) => u.shortUrl)

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Global Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            Multi-line overview of your top performing short URLs.
          </p>
        </div>
        <div className="flex items-center">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      {loading && chartData.length === 0 && (
        <p className="text-sm text-muted-foreground">Loading chart data...</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && chartData.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Top URLs - Performance Over Time</CardTitle>
            <CardDescription>Number of visits per day</CardDescription>
          </CardHeader>
          <CardContent className="h-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  {visibleUrlKeys.map((key, idx) => (
                    <linearGradient
                      key={`grad-${key}`}
                      id={`color-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS[idx % COLORS.length]}
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS[idx % COLORS.length]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
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
                    borderRadius: "calc(var(--radius) - 2px)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                  labelFormatter={(val) =>
                    format(new Date(val), "MMM dd, yyyy")
                  }
                />

                {visibleUrlKeys.map((key, idx) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={`/${key}`}
                    stroke={COLORS[idx % COLORS.length]}
                    fill={`url(#color-${key})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {!loading && !error && allUrls.length > 0 && (
        <div className="pt-4">
          <UrlList
            onSelect={(shortUrl) =>
              navigate(`/dashboard/analytics/${shortUrl}`)
            }
            hideAnalyticsLink={false}
          />
        </div>
      )}
    </div>
  )
}
