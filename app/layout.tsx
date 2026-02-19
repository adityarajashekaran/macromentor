import type React from "react"
import type { Metadata } from "next"
import { Outfit, DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MotionProvider } from "@/components/animations/motion-context"
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
})

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "MacroMentor - Advanced Nutrition Calculator",
  description: "Calculate your personalized calorie and macronutrient needs based on your body composition, activity level, and goals.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmSans.variable} font-body`}>
        <ThemeProvider defaultTheme="system" storageKey="macromentor-theme">
          <MotionProvider>
            {children}
          </MotionProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
