import { z } from "zod"

/**
 * Form schema for the 3-step calculator.
 *
 * Deliberately removed from the old form:
 * - exerciseFrequency: was required but never used by the engine
 * - targetWeight / neckCircumference: collected but never used
 * - ethnicity options with no supported adjustment (they silently did nothing)
 */
export const formSchema = z.object({
  // Step 1 — About you
  sex: z.enum(["male", "female", "other"], { message: "Pick one to continue" }),
  age: z.coerce.number().min(15, "Must be 15 or older").max(100, "Must be 100 or younger"),
  height: z.coerce.number().min(120, "Between 120 and 250 cm").max(250, "Between 120 and 250 cm"),
  weight: z.coerce.number().min(30, "Between 30 and 300 kg").max(300, "Between 30 and 300 kg"),

  // Step 2 — Lifestyle
  activityLevel: z.enum(["sedentary", "light", "moderate", "very", "extra"], {
    message: "Pick your activity level to continue",
  }),
  trainingExperience: z.enum(["none", "beginner", "intermediate", "advanced"]).default("none"),
  bodyFat: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(3, "Between 3 and 60%").max(60, "Between 3 and 60%").optional(),
  ),

  // Step 3 — Goal
  goal: z.enum(
    [
      "lose_fat",
      "build_muscle",
      "maintain",
      "clean_bulk",
      "aggressive_bulk",
      "gain_weight",
      "improve_health",
      "recomposition",
    ],
    { message: "Pick a goal to see your plan" },
  ),
  weightLossRate: z.enum(["slow", "moderate", "fast"]).default("moderate"),
  weightGainRate: z.enum(["slow", "moderate"]).default("slow"),

  // Step 3 — Refinements (all optional)
  dietType: z.enum(["standard", "vegetarian", "vegan"]).default("standard"),
  ethnicity: z
    .enum(["default", "south_asian", "east_asian", "african", "pacific_islander", "nordic", "other"])
    .default("default"),
  waistCircumference: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(50, "Between 50 and 200 cm").max(200, "Between 50 and 200 cm").optional(),
  ),
})

export type CalculatorFormValues = z.infer<typeof formSchema>

export const stepFields: Record<number, (keyof CalculatorFormValues)[]> = {
  1: ["sex", "age", "height", "weight"],
  2: ["activityLevel", "trainingExperience", "bodyFat"],
  3: ["goal", "weightLossRate", "weightGainRate", "dietType", "ethnicity", "waistCircumference"],
}

export const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const

export const activityLevelOptions = [
  { value: "sedentary", label: "Sedentary", description: "Desk job, little movement outside of it" },
  { value: "light", label: "Lightly active", description: "Some walking, light exercise 1–2× a week" },
  { value: "moderate", label: "Moderately active", description: "On your feet often, or training 3–4× a week" },
  { value: "very", label: "Very active", description: "Physical job, or hard training 5–6× a week" },
  { value: "extra", label: "Extremely active", description: "Physical job plus intense daily training" },
] as const

export const trainingExperienceOptions = [
  { value: "none", label: "None", description: "No consistent lifting" },
  { value: "beginner", label: "Beginner", description: "Under a year" },
  { value: "intermediate", label: "Intermediate", description: "1–3 years" },
  { value: "advanced", label: "Advanced", description: "3+ years" },
] as const

export const goalOptions = [
  { value: "lose_fat", label: "Lose fat", description: "A calorie deficit, capped for safety" },
  { value: "build_muscle", label: "Build muscle", description: "A surplus sized to your training age" },
  { value: "maintain", label: "Maintain", description: "Hold steady at your maintenance" },
  { value: "recomposition", label: "Recomposition", description: "Slight deficit, high protein — both at once" },
  { value: "clean_bulk", label: "Clean bulk", description: "Moderate surplus, minimal fat gain" },
  { value: "aggressive_bulk", label: "Aggressive bulk", description: "Bigger surplus, faster scale weight" },
  { value: "gain_weight", label: "Gain weight", description: "Steady healthy weight increase" },
  { value: "improve_health", label: "Improve health", description: "Balanced intake at or near maintenance" },
] as const

export const weightLossRateOptions = [
  { value: "slow", label: "Gentle", description: "~12.5% deficit — easiest to sustain" },
  { value: "moderate", label: "Moderate", description: "~17.5% deficit — the usual pick" },
  { value: "fast", label: "Aggressive", description: "~22.5% deficit — hungrier, faster" },
] as const

export const weightGainRateOptions = [
  { value: "slow", label: "Lean", description: "+275 kcal — about 0.25 kg a week" },
  { value: "moderate", label: "Standard", description: "+550 kcal — about 0.5 kg a week" },
] as const

export const dietTypeOptions = [
  { value: "standard", label: "Omnivore" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
] as const

export const ethnicityOptions = [
  { value: "default", label: "Prefer not to say" },
  { value: "south_asian", label: "South Asian" },
  { value: "east_asian", label: "East Asian" },
  { value: "african", label: "Black / African descent" },
  { value: "pacific_islander", label: "Pacific Islander" },
  { value: "nordic", label: "Nordic / Northern European" },
  { value: "other", label: "Another background" },
] as const
