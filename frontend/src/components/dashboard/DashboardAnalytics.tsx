import { useState, useEffect } from "react"
import { urlsApi } from "@/lib/api/urls"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
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

export function DashboardAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const [data, setData] = useState<{ date: string; clicks: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange?.from || !dateRange?.to) return

      setLoading(true)
      setError(null)
      try {
        const fromIso = format(dateRange.from, "yyyy-MM-dd")
        const toIso = format(dateRange.to, "yyyy-MM-dd")

        const result = await urlsApi.getTotalClicks(fromIso, toIso)

        const clicksMap = result.response || {}
        const chartData = Object.entries(clicksMap)
          .map(([date, count]) => ({
            date,
            clicks: count,
          }))
          .sort((a, b) => a.date.localeCompare(b.date))

        setData(chartData)
      } catch (err: unknown) {
        let errorMsg = "Failed to load total clicks"
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMsg = err.response.data.message
        }
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const totalClicksThisPeriod = data.reduce((acc, c) => acc + c.clicks, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Total Clicks Overview
        </h2>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      {loading && !data.length && (
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && data.length === 0 && !error && (
        <Card className="shadow-md">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No clicks recorded for this date range.
          </CardContent>
        </Card>
      )}

      {data.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-md md:col-span-2">
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>
                Number of visits across all URLs per day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
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
                  <Bar
                    dataKey="clicks"
                    fill="currentColor"
                    className="fill-primary"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-muted-foreground">
                    Total Clicks (selected period)
                  </span>
                  <span className="text-4xl font-bold">
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
