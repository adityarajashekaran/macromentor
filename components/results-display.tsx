"use client"
import { Check, Info, ArrowRight, Flame, Dumbbell, Apple, Utensils, Printer } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { DonutChart } from "@tremor/react"
// Import necessary components from recharts
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts'

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
      bodyFatPercentage?: number
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

  // Helper function to round numbers
  const round = (num: number, places: number = 0) => parseFloat(num.toFixed(places))

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
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" /> Print Results
              </Button>
              <Badge className="self-start md:self-auto bg-primary text-primary-foreground py-1.5 px-3">
                {formatGoal(results.userProfile.goal)}
              </Badge>
            </div>
          </div>

          {/* Consolidated User Profile Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 mt-6 border-t pt-4">
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

        {/* REMOVE the first ethnicity adjustment alert block */}
        {/* {ethnicityAdjustmentApplied && (
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
        )} */}

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

        {/* Surplus/Deficit and BMI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
          {/* Surplus/Deficit Card */}
          <Card className="text-center border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {results.deficitSurplus >= 0 ? "Daily Calorie Surplus" : "Daily Calorie Deficit"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${results.deficitSurplus >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.abs(round(results.deficitSurplus))} kcal
              </div>
            </CardContent>
          </Card>

          {/* BMI Card - Always Displayed */}
          <Card className="text-center border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Body Mass Index (BMI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {results.metrics ? round(results.metrics.bmi, 1) : "N/A"}
              </div>
            </CardContent>
          </Card>
          {/* Optional: Lean Body Mass Card - uncomment if needed
          {results.metrics?.lbm && (
            <Card className="text-center border shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lean Body Mass (Est.)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {round(results.metrics.lbm, 1)} kg
                </div>
              </CardContent>
            </Card>
          )}
          */}
        </motion.div>

        {/* Macronutrients, Micronutrients, and Recommendations Sections (Stacked Vertically) */}
        <motion.div variants={itemVariants} className="space-y-6"> {/* Add spacing if needed */}
          {/* Macronutrients Section */}
          <Card className="mt-4"> {/* Keep or adjust margins as needed */} 
            <CardHeader>
              <CardTitle>Macronutrient Distribution</CardTitle>
              <CardDescription>Your optimal balance of protein, carbs, and fat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                 {/* Recharts Donut Chart */}
                 <div className="flex justify-center items-center md:col-span-1 h-48 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <defs>
                         {/* Define gradients or patterns if needed */}
                       </defs>
                       <Pie
                         data={[
                           { name: 'Protein', value: results.macros.protein.calories },
                           { name: 'Carbohydrates', value: results.macros.carbs.calories },
                           { name: 'Fat', value: results.macros.fat.calories },
                         ]}
                         cx="50%"
                         cy="50%"
                         innerRadius={60} // Creates the donut hole
                         outerRadius={80} // Outer size of the chart
                         fill="#8884d8" // Default fill, overridden by Cell
                         paddingAngle={1}
                         dataKey="value"
                         stroke="hsl(var(--background))" // Use background color for stroke
                         strokeWidth={2}
                       >
                         <Label
                           value={`${round(results.calorieTarget)}`}
                           position="center" // Display total calories in the center
                           fill="hsl(var(--foreground))"
                           className="text-2xl font-bold"
                           dy={-10} // Adjust vertical position
                         />
                         <Label
                           value="calories"
                           position="center"
                           fill="hsl(var(--muted-foreground))"
                           className="text-xs"
                           dy={10} // Adjust vertical position
                         />
                         {/* Define colors for each segment */}
                         <Cell key={`cell-protein`} fill="var(--color-protein)" />
                         <Cell key={`cell-carbs`} fill="var(--color-carbs)" />
                         <Cell key={`cell-fat`} fill="var(--color-fat)" />
                       </Pie>
                       {/* Add Tooltip if needed */}
                       {/* <Tooltip /> */}
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 {/* Macro Breakdown */}
                 <div className="md:col-span-2 space-y-4">
                   {/* Protein */}
                   <div className="flex items-center">
                     <span className="h-3 w-3 rounded-full !bg-emerald-500 mr-2 flex-shrink-0"></span>
                     <div className="flex-1">
                       <div className="flex justify-between items-baseline">
                         <span className="font-medium">Protein</span>
                         <span className="font-bold text-lg">{round(results.macros.protein.grams)}g <span className="text-sm font-normal text-muted-foreground">({round(results.macros.protein.percentage)}%)</span></span>
                       </div>
                       <Progress value={results.macros.protein.percentage} className="h-2 mt-1 [&>div]:!bg-emerald-500" />
                       <p className="text-xs text-muted-foreground mt-1">
                         {round(results.macros.protein.calories)} calories • {round(results.macros.protein.grams / results.userProfile.weight, 1)}g per kg bodyweight
                       </p>
                     </div>
                   </div>
                   {/* Carbs */}
                   <div className="flex items-center">
                     <span className="h-3 w-3 rounded-full !bg-blue-500 mr-2 flex-shrink-0"></span>
                     <div className="flex-1">
                       <div className="flex justify-between items-baseline">
                         <span className="font-medium">Carbohydrates</span>
                         <span className="font-bold text-lg">{round(results.macros.carbs.grams)}g <span className="text-sm font-normal text-muted-foreground">({round(results.macros.carbs.percentage)}%)</span></span>
                       </div>
                       <Progress value={results.macros.carbs.percentage} className="h-2 mt-1 [&>div]:!bg-blue-500" />
                       <p className="text-xs text-muted-foreground mt-1">
                         {round(results.macros.carbs.calories)} calories • {round(results.macros.carbs.grams / results.userProfile.weight, 1)}g per kg bodyweight
                       </p>
                     </div>
                   </div>
                   {/* Fat */}
                   <div className="flex items-center">
                     <span className="h-3 w-3 rounded-full !bg-amber-500 mr-2 flex-shrink-0"></span>
                     <div className="flex-1">
                       <div className="flex justify-between items-baseline">
                         <span className="font-medium">Fat</span>
                         <span className="font-bold text-lg">{round(results.macros.fat.grams)}g <span className="text-sm font-normal text-muted-foreground">({round(results.macros.fat.percentage)}%)</span></span>
                       </div>
                       <Progress value={results.macros.fat.percentage} className="h-2 mt-1 [&>div]:!bg-amber-500" />
                       <p className="text-xs text-muted-foreground mt-1">
                         {round(results.macros.fat.calories)} calories • {round(results.macros.fat.grams / results.userProfile.weight, 1)}g per kg bodyweight
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
               {/* Why This Matters Section */}
               <div className="bg-muted/50 p-4 rounded-lg border">
                 <h4 className="font-semibold mb-2 text-foreground">Why This Matters</h4>
                 <ul className="space-y-2 text-sm text-muted-foreground">
                   <li><strong className="!text-emerald-600">Protein:</strong> Builds and repairs muscle tissue, supports immune function, and increases satiety. Your target of {round(results.macros.protein.grams)}g ({round(results.macros.protein.grams / results.userProfile.weight, 1)}g/kg) is optimized for your {results.userProfile.goal === 'build_muscle' ? 'build_muscle' : 'health'} goal.</li>
                   <li><strong className="!text-blue-600">Carbs:</strong> Primary energy source, fuels brain and high-intensity exercise. Your target of {round(results.macros.carbs.grams)}g provides adequate energy while balancing your overall calorie goal.</li>
                   <li><strong className="!text-amber-600">Fat:</strong> Supports hormone production, brain health, and nutrient absorption. Your target of {round(results.macros.fat.grams)}g ({round(results.macros.fat.grams / results.userProfile.weight, 1)}g/kg) ensures adequate essential fatty acids.</li>
                 </ul>
               </div>
            </CardContent>
          </Card>

          {/* Micronutrients Section */}
          <Card className="mt-4"> {/* Keep or adjust margins as needed */} 
            <CardHeader>
              <CardTitle>Micronutrient Recommendations</CardTitle>
              <CardDescription>Essential vitamins and minerals for optimal health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Iron */}
                 <Card className={highlightIron ? "border-primary" : ""}>
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium">Iron</CardTitle>
                     <Badge variant={highlightIron ? "default" : "secondary"}>{results.micronutrients.iron} mg</Badge>
                   </CardHeader>
                   <CardContent>
                     <p className="text-xs text-muted-foreground mb-2">Essential for oxygen transport</p>
                     <p className="text-sm font-medium">Good sources:</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                       <Badge variant="outline">Red meat</Badge>
                       <Badge variant="outline">Spinach</Badge>
                       <Badge variant="outline">Lentils</Badge>
                       <Badge variant="outline">Fortified cereals</Badge>
                     </div>
                   </CardContent>
                 </Card>
                 {/* Calcium */}
                 <Card className={highlightCalcium ? "border-primary" : ""}>
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium">Calcium</CardTitle>
                     <Badge variant={highlightCalcium ? "default" : "secondary"}>{results.micronutrients.calcium} mg</Badge>
                   </CardHeader>
                   <CardContent>
                     <p className="text-xs text-muted-foreground mb-2">Important for bone health</p>
                     <p className="text-sm font-medium">Good sources:</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                       <Badge variant="outline">Dairy</Badge>
                       <Badge variant="outline">Fortified plant milks</Badge>
                       <Badge variant="outline">Leafy greens</Badge>
                       <Badge variant="outline">Tofu</Badge>
                     </div>
                   </CardContent>
                 </Card>
                 {/* Vitamin D */}
                 <Card className={highlightVitD ? "border-primary" : ""}>
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium">Vitamin D</CardTitle>
                     <Badge variant={highlightVitD ? "default" : "secondary"}>{results.micronutrients.vitaminD} IU</Badge>
                   </CardHeader>
                   <CardContent>
                     <p className="text-xs text-muted-foreground mb-2">Supports immune function and bone health</p>
                     <p className="text-sm font-medium">Good sources:</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                       <Badge variant="outline">Sunlight</Badge>
                       <Badge variant="outline">Fatty fish</Badge>
                       <Badge variant="outline">Fortified foods</Badge>
                       <Badge variant="outline">Egg yolks</Badge>
                     </div>
                   </CardContent>
                 </Card>
                 {/* Omega-3 */}
                 <Card className={highlightOmega3 ? "border-primary" : ""}>
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium">Omega-3 Fatty Acids</CardTitle>
                     <Badge variant={highlightOmega3 ? "default" : "secondary"}>{results.micronutrients.omega3} mg</Badge>
                   </CardHeader>
                   <CardContent>
                     <p className="text-xs text-muted-foreground mb-2">Essential for heart and brain health</p>
                     <p className="text-sm font-medium">Good sources:</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                       <Badge variant="outline">Fatty fish</Badge>
                       <Badge variant="outline">Flaxseeds</Badge>
                       <Badge variant="outline">Walnuts</Badge>
                       <Badge variant="outline">Chia seeds</Badge>
                     </div>
                   </CardContent>
                 </Card>
                 {/* Fiber */}
                 <Card className="md:col-span-2">
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium">Fiber</CardTitle>
                     <Badge variant="secondary">{results.micronutrients.fiber} g</Badge>
                   </CardHeader>
                   <CardContent>
                     <p className="text-xs text-muted-foreground mb-2">Important for digestive health</p>
                     <p className="text-sm font-medium">Good sources:</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                       <Badge variant="outline">Whole grains</Badge>
                       <Badge variant="outline">Fruits</Badge>
                       <Badge variant="outline">Vegetables</Badge>
                       <Badge variant="outline">Legumes</Badge>
                       <Badge variant="outline">Nuts</Badge>
                       <Badge variant="outline">Seeds</Badge>
                     </div>
                   </CardContent>
                 </Card>
               </div>
               <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
                 <Info className="h-4 w-4 text-blue-600" />
                 <AlertTitle className="font-semibold">Pro Tip</AlertTitle>
                 <AlertDescription>
                   Aim for {results.micronutrients.fiber}g of fiber daily, which is approximately 14g per 1000 calories consumed. Increase fiber intake gradually and drink plenty of water to prevent digestive discomfort.
                 </AlertDescription>
               </Alert>
            </CardContent>
          </Card>

          {/* Recommendations Section */}
          <Card className="mt-4"> {/* Keep or adjust margins as needed */} 
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Optimize your nutrition plan for best results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lifestyle/Strategy Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Meal Timing</h4>
                    <p className="text-sm text-muted-foreground">Distribute your protein intake evenly throughout the day (20-30g per meal) to maximize muscle protein synthesis. Aim for 3-5 meals spaced 3-5 hours apart.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Fiber Intake</h4>
                    <p className="text-sm text-muted-foreground">Aim for {results.micronutrients.fiber}g of fiber daily from fruits, vegetables, and whole grains for digestive health. Increase intake gradually to avoid digestive discomfort.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Hydration</h4>
                    <p className="text-sm text-muted-foreground">Aim for 2-3 liters of water daily, more if you're active or in hot environments. A good rule of thumb is 30-40ml per kg of bodyweight.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Weight Management</h4>
                    <p className="text-sm text-muted-foreground">Focus on sustainable habits rather than rapid weight loss. Even modest weight loss (5-10%) can provide significant health benefits. Aim for consistency over perfection.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Reassessment</h4>
                    <p className="text-sm text-muted-foreground">Recalculate your needs every 4-6 weeks as your body composition changes. If progress stalls for more than 2 weeks, consider adjusting your calorie target.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Food Quality</h4>
                    <p className="text-sm text-muted-foreground">Focus on whole, minimally processed foods for the majority (80%) of your diet. This ensures adequate micronutrient intake and better satiety.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sample Meal Structure */}
              <div>
                <h4 className="font-semibold mb-3 text-foreground">Sample Daily Meal Structure</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Breakfast */}
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h5 className="font-medium mb-1">Breakfast (25%)</h5>
                    <p className="text-sm text-muted-foreground">~{round(results.calorieTarget * 0.25)} kcal</p>
                    <ul className="text-xs mt-2 space-y-0.5">
                      <li>Protein: ~{round(results.macros.protein.grams * 0.25)}g</li>
                      <li>Carbs: ~{round(results.macros.carbs.grams * 0.25)}g</li>
                      <li>Fat: ~{round(results.macros.fat.grams * 0.25)}g</li>
                    </ul>
                  </div>
                  {/* Lunch */}
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h5 className="font-medium mb-1">Lunch (30%)</h5>
                    <p className="text-sm text-muted-foreground">~{round(results.calorieTarget * 0.30)} kcal</p>
                    <ul className="text-xs mt-2 space-y-0.5">
                      <li>Protein: ~{round(results.macros.protein.grams * 0.30)}g</li>
                      <li>Carbs: ~{round(results.macros.carbs.grams * 0.30)}g</li>
                      <li>Fat: ~{round(results.macros.fat.grams * 0.30)}g</li>
                    </ul>
                  </div>
                  {/* Dinner */}
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h5 className="font-medium mb-1">Dinner (30%)</h5>
                    <p className="text-sm text-muted-foreground">~{round(results.calorieTarget * 0.30)} kcal</p>
                    <ul className="text-xs mt-2 space-y-0.5">
                      <li>Protein: ~{round(results.macros.protein.grams * 0.30)}g</li>
                      <li>Carbs: ~{round(results.macros.carbs.grams * 0.30)}g</li>
                      <li>Fat: ~{round(results.macros.fat.grams * 0.30)}g</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">The remaining 15% can be distributed as snacks or added to meals based on your preference.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts/Warnings (Below Sections) */}
        {(results.warnings.belowMinimum || results.warnings.refeedRecommended || ethnicityAdjustmentApplied) && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Alerts & Special Considerations</h3>
            {results.warnings.belowMinimum && (
              <Alert variant="destructive">
                <Flame className="h-4 w-4" />
                <AlertTitle>Warning: Low Calorie Intake</AlertTitle>
                <AlertDescription>
                  Your calculated target of {results.calorieTarget} kcal is below the generally recommended minimum (1200 kcal for women, 1500 kcal for men). This may not be sustainable or healthy long-term. Consider consulting a healthcare professional.
                </AlertDescription>
              </Alert>
            )}
            {results.warnings.refeedRecommended && (
              <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <Apple className="h-4 w-4 text-yellow-600" />
                <AlertTitle>Recommendation: Consider Refeed Days</AlertTitle>
                <AlertDescription>
                  For prolonged fat loss phases or very low body fat levels, incorporating planned refeed days (higher carb/calorie days) can help mitigate metabolic adaptation and hormonal imbalances.
                </AlertDescription>
              </Alert>
            )}
            {/* KEEP this alert, but update its text and remove explicit blue styling */}
            {ethnicityAdjustmentApplied && (
              <Alert>
                <Info className="h-4 w-4" /> {/* Keep Info icon, color will be default */} 
                <AlertTitle>Population-Based Adjustment Applied</AlertTitle>
                <AlertDescription>
                  Based on the optional ethnicity information provided and population-level research averages, a small
                  adjustment was applied to the initial metabolic rate estimate as body fat percentage was not available.
                  This adjustment reflects statistical averages from research studies and is not deterministic. Individual
                  metabolism varies greatly within any group, and your actual needs may differ.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}

        {/* Disclaimer Section */}
        <motion.div variants={itemVariants}>
          <Card className="mt-8 bg-muted/20 border-dashed">
            <CardHeader>
              <CardTitle className="text-base font-medium">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                The information provided by MacroMentor is intended for informational purposes only and does not constitute medical advice. The calculations are based on established formulas but individual needs may vary. Always consult with a qualified healthcare professional or registered dietitian before making significant changes to your diet or exercise routine, especially if you have underlying health conditions.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Export both as default and named export to ensure compatibility
export default ResultsDisplay
