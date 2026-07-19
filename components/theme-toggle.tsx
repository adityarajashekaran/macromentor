"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/**
 * Single bordered square button, family style: toggles light/dark.
 * Renders a stable placeholder pre-hydration so there's no layout shift.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="h-[1.1rem] w-[1.1rem]" />
        ) : (
          <Moon className="h-[1.1rem] w-[1.1rem]" />
        )
      ) : (
        <span className="h-[1.1rem] w-[1.1rem]" />
      )}
    </button>
  )
}
