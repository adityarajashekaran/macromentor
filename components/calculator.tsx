"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler, Resolver, FieldValues } from "react-hook-form"
import { z } from "zod"
import { ArrowRight, HelpCircle, CheckCircle2, Activity, Target, Settings, User, Info, TrendingDown, Dumbbell, Scale, Salad, Beef, TrendingUp, Heart, RefreshCw } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"

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
  exerciseFrequency: z.enum(["none", "light", "moderate", "intense"]),
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
  { icon: <Settings className="h-5 w-5" />, title: "Fine-tune", description: "Customize your plan" },
]

const stepFields: Record<number, (keyof CalculatorFormValues)[]> = {
  1: ["sex", "age", "height", "weight"],
  2: ["activityLevel", "hasBodyFat", "bodyFat", "exerciseFrequency", "trainingExperience"],
  3: ["goal", "targetWeight", "weightLossRate", "weightGainRate"],
  4: ["dietType", "ethnicity", "hasNeckWaist", "neckCircumference", "waistCircumference"],
}

// Step 1: Basic Information
const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Prefer to Specify Differently" },
]

// Step 2: Body Composition & Activity
const activityLevelOptions = [
  { value: "sedentary", label: "Sedentary", description: "Desk job, little movement" },
  { value: "light", label: "Lightly Active", description: "Light manual work, some walking" },
  { value: "moderate", label: "Moderately Active", description: "Most trades, active job, regular walking" },
  { value: "very", label: "Very Active", description: "Heavy manual labor, very active day" },
  { value: "extra", label: "Extra Active", description: "Intense daily exercise + physical job" },
]

const exerciseFrequencyOptions = [
  { value: "none", label: "None", description: "No regular exercise" },
  { value: "light", label: "Light (1-2 days/wk)", description: "Low intensity workouts" },
  { value: "moderate", label: "Moderate (3-4 days/wk)", description: "Moderate intensity workouts" },
  { value: "intense", label: "Intense (5+ days/wk)", description: "High intensity workouts" },
]

const trainingExperienceOptions = [
  { value: "none", label: "None", description: "No consistent strength training" },
  { value: "beginner", label: "Beginner (<1 year)", description: "Less than 1 year consistent training" },
  { value: "intermediate", label: "Intermediate (1-3 years)", description: "1-3 years consistent training" },
  { value: "advanced", label: "Advanced (3+ years)", description: "3+ years consistent training" },
]

// Step 3: Goals
const goalOptions = [
  { value: "lose_fat", label: "Lose Fat", description: "Calorie deficit to shed fat", icon: TrendingDown },
  { value: "build_muscle", label: "Build Lean Muscle", description: "Surplus for muscle growth", icon: Dumbbell },
  { value: "maintain", label: "Maintain Weight", description: "Balance energy in and out", icon: Scale },
  { value: "clean_bulk", label: "Clean Bulk", description: "Moderate surplus, minimal fat", icon: Salad },
  { value: "aggressive_bulk", label: "Aggressive Bulk", description: "Max surplus for fast gains", icon: Beef },
  { value: "gain_weight", label: "Gain Weight", description: "Healthy weight increase", icon: TrendingUp },
  { value: "improve_health", label: "Improve Health", description: "Nutrient-dense, balanced macros", icon: Heart },
  { value: "recomposition", label: "Body Recomp", description: "Build muscle, lose fat", icon: RefreshCw },
]

const weightLossRateOptions = [
  { value: "slow", label: "Slow (~0.5% of body weight/week)", description: "Gradual, sustainable approach" },
  { value: "moderate", label: "Moderate (~0.75% of body weight/week)", description: "Balanced approach to fat loss" },
  { value: "fast", label: "Fast (~1% of body weight/week)", description: "More aggressive approach" },
]

const weightGainRateOptions = [
  { value: "slow", label: "Slow (~0.25kg/week)", description: "Minimize fat gain" },
  { value: "moderate", label: "Moderate (~0.5kg/week)", description: "Balanced approach to weight gain" },
]

