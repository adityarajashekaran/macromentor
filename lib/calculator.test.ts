import { describe, it, expect } from 'vitest'
import { calculateBMR, calculateTDEE, calculateCalorieTarget, calculateMacros } from './calculator'

describe('calculateBMR - Based on healthcalculations.md Spec', () => {
  // A. `calculateBMR` Function Tests (Spec Alignment)

  // Task: Test Mifflin-St Jeor (Male)
  it('should calculate BMR correctly for males using Mifflin-St Jeor', () => {
    // Subtask 1
    expect(calculateBMR(80, 180, 30, 'male')).toBeCloseTo(1780)
    // Subtask 2
    expect(calculateBMR(90, 175, 60, 'male')).toBeCloseTo(1665)
  })

  // Task: Test Mifflin-St Jeor (Female)
  it('should calculate BMR correctly for females using Mifflin-St Jeor', () => {
    // Subtask 1
    expect(calculateBMR(60, 165, 30, 'female')).toBe(1320)
    // Subtask 2
    expect(calculateBMR(70, 160, 60, 'female')).toBe(1214)
  })

  // Task: Test Mifflin-St Jeor (Other)
  it('should calculate BMR correctly for other sex using Mifflin-St Jeor averaged constant', () => {
    // Subtask 1
    expect(calculateBMR(70, 170, 30, 'other')).toBeCloseTo(1535)
  })

  // Task: Test Mifflin-St Jeor Age Adjustment (>40) - Spec Alignment
  it('should apply age adjustment based on FLOOR per decade over 40 (Spec)', () => {
    // Subtask 1: Female, 45 -> floor((45-40)/10) = 0 -> 0% adjustment
    const baseBmrFemale45 = (10 * 65) + (6.25 * 168) - (5 * 45) - 161 // = 1314
    expect(calculateBMR(65, 168, 45, 'female')).toBe(1314)

    // Subtask 2: Male, 55 -> floor((55-40)/10) = 1 -> 1% adjustment
    const baseBmrMale55 = (10 * 85) + (6.25 * 182) - (5 * 55) + 5 // = 1717.5
    expect(calculateBMR(85, 182, 55, 'male')).toBe(1700)
  })

  // Task: Test Katch-McArdle
  it('should calculate BMR correctly using Katch-McArdle when bodyFat is provided', () => {
    const weight1 = 80
    const bf1 = 15
    const lbm1 = weight1 * (1 - bf1 / 100) // 68kg
    // Expected: 370 + 21.6 * 68 = 1838.8
    expect(calculateBMR(weight1, 180, 30, 'male', bf1)).toBeCloseTo(1838.8)

    const weight2 = 60
    const bf2 = 25
    const lbm2 = weight2 * (1 - bf2 / 100) // 45kg
    // Expected: 370 + 21.6 * 45 = 1342
    expect(calculateBMR(weight2, 165, 30, 'female', bf2)).toBeCloseTo(1342)
  })

  // Task: Test Cunningham
  it('should calculate BMR correctly using Cunningham for trained individuals with bodyFat', () => {
    const weight1 = 80
    const bf1 = 15
    const lbm1 = weight1 * (1 - bf1 / 100) // 68kg
    // Expected: 500 + 22 * 68 = 1996
    expect(calculateBMR(weight1, 180, 30, 'male', bf1, 'intermediate')).toBeCloseTo(1996)

    const weight2 = 90
    const bf2 = 12
    const lbm2 = weight2 * (1 - bf2 / 100) // 79.2kg
    // Expected: 500 + 22 * 79.2 = 2242.4
    expect(calculateBMR(weight2, 175, 40, 'male', bf2, 'advanced')).toBeCloseTo(2242.4)
  })

  // Task: Test BMR Tier Logic
  it('should select Cunningham when BF% and intermediate/advanced training experience are provided', () => {
    // Mock or spy on the math if needed, but testing output is sufficient here
    const result = calculateBMR(80, 180, 30, 'male', 15, 'intermediate')
    expect(result).toBeCloseTo(1996) // Cunningham result from previous test
  })

  it('should select Katch-McArdle when BF% is provided but training experience is none/beginner/undefined', () => {
    const result1 = calculateBMR(80, 180, 30, 'male', 15, 'none')
    expect(result1).toBeCloseTo(1838.8)
    const result2 = calculateBMR(80, 180, 30, 'male', 15, 'beginner')
    expect(result2).toBeCloseTo(1838.8)
    const result3 = calculateBMR(80, 180, 30, 'male', 15)
    expect(result3).toBeCloseTo(1838.8)
  })

  it('should select Mifflin-St Jeor when BF% is not provided', () => {
    const result = calculateBMR(80, 180, 30, 'male')
    expect(result).toBeCloseTo(1780)
  })

  // Task: Test Edge Cases
  it('should handle edge cases for age, weight, height without failing', () => {
    expect(() => calculateBMR(30, 120, 15, 'female')).not.toThrow()
    expect(() => calculateBMR(300, 250, 100, 'male')).not.toThrow()
  })

  it('should handle edge cases for body fat percentage', () => {
    expect(() => calculateBMR(70, 170, 30, 'male', 3)).not.toThrow()
    expect(calculateBMR(70, 170, 30, 'male', 3)).toBeGreaterThan(0)
    expect(() => calculateBMR(70, 170, 30, 'male', 60)).not.toThrow()
    expect(calculateBMR(70, 170, 30, 'male', 60)).toBeGreaterThan(0)
  })

  it('should handle extreme input values', () => {
    // Very low values
    expect(calculateBMR(20, 100, 10, 'female')).toBeGreaterThan(0)
    expect(calculateBMR(20, 100, 10, 'male', 5)).toBeGreaterThan(0) // Low BF
    expect(calculateBMR(20, 100, 10, 'male', 3, 'advanced')).toBeGreaterThan(0) // Low BF, trained
    // Very high values
    expect(calculateBMR(250, 220, 90, 'male')).toBeGreaterThan(0)
    expect(calculateBMR(250, 220, 90, 'female', 55)).toBeGreaterThan(0) // High BF
    expect(calculateBMR(250, 220, 90, 'female', 50, 'intermediate')).toBeGreaterThan(0) // High BF, trained
  })

  it('should handle age adjustment boundaries correctly', () => {
    // Age 40: No adjustment. Base=1567.5 -> round 1568
    expect(calculateBMR(70, 170, 40, 'male')).toBe(1568) // Corrected from 1566
    // Age 49: floor((49-40)/10) = 0 -> No adjustment. Base=1522.5 -> round 1523
    expect(calculateBMR(70, 170, 49, 'male')).toBe(1523) // Corrected from 1522
    // Age 50: floor((50-40)/10) = 1 -> 1% adjustment
    const base50 = 10 * 70 + 6.25 * 170 - 5 * 50 + 5 // Male = 1516.25
    const adj50 = base50 * (1 - 0.01 * 1) // 1516.25 * 0.99 = 1502.325 -> round 1502
    expect(calculateBMR(70, 170, 50, 'male')).toBe(1502)
    // Age 51: floor((51-40)/10) = 1 -> 1% adjustment
    const base51 = 10 * 70 + 6.25 * 170 - 5 * 51 + 5 // Male = 1512.5
    const adj51 = base51 * (1 - 0.01 * 1) // 1512.5 * 0.99 = 1497.375 -> round 1497
    expect(calculateBMR(70, 170, 51, 'male')).toBe(1497)
  })

  it('should handle other sex with adjustments', () => {
    // Other sex, age 55 -> floor(1.5) = 1 -> 1% adjustment
    // Base=1409.5. Adj=1409.5*0.99 = 1395.405 -> round 1395
    expect(calculateBMR(70, 170, 55, 'other')).toBe(1395) // Corrected from 1394
    // Other sex with BF% (should use Katch-McArdle)
    const lbmOther = 70 * (1 - 20/100) // 56kg
    const katchOther = 370 + 21.6 * lbmOther // 370 + 1209.6 = 1579.6 -> 1580 (Final round? No, KM has no rounding)
    expect(calculateBMR(70, 170, 55, 'other', 20)).toBeCloseTo(1579.6)
    // Other sex with BF% and Trained (should use Cunningham)
    const cunnOther = 500 + 22 * lbmOther // 500 + 1232 = 1732
    expect(calculateBMR(70, 170, 55, 'other', 20, 'intermediate')).toBeCloseTo(1732)
  })

  it('should apply Tier 3 ethnicity adjustments ONLY when BF% is not provided (Mifflin)', () => {
    const weight = 70, height = 170, age = 30
    const baseBmrMale = 10 * weight + 6.25 * height - 5 * age + 5 // 1617.5
    const baseBmrFemale = 10 * weight + 6.25 * height - 5 * age - 161 // 1301.5

    // Research-backed downward adjustments (see citations in calculator.ts):
    // standard formulas over-predict BMR in each of these groups.
    expect(calculateBMR(weight, height, age, 'male', undefined, undefined, 'south_asian')).toBe(Math.round(baseBmrMale * 0.96)) // -4%
    expect(calculateBMR(weight, height, age, 'female', undefined, undefined, 'east_asian')).toBe(Math.round(baseBmrFemale * 0.96)) // -4%
    expect(calculateBMR(weight, height, age, 'male', undefined, undefined, 'african')).toBe(Math.round(baseBmrMale * 0.95)) // -5%
    expect(calculateBMR(weight, height, age, 'female', undefined, undefined, 'default')).toBe(Math.round(baseBmrFemale)) // no adjustment
    expect(calculateBMR(weight, height, age, 'male', undefined, undefined, 'other')).toBe(Math.round(baseBmrMale)) // no adjustment

    // Test that adjustment is NOT applied if BF% is provided (Katch used)
    const lbm = weight * (1 - 20/100) // 56kg
    const katchBmr = 370 + 21.6 * lbm // 1579.6
    expect(calculateBMR(weight, height, age, 'male', 20, undefined, 'south_asian')).toBeCloseTo(katchBmr)

    // Test that adjustment is NOT applied if BF% and training provided (Cunningham used)
    const cunnBmr = 500 + 22 * lbm // 1732
    expect(calculateBMR(weight, height, age, 'male', 20, 'intermediate', 'south_asian')).toBeCloseTo(cunnBmr)
  })
})

