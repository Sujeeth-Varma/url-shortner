import { useEffect, useState, useCallback } from "react"
import { urlsApi } from "@/lib/api/urls"
import type { UrlMappingDto } from "@/lib/api/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface UrlListProps {
  onSelect?: (shortUrl: string | null) => void
  selectedShortUrl?: string | null
  limit?: number
  hideAnalyticsLink?: boolean
}

export function UrlList({
  onSelect,
  selectedShortUrl,
  limit,
  hideAnalyticsLink,
}: UrlListProps) {
  const [urls, setUrls] = useState<UrlMappingDto[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true)
      const data = await urlsApi.getMyUrls()
      let sorted = [...(data.response || [])].sort((a, b) => b.id - a.id)
      if (limit) {
        sorted = sorted.slice(0, limit)
      }
      setUrls(sorted)
    } catch {
      toast.error("Failed to load URLs")
    } finally {
      setLoading(false)
    }
  }, [limit])

  const copyToClipboard = (shortUrl: string) => {
    const fullUrl = `${window.location.origin}/${shortUrl}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedUrl(shortUrl)
    toast.success("Copied to clipboard")
    setTimeout(() => {
      setCopiedUrl(null)
    }, 2000)
  }

  useEffect(() => {
    fetchUrls()
  }, [fetchUrls])

  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <CardTitle>My URLs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading URLs...
          </div>
        ) : urls.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No URLs found. Create one.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead className="text-right">Total Clicks</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow
                    key={url.id}
                    className={
                      selectedShortUrl === url.shortUrl ? "bg-muted/50" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <a
                          href={`${window.location.origin}/${url.shortUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          /{url.shortUrl}
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => copyToClipboard(url.shortUrl)}
                          title="Copy Link"
                        >
                          {copiedUrl === url.shortUrl ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span className="sr-only">Copy url</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell
                      className="max-w-50 truncate"
                      title={url.originalUrl}
                    >
                      {url.originalUrl}
                    </TableCell>
                    <TableCell className="text-right">{url.clicks}</TableCell>
                    <TableCell className="text-right">
                      {!hideAnalyticsLink && (
                        <Button
                          variant={
                            selectedShortUrl === url.shortUrl
                              ? "default"
                              : "ghost"
                          }
                          size="sm"
                          onClick={() => {
                            if (onSelect) {
                              onSelect(
                                selectedShortUrl === url.shortUrl
                                  ? null
                                  : url.shortUrl
                              )
                            }
                          }}
                        >
                          {selectedShortUrl === url.shortUrl
                            ? "Viewing"
                            : "Analytics"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
