"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { ArrowRight, HelpCircle, CheckCircle2, Activity, Target, Settings, User, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Import both default and named export to ensure compatibility
import ResultsDisplay from "@/components/results-display"

const formSchema = z.object({
  // Step 1: Basic Information
  sex: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(15).max(100),
  height: z.coerce.number().min(120).max(250),
  weight: z.coerce.number().min(30).max(300),

  // Step 2: Body Composition & Activity
  bodyFat: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(3).max(60).optional()
  ),
  hasBodyFat: z.boolean().default(false),
  activityLevel: z.enum(["sedentary", "light", "moderate", "very", "extra"]),
  exerciseFrequency: z.enum(["none", "light", "moderate", "intense"]).optional(),
  trainingExperience: z.enum(["none", "beginner", "intermediate", "advanced"]).optional(),

  // Step 3: Goals
  goal: z.enum([
    "lose_fat",
    "build_muscle",
    "maintain",
    "clean_bulk",
    "aggressive_bulk",
    "gain_weight",
    "improve_health",
    "recomposition",
  ]),
  targetWeight: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(30).max(300).optional()
  ),
  weightLossRate: z.enum(["slow", "moderate", "fast"]).optional(),
  weightGainRate: z.enum(["slow", "moderate"]).optional(),

  // Step 4: Advanced Options
  dietType: z.enum(["standard", "vegetarian", "vegan"]).default("standard"),
  ethnicity: z
    .enum([
      "default",
      "caucasian",
      "african",
      "east_asian",
      "south_asian",
      "hispanic",
      "indigenous",
      "nordic",
      "middle_eastern",
      "mixed",
    ])
    .default("default"),
  hasNeckWaist: z.boolean().default(false),
  neckCircumference: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(20).max(80).optional()
  ),
  waistCircumference: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(50).max(200).optional()
  ),
})

type CalculatorFormValues = z.infer<typeof formSchema>

// Animation variants for form transitions
const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
}

// Step icons and titles
const stepInfo = [
  { icon: <User className="h-5 w-5" />, title: "Basic Information", description: "Tell us about yourself" },
  { icon: <Activity className="h-5 w-5" />, title: "Activity Level", description: "Your daily movement" },
  { icon: <Target className="h-5 w-5" />, title: "Goals", description: "What you want to achieve" },
  { icon: <Settings className="h-5 w-5" />, title: "Advanced", description: "Fine-tune your plan" },
]

const stepFields: Record<number, (keyof CalculatorFormValues)[]> = {
  1: ["sex", "age", "height", "weight"],
  2: ["activityLevel", "hasBodyFat", "bodyFat", "exerciseFrequency", "trainingExperience"],
  3: ["goal", "targetWeight", "weightLossRate", "weightGainRate"],
  4: ["dietType", "ethnicity", "hasNeckWaist", "neckCircumference", "waistCircumference"],
}

