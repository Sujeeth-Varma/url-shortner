import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, Link as LinkIcon, Zap } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="space-y-6 pt-6 pb-8 md:pt-8 md:pb-12 lg:py-24">
        <div className="container mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center">
          <div className="flex items-center justify-center p-4">
            <img
              src="/favicon.svg"
              alt="ClipLink Logo"
              className="h-16 w-16 drop-shadow-md"
            />
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>From long URLs to instant short links</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent drop-shadow-sm">
              Shorten links.
              <br /> Track every click.
            </span>
          </h1>
          <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            A fast, minimalistic URL shortener giving you exactly what you
            need—reliable links and clear analytics. No bloat.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild className="h-12 px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link to="/signin">Log In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature 1: Total Clicks */}
      <section className="container mx-auto max-w-6xl space-y-12 px-4 py-12 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              <BarChart3 className="mr-2 h-4 w-4" />
              Easy Dashboard
            </div>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Track your aggregate reach instantly
            </h2>
            <p className="text-lg text-muted-foreground">
              Monitor your total clicks across all your shortened links with our
              simple, clean dashboard. Set date ranges effortlessly and get
              immediate insights into your audience behavior.
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" /> Fast URL
                shortening creation
              </li>
              <li className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" /> Clear daily
                breakdown charts
              </li>
            </ul>
          </div>
          <div className="mx-auto flex w-full justify-center">
            <img
              src="/total-clicks.png"
              alt="Total Clicks Dashboard"
              className="rounded-xl border bg-muted shadow-2xl transition-all hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* Feature 2: Global Analytics */}
      <section className="w-full bg-muted/30 py-12 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-last mx-auto flex w-full justify-center lg:order-first">
              <img
                src="/global-analytics.png"
                alt="Global Analytics Interface"
                className="rounded-xl border bg-muted shadow-2xl transition-all hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg border bg-background px-3 py-1 text-sm font-medium">
                <LineChart className="mr-2 h-4 w-4" />
                Advanced Comparative Analytics
              </div>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Compare your top links visually
              </h2>
              <p className="text-lg text-muted-foreground">
                Our global analytics engine allows you to compare the
                performance of multiple URLs over time via beautiful, stacked
                area gradients. Discover your most successful campaigns
                instantly.
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5 text-primary" /> Overlay
                  multiple shortlinks
                </li>
                <li className="flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5 text-primary" /> Beautiful
                  dark mode compatibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
        <div className="mx-auto flex max-w-232 flex-col items-center justify-center space-y-4">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Start Shortening Today
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Join ClipLink to take control of your URLs, get comprehensive
            metrics, and deliver better user experiences.
          </p>
          <Button size="lg" asChild className="mt-4">
            <Link to="/signup">Create your first link</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
