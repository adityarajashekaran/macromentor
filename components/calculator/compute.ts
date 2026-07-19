import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
} from "@/lib/calculator"
import type { CalculatorFormValues } from "./schema"

export interface CalculationResults {
  bmr: number
  bmrMethod: string
  tier: 1 | 2 | 3
  tdee: number
  palMultiplier: number
  calorieTarget: number
  deficitSurplus: number
  goalDescription: string
  userProfile: {
    age: number
    sex: CalculatorFormValues["sex"]
    height: number
    weight: number
    bodyFat?: number
    activityLevel: CalculatorFormValues["activityLevel"]
    goal: CalculatorFormValues["goal"]
    dietType: CalculatorFormValues["dietType"]
  }
  macros: ReturnType<typeof calculateMacros>
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
  metrics: {
    bmi: number
    lbm?: number
    bodyFatPercentage?: number
  }
}

const PAL: Record<CalculatorFormValues["activityLevel"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
}

const GOAL_DESCRIPTIONS: Record<string, string> = {
  lose_fat: "Fat loss",
  build_muscle: "Muscle building",
  maintain: "Weight maintenance",
  clean_bulk: "Clean bulk",
  aggressive_bulk: "Aggressive bulk",
  gain_weight: "Weight gain",
  improve_health: "Health improvement",
  recomposition: "Body recomposition",
}

/** Pure: form values in, full results object out. Mirrors lib/calculator's tiering. */
export function buildResults(data: CalculatorFormValues): CalculationResults {
  // lib's lean-mass formulas return unrounded floats; round once here for display + downstream math
  const bmr = Math.round(
    calculateBMR(
      data.weight,
      data.height,
      data.age,
      data.sex,
      data.bodyFat,
      data.trainingExperience,
      data.ethnicity,
    ),
  )

  const isTrained =
    data.trainingExperience && ["intermediate", "advanced"].includes(data.trainingExperience)
  const tier: 1 | 2 | 3 = data.bodyFat !== undefined ? (isTrained ? 1 : 2) : 3
  const bmrMethod =
    tier === 1
      ? "Cunningham equation — lean body mass and training history"
      : tier === 2
        ? "Katch-McArdle equation — lean body mass"
        : "Mifflin-St Jeor equation — the validated general formula"

  const ethnicityAdjustmentApplied =
    data.bodyFat === undefined &&
    ["south_asian", "east_asian", "african", "pacific_islander", "nordic"].includes(data.ethnicity)

  const tdee = calculateTDEE(bmr, data.activityLevel)

  const { calorieTarget, deficitSurplus } = calculateCalorieTarget(
    tdee,
    data.goal,
    data.weightLossRate,
    data.weightGainRate,
    data.bodyFat,
    data.sex,
    data.trainingExperience,
    data.height,
  )

  const macros = calculateMacros(data.weight, calorieTarget, data.goal, data.dietType)

  const heightInMeters = data.height / 100
  const bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1))
  const lbm =
    data.bodyFat !== undefined
      ? parseFloat((data.weight * (1 - data.bodyFat / 100)).toFixed(1))
      : undefined

  const micronutrients = {
    iron: data.sex === "female" && data.age < 50 ? 18 : 8,
    calcium: data.age < 25 || data.age > 50 ? 1200 : 1000,
    vitaminD: data.age > 65 ? 1000 : 800,
    omega3: 500,
    fiber: Math.round(14 * (calorieTarget / 1000)),
  }
  if (data.waistCircumference) {
    const highWaist =
      (data.sex === "male" && data.waistCircumference > 102) ||
      (data.sex === "female" && data.waistCircumference > 88)
    if (highWaist) {
      micronutrients.omega3 = Math.max(micronutrients.omega3, 1000)
    }
  }

  const minCalories = data.sex === "female" ? 1200 : 1500
  const belowMinimum = calorieTarget < minCalories
  const refeedRecommended = data.goal === "lose_fat" && (tdee - calorieTarget) / tdee > 0.2

  return {
    bmr,
    bmrMethod,
    tier,
    tdee,
    palMultiplier: PAL[data.activityLevel],
    calorieTarget,
    deficitSurplus,
    goalDescription: GOAL_DESCRIPTIONS[data.goal] ?? "Custom goal",
    userProfile: {
      age: data.age,
      sex: data.sex,
      height: data.height,
      weight: data.weight,
      bodyFat: data.bodyFat,
      activityLevel: data.activityLevel,
      goal: data.goal,
      dietType: data.dietType,
    },
    macros,
    micronutrients,
    warnings: { belowMinimum, refeedRecommended, ethnicityAdjustmentApplied },
    metrics: { bmi, lbm, bodyFatPercentage: data.bodyFat },
  }
}

/** Plain-text summary for the copy-to-clipboard action. */
export function formatSummary(r: CalculationResults): string {
  const sign = r.deficitSurplus > 0 ? "+" : ""
  return [
    `MacroMentor plan — ${r.goalDescription}`,
    ``,
    `Daily target: ${r.calorieTarget.toLocaleString()} kcal (${sign}${r.deficitSurplus.toLocaleString()} vs maintenance)`,
    `Protein: ${r.macros.protein.grams} g · Carbs: ${r.macros.carbs.grams} g · Fat: ${r.macros.fat.grams} g`,
    ``,
    `BMR ${r.bmr.toLocaleString()} kcal (${r.bmrMethod})`,
    `TDEE ${r.tdee.toLocaleString()} kcal (activity ×${r.palMultiplier})`,
    `BMI ${r.metrics.bmi}${r.metrics.lbm ? ` · Lean mass ${r.metrics.lbm} kg` : ""}`,
    ``,
    `macromentor.horizonfall.com`,
  ].join("\n")
}
