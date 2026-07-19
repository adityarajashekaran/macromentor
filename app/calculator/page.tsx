import type { Metadata } from "next"
import { CalculatorFlow } from "@/components/calculator/calculator-flow"

export const metadata: Metadata = {
  title: "Calculator — MacroMentor",
  description:
    "Three steps to your daily calories and macros. Tiered BMR formulas, TDEE from your real activity, goal-based targets with safety caps.",
}

export default function CalculatorPage() {
  return (
    <main className="container py-10 md:py-16">
      <CalculatorFlow />
    </main>
  )
}