describe('calculateTDEE - Based on healthcalculations.md Spec', () => {
  const bmr = 1500

  // B. `calculateTDEE` Function Tests (Spec Alignment)

  // Task: Test Base Activity Multipliers (Simpler PAL version from Spec Section 4, Item 4)
  // Note: The code implements *different* logic involving extra training/ethnicity multipliers.
  // These tests check ONLY the base PALs from the spec, ignoring the code's extra multipliers.
  it('should calculate TDEE based on simpler PAL multipliers from spec (ignoring code\'s extra adjustments)', () => {
    expect(calculateTDEE(bmr, 'sedentary')).toBeCloseTo(1800)   // 1500 * 1.2
    expect(calculateTDEE(bmr, 'light')).toBeCloseTo(2063)     // 1500 * 1.375
    expect(calculateTDEE(bmr, 'moderate')).toBeCloseTo(2325)  // 1500 * 1.55
    expect(calculateTDEE(bmr, 'very')).toBeCloseTo(2588)      // 1500 * 1.725
    expect(calculateTDEE(bmr, 'extra')).toBeCloseTo(2850)     // 1500 * 1.9
  })

  // Removing tests for training/ethnicity adjustments within calculateTDEE,
  // as spec puts ethnicity adjustments in BMR Tier 3 and calculates TDEE based on PAL derived from NEAT/EAT or simpler PALs.
  // The current code's adjustments within calculateTDEE diverge from the spec.
})

