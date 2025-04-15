"use client"

import { useState } from "react"
import type React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Activity, Apple, CalculatorIcon as CalcIcon, Heart, Utensils, Loader2, ShieldAlert } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false)
  const router = useRouter()

  const handleGetStartedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDisclaimerOpen(true)
  }

  const handleDisclaimerContinue = () => {
    if (isChecked) {
      setIsLoading(true)
      setIsDisclaimerOpen(false)
      router.push('/calculator')
    }
  }

  const disclaimerText = "The information provided by MacroMentor is intended for informational purposes only and does not constitute medical advice. The calculations are based on established formulas but individual needs may vary. Always consult with a qualified healthcare professional or registered dietitian before making significant changes to your diet or exercise routine, especially if you have underlying health conditions."

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
            MacroMentor
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-12">
            Unlock your personalized nutrition plan. MacroMentor calculates your unique
            calorie and macronutrient needs based on metabolic science to guide your health journey.
          </p>
        </div>

        {/* How it Works Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-6">How MacroMentor Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-xl mb-3">1</div>
              <h3 className="font-medium mb-1">Tell Us About You</h3>
              <p className="text-sm text-muted-foreground">Input your details, activity levels, and health goals.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-xl mb-3">2</div>
              <h3 className="font-medium mb-1">Get Personalized Targets</h3>
              <p className="text-sm text-muted-foreground">Receive precise calorie and macronutrient recommendations.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-xl mb-3">3</div>
              <h3 className="font-medium mb-1">Understand Your Needs</h3>
              <p className="text-sm text-muted-foreground">Learn the science behind your personalized numbers.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-primary" />}
            title="Personalized Metabolism"
            description="Precise BMR & TDEE calculation using advanced formulas"
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
            title="Evidence-Based"
            description="Recommendations grounded in scientific research"
          />
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-16 mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 dark:from-primary dark:to-blue-400 dark:hover:from-primary/90 dark:hover:to-blue-400/90 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-75"
            disabled={isLoading}
            onClick={handleGetStartedClick}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Get Started with MacroMentor"
            )}
          </Button>

          <AlertDialog open={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-destructive" /> Important Disclaimer
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-left pt-2 max-h-[300px] overflow-y-auto">
                  {disclaimerText}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex items-center space-x-2 py-4">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={(checkedState) => setIsChecked(Boolean(checkedState))}
                />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I understand and agree to the disclaimer.
                </Label>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsChecked(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDisclaimerContinue}
                  disabled={!isChecked}
                >
                  Agree & Proceed
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
