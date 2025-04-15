import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MotionProvider } from "@/components/animations/motion-context"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="macromentor-theme">
          <MotionProvider>
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'