describe('calculateCalorieTarget - Based on healthcalculations.md Spec', () => {
  const tdee = 2500

  // C. `calculateCalorieTarget` Function Tests (Spec Alignment)

  // Task: Test Goal: 'lose_fat' (Spec Alignment)
  it('should calculate target for lose_fat goal with different rates (Spec)', () => {
    // Spec: Slow ~0.5% BW (~10-15% deficit), Moderate ~0.75% BW (~15-20%), Fast ~1.0% BW (~20-25%)
    expect(calculateCalorieTarget(tdee, 'lose_fat', 'slow').calorieTarget).toBe(Math.round(tdee * (1 - 0.125)))
    expect(calculateCalorieTarget(tdee, 'lose_fat', 'slow').deficitSurplus).toBe(-Math.round(tdee * 0.125))
    expect(calculateCalorieTarget(tdee, 'lose_fat', 'moderate').calorieTarget).toBe(Math.round(tdee * (1 - 0.175)))
    expect(calculateCalorieTarget(tdee, 'lose_fat', 'moderate').deficitSurplus).toBe(-Math.round(tdee * 0.175))
    expect(calculateCalorieTarget(tdee, 'lose_fat', 'fast').calorieTarget).toBe(Math.round(tdee * (1 - 0.225)))
    expect(calculateCalorieTarget(tdee, 'lose_fat', 'fast').deficitSurplus).toBe(-Math.round(tdee * 0.225))
  })

  it('should apply lean body mass cap for lose_fat goal (Spec: Max 15% deficit if lean)', () => {
    // This logic aligns between spec and code
    const resultMale = calculateCalorieTarget(tdee, 'lose_fat', 'fast', undefined, 12, 'male')
    expect(resultMale.calorieTarget).toBeCloseTo(tdee * (1 - 0.15)) // Capped at 15%
    expect(resultMale.deficitSurplus).toBeCloseTo(tdee * -0.15)
    const resultFemale = calculateCalorieTarget(tdee, 'lose_fat', 'fast', undefined, 20, 'female')
    expect(resultFemale.calorieTarget).toBeCloseTo(tdee * (1 - 0.15)) // Capped at 15%
    expect(resultFemale.deficitSurplus).toBeCloseTo(tdee * -0.15)
  })

  // Task: Test High Body Fat Deficit Increase (Spec - Missing in Code)
  it('should allow higher deficit (up to 25%) for lose_fat goal if BF% is high (Spec - Likely Fails)', () => {
    // Spec: Max Deficit: 25% (only if Body Fat >30% M / >35% F)
    const resultMaleHighBF = calculateCalorieTarget(tdee, 'lose_fat', 'fast', undefined, 35, 'male') // Fast rate default 22.5% < 25% cap
    expect(resultMaleHighBF.calorieTarget).toBeCloseTo(tdee * (1 - 0.25)) // Expect 25% deficit allowed
    expect(resultMaleHighBF.deficitSurplus).toBeCloseTo(tdee * -0.25)

    const resultFemaleHighBF = calculateCalorieTarget(tdee, 'lose_fat', 'fast', undefined, 40, 'female')
    expect(resultFemaleHighBF.calorieTarget).toBeCloseTo(tdee * (1 - 0.25)) // Expect 25% deficit allowed
    expect(resultFemaleHighBF.deficitSurplus).toBeCloseTo(tdee * -0.25)
  })

  // Task: Test Goal: 'build_muscle' (Spec Alignment)
  it('should calculate target for build_muscle goal based on experience (Spec: B:10-15%, I:5-10%, A:5%)', () => {
    expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'beginner').calorieTarget).toBeCloseTo(Math.round(tdee * 1.125)) // Adjusted for rounding
    expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'beginner').deficitSurplus).toBeCloseTo(Math.round(tdee * 0.125)) // Adjusted for rounding
    expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'intermediate').calorieTarget).toBeCloseTo(Math.round(tdee * 1.075)) // Adjusted for rounding
    expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'intermediate').deficitSurplus).toBeCloseTo(Math.round(tdee * 0.075)) // Adjusted for rounding
    expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'advanced').calorieTarget).toBeCloseTo(Math.round(tdee * 1.05)) // Adjusted for rounding
    expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'advanced').deficitSurplus).toBeCloseTo(Math.round(tdee * 0.05)) // Adjusted for rounding
    // Default is intermediate in function now
    expect(calculateCalorieTarget(tdee, 'build_muscle').calorieTarget).toBeCloseTo(Math.round(tdee * 1.075)) // Adjusted for rounding
  })

  // Task: Test Goal: 'maintain' (Aligns)
  it('should calculate target for maintain goal', () => {
    expect(calculateCalorieTarget(tdee, 'maintain').calorieTarget).toBe(tdee)
    expect(calculateCalorieTarget(tdee, 'maintain').deficitSurplus).toBe(0)
  })

  // Task: Test Goal: 'clean_bulk' (Spec Alignment)
  it('should calculate target for clean_bulk goal (Spec: Lower end surplus, e.g., 5-10%)', () => {
    expect(calculateCalorieTarget(tdee, 'clean_bulk').calorieTarget).toBeCloseTo(Math.round(tdee * 1.075)) // Adjusted for rounding
    expect(calculateCalorieTarget(tdee, 'clean_bulk').deficitSurplus).toBeCloseTo(Math.round(tdee * 0.075)) // Adjusted for rounding
  })

  // Task: Test Goal: 'aggressive_bulk' (Spec Alignment)
  it('should calculate target for aggressive_bulk goal (Spec: Higher end surplus, e.g., 15-20%)', () => {
    expect(calculateCalorieTarget(tdee, 'aggressive_bulk').calorieTarget).toBeCloseTo(Math.round(tdee * 1.175)) // Adjusted for rounding
    expect(calculateCalorieTarget(tdee, 'aggressive_bulk').deficitSurplus).toBeCloseTo(Math.round(tdee * 0.175)) // Adjusted for rounding
  })

  // Task: Test Goal: 'gain_weight' (Spec Alignment - assumes ~0.25kg/wk for slow, ~0.5kg/wk for moderate)
  it('should calculate target for gain_weight goal (Spec)', () => {
    // Surplus = Pace(kg/wk) * 7700 / 7 days/wk = Pace * 1100
    // Slow: 0.25 * 1100 = 275 kcal surplus
    expect(calculateCalorieTarget(tdee, 'gain_weight', undefined, 'slow').calorieTarget).toBeCloseTo(tdee + 275)
    expect(calculateCalorieTarget(tdee, 'gain_weight', undefined, 'slow').deficitSurplus).toBeCloseTo(275)
    // Moderate: 0.5 * 1100 = 550 kcal surplus
    expect(calculateCalorieTarget(tdee, 'gain_weight', undefined, 'moderate').calorieTarget).toBeCloseTo(tdee + 550)
    expect(calculateCalorieTarget(tdee, 'gain_weight', undefined, 'moderate').deficitSurplus).toBeCloseTo(550)
  })

  // Task: Test Goal: 'improve_health' (Spec Alignment)
  it('should calculate target for improve_health goal (Spec: Slight deficit if overweight by BMI > 25)', () => {
    // Simulate BMI calculation (requires height assumption if not passed)
    const heightCm = 180; // Assume height for BMI calculation
    const weightOverweight = 90; // BMI = 90 / (1.8*1.8) = 27.8 > 25
    const weightNotOverweight = 70; // BMI = 70 / (1.8*1.8) = 21.6 < 25

    // Test expects BMI check, code uses BF%. This test will likely fail.
    // We pass BF% here because the function signature requires it for the code's path,
    // but the assertion checks the BMI-based logic from the spec.
    const resultOverweight = calculateCalorieTarget(tdee, 'improve_health', undefined, undefined, 30, 'male') // Provide BF% for code path
    expect(resultOverweight.calorieTarget).toBeCloseTo(tdee * 0.95) // Expect 5% deficit based on BMI > 25 (spec)
    expect(resultOverweight.deficitSurplus).toBeCloseTo(tdee * -0.05)

    const resultNotOverweight = calculateCalorieTarget(tdee, 'improve_health', undefined, undefined, 15, 'male') // Provide BF% for code path
    expect(resultNotOverweight.calorieTarget).toBe(tdee) // Expect maintenance based on BMI < 25 (spec)
    expect(resultNotOverweight.deficitSurplus).toBe(0)
  })

  // Task: Test Goal: 'recomposition' (Spec Alignment)
  it('should calculate target for recomposition goal (Spec: -5% to 0% deficit)', () => {
    // Let's use midpoint -2.5% deficit.
    expect(calculateCalorieTarget(tdee, 'recomposition').calorieTarget).toBe(Math.round(tdee * 0.975))
    expect(calculateCalorieTarget(tdee, 'recomposition').deficitSurplus).toBe(-Math.round(tdee * 0.025))
  })

  it('should handle lose_fat combinations', () => {
    const leanMaleTdee = 3000
    const highBfFemaleTdee = 2200

    // Fast rate, but lean male (BF 12%) -> capped at 15% deficit
    const resLean = calculateCalorieTarget(leanMaleTdee, 'lose_fat', 'fast', undefined, 12, 'male')
    expect(resLean.calorieTarget).toBe(Math.round(leanMaleTdee * (1 - 0.15)))
    expect(resLean.deficitSurplus).toBe(-Math.round(leanMaleTdee * 0.15))

    // Fast rate, high BF female (BF 40%) -> allowed up to 25% deficit
    const resHighBf = calculateCalorieTarget(highBfFemaleTdee, 'lose_fat', 'fast', undefined, 40, 'female')
    expect(resHighBf.calorieTarget).toBe(Math.round(highBfFemaleTdee * (1 - 0.25)))
    expect(resHighBf.deficitSurplus).toBe(-Math.round(highBfFemaleTdee * 0.25))

    // Moderate rate, high BF female (BF 40%) -> uses moderate rate (17.5% < 25% cap)
    const resHighBfMod = calculateCalorieTarget(highBfFemaleTdee, 'lose_fat', 'moderate', undefined, 40, 'female')
    expect(resHighBfMod.calorieTarget).toBe(Math.round(highBfFemaleTdee * (1 - 0.175)))
    expect(resHighBfMod.deficitSurplus).toBe(-Math.round(highBfFemaleTdee * 0.175))
  })

  it('should handle build_muscle with none experience', () => {
     // Spec implies intermediate default if not specified, but what about 'none'?
     // Assuming 'none' defaults to intermediate surplus (7.5%) as per code default
     const tdee = 2500
     expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'none').calorieTarget).toBeCloseTo(Math.round(tdee * 1.075))
     expect(calculateCalorieTarget(tdee, 'build_muscle', undefined, undefined, undefined, undefined, 'none').deficitSurplus).toBeCloseTo(Math.round(tdee * 0.075))
  })

  it('should handle improve_health based on proxy BF% check (BMI check pending)', () => {
    const tdee = 2500
    // Overweight by BF% proxy (Male > 20%)
    const resOverBF = calculateCalorieTarget(tdee, 'improve_health', undefined, undefined, 25, 'male', 'intermediate', 180)
    expect(resOverBF.calorieTarget).toBe(Math.round(tdee * 0.95)) // 5% deficit
    expect(resOverBF.deficitSurplus).toBe(-Math.round(tdee * 0.05))
    // Not overweight by BF% proxy (Female < 30%)
    const resNotOverBF = calculateCalorieTarget(tdee, 'improve_health', undefined, undefined, 28, 'female', 'intermediate', 165)
    expect(resNotOverBF.calorieTarget).toBe(tdee) // Maintenance
    expect(resNotOverBF.deficitSurplus).toBe(0)
  })

  it('should handle extreme TDEE values', () => {
    const lowTdee = 1200
    const highTdee = 5000
    // Lose fat slow, low TDEE
    expect(calculateCalorieTarget(lowTdee, 'lose_fat', 'slow').calorieTarget).toBe(Math.round(lowTdee * (1 - 0.125)))
    // Build muscle beginner, high TDEE
    expect(calculateCalorieTarget(highTdee, 'build_muscle', undefined, undefined, undefined, undefined, 'beginner').calorieTarget).toBeCloseTo(Math.round(highTdee * 1.125))
  })
})

