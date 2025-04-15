import type React from "react"
import { Calculator } from "@/components/calculator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Activity, Apple, CalculatorIcon as CalcIcon, Heart, Utensils } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container px-4 mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <CalcIcon className="h-6 w-6 text-primary mr-2" />
            <span className="font-medium text-primary">Advanced Nutrition Calculator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent">
            NutriTrack Pro
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Advanced nutrition calculator powered by cutting-edge metabolic science. Get personalized recommendations
            tailored to your unique profile.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-primary" />}
            title="Metabolic Rate"
            description="Precise BMR calculation using advanced formulas"
          />
          <FeatureCard
            icon={<Utensils className="h-8 w-8 text-blue-500 dark:text-blue-400" />}
            title="Macro Balance"
            description="Optimal protein, carbs and fat distribution"
          />
          <FeatureCard
            icon={<Apple className="h-8 w-8 text-green-500 dark:text-green-400" />}
            title="Micronutrients"
            description="Essential vitamins and minerals guidance"
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-red-500 dark:text-red-400" />}
            title="Health Focused"
            description="Evidence-based recommendations"
          />
        </div>

        <Calculator />
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3">{icon}</div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
