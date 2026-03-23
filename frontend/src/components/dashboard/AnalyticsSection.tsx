import { useEffect, useState, useCallback } from "react"
import { urlsApi } from "@/lib/api/urls"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface AnalyticsSectionProps {
  selectedShortUrl: string | null
}

export function AnalyticsSection({ selectedShortUrl }: AnalyticsSectionProps) {
  const [data, setData] = useState<{ date: string; clicks: number }[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const today = new Date()
      const pastMonth = new Date()
      pastMonth.setDate(today.getDate() - 30)

      const startDateStr = pastMonth.toISOString().split("T")[0]
      const endDateStr = today.toISOString().split("T")[0]

      if (selectedShortUrl) {
        const startDateTimeStr = pastMonth.toISOString().split(".")[0]
        const endDateTimeStr = today.toISOString().split(".")[0]

        const res = await urlsApi.getAnalytics(
          selectedShortUrl,
          startDateTimeStr,
          endDateTimeStr
        )
        if (res.response) {
          const formatted = res.response
            .map((event) => ({
              date: event.clickDate,
              clicks: event.count,
            }))
            .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
          setData(formatted)
        }
      } else {
        const res = await urlsApi.getTotalClicks(startDateStr, endDateStr)
        if (res.response) {
          const formatted = Object.entries(res.response)
            .map(([date, clicks]) => ({
              date,
              clicks,
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
          setData(formatted)
        }
      }
    } catch {
      toast.error("Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }, [selectedShortUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="py-6 text-sm text-muted-foreground">
        Loading analytics...
      </div>
    )
  }

  const chartConfig = {
    clicks: {
      label: "Clicks",
      color: "var(--chart-1)",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedShortUrl
            ? `Analytics for /${selectedShortUrl}`
            : "Total System Clicks (Last 30 Days)"}
        </CardTitle>
        <CardDescription>Views over the selected period</CardDescription>
      </CardHeader>
      <CardContent className="h-75">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No data available for this period.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
