import { useState } from "react"
import { urlsApi } from "@/lib/api/urls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { QRCodeSVG } from "qrcode.react"
import { CopyIcon, CheckIcon } from "lucide-react"

interface CreateUrlFormProps {
  onCreated: () => void
}

export function CreateUrlForm({ onCreated }: CreateUrlFormProps) {
  const [longUrl, setLongUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl) return

    setLoading(true)
    try {
      const resp = await urlsApi.createShortUrl({ longUrl })
      setGeneratedUrl(resp.response.shortUrl)
      toast.success("Short URL created successfully")
      setLongUrl("")
      onCreated()
    } catch (err: unknown) {
      let errorMsg = "Failed to create short URL"
      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedUrl) {
      const fullUrl = `${window.location.origin}/${generatedUrl}`
      navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Copied to clipboard")
    }
  }

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Create Short URL</CardTitle>
          <CardDescription>
            Paste your long URL below to shorten it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-url-form" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="longUrl" className="sr-only">
                  Long URL
                </FieldLabel>
                <Input
                  id="longUrl"
                  type="url"
                  required
                  placeholder="https://example.com/very/long/path"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  disabled={loading}
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            form="create-url-form"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog
        open={!!generatedUrl}
        onOpenChange={(open) => !open && setGeneratedUrl(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Short URL Created</DialogTitle>
            <DialogDescription>
              Your URL has been shortened successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {generatedUrl && (
              <QRCodeSVG
                value={`${window.location.origin}/${generatedUrl}`}
                size={160}
                className="rounded-lg bg-white p-2"
              />
            )}
            <div className="flex w-full items-center space-x-2">
              <Input
                readOnly
                value={`${window.location.origin}/${generatedUrl}`}
                className="flex-1"
              />
              <Button size="icon" onClick={copyToClipboard} variant="outline">
                {copied ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
