import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
          macromentor<span className="text-primary">.</span>
        </Link>

        <nav className="flex items-center gap-3">
          <a
            href="https://horizonfall.com"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            a horizonfall project
          </a>
          <Link
            href="/calculator"
            className="eyebrow rounded-md border border-primary/40 px-4 py-2.5 text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Calculator
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
