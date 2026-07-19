import { describe, it, expect } from "vitest"
import { buildResults } from "./compute"
import type { CalculatorFormValues } from "./schema"
import { lbToKg, ftInToCm } from "@/lib/units"

/**
 * Proves the unit-conversion boundary feeds the metric engine faithfully:
 * a US-entered profile, converted to metric, must produce the exact
 * hand-computed engine numbers — and must be identical to a metric user who
 * enters the same converted values. The engine itself never sees units.
 *
 * Ground truth for 185 lb, 5'10", 34 y, male, moderate activity, lose fat (moderate):
 *   weight = 185 lb  = 83.91458845 kg
 *   height = 5'10"   = 177.8 cm
 *   BMR (Mifflin)    = 10*83.9146 + 6.25*177.8 - 5*34 + 5 = 1785
 *   TDEE             = round(1785 * 1.55)                  = 2767
 *   target (-17.5%)  = round(2767 * 0.825)                = 2283
 *   deficit          = -round(2767 * 0.175)               = -484
 *   protein          = round(83.9146 * 2.2)               = 185 g
 *   fat              = round(max(2283*0.275/9, 83.9146*0.6)) = 70 g
 *   carbs            = round((2283 - 740 - 630) / 4)       = 228 g
 */

const base: Omit<CalculatorFormValues, "weight" | "height"> = {
  sex: "male",
  age: 34,
  activityLevel: "moderate",
  trainingExperience: "none",
  bodyFat: undefined,
  goal: "lose_fat",
  weightLossRate: "moderate",
  weightGainRate: "slow",
  dietType: "standard",
  ethnicity: "default",
  waistCircumference: undefined,
}

describe("unit conversion feeds the metric engine without drift", () => {
  it("converts a US profile to the expected metric values", () => {
    expect(lbToKg(185)).toBeCloseTo(83.91458845, 8)
    expect(ftInToCm(5, 10)).toBeCloseTo(177.8, 10)
  })

  it("produces the hand-computed engine results from converted US input", () => {
    const r = buildResults({ ...base, weight: lbToKg(185), height: ftInToCm(5, 10) })

    expect(r.bmr).toBe(1785)
    expect(r.tdee).toBe(2767)
    expect(r.calorieTarget).toBe(2283)
    expect(r.deficitSurplus).toBe(-484)
    expect(r.macros.protein.grams).toBe(185)
    expect(r.macros.fat.grams).toBe(70)
    expect(r.macros.carbs.grams).toBe(228)
  })

  it("gives the same plan whether entered in US or equivalent metric units", () => {
    // The engine is unit-agnostic: the microscopic float difference between
    // lbToKg(185) and the 83.9146 literal rounds away, so every computed
    // output is identical. (userProfile echoes the raw input weight, which
    // legitimately differs in its last bit — so we compare the outputs.)
    const fromUS = buildResults({ ...base, weight: lbToKg(185), height: ftInToCm(5, 10) })
    const fromMetric = buildResults({ ...base, weight: 83.91458845, height: 177.8 })

    expect(fromUS.bmr).toBe(fromMetric.bmr)
    expect(fromUS.tdee).toBe(fromMetric.tdee)
    expect(fromUS.calorieTarget).toBe(fromMetric.calorieTarget)
    expect(fromUS.deficitSurplus).toBe(fromMetric.deficitSurplus)
    expect(fromUS.macros).toEqual(fromMetric.macros)
    expect(fromUS.metrics.bmi).toBe(fromMetric.metrics.bmi)
  })

  it("keeps macros in grams regardless of input units (grams are universal)", () => {
    const r = buildResults({ ...base, weight: lbToKg(185), height: ftInToCm(5, 10) })
    // grams never convert — only the display layer reframes energy/weight
    expect(r.macros.protein.grams + r.macros.fat.grams + r.macros.carbs.grams).toBe(483)
  })
})
