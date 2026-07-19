/**
 * Unit system: a thin, pure conversion layer.
 *
 * The calculator engine (`lib/calculator.ts`) and the form schema are always
 * metric (kg, cm) and always kcal. This module converts user input → metric at
 * the boundary and metric results → the chosen display units. Grams, BMI, and
 * micronutrients are universal and never pass through here.
 *
 * Exact standard definitions (see lib/units.test.ts for ground-truth checks):
 *   1 lb = 0.45359237 kg · 1 in = 2.54 cm · 1 stone = 14 lb · 1 kcal = 4.184 kJ
 */

export const KG_PER_LB = 0.45359237
export const LB_PER_KG = 1 / KG_PER_LB
export const CM_PER_IN = 2.54
export const LB_PER_STONE = 14
export const KJ_PER_KCAL = 4.184

export type WeightUnit = "kg" | "lb" | "st-lb"
export type HeightUnit = "cm" | "ft-in"
export type LengthUnit = "cm" | "in"
export type EnergyUnit = "kcal" | "kJ"

export interface UnitPrefs {
  weight: WeightUnit
  height: HeightUnit
  waist: LengthUnit
  energy: EnergyUnit
}

export const DEFAULT_UNITS: UnitPrefs = {
  weight: "kg",
  height: "cm",
  waist: "cm",
  energy: "kcal",
}

const round1 = (x: number) => Math.round(x * 10) / 10

/* ————— Weight ————— */

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB
}
export function kgToLb(kg: number): number {
  return kg * LB_PER_KG
}
export function stLbToKg(st: number, lb: number): number {
  return (st * LB_PER_STONE + lb) * KG_PER_LB
}
/** Display split: whole pounds, carrying to the next stone (13.7 lb → +1 st). */
export function kgToStLb(kg: number): { st: number; lb: number } {
  const totalLb = Math.round(kgToLb(kg))
  const st = Math.floor(totalLb / LB_PER_STONE)
  return { st, lb: totalLb - st * LB_PER_STONE }
}

/* ————— Height / length ————— */

export function inToCm(inch: number): number {
  return inch * CM_PER_IN
}
export function cmToIn(cm: number): number {
  return cm / CM_PER_IN
}
export function ftInToCm(ft: number, inch: number): number {
  return (ft * 12 + inch) * CM_PER_IN
}
/** Display split: whole inches, carrying to the next foot (11.6 in → +1 ft). */
export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = Math.round(cmToIn(cm))
  const ft = Math.floor(totalIn / 12)
  return { ft, in: totalIn - ft * 12 }
}

/* ————— Energy ————— */

export function kcalToKj(kcal: number): number {
  return kcal * KJ_PER_KCAL
}
export function kjToKcal(kj: number): number {
  return kj / KJ_PER_KCAL
}
/** Display number in the target unit (whole). */
export function energyValue(kcal: number, unit: EnergyUnit): number {
  return unit === "kJ" ? Math.round(kcalToKj(kcal)) : Math.round(kcal)
}

/* ————— Formatters ————— */

export function formatEnergy(kcal: number, unit: EnergyUnit): string {
  return `${energyValue(kcal, unit).toLocaleString("en-US")} ${unit}`
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  if (unit === "st-lb") {
    const { st, lb } = kgToStLb(kg)
    return `${st} st ${lb} lb`
  }
  const value = round1(unit === "lb" ? kgToLb(kg) : kg)
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })} ${unit}`
}

export function formatHeight(cm: number, unit: HeightUnit): string {
  if (unit === "ft-in") {
    const { ft, in: inches } = cmToFtIn(cm)
    return `${ft}'${inches}"`
  }
  return `${Math.round(cm)} cm`
}

export function formatLength(cm: number, unit: LengthUnit): string {
  if (unit === "in") return `${Math.round(cmToIn(cm))} in`
  return `${Math.round(cm)} cm`
}

export function energyLabel(unit: EnergyUnit): string {
  return unit
}
export function weightUnitLabel(unit: WeightUnit): string {
  return unit === "st-lb" ? "st" : unit
}

/** Protein density reframed: grams-per-kg → grams-per-lb. */
export function perKgToPerLb(gPerKg: number): number {
  return gPerKg * KG_PER_LB
}

/* ————— Validation ranges ————— */

const METRIC_BOUNDS = {
  weight: { min: 30, max: 300 }, // kg
  height: { min: 120, max: 250 }, // cm
  waist: { min: 50, max: 200 }, // cm
}

/** Map metric bounds inward (ceil min, floor max) so a hint never admits an out-of-range value. */
export function weightRangeIn(unit: WeightUnit): { min: number; max: number } {
  const { min, max } = METRIC_BOUNDS.weight
  if (unit === "kg") return { min, max }
  return { min: Math.ceil(kgToLb(min)), max: Math.floor(kgToLb(max)) }
}
export function heightRangeIn(unit: HeightUnit): { min: number; max: number } {
  const { min, max } = METRIC_BOUNDS.height
  if (unit === "cm") return { min, max }
  return { min: Math.ceil(cmToIn(min)), max: Math.floor(cmToIn(max)) }
}
export function waistRangeIn(unit: LengthUnit): { min: number; max: number } {
  const { min, max } = METRIC_BOUNDS.waist
  if (unit === "cm") return { min, max }
  return { min: Math.ceil(cmToIn(min)), max: Math.floor(cmToIn(max)) }
}

export function rangeHint(dimension: "weight" | "height" | "waist", unit: string): string {
  if (dimension === "weight") {
    if (unit === "lb") {
      const r = weightRangeIn("lb")
      return `Between ${r.min} and ${r.max} lb`
    }
    if (unit === "st-lb") {
      const lo = kgToStLb(METRIC_BOUNDS.weight.min)
      const hi = kgToStLb(METRIC_BOUNDS.weight.max)
      return `Between ${lo.st} st ${lo.lb} lb and ${hi.st} st ${hi.lb} lb`
    }
    return `Between ${METRIC_BOUNDS.weight.min} and ${METRIC_BOUNDS.weight.max} kg`
  }
  if (dimension === "height") {
    if (unit === "ft-in") {
      const r = heightRangeIn("ft-in")
      const lo = { ft: Math.floor(r.min / 12), in: r.min % 12 }
      const hi = { ft: Math.floor(r.max / 12), in: r.max % 12 }
      return `Between ${lo.ft}'${lo.in}" and ${hi.ft}'${hi.in}"`
    }
    return `Between ${METRIC_BOUNDS.height.min} and ${METRIC_BOUNDS.height.max} cm`
  }
  if (unit === "in") {
    const r = waistRangeIn("in")
    return `Between ${r.min} and ${r.max} in`
  }
  return `Between ${METRIC_BOUNDS.waist.min} and ${METRIC_BOUNDS.waist.max} cm`
}

/* ————— Locale-based defaults ————— */

function parseRegion(locale?: string): string | undefined {
  if (!locale) return undefined
  const m = locale.match(/[-_]([A-Za-z]{2})(?:[-_]|$)/)
  return m ? m[1].toUpperCase() : undefined
}

/** First-visit defaults inferred from the browser locale; user can override. */
export function defaultUnitsFor(locale?: string): UnitPrefs {
  switch (parseRegion(locale)) {
    case "US":
      return { weight: "lb", height: "ft-in", waist: "in", energy: "kcal" }
    case "GB":
      return { weight: "st-lb", height: "ft-in", waist: "in", energy: "kcal" }
    case "AU":
    case "NZ":
      return { weight: "kg", height: "cm", waist: "cm", energy: "kJ" }
    default:
      return { ...DEFAULT_UNITS }
  }
}
