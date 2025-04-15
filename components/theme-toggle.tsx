"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show the toggle after hydration to avoid SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" className="w-9 h-9 rounded-full" />
  }

  return (
    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full w-8 h-8 p-0 ${theme === "light" ? "bg-primary text-primary-foreground" : ""}`}
        onClick={() => setTheme("light")}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full w-8 h-8 p-0 ${theme === "dark" ? "bg-primary text-primary-foreground" : ""}`}
        onClick={() => setTheme("dark")}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark mode</span>
      </Button>

      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full w-8 h-8 p-0 ${theme === "system" ? "bg-primary text-primary-foreground" : ""}`}
        onClick={() => setTheme("system")}
        title="System mode"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">System preference</span>
      </Button>
    </div>
  )
}