export function Calculator() {
  console.log("Calculator component rendering")

  const [step, setStep] = useState(1)
  const [results, setResults] = useState<any>(null)
  const [ethnicityAdjustmentApplied, setEthnicityAdjustmentApplied] = useState(false)
  const totalSteps = 4

  // Check if ResultsDisplay is available
  useEffect(() => {
    console.log("ResultsDisplay component available:", typeof ResultsDisplay)
  }, [])

  const defaultValues: Partial<CalculatorFormValues> = {
    bodyFat: undefined,
    hasBodyFat: false,
    exerciseFrequency: "none",
    trainingExperience: "none",
    targetWeight: undefined,
    weightLossRate: "moderate",
    weightGainRate: "slow",
    dietType: "standard",
    ethnicity: "default",
    hasNeckWaist: false,
    neckCircumference: undefined,
    waistCircumference: undefined,
  }

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver<CalculatorFormValues>(formSchema),
    defaultValues,
    mode: "onChange",
  })

  const watchHasBodyFat = form.watch("hasBodyFat")
  const watchGoal = form.watch("goal")
  const watchHasNeckWaist = form.watch("hasNeckWaist")

  async function nextStep() {
    const fieldsToValidate = stepFields[step]
    // Trigger validation for fields in the current step
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid && step < totalSteps) {
      setStep(step + 1)
    }
     // If not valid, errors will be displayed automatically by FormMessage components
  }

  function prevStep() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const onSubmit: SubmitHandler<CalculatorFormValues> = (data) => {
    console.log("Form submitted with data:", data)

    // Reset ethnicity adjustment flag
    setEthnicityAdjustmentApplied(false)

    // Calculate BMR based on available data using tiered approach
    let bmr = 0
    let bmrMethod = ""
    let lbm = 0

    // Calculate BMI for potential use
    const heightInMeters = data.height / 100
    const bmi = data.weight / (heightInMeters * heightInMeters)

    // Calculate Lean Body Mass if body fat % is provided
    if (data.hasBodyFat && data.bodyFat !== undefined) {
      lbm = data.weight * (1 - data.bodyFat / 100)

      // Tier 1: Body Fat % + Training Experience (Cunningham Equation)
      if (data.trainingExperience && ["intermediate", "advanced"].includes(data.trainingExperience)) {
        bmr = 500 + 22 * lbm
        bmrMethod = "Cunningham Equation (optimized for trained individuals with known body composition)"
      }
      // Tier 2: Body Fat % provided (Katch-McArdle)
      else {
        // Check if East Asian and use Singapore Equation if applicable
        if (data.ethnicity === "east_asian") {
          if (data.sex === "male") {
            bmr = bmi < 27.5 ? 12.1 * data.weight + 708 : 14.3 * data.weight + 508
          } else if (data.sex === "female") {
            bmr = bmi < 27.5 ? 10.6 * data.weight + 590 : 10.8 * data.weight + 601
          } else {
            // Default to Katch-McArdle for non-binary with East Asian ethnicity
            bmr = 370 + 21.6 * lbm
          }
          bmrMethod = "Singapore Equation (optimized for East Asian populations)"
        } else {
          // Standard Katch-McArdle
          bmr = 370 + 21.6 * lbm
          bmrMethod = "Katch-McArdle Equation (based on lean body mass)"
        }
      }
    }
    // Tier 3: No Body Fat % (Mifflin-St Jeor with potential ethnic adjustments)
    else {
      // Calculate base Mifflin-St Jeor BMR
      if (data.sex === "male") {
        bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
      } else if (data.sex === "female") {
        bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161
      } else {
        // Gender-neutral approach for non-binary
        bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 78
      }

      bmrMethod = "Mifflin-St Jeor Equation"

      // Apply evidence-based ethnic adjustments if ethnicity is provided
      // Only apply if body fat % is NOT provided (Tier 3 only)
      if (data.ethnicity !== "default" && data.ethnicity !== "mixed") {
        let ethnicityAdjustment = 1.0 // Default: no adjustment

        switch (data.ethnicity) {
          case "african":
            ethnicityAdjustment = 0.95 // -5%
            break
          case "east_asian":
          case "south_asian":
            ethnicityAdjustment = 0.96 // -4%
            break
          case "indigenous":
            ethnicityAdjustment = 1.07 // +7%
            break
          case "caucasian":
          case "hispanic":
          case "nordic":
          case "middle_eastern":
            ethnicityAdjustment = 1.0 // No adjustment
            break
        }

        // Apply the adjustment
        if (ethnicityAdjustment !== 1.0) {
          bmr = bmr * ethnicityAdjustment
          setEthnicityAdjustmentApplied(true)
          bmrMethod += ` with population-based adjustment (${ethnicityAdjustment > 1 ? "+" : ""}${((ethnicityAdjustment - 1) * 100).toFixed(0)}%)`
        }
      }

      // Age adjustment for those over 40
      if (data.age > 40) {
        const decadesOver40 = Math.floor((data.age - 40) / 10)
        const ageAdjustment = 1 - 0.01 * decadesOver40
        bmr = bmr * ageAdjustment
        bmrMethod += ` with age adjustment (-${decadesOver40}%)`
      }
    }

    // Round BMR to nearest whole number
    bmr = Math.round(bmr)

    // Calculate TDEE based on activity level
    let activityMultiplier = 1.2 // Default sedentary

    // Refined activity multipliers
    switch (data.activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2
        break
      case "light":
        activityMultiplier = 1.375
        break
      case "moderate":
        activityMultiplier = 1.55
        break
      case "very":
        activityMultiplier = 1.725
        break
      case "extra":
        activityMultiplier = 1.9
        break
    }

    // Additional adjustment for exercise frequency
    if (data.exerciseFrequency) {
      switch (data.exerciseFrequency) {
        case "light":
          activityMultiplier += 0.05
          break
        case "moderate":
          activityMultiplier += 0.1
          break
        case "intense":
          activityMultiplier += 0.15
          break
      }
    }

    // Calculate TDEE
    const tdee = Math.round(bmr * activityMultiplier)

    // Calculate calorie target based on goal
    let calorieTarget = tdee
    let deficitSurplus = 0
    let proteinTarget = 0
    let fatTarget = 0
    let carbTarget = 0
    let goalDescription = ""

    switch (data.goal) {
      case "lose_fat":
        let deficitPercentage = 0.15 // Default moderate

        if (data.weightLossRate === "slow") {
          deficitPercentage = 0.1 // 10% deficit
          goalDescription = "Slow fat loss (~0.5% of body weight per week)"
        } else if (data.weightLossRate === "moderate") {
          deficitPercentage = 0.15 // 15% deficit
          goalDescription = "Moderate fat loss (~0.75% of body weight per week)"
        } else if (data.weightLossRate === "fast") {
          deficitPercentage = 0.2 // 20% deficit
          goalDescription = "Fast fat loss (~1% of body weight per week)"
        }

        // Cap deficit for lean individuals
        if (data.hasBodyFat && data.bodyFat !== undefined) {
          if ((data.sex === "male" && data.bodyFat < 15) || (data.sex === "female" && data.bodyFat < 22)) {
            deficitPercentage = Math.min(deficitPercentage, 0.15)
            goalDescription += " (deficit capped to protect lean mass)"
          }

          // Allow larger deficit for higher body fat
          if ((data.sex === "male" && data.bodyFat > 30) || (data.sex === "female" && data.bodyFat > 35)) {
            deficitPercentage = Math.min(deficitPercentage * 1.25, 0.25) // Cap at 25% max
            goalDescription += " (slightly higher deficit based on body fat levels)"
          }
        }

        calorieTarget = Math.round(tdee * (1 - deficitPercentage))
        deficitSurplus = -Math.round(tdee * deficitPercentage)

        // Higher protein for fat loss
        proteinTarget = Math.round(data.weight * 2.2) // 2.2g per kg
        break

      case "build_muscle":
        let surplusPercentage = 0.1 // Default 10%

        if (data.trainingExperience === "beginner") {
          surplusPercentage = 0.15 // 15% for beginners
          goalDescription = "Muscle building for beginners (higher surplus to maximize gains)"
        } else if (data.trainingExperience === "intermediate") {
          surplusPercentage = 0.1 // 10% for intermediate
          goalDescription = "Muscle building for intermediate lifters (moderate surplus)"
        } else if (data.trainingExperience === "advanced") {
          surplusPercentage = 0.05 // 5% for advanced
          goalDescription = "Muscle building for advanced lifters (minimal surplus to limit fat gain)"
        } else {
          goalDescription = "General muscle building (moderate surplus)"
        }

        calorieTarget = Math.round(tdee * (1 + surplusPercentage))
        deficitSurplus = Math.round(tdee * surplusPercentage)

        // Protein for muscle building
        proteinTarget = Math.round(data.weight * 1.8) // 1.8g per kg
        break

      case "maintain":
        calorieTarget = tdee
        deficitSurplus = 0
        goalDescription = "Weight maintenance (energy balance)"

        // Moderate protein for maintenance
        proteinTarget = Math.round(data.weight * 1.6) // 1.6g per kg
        break

      case "clean_bulk":
        calorieTarget = Math.round(tdee * 1.1) // 10% surplus
        deficitSurplus = Math.round(tdee * 0.1)
        goalDescription = "Clean bulk (moderate surplus to minimize fat gain)"

        // Protein for clean bulk
        proteinTarget = Math.round(data.weight * 1.8) // 1.8g per kg
        break

      case "aggressive_bulk":
        calorieTarget = Math.round(tdee * 1.15) // 15% surplus
        deficitSurplus = Math.round(tdee * 0.15)
        goalDescription = "Aggressive bulk (higher surplus for maximum gains)"

        // Protein for aggressive bulk
        proteinTarget = Math.round(data.weight * 1.8) // 1.8g per kg
        break

      case "gain_weight":
        let gainSurplus = 0.1 // Default 10%
        if (data.weightGainRate === "moderate") {
          gainSurplus = 0.15 // 15% for moderate
          goalDescription = "Moderate weight gain (~0.5kg per week)"
        } else {
          goalDescription = "Slow weight gain (~0.25kg per week)"
        }

        calorieTarget = Math.round(tdee * (1 + gainSurplus))
        deficitSurplus = Math.round(tdee * gainSurplus)

        // Moderate protein for weight gain
        proteinTarget = Math.round(data.weight * 1.6) // 1.6g per kg
        break

      case "improve_health":
        // Slight deficit if overweight, otherwise maintenance
        const isOverweight = bmi > 25

        if (isOverweight) {
          calorieTarget = Math.round(tdee * 0.9) // 10% deficit
          deficitSurplus = -Math.round(tdee * 0.1)
          goalDescription = "Health improvement with gentle weight loss"
        } else {
          calorieTarget = tdee
          deficitSurplus = 0
          goalDescription = "Health improvement at maintenance calories"
        }

        // Moderate protein for health
        proteinTarget = Math.round(data.weight * 1.6) // 1.6g per kg
        break

      case "recomposition":
        // Slight deficit with high protein
        calorieTarget = Math.round(tdee * 0.95) // 5% deficit
        deficitSurplus = -Math.round(tdee * 0.05)
        goalDescription = "Body recomposition (slight deficit with high protein)"

        // High protein for recomposition
        proteinTarget = Math.round(data.weight * 2.4) // 2.4g per kg
        break
    }

    // Adjust protein for diet type
    if (data.dietType === "vegetarian") {
      proteinTarget = Math.round(proteinTarget * 1.1) // 10% more for vegetarians
    } else if (data.dietType === "vegan") {
      proteinTarget = Math.round(proteinTarget * 1.2) // 20% more for vegans
    }

    // Adjust protein for age (seniors)
    if (data.age > 65) {
      proteinTarget = Math.max(proteinTarget, Math.round(data.weight * 1.6)) // Minimum 1.6g/kg for seniors
    }

    // Calculate fat target (% of calories)
    let fatPercentage = 0.3 // Default 30%

    // Adjust fat percentage based on goal
    if (data.goal === "lose_fat" || data.goal === "recomposition") {
      fatPercentage = 0.35 // Higher fat for satiety during cutting
    } else if (data.goal === "build_muscle" || data.goal === "clean_bulk" || data.goal === "aggressive_bulk") {
      fatPercentage = 0.25 // Lower fat for bulking to allow more carbs
    }

    // Calculate fat in grams
    const fatCalories = calorieTarget * fatPercentage
    fatTarget = Math.round(fatCalories / 9)

    // Ensure minimum fat intake (0.6g/kg)
    const minFat = Math.round(data.weight * 0.6)
    if (fatTarget < minFat) {
      fatTarget = minFat
      // Recalculate fat calories
      const newFatCalories = fatTarget * 9
      fatPercentage = newFatCalories / calorieTarget
    }

    // Calculate protein calories
    const proteinCalories = proteinTarget * 4

    // Calculate remaining calories for carbs
    const carbCalories = calorieTarget - proteinCalories - fatTarget * 9
    carbTarget = Math.round(carbCalories / 4)

    // Ensure minimum carbs (at least 50g)
    if (carbTarget < 50) {
      carbTarget = 50
      // Recalculate calories
      calorieTarget = proteinCalories + fatTarget * 9 + carbTarget * 4
    }

    // Calculate macronutrient percentages
    const proteinPercentage = Math.round((proteinCalories / calorieTarget) * 100)
    const fatPercentage2 = Math.round(((fatTarget * 9) / calorieTarget) * 100)
    const carbPercentage = Math.round((carbCalories / calorieTarget) * 100)

    // Safety check for minimum calories
    const minCalories = data.sex === "female" ? 1200 : 1500
    const belowMinimum = calorieTarget < minCalories

    if (belowMinimum) {
      calorieTarget = minCalories
      // Recalculate macros with fixed ratios
      proteinTarget = Math.round(((proteinPercentage / 100) * calorieTarget) / 4)
      fatTarget = Math.round(((fatPercentage2 / 100) * calorieTarget) / 9)
      carbTarget = Math.round(((carbPercentage / 100) * calorieTarget) / 4)
    }

    // Prepare micronutrient recommendations
    const micronutrients = {
      iron: data.sex === "female" && data.age < 50 ? 18 : 8,
      calcium: data.age < 25 || data.age > 50 ? 1200 : 1000,
      vitaminD: data.age > 65 || bmi > 30 ? 1000 : 800,
      omega3: 500,
      fiber: Math.round(14 * (calorieTarget / 1000)), // 14g per 1000 calories
    }

    // Adjust for special cases
    if (data.hasNeckWaist && data.waistCircumference) {
      const highWaist =
        (data.sex === "male" && data.waistCircumference > 102) ||
        (data.sex === "female" && data.waistCircumference > 88)

      if (highWaist) {
        micronutrients.omega3 = 2000 // Higher omega-3 for high visceral fat
      }
    }

    // Check for refeed recommendation
    const refeedRecommended = data.goal === "lose_fat" && calorieTarget / tdee < 0.8

    // Prepare results object
    const resultsData = {
      bmr,
      bmrMethod,
      tdee,
      calorieTarget,
      deficitSurplus,
      goalDescription,
      userProfile: {
        age: data.age,
        sex: data.sex,
        height: data.height,
        weight: data.weight,
        bodyFat: data.hasBodyFat ? data.bodyFat : undefined,
        activityLevel: data.activityLevel,
        goal: data.goal,
        dietType: data.dietType,
      },
      macros: {
        protein: {
          grams: proteinTarget,
          calories: proteinTarget * 4,
          percentage: proteinPercentage,
        },
        fat: {
          grams: fatTarget,
          calories: fatTarget * 9,
          percentage: fatPercentage2,
        },
        carbs: {
          grams: carbTarget,
          calories: carbTarget * 4,
          percentage: carbPercentage,
        },
      },
      micronutrients,
      warnings: {
        belowMinimum,
        refeedRecommended,
        ethnicityAdjustmentApplied,
      },
      metrics: {
        bmi,
        lbm: data.hasBodyFat && data.bodyFat !== undefined ? lbm : undefined,
      },
    }

    console.log("Calculation results:", resultsData)
    setResults(resultsData)
    setStep(totalSteps + 1) // Move to results step
  }

  // Helper component for inline Info displays (using Popover for click/tap)
  const InfoTooltip = ({ content }: { content: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        {/* Set type='button' to prevent form submission */}
        <Button type="button" variant="ghost" size="icon" className="h-5 w-5 ml-1 cursor-help">
          <Info className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 text-sm">
        <p>{content}</p>
      </PopoverContent>
    </Popover>
  )

  // Step Indicator Component
  const renderStepIndicator = () => (
    <div className="mb-8 flex justify-center space-x-4 border-b pb-4">
      {stepInfo.map((info, index) => {
        const currentStepIndex = step - 1
        const isCompleted = index < currentStepIndex
        const isCurrent = index === currentStepIndex

        return (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                isCurrent
                  ? "border-primary bg-primary/10 text-primary"
                  : isCompleted
                  ? "border-green-500 bg-green-500/10 text-green-600"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : info.icon}
            </div>
            <p className={`mt-2 text-xs font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
              {info.title}
            </p>
          </div>
        )
      })}
    </div>
  )

  // Render results directly if ResultsDisplay is not available
  const renderResults = () => {
    if (!results) return null

    if (typeof ResultsDisplay !== "function") {
      console.error("ResultsDisplay component not available, rendering fallback")
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold">Your Results</h2>
          <p className="mt-2">Calculation complete! Your daily calorie target is {results.calorieTarget} kcal.</p>
          <div className="mt-4">
            <h3 className="text-lg font-medium">Macronutrients:</h3>
            <ul className="mt-2 space-y-1">
              <li>
                Protein: {results.macros.protein.grams}g ({results.macros.protein.percentage}%)
              </li>
              <li>
                Carbs: {results.macros.carbs.grams}g ({results.macros.carbs.percentage}%)
              </li>
              <li>
                Fat: {results.macros.fat.grams}g ({results.macros.fat.percentage}%)
              </li>
            </ul>
          </div>
        </div>
      )
    }

    return <ResultsDisplay results={results} ethnicityAdjustmentApplied={ethnicityAdjustmentApplied} />
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="w-full shadow-xl border overflow-hidden">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                {step <= totalSteps ? "Advanced Nutrition Calculator" : "Your Personalized Plan"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                {step <= totalSteps ? stepInfo[step - 1].description : "Tailored to your unique profile and goals"}
              </CardDescription>
            </div>
            {step <= totalSteps && (
              <Badge variant="outline" className="bg-background">
                ({step}/{totalSteps})
              </Badge>
            )}
          </div>
          {step <= totalSteps && renderStepIndicator()}
        </CardHeader>
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6"
                  >
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="flex items-center">
                              Sex Assigned at Birth
                              <InfoTooltip content="Biological sex influences factors like hormone levels and typical body composition (muscle vs. fat mass), which affect baseline metabolism. We use this for selecting the base formula constant." />
                            </FormLabel>
                            <FormDescription>
                              Used for BMR calculation constant. Select the option that best applies.
                            </FormDescription>
                            <div className="pt-2">
                              <RadioGroup
                                onValueChange={field.onChange}
                                className="flex flex-col sm:flex-row gap-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                  <FormControl>
                                    <RadioGroupItem value="male" />
                                  </FormControl>
                                  <FormLabel className="font-medium cursor-pointer">Male</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                  <FormControl>
                                    <RadioGroupItem value="female" />
                                  </FormControl>
                                  <FormLabel className="font-medium cursor-pointer">Female</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="font-medium cursor-pointer">
                                    Prefer to Specify Differently
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Age (Years)
                              <InfoTooltip content="Your age influences your baseline metabolism (the calories your body burns at rest). Metabolic rate generally decreases slightly with age." />
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter your age"
                                className="mt-1"
                                {...field}
                                value={field.value === undefined ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? undefined : Number(e.target.value)
                                  field.onChange(value)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                Height (cm)
                                <InfoTooltip content="Height is a key factor in determining your body size, which influences your energy needs." />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter height in cm"
                                  className="mt-1"
                                  {...field}
                                  value={field.value === undefined ? "" : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value === "" ? undefined : Number(e.target.value)
                                    field.onChange(value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                Weight (kg)
                                <InfoTooltip content="Your current weight is the primary factor used to estimate your calorie needs and calculate goal-based adjustments." />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter weight in kg"
                                  className="mt-1"
                                  {...field}
                                  value={field.value === undefined ? "" : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value === "" ? undefined : Number(e.target.value)
                                    field.onChange(value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Body Composition & Activity */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6"
                  >
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="hasBodyFat"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="flex items-center">
                                <FormLabel className="text-base font-medium mr-1">
                                  Do you know your body fat %?
                                </FormLabel>
                                <Badge variant="outline" className="text-xs">Optional</Badge>
                                <InfoTooltip content="Providing body fat % allows for more accurate metabolism calculations (using Katch-McArdle or Cunningham formulas) based on lean body mass, especially beneficial if very lean or muscular." />
                              </div>
                              <FormDescription>
                                Improves calculation accuracy. Obtain via scales, calipers, scans.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-primary"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {watchHasBodyFat && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FormField
                            control={form.control}
                            name="bodyFat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center">
                                  Body Fat Percentage (%)
                                  <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                                  <InfoTooltip content="Enter your estimated body fat percentage. Accuracy varies by method." />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="15"
                                    className="mt-1"
                                    step="0.1"
                                    {...field}
                                    value={field.value === undefined ? "" : field.value}
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                                      field.onChange(value)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center">
                              Daily Activity Level (Non-Exercise)
                              <InfoTooltip content="Select the level that best describes your typical daily activity, including your job and leisure time *outside* of planned exercise. This helps estimate calories burned through daily movement (NEAT)." />
                            </FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your activity level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sedentary">
                                  <div className="flex flex-col">
                                    <span>Sedentary</span>
                                    <span className="text-xs text-muted-foreground">
                                      Desk job, little movement
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="light">
                                  <div className="flex flex-col">
                                    <span>Lightly Active</span>
                                    <span className="text-xs text-muted-foreground">
                                      Light manual work, some walking
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="moderate">
                                  <div className="flex flex-col">
                                    <span>Moderately Active</span>
                                    <span className="text-xs text-muted-foreground">
                                      Most trades, active job, regular walking
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="very">
                                  <div className="flex flex-col">
                                    <span>Very Active</span>
                                    <span className="text-xs text-muted-foreground">
                                      Heavy manual labor, very active day
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="extra">
                                  <div className="flex flex-col">
                                    <span>Extra Active</span>
                                    <span className="text-xs text-muted-foreground">
                                      Intense daily exercise + physical job
                                    </span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="exerciseFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center">
                              Planned Exercise
                              <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                              <InfoTooltip content="Tell us about your structured workouts (gym, running, sports). This refines your TDEE by adding Exercise Activity Thermogenesis (EAT). Recommended for better accuracy." />
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your exercise frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">
                                  <div className="flex flex-col">
                                    <span>None</span>
                                    <span className="text-xs text-muted-foreground">No regular exercise</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="light">
                                  <div className="flex flex-col">
                                    <span>Light (1-2 days/wk)</span>
                                    <span className="text-xs text-muted-foreground">Low intensity workouts</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="moderate">
                                  <div className="flex flex-col">
                                    <span>Moderate (3-4 days/wk)</span>
                                    <span className="text-xs text-muted-foreground">Moderate intensity workouts</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="intense">
                                  <div className="flex flex-col">
                                    <span>Intense (5+ days/wk)</span>
                                    <span className="text-xs text-muted-foreground">High intensity workouts</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trainingExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center">
                              Strength Training Experience
                              <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                              <InfoTooltip content="Your training background helps tailor muscle gain goals and protein needs. Beginners often benefit from a slightly higher surplus. Recommended if building muscle or body fat % is provided." />
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your training experience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">
                                  <div className="flex flex-col">
                                    <span>None</span>
                                    <span className="text-xs text-muted-foreground">No consistent strength training</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="beginner">
                                  <div className="flex flex-col">
                                    <span>Beginner (&lt;1 year)</span>
                                    <span className="text-xs text-muted-foreground">Less than 1 year consistent training</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="intermediate">
                                  <div className="flex flex-col">
                                    <span>Intermediate (1-3 years)</span>
                                    <span className="text-xs text-muted-foreground">1-3 years consistent training</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="advanced">
                                  <div className="flex flex-col">
                                    <span>Advanced (3+ years)</span>
                                    <span className="text-xs text-muted-foreground">3+ years consistent training</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6"
                  >
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center">
                              Primary Goal
                              <InfoTooltip content="Select the main objective for your nutrition plan. This determines whether you aim for a calorie deficit, surplus, or maintenance." />
                            </FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your primary goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lose_fat">
                                  <div className="flex flex-col">
                                    <span>Lose Fat</span>
                                    <span className="text-xs text-muted-foreground">
                                      Creates an energy deficit to promote fat loss while preserving muscle mass
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="build_muscle">
                                  <div className="flex flex-col">
                                    <span>Build Lean Muscle</span>
                                    <span className="text-xs text-muted-foreground">
                                      Provides extra energy needed for muscle repair and growth with minimal fat gain
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="maintain">
                                  <div className="flex flex-col">
                                    <span>Maintain Current Weight</span>
                                    <span className="text-xs text-muted-foreground">
                                      Balances energy intake with expenditure for weight stability
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="clean_bulk">
                                  <div className="flex flex-col">
                                    <span>Clean Bulk</span>
                                    <span className="text-xs text-muted-foreground">
                                      Moderate surplus focused on quality nutrition for muscle gain with minimal fat
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="aggressive_bulk">
                                  <div className="flex flex-col">
                                    <span>Aggressive Bulk</span>
                                    <span className="text-xs text-muted-foreground">
                                      Larger surplus to maximize muscle growth, accepting some fat gain
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="gain_weight">
                                  <div className="flex flex-col">
                                    <span>Gain Weight</span>
                                    <span className="text-xs text-muted-foreground">
                                      For healthy weight gain when underweight or looking to increase overall mass
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="improve_health">
                                  <div className="flex flex-col">
                                    <span>Improve Overall Health</span>
                                    <span className="text-xs text-muted-foreground">
                                      Focuses on nutrient-dense foods and balanced macros rather than weight change
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="recomposition">
                                  <div className="flex flex-col">
                                    <span>Body Recomposition</span>
                                    <span className="text-xs text-muted-foreground">
                                      Aims to build muscle and lose fat simultaneously with high protein and training
                                    </span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Conditional fields based on goal */}
                      {watchGoal === "lose_fat" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6 border p-4 rounded-lg bg-muted/30"
                        >
                          <FormField
                            control={form.control}
                            name="targetWeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center">
                                  Target Weight (kg)
                                  <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                                  <InfoTooltip content="Setting a target weight helps visualize progress but doesn't change the calorie calculation, which is based on the desired rate of loss." />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="65"
                                    className="mt-1"
                                    {...field}
                                    value={field.value === undefined ? "" : field.value}
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                                      field.onChange(value)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="weightLossRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center">
                                  Desired Rate of Loss
                                  <InfoTooltip content="Select how quickly you aim to lose weight. Slower rates (0.5%) better preserve muscle, while faster rates (1%) require more diligence. Moderate (0.75%) is a common balance." />
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || "moderate"}>
                                  <FormControl>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select your desired rate" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="slow">
                                      <div className="flex flex-col">
                                        <span>Slow (~0.5% of body weight/week)</span>
                                        <span className="text-xs text-muted-foreground">
                                          Gradual, sustainable approach
                                        </span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="moderate">
                                      <div className="flex flex-col">
                                        <span>Moderate (~0.75% of body weight/week)</span>
                                        <span className="text-xs text-muted-foreground">
                                          Balanced approach to fat loss
                                        </span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="fast">
                                      <div className="flex flex-col">
                                        <span>Fast (~1% of body weight/week)</span>
                                        <span className="text-xs text-muted-foreground">More aggressive approach</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {watchGoal === "gain_weight" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6 border p-4 rounded-lg bg-muted/30"
                        >
                          <FormField
                            control={form.control}
                            name="targetWeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center">
                                  Target Weight (kg)
                                  <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                                  <InfoTooltip content="Setting a target weight helps visualize progress but doesn't change the calorie calculation, which is based on the desired rate of gain." />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="75"
                                    className="mt-1"
                                    {...field}
                                    value={field.value === undefined ? "" : field.value}
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                                      field.onChange(value)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="weightGainRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center">
                                  Desired Rate of Gain
                                  <InfoTooltip content="Select how quickly you aim to gain weight. Slower rates (~0.25kg/wk) minimize fat gain, while moderate rates (~0.5kg/wk) may be faster but include more fat." />
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || "slow"}>
                                  <FormControl>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select your desired rate" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="slow">
                                      <div className="flex flex-col">
                                        <span>Slow (~0.25kg/week)</span>
                                        <span className="text-xs text-muted-foreground">Minimize fat gain</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="moderate">
                                      <div className="flex flex-col">
                                        <span>Moderate (~0.5kg/week)</span>
                                        <span className="text-xs text-muted-foreground">
                                          Balanced approach to weight gain
                                        </span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Advanced Options */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6"
                  >
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="dietType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center">
                              Diet Type
                              <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                              <InfoTooltip content="Select your dietary pattern. This helps adjust protein quality considerations (e.g., slightly higher targets for vegan/vegetarian)." />
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your diet type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard (Omnivore)</SelectItem>
                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="rounded-lg border p-4 bg-muted/50">
                        <FormField
                          control={form.control}
                          name="ethnicity"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center mb-1">
                                <FormLabel className="text-base font-medium mr-1">Ethnicity</FormLabel>
                                <Badge variant="outline" className="text-xs">Optional</Badge>
                                <InfoTooltip content="Optional refinement: Population studies sometimes show average metabolic differences. If provided (and body fat % is NOT), a minor statistical adjustment might be applied. See detailed disclaimer in tooltip/planning docs." />
                              </div>
                              <FormDescription className="mb-2">
                                Select if comfortable; used only for potential minor BMR refinement if body fat % is unknown.
                              </FormDescription>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your ethnicity (optional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="default">Prefer not to say</SelectItem>
                                  <SelectItem value="caucasian">White/European Descent</SelectItem>
                                  <SelectItem value="african">Black/African Descent</SelectItem>
                                  <SelectItem value="east_asian">East Asian Descent</SelectItem>
                                  <SelectItem value="south_asian">South Asian Descent</SelectItem>
                                  <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                                  <SelectItem value="indigenous">Indigenous/Native Peoples</SelectItem>
                                  <SelectItem value="middle_eastern">Middle Eastern/North African</SelectItem>
                                  <SelectItem value="nordic">Nordic/Northern European</SelectItem>
                                  <SelectItem value="mixed">Mixed/Multiracial</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="hasNeckWaist"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-medium flex items-center">
                                Neck & Waist Measurements?
                                <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                                <InfoTooltip content="Measuring waist circumference helps assess abdominal fat, linked to health risks. Doesn't change calorie goal but may trigger health tips (e.g., fiber, omega-3)." />
                              </FormLabel>
                              <FormDescription>
                                Provide if known; helps assess health risks.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-primary"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {watchHasNeckWaist && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <FormField
                            control={form.control}
                            name="neckCircumference"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center">
                                  Neck Circumference (cm)
                                  <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                                  <InfoTooltip content="Measure around the narrowest part of your neck." />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="35"
                                    className="mt-1"
                                    step="0.1"
                                    {...field}
                                    value={field.value === undefined ? "" : field.value}
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                                      field.onChange(value)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="waistCircumference"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center">
                                  Waist Circumference (cm)
                                  <Badge variant="outline" className="text-xs ml-1">Optional</Badge>
                                  <InfoTooltip content="Measure horizontally around your natural waistline (usually just above the hip bones)." />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="80"
                                    className="mt-1"
                                    step="0.1"
                                    {...field}
                                    value={field.value === undefined ? "" : field.value}
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                                      field.onChange(value)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Results Display */}
                {step === totalSteps + 1 && results && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {renderResults()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between p-6 pt-2 border-t bg-muted/30">
                {step > 1 && step <= totalSteps && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="transition-all hover:bg-muted"
                  >
                    Back
                  </Button>
                )}

                {step < totalSteps && (
                  <Button
                    type="button"
                    className="ml-auto bg-primary hover:opacity-90 transition-opacity"
                    onClick={nextStep}
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {step === totalSteps && (
                  <Button type="submit" className="ml-auto bg-primary hover:opacity-90 transition-opacity">
                    Calculate Results
                  </Button>
                )}

                {step > totalSteps && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="ml-auto transition-all hover:bg-muted"
                  >
                    Start Over
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
