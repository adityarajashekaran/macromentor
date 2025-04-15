"use client"
import { Check, Info, ArrowRight, Flame, Dumbbell, Apple, Utensils } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

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

  return (
    <div className="p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* Summary Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Personalized Nutrition Plan</h2>
              <p className="text-muted-foreground mt-1">{results.goalDescription}</p>
            </div>
            <Badge className="mt-2 md:mt-0 self-start md:self-auto bg-primary text-primary-foreground py-1.5 px-3">
              {formatGoal(results.userProfile.goal)}
            </Badge>
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
              <CardDescription>Your maintenance calories (energy needed to maintain current weight)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-foreground">{results.tdee} kcal</div>
              <div className="text-xs text-muted-foreground mt-1">
                Based on your activity level and exercise frequency
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border shadow-md">
            <CardHeader className="pb-2 bg-muted/30">
              <div className="flex items-center">
                <Utensils className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-base font-medium">Daily Calorie Target</CardTitle>
              </div>
              <CardDescription>
                {results.deficitSurplus > 0
                  ? `${results.deficitSurplus} kcal surplus for ${formatGoal(results.userProfile.goal)}`
                  : results.deficitSurplus < 0
                    ? `${Math.abs(results.deficitSurplus)} kcal deficit for ${formatGoal(results.userProfile.goal)}`
                    : `Maintenance calories for ${formatGoal(results.userProfile.goal)}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-primary">{results.calorieTarget} kcal</div>
              <div className="text-xs text-muted-foreground mt-1">
                {results.deficitSurplus !== 0 ? (
                  <span className="flex items-center">
                    {results.tdee} {results.deficitSurplus > 0 ? "+" : "-"} {Math.abs(results.deficitSurplus)}
                    <ArrowRight className="h-3 w-3 mx-1" />
                    {results.calorieTarget}
                  </span>
                ) : (
                  "Maintaining current weight"
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="macros" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger
                value="macros"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Apple className="h-4 w-4 mr-2" />
                Macronutrients
              </TabsTrigger>
              <TabsTrigger
                value="micro"
                className="data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Apple className="h-4 w-4 mr-2" />
                Micronutrients
              </TabsTrigger>
              <TabsTrigger
                value="tips"
                className="data-[state=active]:bg-amber-500 dark:data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="macros" className="space-y-6">
              {/* Macro Distribution Visualization */}
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-lg">Macronutrient Distribution</CardTitle>
                  <CardDescription>Your optimal balance of protein, carbs, and fat</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Pie Chart Visualization */}
                    <div className="w-full md:w-1/3 flex justify-center">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Protein Slice */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#4CAF50"
                            strokeWidth="20"
                            strokeDasharray={`${results.macros.protein.percentage * 2.51} 251`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                          {/* Carbs Slice */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#03A9F4"
                            strokeWidth="20"
                            strokeDasharray={`${results.macros.carbs.percentage * 2.51} 251`}
                            strokeDashoffset={`${-(results.macros.protein.percentage * 2.51)}`}
                            transform="rotate(-90 50 50)"
                          />
                          {/* Fat Slice */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#FFC107"
                            strokeWidth="20"
                            strokeDasharray={`${results.macros.fat.percentage * 2.51} 251`}
                            strokeDashoffset={`${-((results.macros.protein.percentage + results.macros.carbs.percentage) * 2.51)}`}
                            transform="rotate(-90 50 50)"
                          />
                          {/* Center Circle */}
                          <circle cx="50" cy="50" r="30" fill="white" className="dark:fill-background" />
                          {/* Total Calories */}
                          <text x="50" y="45" textAnchor="middle" className="text-sm font-bold fill-foreground">
                            {results.calorieTarget}
                          </text>
                          <text x="50" y="55" textAnchor="middle" className="text-xs fill-foreground">
                            calories
                          </text>
                        </svg>
                      </div>
                    </div>

                    {/* Macro Details */}
                    <div className="w-full md:w-2/3 space-y-6">
                      <div className="space-y-4">
                        {/* Protein */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2"></div>
                              <span className="font-medium">Protein</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">{results.macros.protein.grams}g</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({results.macros.protein.percentage}%)
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={results.macros.protein.percentage}
                            className="h-2 bg-muted"
                            indicatorClassName="bg-[#4CAF50]"
                          />
                          <div className="text-xs text-muted-foreground">
                            {results.macros.protein.calories} calories •{" "}
                            {(results.macros.protein.grams / results.userProfile.weight).toFixed(1)}g per kg bodyweight
                          </div>
                        </div>

                        {/* Carbs */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#03A9F4] mr-2"></div>
                              <span className="font-medium">Carbohydrates</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">{results.macros.carbs.grams}g</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({results.macros.carbs.percentage}%)
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={results.macros.carbs.percentage}
                            className="h-2 bg-muted"
                            indicatorClassName="bg-[#03A9F4]"
                          />
                          <div className="text-xs text-muted-foreground">
                            {results.macros.carbs.calories} calories •{" "}
                            {(results.macros.carbs.grams / results.userProfile.weight).toFixed(1)}g per kg bodyweight
                          </div>
                        </div>

                        {/* Fat */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#FFC107] mr-2"></div>
                              <span className="font-medium">Fat</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">{results.macros.fat.grams}g</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({results.macros.fat.percentage}%)
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={results.macros.fat.percentage}
                            className="h-2 bg-muted"
                            indicatorClassName="bg-[#FFC107]"
                          />
                          <div className="text-xs text-muted-foreground">
                            {results.macros.fat.calories} calories •{" "}
                            {(results.macros.fat.grams / results.userProfile.weight).toFixed(1)}g per kg bodyweight
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Why This Matters</h4>
                        <ul className="text-sm space-y-2 text-foreground/80">
                          <li>
                            • <span className="font-medium text-[#4CAF50]">Protein</span>: Builds and repairs muscle
                            tissue, supports immune function, and increases satiety. Your target of{" "}
                            {results.macros.protein.grams}g (
                            {(results.macros.protein.grams / results.userProfile.weight).toFixed(1)}g/kg) is optimized
                            for your {results.userProfile.goal} goal.
                          </li>
                          <li>
                            • <span className="font-medium text-[#03A9F4]">Carbs</span>: Primary energy source, fuels
                            brain and high-intensity exercise. Your target of {results.macros.carbs.grams}g provides
                            adequate energy while balancing your overall calorie goal.
                          </li>
                          <li>
                            • <span className="font-medium text-[#FFC107]">Fat</span>: Supports hormone production,
                            brain health, and nutrient absorption. Your target of {results.macros.fat.grams}g (
                            {(results.macros.fat.grams / results.userProfile.weight).toFixed(1)}g/kg) ensures adequate
                            essential fatty acids.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Body Metrics */}
              {results.metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Body Mass Index (BMI)</CardTitle>
                      <CardDescription>A general indicator of weight status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{results.metrics.bmi.toFixed(1)}</div>
                        <div className="text-sm px-2 py-1 rounded-full bg-muted/50">
                          {results.metrics.bmi < 18.5
                            ? "Underweight"
                            : results.metrics.bmi < 25
                              ? "Normal weight"
                              : results.metrics.bmi < 30
                                ? "Overweight"
                                : "Obese"}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="relative h-2 bg-muted rounded-full w-full">
                          <div
                            className="absolute h-4 w-4 rounded-full top-1/2 transform -translate-y-1/2"
                            style={{
                              left: `${Math.min(Math.max(((results.metrics.bmi - 15) / 25) * 100, 0), 100)}%`,
                              backgroundColor:
                                results.metrics.bmi < 18.5
                                  ? "#FFC107"
                                  : results.metrics.bmi < 25
                                    ? "#4CAF50"
                                    : results.metrics.bmi < 30
                                      ? "#FF9800"
                                      : "#E53935",
                            }}
                          ></div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-4">
                            <span>15</span>
                            <span>18.5</span>
                            <span>25</span>
                            <span>30</span>
                            <span>40</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {results.metrics.lbm && (
                    <Card className="border shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Lean Body Mass</CardTitle>
                        <CardDescription>Your fat-free mass (muscle, bone, organs)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{results.metrics.lbm.toFixed(1)} kg</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {((results.metrics.lbm / results.userProfile.weight) * 100).toFixed(1)}% of your total weight
                        </div>
                        <div className="mt-4">
                          <div className="relative h-6 bg-muted rounded-full w-full overflow-hidden">
                            <div
                              className="absolute h-full bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-blue-600"
                              style={{ width: `${(results.metrics.lbm / results.userProfile.weight) * 100}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                              {results.metrics.lbm.toFixed(1)} kg lean mass / {results.userProfile.weight} kg total
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="micro" className="space-y-6">
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-lg">Micronutrient Recommendations</CardTitle>
                  <CardDescription>Essential vitamins and minerals for optimal health</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Iron */}
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Iron</h3>
                          <p className="text-xs text-muted-foreground">Essential for oxygen transport</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400 border-blue-500/20 dark:border-blue-400/20"
                        >
                          {results.micronutrients.iron} mg
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Good sources:</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Red meat
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Spinach
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Lentils
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Fortified cereals
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Calcium */}
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Calcium</h3>
                          <p className="text-xs text-muted-foreground">Important for bone health</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {results.micronutrients.calcium} mg
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Good sources:</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Dairy
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Fortified plant milks
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Leafy greens
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Tofu
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Vitamin D */}
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Vitamin D</h3>
                          <p className="text-xs text-muted-foreground">Supports immune function and bone health</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/20"
                        >
                          {results.micronutrients.vitaminD} IU
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Good sources:</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Sunlight
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Fatty fish
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Fortified foods
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Egg yolks
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Omega-3 */}
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Omega-3 Fatty Acids</h3>
                          <p className="text-xs text-muted-foreground">Essential for heart and brain health</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400 border-blue-500/20 dark:border-blue-400/20"
                        >
                          {results.micronutrients.omega3} mg
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Good sources:</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Fatty fish
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Flaxseeds
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Walnuts
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Chia seeds
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Fiber */}
                    <div className="bg-card rounded-lg p-4 border col-span-1 md:col-span-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Fiber</h3>
                          <p className="text-xs text-muted-foreground">Important for digestive health</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {results.micronutrients.fiber} g
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Good sources:</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Whole grains
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Fruits
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Vegetables
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Legumes
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Nuts
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 text-foreground/80">
                            Seeds
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 bg-blue-500/10 dark:bg-blue-950/50 p-3 rounded-md text-sm text-blue-700 dark:text-blue-300">
                        <p>
                          <span className="font-medium">Pro Tip:</span> Aim for {results.micronutrients.fiber}g of fiber
                          daily, which is approximately 14g per 1000 calories consumed. Increase fiber intake gradually
                          and drink plenty of water to prevent digestive discomfort.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              {results.warnings.belowMinimum && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Minimum Calorie Warning</AlertTitle>
                  <AlertDescription>
                    Your calculated calorie target was below the recommended minimum. We've adjusted it upward to ensure
                    nutritional adequacy. Very low calorie diets should be supervised by a healthcare professional.
                  </AlertDescription>
                </Alert>
              )}

              {results.warnings.refeedRecommended && (
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-900/50">
                  <Info className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <AlertTitle className="text-amber-700 dark:text-amber-300">Refeed Recommendation</AlertTitle>
                  <AlertDescription className="text-amber-600 dark:text-amber-400">
                    Your deficit is significant. Consider adding one refeed day per week at maintenance calories (
                    {results.tdee} kcal) to prevent metabolic adaptation and support long-term adherence.
                  </AlertDescription>
                </Alert>
              )}

              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
                  <CardDescription>Optimize your nutrition plan for best results</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Meal Timing</p>
                          <p className="text-sm text-muted-foreground">
                            Distribute your protein intake evenly throughout the day (20-30g per meal) to maximize
                            muscle protein synthesis. Aim for 3-5 meals spaced 3-5 hours apart.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Hydration</p>
                          <p className="text-sm text-muted-foreground">
                            Aim for 2-3 liters of water daily, more if you're active or in hot environments. A good rule
                            of thumb is 30-40ml per kg of bodyweight.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Reassessment</p>
                          <p className="text-sm text-muted-foreground">
                            Recalculate your needs every 4-6 weeks as your body composition changes. If progress stalls
                            for more than 2 weeks, consider adjusting your calorie target.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Fiber Intake</p>
                          <p className="text-sm text-muted-foreground">
                            Aim for {results.micronutrients.fiber}g of fiber daily from fruits, vegetables, and whole
                            grains for digestive health. Increase intake gradually to avoid digestive discomfort.
                          </p>
                        </div>
                      </div>

                      {results.metrics && results.metrics.bmi > 25 && (
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Weight Management</p>
                            <p className="text-sm text-muted-foreground">
                              Focus on sustainable habits rather than rapid weight loss. Even modest weight loss (5-10%)
                              can provide significant health benefits. Aim for consistency over perfection.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Food Quality</p>
                          <p className="text-sm text-muted-foreground">
                            Focus on whole, minimally processed foods for the majority (80%) of your diet. This ensures
                            adequate micronutrient intake and better satiety.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-muted/30 p-4 rounded-lg border">
                    <h3 className="font-medium text-foreground mb-2">Sample Daily Meal Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-card p-3 rounded border">
                        <p className="font-medium">Breakfast (25%)</p>
                        <p className="text-muted-foreground">~{Math.round(results.calorieTarget * 0.25)} kcal</p>
                        <div className="mt-1 text-xs">
                          <div>Protein: ~{Math.round(results.macros.protein.grams * 0.25)}g</div>
                          <div>Carbs: ~{Math.round(results.macros.carbs.grams * 0.25)}g</div>
                          <div>Fat: ~{Math.round(results.macros.fat.grams * 0.25)}g</div>
                        </div>
                      </div>
                      <div className="bg-card p-3 rounded border">
                        <p className="font-medium">Lunch (30%)</p>
                        <p className="text-muted-foreground">~{Math.round(results.calorieTarget * 0.3)} kcal</p>
                        <div className="mt-1 text-xs">
                          <div>Protein: ~{Math.round(results.macros.protein.grams * 0.3)}g</div>
                          <div>Carbs: ~{Math.round(results.macros.carbs.grams * 0.3)}g</div>
                          <div>Fat: ~{Math.round(results.macros.fat.grams * 0.3)}g</div>
                        </div>
                      </div>
                      <div className="bg-card p-3 rounded border">
                        <p className="font-medium">Dinner (30%)</p>
                        <p className="text-muted-foreground">~{Math.round(results.calorieTarget * 0.3)} kcal</p>
                        <div className="mt-1 text-xs">
                          <div>Protein: ~{Math.round(results.macros.protein.grams * 0.3)}g</div>
                          <div>Carbs: ~{Math.round(results.macros.carbs.grams * 0.3)}g</div>
                          <div>Fat: ~{Math.round(results.macros.fat.grams * 0.3)}g</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      The remaining 15% can be distributed as snacks or added to meals based on your preference.
                    </p>
                  </div>

                  <div className="mt-6 bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-medium text-foreground mb-2">Adjusting Your Plan</h3>
                    <div className="text-sm text-foreground/80 space-y-2">
                      <p>
                        <strong>Monitor Progress:</strong> Track your weight, measurements, and how you feel. Expect
                        normal fluctuations day-to-day.
                      </p>
                      <p>
                        <strong>Reassess Regularly:</strong> Recalculate your needs every 4-6 weeks or after significant
                        weight changes ({">"}3-5%).
                      </p>
                      <p>
                        <strong>Plateau Strategy:</strong> If progress stalls for more than 2 weeks despite adherence,
                        consider adjusting your calorie target by 5-10%.
                      </p>
                      {results.warnings.refeedRecommended && (
                        <p>
                          <strong>Consider Refeeds:</strong> Your deficit is significant. Adding one day per week at
                          maintenance calories ({results.tdee} kcal) may help prevent metabolic adaptation.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 bg-muted/30 p-4 rounded-lg border">
                    <h3 className="font-medium text-foreground mb-2">Limitations & Considerations</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• All calculations are estimates based on population averages and formulas.</li>
                      <li>• Individual metabolism can vary by 10-20% from predicted values.</li>
                      <li>• Factors like sleep, stress, and medical conditions can affect your actual needs.</li>
                      <li>• This calculator cannot account for all individual variations or medical conditions.</li>
                      <li>
                        • Results should be treated as a starting point to adjust based on your real-world progress.
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      <strong>Disclaimer:</strong> This calculator provides estimates based on formulas and research.
                      Individual needs may vary. These recommendations are for informational purposes only and should
                      not replace professional medical or nutritional advice.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Export both as default and named export to ensure compatibility
export default ResultsDisplay
