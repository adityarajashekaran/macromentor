import type React from "react"
import type { Metadata, Viewport } from "next"
import { Funnel_Display, Onest, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UnitsProvider } from "@/components/units-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/sonner"

const funnel = Funnel_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
})

const onest = Onest({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "MacroMentor — Calorie, Macro & TDEE Calculator",
  description:
    "Free calorie and macro calculator that shows its working. Picks the most accurate BMR formula for your data (Cunningham, Katch-McArdle, or Mifflin-St Jeor), calculates your TDEE from real activity, and sets protein, carb and fat targets with safety caps built in. No account, nothing stored.",
  keywords: [
    "macro calculator",
    "calorie calculator",
    "TDEE calculator",
    "BMR calculator",
    "macronutrient calculator",
    "cutting calories",
    "bulking calories",
  ],
  metadataBase: new URL("https://macromentor.horizonfall.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MacroMentor — know exactly how much to eat",
    description:
      "A calorie and macro calculator that picks the right formula for your body and shows every step of the math.",
    url: "https://macromentor.horizonfall.com",
    siteName: "MacroMentor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MacroMentor — know exactly how much to eat",
    description:
      "A calorie and macro calculator that picks the right formula for your body and shows every step of the math.",
  },
  verification: {
    google: "-P2osicZDIriMjkBGEfw4TioA8-QIZnhm7d3d03z_ns",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5eee0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b10" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${funnel.variable} ${onest.variable} ${jetbrainsMono.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UnitsProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </UnitsProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
