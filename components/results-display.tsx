"use client"
import { Check, Info, ArrowRight, Flame, Dumbbell, Apple, Utensils, Printer, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Define the props interface
interface ResultsDisplayProps {
  results: {
    bmr: number
    bmrMethod: string
    tdee: number
    calorieTarget: number
    deficitSurplus: number
    goalDescription: string
    userProfile: {
      age: number
      sex: string
      height: number
      weight: number
      bodyFat?: number
      activityLevel: string
      goal: string
      dietType: string
    }
    macros: {
      protein: {
        grams: number
        calories: number
        percentage: number
      }
      fat: {
        grams: number
        calories: number
        percentage: number
      }
      carbs: {
        grams: number
        calories: number
        percentage: number
      }
    }
    micronutrients: {
      iron: number
      calcium: number
      vitaminD: number
      omega3: number
      fiber: number
    }
    warnings: {
      belowMinimum: boolean
      refeedRecommended: boolean
      ethnicityAdjustmentApplied: boolean
    }
    metrics?: {
      bmi: number
      lbm?: number
    }
  }
  ethnicityAdjustmentApplied: boolean
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

// Using default export instead of named export
const ResultsDisplay = ({ results, ethnicityAdjustmentApplied }: ResultsDisplayProps) => {
  console.log("ResultsDisplay component rendering", { results, ethnicityAdjustmentApplied })

  // Format activity level for display
  const formatActivityLevel = (level: string) => {
    switch (level) {
      case "sedentary":
        return "Sedentary"
      case "light":
        return "Lightly Active"
      case "moderate":
        return "Moderately Active"
      case "very":
        return "Very Active"
      case "extra":
        return "Extra Active"
      default:
        return level
    }
  }

  // Format diet type for display
  const formatDietType = (type: string) => {
    switch (type) {
      case "standard":
        return "Standard (Omnivore)"
      case "vegetarian":
        return "Vegetarian"
      case "vegan":
        return "Vegan"
      default:
        return type
    }
  }

  // Format goal for display
  const formatGoal = (goal: string) => {
    switch (goal) {
      case "lose_fat":
        return "Lose Fat"
      case "build_muscle":
        return "Build Muscle"
      case "maintain":
        return "Maintain Weight"
      case "clean_bulk":
        return "Clean Bulk"
      case "aggressive_bulk":
        return "Aggressive Bulk"
      case "gain_weight":
        return "Gain Weight"
      case "improve_health":
        return "Improve Health"
      case "recomposition":
        return "Body Recomposition"
      default:
        return goal
    }
  }

  // Determine if specific micronutrients need highlighting
  const highlightIron = results.userProfile.sex === "female" || results.userProfile.dietType === "vegetarian" || results.userProfile.dietType === "vegan"
  const highlightCalcium = results.userProfile.age > 50 || results.userProfile.dietType === "vegan"
  const highlightVitD = results.userProfile.age > 65
  const highlightOmega3 = results.userProfile.dietType === "vegan" || results.userProfile.dietType === "vegetarian"

  // Function to handle printing
  const handlePrint = () => {
    window.print()
  }

  // Function to copy summary to clipboard
  const handleCopySummary = () => {
    const summary = `MacroMentor Results Summary:
Goal: ${formatGoal(results.userProfile.goal)} (${results.goalDescription})
Target Calories: ${results.calorieTarget} kcal (TDEE: ${results.tdee} kcal, Deficit/Surplus: ${results.deficitSurplus} kcal)
Macros:
  - Protein: ${results.macros.protein.grams}g (${results.macros.protein.percentage}%)
  - Carbs: ${results.macros.carbs.grams}g (${results.macros.carbs.percentage}%)
  - Fat: ${results.macros.fat.grams}g (${results.macros.fat.percentage}%)
BMR: ${results.bmr} kcal (${results.bmrMethod})
`
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        toast.success("Summary copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy summary: ", err)
        toast.error("Failed to copy summary.")
      })
  }

  return (
    <div className="p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* Summary Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Personalized Nutrition Plan</h2>
              <p className="text-muted-foreground mt-1">{results.goalDescription}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleCopySummary}>
                <Copy className="h-4 w-4 mr-2" /> Copy Summary
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" /> Print Results
              </Button>
              <Badge className="self-start md:self-auto bg-primary text-primary-foreground py-1.5 px-3">
                {formatGoal(results.userProfile.goal)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Age</span>
              <span className="font-medium">{results.userProfile.age} years</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Sex</span>
              <span className="font-medium">
                {results.userProfile.sex === "male"
                  ? "Male"
                  : results.userProfile.sex === "female"
                    ? "Female"
                    : "Other"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Height</span>
              <span className="font-medium">{results.userProfile.height} cm</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Weight</span>
              <span className="font-medium">{results.userProfile.weight} kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {results.userProfile.bodyFat !== undefined && (
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Body Fat</span>
                <span className="font-medium">{results.userProfile.bodyFat}%</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Activity Level</span>
              <span className="font-medium">{formatActivityLevel(results.userProfile.activityLevel)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Diet Type</span>
              <span className="font-medium">{formatDietType(results.userProfile.dietType)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-muted/30 p-4 rounded-lg border mt-4">
            <h3 className="font-medium text-foreground mb-2">About Your Calculation</h3>
            <p className="text-sm text-muted-foreground">
              Your results are based on the {results.bmrMethod}. This calculator uses a tiered approach, selecting the
              most appropriate formula based on your provided information. All calculations are estimates and individual
              metabolism can vary significantly.
            </p>
          </div>
        </motion.div>

        {ethnicityAdjustmentApplied && (
          <motion.div variants={itemVariants}>
            <Alert className="mb-4 bg-blue-50 border-blue-100 dark:bg-blue-950 dark:border-blue-900">
              <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <AlertTitle className="text-blue-700 dark:text-blue-300">Population-Based Adjustment Applied</AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                Based on the optional ethnicity information provided and population-level research averages, a small
                adjustment was applied to the initial metabolic rate estimate as body fat percentage was not available.
                This adjustment reflects statistical averages from research studies and is not deterministic. Individual
                metabolism varies greatly within any group, and your actual needs may differ.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Energy Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden border shadow-md">
            <CardHeader className="pb-2 bg-muted/30">
              <div className="flex items-center">
                <Flame className="h-5 w-5 text-red-500 mr-2" />
                <CardTitle className="text-base font-medium">Base Metabolic Rate</CardTitle>
              </div>
              <CardDescription>Calories burned at complete rest (your body's minimum energy needs)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-foreground">{results.bmr} kcal</div>
              <div className="text-xs text-muted-foreground mt-1">{results.bmrMethod}</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border shadow-md">
            <CardHeader className="pb-2 bg-muted/30">
              <div className="flex items-center">
                <Dumbbell className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <CardTitle className="text-base font-medium">Total Daily Energy Expenditure</CardTitle>
              </div>
              <CardDescription>Estimated total calories burned per day (BMR + activity)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-foreground">{results.tdee} kcal</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border shadow-md bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-950/50 dark:to-emerald-950/60 border-green-300 dark:border-green-700 col-span-1 md:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Apple className="h-5 w-5 text-green-700 dark:text-green-400 mr-2" />
                <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Target Daily Calories
                </CardTitle>
              </div>
              <CardDescription className="text-green-700 dark:text-green-500">
                Recommended intake for your goal
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-extrabold text-green-700 dark:text-green-300">
                {results.calorieTarget} kcal
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ({results.tdee} TDEE {results.deficitSurplus >= 0 ? "+" : "-"} {Math.abs(results.deficitSurplus)} Deficit/Surplus)
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Macronutrients Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-primary" /> Macronutrient Breakdown
              </h3>
              <TabsList className="grid w-full max-w-xs grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="grams">Grams</TabsTrigger>
                <TabsTrigger value="calories">Calories</TabsTrigger>
              </TabsList>
            </div>
            <Separator className="mb-6" />

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Macronutrient Ratio</CardTitle>
                  <CardDescription>
                    Recommended distribution of Protein, Carbohydrates, and Fat based on your goal and profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TooltipProvider>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Protein</span>
                        <span className="text-sm text-muted-foreground">
                          {results.macros.protein.grams}g / {results.macros.protein.calories} kcal
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Progress
                            value={results.macros.protein.percentage}
                            className="h-2 bg-blue-100 [&>div]:bg-blue-500 cursor-help"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{results.macros.protein.percentage}% of total calories</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                  <TooltipProvider>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Carbs</span>
                        <span className="text-sm text-muted-foreground">
                          {results.macros.carbs.grams}g / {results.macros.carbs.calories} kcal
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Progress
                            value={results.macros.carbs.percentage}
                            className="h-2 bg-orange-100 [&>div]:bg-orange-500 cursor-help"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{results.macros.carbs.percentage}% of total calories</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                  <TooltipProvider>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Fat</span>
                        <span className="text-sm text-muted-foreground">
                          {results.macros.fat.grams}g / {results.macros.fat.calories} kcal
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Progress
                            value={results.macros.fat.percentage}
                            className="h-2 bg-yellow-100 [&>div]:bg-yellow-500 cursor-help"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{results.macros.fat.percentage}% of total calories</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Note: Percentages may not sum to exactly 100 due to rounding. Hover over bars for exact percentage.
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Grams Tab */}
            <TabsContent value="grams">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Macronutrients in Grams</CardTitle>
                  <CardDescription>
                    Your daily targets for each macronutrient in grams. Aim to hit these targets consistently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Protein</span>
                    <span className="text-4xl font-bold text-blue-800 dark:text-blue-200 mt-1">
                      {results.macros.protein.grams}g
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Carbohydrates</span>
                    <span className="text-4xl font-bold text-orange-800 dark:text-orange-200 mt-1">
                      {results.macros.carbs.grams}g
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Fat</span>
                    <span className="text-4xl font-bold text-yellow-800 dark:text-yellow-200 mt-1">
                      {results.macros.fat.grams}g
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Protein: Muscle repair & growth. Carbs: Primary energy source. Fat: Hormone production & cell function.
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Calories Tab */}
            <TabsContent value="calories">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Macronutrients by Calories</CardTitle>
                  <CardDescription>
                    How many calories should come from each macronutrient per day.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Protein</span>
                    <span className="text-3xl font-bold text-blue-800 dark:text-blue-200 mt-1">
                      {results.macros.protein.calories} kcal
                    </span>
                    <span className="text-xs text-muted-foreground">({results.macros.protein.percentage}%)</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Carbohydrates</span>
                    <span className="text-3xl font-bold text-orange-800 dark:text-orange-200 mt-1">
                      {results.macros.carbs.calories} kcal
                    </span>
                    <span className="text-xs text-muted-foreground">({results.macros.carbs.percentage}%)</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Fat</span>
                    <span className="text-3xl font-bold text-yellow-800 dark:text-yellow-200 mt-1">
                      {results.macros.fat.calories} kcal
                    </span>
                    <span className="text-xs text-muted-foreground">({results.macros.fat.percentage}%)</span>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  1g Protein = 4 kcal | 1g Carb = 4 kcal | 1g Fat = 9 kcal
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Micronutrients & Health Markers */}
        <motion.div variants={itemVariants}>
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Key Micronutrients & Health Markers</CardTitle>
              <CardDescription>
                Important considerations for overall health based on your profile and goals. These are general targets;
                individual needs may vary. Focus on whole foods like fruits, vegetables, lean proteins, and whole grains.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className={`flex flex-col items-center p-3 border rounded-lg ${highlightIron ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : 'bg-muted/30' } text-center`}>
                <span className={`text-sm font-medium ${highlightIron ? 'text-blue-700 dark:text-blue-300' : ''}`}>Iron</span>
                <span className={`text-lg font-bold mt-1 ${highlightIron ? 'text-blue-800 dark:text-blue-200' : ''}`}>≈{results.micronutrients.iron}mg</span>
                <span className="text-xs text-muted-foreground mt-0.5">Energy, Oxygen Transport</span>
                {highlightIron && <Badge variant="secondary" className="mt-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Increased focus recommended</Badge>}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-muted-foreground underline cursor-help mt-1">Sources</TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Red meat, poultry, fish, lentils, beans, tofu, spinach, fortified cereals. Pair with Vitamin C sources (e.g., citrus) to enhance absorption, especially for plant sources.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className={`flex flex-col items-center p-3 border rounded-lg ${highlightCalcium ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-muted/30' } text-center`}>
                <span className={`text-sm font-medium ${highlightCalcium ? 'text-green-700 dark:text-green-300' : ''}`}>Calcium</span>
                <span className={`text-lg font-bold mt-1 ${highlightCalcium ? 'text-green-800 dark:text-green-200' : ''}`}>≥{results.micronutrients.calcium}mg</span>
                <span className="text-xs text-muted-foreground mt-0.5">Bone Health</span>
                {highlightCalcium && <Badge variant="secondary" className="mt-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Increased focus recommended</Badge>}
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-muted-foreground underline cursor-help mt-1">Sources</TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Dairy products (milk, yogurt, cheese), fortified plant milks (soy, almond), leafy greens (kale, collards), tofu (calcium-set), sardines/salmon (with bones).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className={`flex flex-col items-center p-3 border rounded-lg ${highlightVitD ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' : 'bg-muted/30' } text-center`}>
                <span className={`text-sm font-medium ${highlightVitD ? 'text-yellow-700 dark:text-yellow-300' : ''}`}>Vitamin D</span>
                <span className={`text-lg font-bold mt-1 ${highlightVitD ? 'text-yellow-800 dark:text-yellow-200' : ''}`}>≈{results.micronutrients.vitaminD} IU</span>
                <span className="text-xs text-muted-foreground mt-0.5">Immunity, Bone Health</span>
                 {highlightVitD && <Badge variant="secondary" className="mt-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Increased focus recommended</Badge>}
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-muted-foreground underline cursor-help mt-1">Sources</TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Sunlight exposure (safely), fatty fish (salmon, mackerel), fortified milk/cereals, egg yolks, mushrooms (UV-exposed). Many people benefit from supplementation, especially in winter.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className={`flex flex-col items-center p-3 border rounded-lg ${highlightOmega3 ? 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800' : 'bg-muted/30' } text-center`}>
                <span className={`text-sm font-medium ${highlightOmega3 ? 'text-purple-700 dark:text-purple-300' : ''}`}>Omega-3 (EPA/DHA)</span>
                <span className={`text-lg font-bold mt-1 ${highlightOmega3 ? 'text-purple-800 dark:text-purple-200' : ''}`}>≥{results.micronutrients.omega3}mg</span>
                <span className="text-xs text-muted-foreground mt-0.5">Heart, Brain Health</span>
                 {highlightOmega3 && <Badge variant="secondary" className="mt-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Increased focus recommended</Badge>}
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-muted-foreground underline cursor-help mt-1">Sources</TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Fatty fish (salmon, sardines, herring), algae oil (vegan source of EPA/DHA). Plant sources like flaxseeds, chia seeds, walnuts provide ALA, which converts inefficiently to EPA/DHA.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
               <div className="flex flex-col items-center p-3 border rounded-lg bg-muted/30 text-center">
                 <span className="text-sm font-medium">Fiber</span>
                 <span className="text-lg font-bold mt-1">≥{results.micronutrients.fiber}g</span>
                 <span className="text-xs text-muted-foreground mt-0.5">Digestion, Satiety</span>
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-muted-foreground underline cursor-help mt-1">Sources</TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Whole grains (oats, quinoa, brown rice), fruits (berries, apples, pears), vegetables (broccoli, Brussels sprouts, carrots), legumes (beans, lentils, peas), nuts, seeds.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
               </div>
               {results.metrics?.bmi && (
                 <div className="flex flex-col items-center p-3 border rounded-lg bg-muted/30 text-center">
                   <span className="text-sm font-medium">BMI</span>
                   <span className="text-lg font-bold mt-1">{results.metrics.bmi.toFixed(1)}</span>
                   <span className="text-xs text-muted-foreground mt-0.5">Body Mass Index</span>
                 </div>
              )}
               {results.metrics?.lbm && (
                 <div className="flex flex-col items-center p-3 border rounded-lg bg-muted/30 text-center">
                   <span className="text-sm font-medium">Lean Body Mass</span>
                   <span className="text-lg font-bold mt-1">{results.metrics.lbm.toFixed(1)} kg</span>
                   <span className="text-xs text-muted-foreground mt-0.5">Muscle, Bone, Organs</span>
                 </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Focus on whole foods to meet these targets. Consider supplements if dietary intake is insufficient.
            </CardFooter>
          </Card>
        </motion.div>

        {/* Warnings & Recommendations */}
        {(results.warnings.belowMinimum || results.warnings.refeedRecommended) && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Important Considerations</h3>
            {results.warnings.belowMinimum && (
              <Alert variant="destructive" className="border-destructive/50">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-semibold">Minimum Calorie Alert</AlertTitle>
                <AlertDescription>
                  Your calculated target of {results.calorieTarget} kcal falls below the generally recommended minimum ({results.userProfile.sex === "female" ? 1200 : 1500} kcal) for adequate nutrient intake and metabolic health.
                  <strong className="block mt-1">
                    The target has been adjusted upwards to {results.userProfile.sex === "female" ? 1200 : 1500} kcal.
                  </strong>
                  Ensure your diet is rich in nutrient-dense foods. Very low-calorie plans should ideally be followed under professional supervision.
                </AlertDescription>
              </Alert>
            )}
            {results.warnings.refeedRecommended && (
              <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="font-semibold text-amber-700 dark:text-amber-200">Refeed Day Recommendation</AlertTitle>
                <AlertDescription>
                  Due to the significant calorie deficit ({results.deficitSurplus} kcal), incorporating 1-2 planned "refeed" days per week may be beneficial.
                  On these days, increase carbohydrate intake to bring calories closer to your maintenance level ({results.tdee} kcal).
                  This can help manage hunger, support metabolism, and improve adherence during extended fat loss phases.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div variants={itemVariants}>
          <Card className="border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-800">
            <CardHeader className="flex-row items-center space-x-3 space-y-0">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-amber-700 dark:text-amber-300">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-600 dark:text-amber-400">
              This calculator provides estimates based on established formulas and your inputs. Individual results may
              vary due to genetics, health conditions, and other factors. This information is not a substitute for
              professional medical or nutritional advice. Consult with a qualified healthcare provider or registered
              dietitian before making significant changes to your diet or exercise routine.
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Export both as default and named export to ensure compatibility
export default ResultsDisplay
