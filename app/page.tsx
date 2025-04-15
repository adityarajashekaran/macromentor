"use client"

import { useState, Suspense } from "react"
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
import dynamic from 'next/dynamic'
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation"
import { getPerformanceConfig } from "@/lib/performance"
import { Skeleton } from "@/components/ui/skeleton"
// Import spacing components
import { Container, Section, Stack, Row, Spacer, Grid } from "@/components/spacing-system"

// Dynamically import animation components with code splitting
const AnimatedGradientBackground = dynamic(
  () => import('@/components/animations/animated-gradient-background').then(mod => mod.AnimatedGradientBackground),
  { 
    ssr: false,
    loading: () => <div className="min-h-screen bg-background/80" />
  }
)

const AnimatedText = dynamic(
  () => import('@/components/animations/animated-text').then(mod => mod.AnimatedText),
  { 
    ssr: false,
    loading: () => <div className="h-8 w-full" />
  }
)

const NutritionCalculatorIllustration = dynamic(
  () => import('@/components/animations/nutrition-calculator-illustration').then(mod => mod.NutritionCalculatorIllustration),
  { 
    ssr: false,
    loading: () => <div className="h-48 w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/40" /></div>
  }
)

const AnimatedFeatureCard = dynamic(
  () => import('@/components/animations/animated-feature-card').then(mod => mod.AnimatedFeatureCard),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-40 w-full" />
  }
)

const ScienceBadge = dynamic(
  () => import('@/components/animations/science-badge').then(mod => mod.ScienceBadge),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-6 w-32 rounded-full mx-auto" />
  }
)

const ScrollIndicator = dynamic(
  () => import('@/components/animations/scroll-indicator').then(mod => mod.ScrollIndicator),
  { 
    ssr: false 
  }
)

const StickyCTA = dynamic(
  () => import('@/components/sticky-cta').then(mod => mod.StickyCTA),
  { 
    ssr: false 
  }
)

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false)
  const router = useRouter()
  
  // Initialize optimized animation hook
  const { 
    OptimizedAnimationProvider,
    trackAnimation,
    performanceConfig
  } = useOptimizedAnimation()
  
  // Track the page animations
  const pageAnimations = trackAnimation('home-page-animations')

  // Start tracking animations when component mounts
  pageAnimations.start()

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

  // Features data
  const features = [
    {
      icon: <Activity className="h-8 w-8 text-primary" />,
      title: "Precision Metabolism",
      description: "Get exact calorie targets based on your unique metabolic rate"
    },
    {
      icon: <Utensils className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
      title: "Optimal Macro Balance",
      description: "Perfect protein, carbs and fat ratios for your specific goals"
    },
    {
      icon: <Apple className="h-8 w-8 text-green-500 dark:text-green-400" />,
      title: "Complete Nutrition",
      description: "Essential vitamins and minerals to fuel your performance"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500 dark:text-red-400" />,
      title: "Science-Backed Results",
      description: "Research-validated formulas trusted by nutrition experts"
    }
  ];

  return (
    <OptimizedAnimationProvider>
      <Suspense fallback={<div className="min-h-screen bg-background/80 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary/40" /></div>}>
        <AnimatedGradientBackground className="min-h-screen">
          <Container>
            <Row justify="end">
              <ThemeToggle />
            </Row>
            <Spacer size="4" />

            {/* Hero Section */}
            <Section className="text-center" spacing="md">
              <Stack spacing="6">
                <AnimatedText 
                  text="Transform Your Body with Precision Nutrition" 
                  as="h1"
                  className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent leading-tight"
                  staggerChildren={performanceConfig?.animationComplexity !== 'minimal'}
                />
                
                <div className="flex justify-center mt-4 mb-4">
                  <ScienceBadge text="Backed by Nutrition Science" />
                </div>

                <AnimatedText 
                  text="MacroMentor delivers your exact calorie and macro needs in seconds. Stop guessing, start progressing."
                  as="p"
                  className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto px-2 mb-6"
                  delay={0.3}
                  staggerChildren={false}
                />
                
                <div className="mt-4 mb-8">
                  <NutritionCalculatorIllustration />
                </div>

                <Stack spacing="4">
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      className="w-full sm:max-w-md mx-auto px-8 py-6 sm:py-4 text-base md:text-lg bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 dark:from-primary dark:to-blue-400 dark:hover:from-primary/90 dark:hover:to-blue-400/90 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-75"
                      disabled={isLoading}
                      onClick={handleGetStartedClick}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Calculate Your Perfect Macros"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Free, instant results. No account required.</p>
                </Stack>
                
                <div className="mt-4">
                  <ScrollIndicator />
                </div>
              </Stack>
            </Section>

            {/* Features Section */}
            <Section spacing="xl">
              <Grid cols="4" gap="6">
                {features.map((feature, index) => (
                  <AnimatedFeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    index={index}
                  />
                ))}
              </Grid>
            </Section>
            
            {/* Sticky CTA Button - Enhanced for mobile */}
            <StickyCTA 
              text="Get Your Custom Plan" 
              onClick={handleGetStartedClick} 
              scrollThreshold={300} // Show earlier on mobile
            />
          </Container>
          
          {/* Disclaimer Dialog - Enhanced for better mobile reading */}
          <AlertDialog open={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen}>
            <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  Important Disclaimer
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left mt-2 text-foreground/90">
                  {disclaimerText}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex items-start space-x-2 my-4">
                <Checkbox 
                  id="disclaimer-check" 
                  checked={isChecked} 
                  onCheckedChange={(checked) => setIsChecked(checked as boolean)} 
                  className="mt-1" 
                />
                <Label htmlFor="disclaimer-check" className="text-sm font-normal leading-snug">
                  I understand that the information provided is for educational purposes only and not a substitute for professional advice.
                </Label>
              </div>
              <AlertDialogFooter className="sm:justify-between">
                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDisclaimerContinue} 
                  disabled={!isChecked}
                  className={!isChecked ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </AnimatedGradientBackground>
      </Suspense>
    </OptimizedAnimationProvider>
  )
}