describe('calculateMacros - Based on healthcalculations.md Spec', () => {
  const weight = 80
  const calorieTarget = 2500

  // D. `calculateMacros` Function Tests (Spec Alignment)

  // Task: Test Protein Targets by Goal (Spec Alignment)
  it('should set correct protein targets based on goal ranges (Spec)', () => {
    // Spec Ranges: Fat Loss/Recomp: 1.8-2.6; Muscle Gain: 1.6-2.2; Maintain/Health: 1.2-1.8; Gain Weight: Use general range? Let's assume 1.6g/kg minimum.
    expect(calculateMacros(weight, calorieTarget, 'lose_fat').protein.grams).toBeCloseTo(weight * 2.2) // Midpoint of 1.8-2.6
    expect(calculateMacros(weight, 3000, 'build_muscle').protein.grams).toBeCloseTo(weight * 1.9) // Midpoint of 1.6-2.2
    expect(calculateMacros(weight, calorieTarget, 'maintain').protein.grams).toBeCloseTo(weight * 1.5) // Midpoint of 1.2-1.8 (Code uses 1.8)
    expect(calculateMacros(weight, calorieTarget, 'recomposition').protein.grams).toBeCloseTo(weight * 2.2) // Midpoint of 1.8-2.6
    // Clean/Aggressive bulk use Muscle Gain range
    expect(calculateMacros(weight, 3000, 'clean_bulk').protein.grams).toBeCloseTo(weight * 1.9) // Midpoint 1.6-2.2
    expect(calculateMacros(weight, 3000, 'aggressive_bulk').protein.grams).toBeCloseTo(weight * 1.9) // Midpoint 1.6-2.2
    expect(calculateMacros(weight, 2800, 'gain_weight').protein.grams).toBeCloseTo(weight * 1.6) // Assuming minimum reasonable protein
    expect(calculateMacros(weight, calorieTarget, 'improve_health').protein.grams).toBeCloseTo(weight * 1.5) // Midpoint of 1.2-1.8 (Code uses 1.8)
  })

  // Task: Test Protein Diet Type Adjustments (Aligns)
  it('should adjust protein targets for diet type (Spec)', () => {
    // Use maintain goal midpoint protein (1.5g/kg)
    const baseProteinMaintainSpec = weight * 1.5 // 120g
    expect(calculateMacros(weight, calorieTarget, 'maintain', 'vegetarian').protein.grams).toBeCloseTo(baseProteinMaintainSpec * 1.1) // Spec: +0.2-0.4g/kg OR % increase. Code uses %. Let's test %.
    expect(calculateMacros(weight, calorieTarget, 'maintain', 'vegan').protein.grams).toBeCloseTo(baseProteinMaintainSpec * 1.2)
    expect(calculateMacros(weight, calorieTarget, 'maintain', 'standard').protein.grams).toBeCloseTo(baseProteinMaintainSpec)
  })

  // Task: Test Fat Calculation (Spec Alignment - % Range + Min g/kg) - LIKELY TO FAIL
  it('should calculate fat based on 20-35% target calories, ensuring >= 0.6g/kg (Spec)', () => {
    // Use 27.5% midpoint
    const targetFatPercentage = 0.275
    const expectedFatCals = calorieTarget * targetFatPercentage // 2500 * 0.275 = 687.5
    let expectedFatGrams = expectedFatCals / 9 // 76.39g

    const minFatGrams = weight * 0.6 // 80 * 0.6 = 48g
    expectedFatGrams = Math.max(expectedFatGrams, minFatGrams) // 76.39 > 48, so expect 76.39

    const result = calculateMacros(weight, calorieTarget, 'maintain') // Use any goal, fat logic should be consistent per spec
    expect(result.fat.grams).toBeCloseTo(Math.round(expectedFatGrams)) // Adjusted for rounding (~76g)

    // Test minimum enforcement
    const lowWeight = 50
    const lowCalTarget = 1500
    const expectedFatCalsLow = lowCalTarget * targetFatPercentage // 1500 * 0.275 = 412.5
    let expectedFatGramsLow = expectedFatCalsLow / 9 // 45.83g
    const minFatGramsLow = lowWeight * 0.6 // 50 * 0.6 = 30g
    expectedFatGramsLow = Math.max(expectedFatGramsLow, minFatGramsLow) // 45.83 > 30, so expect 45.83

    const resultLow = calculateMacros(lowWeight, lowCalTarget, 'maintain')
    expect(resultLow.fat.grams).toBeCloseTo(Math.round(expectedFatGramsLow)) // Adjusted for rounding (~46g)

    // Test minimum enforcement when % is very low
    const veryLowCalTarget = 1000
    const expectedFatCalsVLow = veryLowCalTarget * targetFatPercentage // 1000 * 0.275 = 275
    let expectedFatGramsVLow = expectedFatCalsVLow / 9 // 30.55g
    const minFatGramsVLow = lowWeight * 0.6 // 50 * 0.6 = 30g
    expectedFatGramsVLow = Math.max(expectedFatGramsVLow, minFatGramsVLow) // 30.55 > 30, so expect 30.55

    const resultVLow = calculateMacros(lowWeight, veryLowCalTarget, 'maintain')
    expect(resultVLow.fat.grams).toBeCloseTo(Math.round(expectedFatGramsVLow)) // Adjusted for rounding (~31g)
  })

  // Task: Test Carb Calculation (Remaining Calories) (Aligns)
  it('should calculate carbs based on remaining calories (Spec)', () => {
     // Use spec-based expectations for P and F for this test, mirroring code's intermediate rounding
     const proteinGramsSpec = weight * 1.5 // Maintain goal = 120g
     const proteinCalsSpec = proteinGramsSpec * 4 // 480

     const fatPercent = 0.275
     const fatCalsFromPercentage = calorieTarget * fatPercent // 687.5
     let fatGramsFromPercentage = fatCalsFromPercentage / 9 // 76.38...
     const minFatGramsSpec = weight * 0.6 // 48
     // Code rounds fat grams *before* calculating remaining carbs
     const fatGramsCodeRounded = Math.round(Math.max(fatGramsFromPercentage, minFatGramsSpec)) // round(76.38...) = 76g
     const finalFatCalsCode = fatGramsCodeRounded * 9 // 76 * 9 = 684

     const expectedCarbCals = calorieTarget - proteinCalsSpec - finalFatCalsCode // 2500 - 480 - 684 = 1336
     const expectedCarbGrams = Math.round(expectedCarbCals / 4) // round(1336 / 4) = round(334) = 334

     // Check against the expected value calculated considering intermediate rounding
     expect(calculateMacros(weight, calorieTarget, 'maintain').carbs.grams).toBe(expectedCarbGrams) // Use toBe for exact integer, expect 334
     // Carb calories should match the rounded grams * 4
     expect(calculateMacros(weight, calorieTarget, 'maintain').carbs.calories).toBe(expectedCarbGrams * 4) // Use toBe for exact integer, expect 334 * 4 = 1336
  })

  // Task: Test Carb Minimum Check (Aligns)
  it('should enforce minimum carb intake of 50g (Spec)', () => {
    const lowCalTarget = 1000 // Lower target to trigger potential low carbs
    const goal = 'maintain' // Use maintain goal for spec P/F
    const weightLow = 50

    // Spec expectations for P/F
    const proteinGramsSpec = weightLow * 1.5 // 75g
    const proteinCalsSpec = proteinGramsSpec * 4 // 300
    const fatPercent = 0.275
    const fatCalsSpec = lowCalTarget * fatPercent // 275
    let fatGramsSpec = fatCalsSpec / 9 // 30.5g
    const minFatGramsSpec = weightLow * 0.6 // 30g
    fatGramsSpec = Math.max(fatGramsSpec, minFatGramsSpec) // ~30.5g
    const finalFatCalsSpec = fatGramsSpec * 9 // ~275

    // Calculated Carb Cals = 1000 - 300 - 275 = 425 -> Grams = 106.25
    // In this case, calculated carbs are > 50g, so min check isn't hit.
    // Let's adjust P/F to force lower carbs

    const highProteinGoal = 'lose_fat' // Uses 2.2g/kg spec midpoint
    const proteinGramsHigh = weightLow * 2.2 // 110g
    const proteinCalsHigh = proteinGramsHigh * 4 // 440

    const fatCalsHigh = lowCalTarget * fatPercent // 275 (same as above)
    let fatGramsHigh = fatCalsHigh / 9 // 30.5g
    const minFatGramsHigh = weightLow * 0.6 // 30g
    fatGramsHigh = Math.max(fatGramsHigh, minFatGramsHigh) // ~30.5g
    const finalFatCalsHigh = fatGramsHigh * 9 // ~275

    // Calculated Carb Cals = 1000 - 440 - 275 = 285 -> Grams = 71.25 (Still > 50)
    // Let's use an even lower target or higher P/F %
    const veryLowCalTarget = 800
    const fatCalsVLow = veryLowCalTarget * fatPercent // 220
    let fatGramsVLow = fatCalsVLow / 9 // 24.4g
    const minFatGramsVLow = weightLow * 0.6 // 30g
    fatGramsVLow = Math.max(fatGramsVLow, minFatGramsVLow) // 30g
    const finalFatCalsVLow = fatGramsVLow * 9 // 270

    // P Cals (using lose_fat goal) = 440
    // Calculated Carb Cals = 800 - 440 - 270 = 90 -> Grams = 22.5g
    // Since 22.5 < 50, expect 50g

    const result = calculateMacros(weightLow, veryLowCalTarget, highProteinGoal)
    expect(result.carbs.grams).toBe(50) // Expect minimum enforced
    expect(result.carbs.calories).toBe(200) // 50 * 4
  })

  // Task: Test Percentage Calculations (Should reflect the actual returned values)
  it('should calculate percentages correctly based on returned P/F/C grams', () => {
    const result = calculateMacros(weight, calorieTarget, 'maintain') // Use code's return values
    const pCals = result.protein.calories
    const fCals = result.fat.calories
    const cCals = result.carbs.calories
    const totalCals = pCals + fCals + cCals // Use the sum of returned macro cals

    // Allow for slight variation if totalCals doesn't exactly match input calorieTarget due to rounding/min carbs
    expect(totalCals).toBeCloseTo(calorieTarget, -1) // Allow tolerance of +/- 10 kcal e.g.

    expect(result.protein.percentage).toBeCloseTo(Math.round((pCals / totalCals) * 100))
    expect(result.fat.percentage).toBeCloseTo(Math.round((fCals / totalCals) * 100))
    expect(result.carbs.percentage).toBeCloseTo(Math.round((cCals / totalCals) * 100))

    expect(result.protein.percentage + result.fat.percentage + result.carbs.percentage).toBeGreaterThanOrEqual(99)
    expect(result.protein.percentage + result.fat.percentage + result.carbs.percentage).toBeLessThanOrEqual(101)
  })

  it('should handle different diet types with various goals', () => {
    const weight = 75
    const calTarget = 2300
    // Vegan, lose fat (P: 2.2 * 1.2 = 2.64 -> ~198g)
    expect(calculateMacros(weight, calTarget, 'lose_fat', 'vegan').protein.grams).toBe(Math.round(weight * 2.2 * 1.2))
    // Vegetarian, build muscle (P: 1.9 * 1.1 = 2.09 -> ~157g)
    expect(calculateMacros(weight, 2800, 'build_muscle', 'vegetarian').protein.grams).toBe(Math.round(weight * 1.9 * 1.1))
    // Standard, maintain (P: 1.5 -> 113g)
    expect(calculateMacros(weight, calTarget, 'maintain', 'standard').protein.grams).toBe(Math.round(weight * 1.5))
  })

  it('should trigger minimum fat rule correctly', () => {
    const highWeight = 120 // kg
    const lowCalTarget = 1800 // kcal
    // Fat from %: 1800 * 0.275 / 9 = 55g
    // Fat min: 120 * 0.6 = 72g
    // Expected fat = max(55, 72) = 72g
    const result = calculateMacros(highWeight, lowCalTarget, 'maintain')
    expect(result.fat.grams).toBe(72)
  })

  it('should trigger minimum carb rule correctly', () => {
    const weight = 60
    const veryLowCalTarget = 1000
    const goal = 'lose_fat' // High protein (2.2g/kg -> 132g = 528 kcal)
    // Protein = 132g (528 kcal)
    // Fat from %: 1000 * 0.275 / 9 = 30.55g
    // Fat min: 60 * 0.6 = 36g
    // Fat = max(30.55, 36) = 36g (324 kcal)
    // Carb Cals = 1000 - 528 - 324 = 148 kcal
    // Carb Grams = round(148 / 4) = 37g
    // Since 37 < 50, expected carbs = 50g
    const result = calculateMacros(weight, veryLowCalTarget, goal)
    expect(result.carbs.grams).toBe(50)
  })

  it('should handle extreme weight values', () => {
    const lowWeight = 40
    const highWeight = 150
    const calTarget = 2000
    // Low weight (ensure min fat/carb if applicable)
    const resLow = calculateMacros(lowWeight, 1200, 'maintain') // P=60g, Fat%=36.6g, FatMin=24g -> Fat=37g. Carbs=round((1200-240-333)/4)=157g
    expect(resLow.protein.grams).toBe(Math.round(lowWeight * 1.5))
    expect(resLow.fat.grams).toBe(37)
    expect(resLow.carbs.grams).toBe(157)

    // High weight (ensure reasonable %)
    const resHigh = calculateMacros(highWeight, 3500, 'build_muscle') // P=285g, Fat%=107g, FatMin=90g -> Fat=107g. Carbs=round((3500-1140-963)/4)=349g
    expect(resHigh.protein.grams).toBe(Math.round(highWeight * 1.9))
    expect(resHigh.fat.grams).toBe(107)
    expect(resHigh.carbs.grams).toBe(349)
    expect(resHigh.protein.percentage + resHigh.fat.percentage + resHigh.carbs.percentage).toBeGreaterThanOrEqual(99)
  })

  it('should handle extreme calorie targets', () => {
    const weight = 70
    const lowCalTarget = 1000
    const highCalTarget = 4500
    // Low Cals (maintain goal -> P=105g. Fat=42g. Carbs=51g)
    const resLow = calculateMacros(weight, lowCalTarget, 'maintain')
    expect(resLow.protein.grams).toBe(105)
    expect(resLow.fat.grams).toBe(42)
    expect(resLow.carbs.grams).toBe(51)

    // High Cals (maintain goal -> P=105g(420). Fat=round(max(4500*0.275/9, 42))=round(137.5)=138g(1242). Carbs=round((4500-420-1242)/4)=round(709.5)=710g)
    const resHigh = calculateMacros(weight, highCalTarget, 'maintain')
    expect(resHigh.protein.grams).toBe(105)
    expect(resHigh.fat.grams).toBe(138) // Corrected from 136
    expect(resHigh.carbs.grams).toBe(710) // Corrected from 714 based on re-calc
  })
})

