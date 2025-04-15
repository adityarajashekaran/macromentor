// BMR Calculation Functions

export function calculateBMR(
  weight: number, // in kg
  height: number, // in cm
  age: number,
  sex: "male" | "female" | "other",
  bodyFat?: number, // as percentage
  trainingExperience?: "none" | "beginner" | "intermediate" | "advanced",
): number {
  // If body fat percentage is provided
  if (bodyFat !== undefined) {
    // Calculate lean body mass
    const lbm = weight * (1 - bodyFat / 100)

    // Use Cunningham for trained individuals
    if (trainingExperience && ["intermediate", "advanced"].includes(trainingExperience)) {
      return 500 + 22 * lbm // Cunningham Equation
    }

    // Use Katch-McArdle for those with body fat data
    return 370 + 21.6 * lbm // Katch-McArdle Equation
  }

  // Otherwise use Mifflin-St Jeor
  let bmr = 0

  if (sex === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else if (sex === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  } else {
    // Gender-neutral approach
    bmr = 10 * weight + 6.25 * height - 5 * age - 78
  }

  // Age adjustment for those over 40
  if (age > 40) {
    const decadesOver40 = (age - 40) / 10
    bmr = bmr * (1 - 0.01 * decadesOver40)
  }

  return Math.round(bmr)
}

// TDEE Calculation
export function calculateTDEE(
  bmr: number,
  activityLevel: "sedentary" | "light" | "moderate" | "very" | "extra",
  trainingExperience?: "none" | "beginner" | "intermediate" | "advanced",
  ethnicity?: "default" | "south_asian" | "nordic" | "other",
): number {
  // Base activity multipliers
  let activityMultiplier = 1.2 // Default sedentary

  switch (activityLevel) {
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

  // Ethnicity adjustment
  if (ethnicity === "south_asian") {
    activityMultiplier *= 0.95 // 5% reduction
  } else if (ethnicity === "nordic") {
    activityMultiplier *= 1.03 // 3% increase
  }

  // Training adjustment
  if (trainingExperience && trainingExperience !== "none") {
    activityMultiplier *= 1.03 // Additional 3% for recovery demands
  }

  return Math.round(bmr * activityMultiplier)
}

// Calculate Calorie Target based on goal
export function calculateCalorieTarget(
  tdee: number,
  goal: string,
  weightLossRate?: "slow" | "moderate" | "fast",
  weightGainRate?: "slow" | "moderate",
  bodyFat?: number,
  sex?: "male" | "female" | "other",
  trainingExperience?: "none" | "beginner" | "intermediate" | "advanced",
): { calorieTarget: number; deficitSurplus: number } {
  let calorieTarget = tdee
  let deficitSurplus = 0

  switch (goal) {
    case "lose_fat":
      let deficitPercentage = 0.15 // Default moderate
      if (weightLossRate === "slow") deficitPercentage = 0.1
      if (weightLossRate === "fast") deficitPercentage = 0.25

      // Cap deficit for lean individuals
      if (bodyFat && sex) {
        if ((sex === "male" && bodyFat < 15) || (sex === "female" && bodyFat < 22)) {
          deficitPercentage = Math.min(deficitPercentage, 0.15)
        }
      }

      calorieTarget = Math.round(tdee * (1 - deficitPercentage))
      deficitSurplus = -Math.round(tdee * deficitPercentage)
      break

    case "build_muscle":
      let surplusPercentage = 0.1 // Default 10%

      if (trainingExperience === "beginner") {
        surplusPercentage = 0.15 // 15% for beginners
      } else if (trainingExperience === "advanced") {
        surplusPercentage = 0.05 // 5% for advanced
      }

      calorieTarget = Math.round(tdee * (1 + surplusPercentage))
      deficitSurplus = Math.round(tdee * surplusPercentage)
      break

    case "maintain":
      calorieTarget = tdee
      deficitSurplus = 0
      break

    case "clean_bulk":
      calorieTarget = Math.round(tdee * 1.12) // 12% surplus
      deficitSurplus = Math.round(tdee * 0.12)
      break

    case "aggressive_bulk":
      calorieTarget = Math.round(tdee * 1.2) // 20% surplus
      deficitSurplus = Math.round(tdee * 0.2)
      break

    case "gain_weight":
      let gainSurplus = 0.1 // Default 10%
      if (weightGainRate === "moderate") gainSurplus = 0.15

      calorieTarget = Math.round(tdee * (1 + gainSurplus))
      deficitSurplus = Math.round(tdee * gainSurplus)
      break

    case "improve_health":
      // Slight deficit if overweight, otherwise maintenance
      const isOverweight = bodyFat ? (sex === "male" ? bodyFat > 20 : bodyFat > 30) : false

      calorieTarget = isOverweight ? Math.round(tdee * 0.95) : tdee
      deficitSurplus = isOverweight ? -Math.round(tdee * 0.05) : 0
      break

    case "recomposition":
      // Slight deficit with high protein
      calorieTarget = Math.round(tdee * 0.95) // 5% deficit
      deficitSurplus = -Math.round(tdee * 0.05)
      break
  }

  return { calorieTarget, deficitSurplus }
}

// Calculate Macronutrients
export function calculateMacros(
  weight: number, // in kg
  calorieTarget: number,
  goal: string,
  dietType: "standard" | "vegetarian" | "vegan" = "standard",
): {
  protein: { grams: number; calories: number; percentage: number }
  fat: { grams: number; calories: number; percentage: number }
  carbs: { grams: number; calories: number; percentage: number }
} {
  // Determine protein target based on goal
  let proteinPerKg = 1.8 // Default

  switch (goal) {
    case "lose_fat":
    case "recomposition":
      proteinPerKg = 2.4 // Higher protein for fat loss/recomp
      break
    case "build_muscle":
    case "clean_bulk":
      proteinPerKg = 2.2 // High protein for muscle building
      break
    case "aggressive_bulk":
      proteinPerKg = 2.0 // Moderate-high protein for bulking
      break
    case "gain_weight":
      proteinPerKg = 1.6 // Moderate protein for weight gain
      break
    case "maintain":
    case "improve_health":
      proteinPerKg = 1.8 // Moderate protein for maintenance/health
      break
  }

  // Adjust protein for diet type
  if (dietType === "vegetarian") {
    proteinPerKg *= 1.1 // 10% more for vegetarians
  } else if (dietType === "vegan") {
    proteinPerKg *= 1.2 // 20% more for vegans
  }

  // Calculate protein target
  const proteinGrams = Math.round(weight * proteinPerKg)
  const proteinCalories = proteinGrams * 4

  // Calculate fat target (0.8-1.0g per kg)
  let fatMultiplier = 0.8
  if (goal === "lose_fat" || goal === "recomposition") {
    fatMultiplier = 1.0 // Higher fat for cutting
  }

  const fatGrams = Math.round(weight * fatMultiplier)
  const fatCalories = fatGrams * 9

  // Calculate remaining calories for carbs
  const carbCalories = calorieTarget - proteinCalories - fatCalories
  let carbGrams = Math.round(carbCalories / 4)

  // Ensure minimum carbs (at least 50g)
  if (carbGrams < 50) {
    carbGrams = 50
    // Recalculate calories
    const newCalorieTarget = proteinCalories + fatCalories + carbGrams * 4
    // This would require recalculating percentages
  }

  // Calculate macronutrient percentages
  const totalCalories = proteinCalories + fatCalories + carbGrams * 4
  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100)
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100)
  const carbPercentage = Math.round(((carbGrams * 4) / totalCalories) * 100)

  return {
    protein: {
      grams: proteinGrams,
      calories: proteinCalories,
      percentage: proteinPercentage,
    },
    fat: {
      grams: fatGrams,
      calories: fatCalories,
      percentage: fatPercentage,
    },
    carbs: {
      grams: carbGrams,
      calories: carbGrams * 4,
      percentage: carbPercentage,
    },
  }
}