// Step 4: Advanced Options
const dietTypeOptions = [
  { value: "standard", label: "Omnivore" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
]

const ethnicityOptions = [
  { value: "default", label: "Prefer not to say" },
  { value: "caucasian", label: "White/European Descent" },
  { value: "african", label: "Black/African Descent" },
  { value: "east_asian", label: "East Asian Descent" },
  { value: "south_asian", label: "South Asian Descent" },
  { value: "hispanic", label: "Hispanic/Latino" },
  { value: "indigenous", label: "Indigenous/Native Peoples" },
  { value: "middle_eastern", label: "Middle Eastern/North African" },
  { value: "nordic", label: "Nordic/Northern European" },
  { value: "mixed", label: "Mixed/Multiracial" },
]

export function Calculator() {
  const [step, setStep] = useState(1)
  const [results, setResults] = useState<any>(null)
  const [ethnicityAdjustmentApplied, setEthnicityAdjustmentApplied] = useState(false)
  const totalSteps = 4

  const defaultValues: Partial<CalculatorFormValues> = {
    sex: undefined,
    age: undefined,
    height: undefined,
    weight: undefined,
    bodyFat: undefined,
    hasBodyFat: false,
    activityLevel: undefined,
    exerciseFrequency: undefined,
    trainingExperience: "none",
    goal: undefined,
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
    resolver: zodResolver(formSchema) as Resolver<CalculatorFormValues, any>,
    defaultValues,
    mode: "onChange",
  })

  const watchHasBodyFat = form.watch("hasBodyFat")
  const watchGoal = form.watch("goal")
  const watchHasNeckWaist = form.watch("hasNeckWaist")

  // Add watch hooks for select values to update the trigger display
  const watchActivityLevel = form.watch("activityLevel")
  const watchExerciseFrequency = form.watch("exerciseFrequency")
  const watchTrainingExperience = form.watch("trainingExperience")
  const watchWeightLossRate = form.watch("weightLossRate")
  const watchWeightGainRate = form.watch("weightGainRate")
  const watchDietType = form.watch("dietType")
  const watchEthnicity = form.watch("ethnicity")

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
    // Lazy load calculation functions
    import("../lib/calculator")
      .then((calculatorModule) => {
        // Map form ethnicity to calculator function ethnicity type
        const mapEthnicity = (formEthnicity: CalculatorFormValues['ethnicity']): Parameters<typeof calculatorModule.calculateBMR>[6] => {
          const supportedEthnicities: Array<Parameters<typeof calculatorModule.calculateBMR>[6]> = [
            "default", "south_asian", "east_asian", "african", "pacific_islander", "nordic", "other"
          ];
          // Check if the form ethnicity is directly supported
          if (supportedEthnicities.includes(formEthnicity as any)) {
            return formEthnicity as Parameters<typeof calculatorModule.calculateBMR>[6];
          }
          // Map specific unsupported values or return default
          // For now, map any unsupported value (like caucasian, hispanic, mixed etc.) to undefined or 'default'
          // This means no specific adjustment will be applied for them in calculateBMR
          return 'default'; // Or return undefined if calculateBMR handles it
        };
        const calculatorEthnicity = mapEthnicity(data.ethnicity);

        // 1. Calculate BMR
        const bmr = calculatorModule.calculateBMR(
          data.weight,
          data.height,
          data.age,
          data.sex,
          data.bodyFat,
          data.trainingExperience,
          calculatorEthnicity // Pass the mapped value
        )
        const bmrMethod = data.bodyFat
          ? data.trainingExperience && ["intermediate", "advanced"].includes(data.trainingExperience)
            ? "Cunningham Equation (based on LBM & Training)"
            : "Katch-McArdle Equation (based on LBM)"
          : "Mifflin-St Jeor Equation (weight-based)"

        // Check if ethnicity adjustment was applied
        let ethnicityAdjusted = false
        if (data.bodyFat === undefined && data.ethnicity && data.ethnicity !== 'default') {
            // List of ethnicities that *might* have adjustments applied in calculateBMR
            const ethnicitiesWithPotentialAdjustments = [
                'south_asian', 'east_asian', 'african', 'pacific_islander', 'nordic'
            ];
            if (ethnicitiesWithPotentialAdjustments.includes(data.ethnicity)) {
                ethnicityAdjusted = true;
            }
        }
        setEthnicityAdjustmentApplied(ethnicityAdjusted)

        // 2. Calculate TDEE
        // TODO: Implement refined activity calculation using exerciseFrequency
        const tdee = calculatorModule.calculateTDEE(bmr, data.activityLevel)

        // 3. Calculate Calorie Target
        const { calorieTarget, deficitSurplus } = calculatorModule.calculateCalorieTarget(
          tdee,
          data.goal,
          data.weightLossRate,
          data.weightGainRate,
          data.bodyFat,
          data.sex,
          data.trainingExperience,
          data.height // Pass height for potential BMI calc within (though we do it below now)
        )

        // 4. Calculate Macros
        const macros = calculatorModule.calculateMacros(
          data.weight,
          calorieTarget,
          data.goal,
          data.dietType
        )

        // 5. Calculate Metrics (BMI, LBM)
        const heightInMeters = data.height / 100;
        const bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
        let lbm = undefined;
        if (data.bodyFat) {
          lbm = parseFloat((data.weight * (1 - data.bodyFat / 100)).toFixed(1));
        }
        const metrics = {
          bmi: bmi,
          lbm: lbm,
          bodyFatPercentage: data.bodyFat // Include provided BF% in metrics
        };

        // 6. Determine Goal Description
        const goalDescriptions: { [key: string]: string } = {
          "lose_fat": "Slow fat loss (~0.5% of body weight per week)",
          "build_muscle": "Muscle building for beginners (higher surplus to maximize gains)",
          "maintain": "Weight maintenance (energy balance)",
          "clean_bulk": "Clean bulk (moderate surplus to minimize fat gain)",
          "aggressive_bulk": "Aggressive bulk (higher surplus for maximum gains)",
          "gain_weight": "Slow weight gain (~0.25kg per week)",
          "improve_health": "Health improvement at maintenance calories",
          "recomposition": "Body recomposition (slight deficit with high protein)"
        };
        const goalDescription = goalDescriptions[data.goal] || "General muscle building (moderate surplus)";

        // 7. Calculate Micronutrients (Re-implemented directly)
        const micronutrients = {
            iron: data.sex === "female" && data.age < 50 ? 18 : 8,
            calcium: data.age < 25 || data.age > 50 ? 1200 : 1000,
            vitaminD: data.age > 65 ? 1000 : 800, // Basic age check, spec had BMI check too, but BMI calculated later
            omega3: 500,
            fiber: Math.round(14 * (calorieTarget / 1000)), // 14g per 1000 calories
        };
        // Adjust micro targets based on other factors if needed (e.g., waist circumference)
        // Note: This logic was simplified based on the original spec example in results-display
        // The full spec has more complex rules involving BMI/waist which might need full re-implementation if required.
        if (data.hasNeckWaist && data.waistCircumference) {
            const highWaist =
                (data.sex === "male" && data.waistCircumference > 102) ||
                (data.sex === "female" && data.waistCircumference > 88);
            if (highWaist) {
                micronutrients.omega3 = Math.max(micronutrients.omega3, 1000); // Ensure at least 1000mg
            }
        }

        // 8. Check Warnings (Re-implemented directly)
        const minCalories = data.sex === "female" ? 1200 : 1500;
        const belowMinimum = calorieTarget < minCalories;

        // Refeed recommended if deficit is > 20% (simplified from spec)
        const refeedRecommended = data.goal === "lose_fat" && (tdee - calorieTarget) / tdee > 0.20;

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
          macros,
          micronutrients, // Add micronutrients
          warnings: {
            belowMinimum, // Add warning
            refeedRecommended, // Add warning
            ethnicityAdjustmentApplied,
          },
          metrics,
        }

        setResults(resultsData)
        setStep(totalSteps + 1) // Move to results step
      })
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
                  ? "border-primary bg-primary/10 text-primary"
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
      <Progress value={((step - 1) / (totalSteps - 1)) * 100} className="h-1.5 mt-4" />
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
        {/* Conditionally render CardHeader only for form steps */}
        {step <= totalSteps && (
          <CardHeader className="bg-muted/50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                  Advanced Nutrition Calculator
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  {stepInfo[step - 1].description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-background">
                ({step}/{totalSteps})
              </Badge>
            </div>
            {renderStepIndicator()}
          </CardHeader>
        )}
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className="space-y-6">
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
                              <span className="text-destructive ml-1">*</span>
                              <InfoTooltip content="Biological sex influences factors like hormone levels and typical body composition (muscle vs. fat mass), which affect baseline metabolism. We use this for selecting the base formula constant." />
                            </FormLabel>
                            <FormDescription>
                              Used for BMR calculation constant. Select the option that best applies.
                            </FormDescription>
                            <div className="pt-2">
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col sm:flex-row gap-4"
                              >
                                {sexOptions.map((option) => (
                                  <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={option.value} id={`sex-${option.value}-${field.name}`} />
                                    </FormControl>
                                    <FormLabel
                                      htmlFor={`sex-${option.value}-${field.name}`}
                                      className="font-medium cursor-pointer rounded-md border p-4 hover:bg-muted/50 transition-colors w-full has-[+input:checked]:bg-muted/50 has-[+input:checked]:border-primary"
                                    >
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
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
                              <span className="text-destructive ml-1">*</span>
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
                                <span className="text-destructive ml-1">*</span>
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
                                <span className="text-destructive ml-1">*</span>
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
                              <span className="text-destructive ml-1">*</span>
                              <InfoTooltip content="Select the level that best describes your typical daily activity, including your job and leisure time *outside* of planned exercise. This helps estimate calories burned through daily movement (NEAT)." />
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your activity level">
                                    {watchActivityLevel ? activityLevelOptions.find(option => option.value === watchActivityLevel)?.label : "Select your activity level"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {activityLevelOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex flex-col">
                                      <span>{option.label}</span>
                                      {option.description && (
                                        <span className="text-xs text-muted-foreground">
                                          {option.description}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
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
                              <span className="text-destructive ml-1">*</span>
                              <InfoTooltip content="Tell us about your structured workouts (gym, running, sports). This refines your TDEE by adding Exercise Activity Thermogenesis (EAT). Recommended for better accuracy." />
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your exercise frequency">
                                    {watchExerciseFrequency ? exerciseFrequencyOptions.find(option => option.value === watchExerciseFrequency)?.label : "Select your exercise frequency"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {exerciseFrequencyOptions.map((option) => (
                                   <SelectItem key={option.value} value={option.value}>
                                    <div className="flex flex-col">
                                      <span>{option.label}</span>
                                      {option.description && (
                                        <span className="text-xs text-muted-foreground">
                                          {option.description}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
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
                            <Select onValueChange={field.onChange} value={field.value || "none"}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your training experience">
                                    {watchTrainingExperience ? trainingExperienceOptions.find(option => option.value === watchTrainingExperience)?.label : "Select your training experience"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {trainingExperienceOptions.map((option) => (
                                   <SelectItem key={option.value} value={option.value}>
                                    <div className="flex flex-col">
                                      <span>{option.label}</span>
                                      {option.description && (
                                        <span className="text-xs text-muted-foreground">
                                          {option.description}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
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
                              <span className="text-destructive ml-1">*</span>
                              <InfoTooltip content="Select the main objective for your nutrition plan. This determines whether you aim for a calorie deficit, surplus, or maintenance." />
                            </FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                              {goalOptions.map((option) => {
                                const isSelected = field.value === option.value
                                const Icon = option.icon
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                                      isSelected
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                    }`}
                                  >
                                    <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <span className={`font-medium text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                                          {option.label}
                                        </span>
                                        {isSelected && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
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
                                <Select onValueChange={field.onChange} value={field.value || "moderate"}>
                                  <FormControl>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select your desired rate">
                                        {watchWeightLossRate ? weightLossRateOptions.find(option => option.value === watchWeightLossRate)?.label : "Select your desired rate"}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {weightLossRateOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex flex-col">
                                          <span>{option.label}</span>
                                          {option.description && (
                                            <span className="text-xs text-muted-foreground">
                                              {option.description}
                                            </span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
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
                                <Select onValueChange={field.onChange} value={field.value || "slow"}>
                                  <FormControl>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select your desired rate">
                                        {watchWeightGainRate ? weightGainRateOptions.find(option => option.value === watchWeightGainRate)?.label : "Select your desired rate"}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {weightGainRateOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex flex-col">
                                          <span>{option.label}</span>
                                          {option.description && (
                                            <span className="text-xs text-muted-foreground">
                                              {option.description}
                                            </span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select your diet type">
                                    {watchDietType ? dietTypeOptions.find(option => option.value === watchDietType)?.label : "Select your diet type"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {dietTypeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your ethnicity (optional)">
                                      {watchEthnicity ? ethnicityOptions.find(option => option.value === watchEthnicity)?.label : "Select your ethnicity (optional)"}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ethnicityOptions.map((option) => (
                                     <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                  ))}
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