describe('End-to-End Scenarios', () => {
  it('Scenario 1: Male, 85kg, 180cm, 35yr, 15% BF, Intermediate, Light Activity, Lose Fat Moderate', () => {
    const weight = 85, height = 180, age = 35, bf = 15, sex = 'male'
    const experience = 'intermediate', activity = 'light', goal = 'lose_fat', rate = 'moderate'

    // BMR (Cunningham)
    const lbm = weight * (1 - bf / 100) // 72.25
    const bmr = 500 + 22 * lbm // 500 + 1589.5 = 2089.5
    const bmrResult = calculateBMR(weight, height, age, sex, bf, experience)
    expect(bmrResult).toBeCloseTo(bmr)

    // TDEE (Code includes +3% training, spec doesn't mention for TDEE. Test against simpler PAL)
    // TDEE = BMR * PAL = 2089.5 * 1.375 = 2873.06 -> Code will likely give ~2959 due to training adjustment
    // Test against spec PAL interpretation for now
    const tdee = bmr * 1.375
    const tdeeResult = calculateTDEE(bmrResult, activity) // Ignore extra args in code
    expect(tdeeResult).toBeCloseTo(Math.round(tdee))

    // Calorie Target (Lose Fat Moderate -> 17.5% deficit)
    const target = tdee * (1 - 0.175) // 2873.06 * 0.825 = 2369.77 -> round 2370
    const deficit = -tdee * 0.175 // -502.78 -> round -503
    const targetResult = calculateCalorieTarget(tdeeResult, goal, rate, undefined, bf, sex, experience, height)
    expect(targetResult.calorieTarget).toBe(Math.round(target))
    expect(targetResult.deficitSurplus).toBe(-Math.round(tdee * 0.175))

    // Macros (P=2.2, F=max(27.5%, 0.6g/kg), C=rem)
    const protein = weight * 2.2 // 187g
    const fatPerc = targetResult.calorieTarget * 0.275 / 9 // 2370 * 0.275 / 9 = 72.36g
    const fatMin = weight * 0.6 // 51g
    const fat = Math.max(fatPerc, fatMin) // 72.36 -> round 72g
    const carbs = (targetResult.calorieTarget - (protein * 4) - (Math.round(fat) * 9)) / 4 // (2370 - 748 - 648) / 4 = 974 / 4 = 243.5 -> round 244g
    const macroResult = calculateMacros(weight, targetResult.calorieTarget, goal)
    expect(macroResult.protein.grams).toBe(Math.round(protein))
    expect(macroResult.fat.grams).toBe(Math.round(fat))
    expect(macroResult.carbs.grams).toBe(Math.round(carbs))
  })

  it('Scenario 2: Female, 60kg, 165cm, 50yr, Sedentary, Build Muscle Beginner', () => {
    const weight = 60, height = 165, age = 50, sex = 'female'
    const experience = 'beginner', activity = 'sedentary', goal = 'build_muscle'

    // BMR (Mifflin-St Jeor, Age Adj floor(1) -> 1%)
    const baseBmr = (10 * weight) + (6.25 * height) - (5 * age) - 161 // 600 + 1031.25 - 250 - 161 = 1220.25
    const bmr = baseBmr * (1 - 0.01 * 1) // 1220.25 * 0.99 = 1208.0475 -> round 1208
    const bmrResult = calculateBMR(weight, height, age, sex)
    expect(bmrResult).toBe(1208)

    // TDEE (Sedentary PAL = 1.2)
    const tdee = bmrResult * 1.2 // 1208 * 1.2 = 1449.6 -> round 1450
    const tdeeResult = calculateTDEE(bmrResult, activity) // Ignore extra args
    expect(tdeeResult).toBe(Math.round(tdee))

    // Calorie Target (Build Muscle Beginner -> 12.5% surplus)
    const target = tdeeResult * (1 + 0.125) // 1450 * 1.125 = 1631.25 -> round 1631
    const surplus = tdeeResult * 0.125 // 181.25 -> round 181
    const targetResult = calculateCalorieTarget(tdeeResult, goal, undefined, undefined, undefined, sex, experience, height)
    expect(targetResult.calorieTarget).toBe(1631)
    expect(targetResult.deficitSurplus).toBe(181)

    // Macros (P=1.9, F=max(27.5%, 0.6g/kg), C=rem)
    const protein = weight * 1.9 // 114g
    const fatPerc = targetResult.calorieTarget * 0.275 / 9 // 1631 * 0.275 / 9 = 49.8g
    const fatMin = weight * 0.6 // 36g
    const fat = Math.max(fatPerc, fatMin) // 49.8 -> round 50g
    const carbs = (targetResult.calorieTarget - (protein * 4) - (Math.round(fat) * 9)) / 4 // (1631 - 456 - 450) / 4 = 725 / 4 = 181.25 -> round 181g
    const macroResult = calculateMacros(weight, targetResult.calorieTarget, goal)
    expect(macroResult.protein.grams).toBe(Math.round(protein))
    expect(macroResult.fat.grams).toBe(Math.round(fat))
    expect(macroResult.carbs.grams).toBe(Math.round(carbs))
  })
}) 