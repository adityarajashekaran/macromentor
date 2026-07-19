import { describe, it, expect } from "vitest"
import {
  KG_PER_LB,
  LB_PER_KG,
  CM_PER_IN,
  LB_PER_STONE,
  KJ_PER_KCAL,
  DEFAULT_UNITS,
  lbToKg,
  kgToLb,
  stLbToKg,
  kgToStLb,
  inToCm,
  cmToIn,
  ftInToCm,
  cmToFtIn,
  kcalToKj,
  kjToKcal,
  energyValue,
  formatEnergy,
  formatWeight,
  formatHeight,
  formatLength,
  energyLabel,
  weightUnitLabel,
  perKgToPerLb,
  weightRangeIn,
  heightRangeIn,
  waistRangeIn,
  rangeHint,
  defaultUnitsFor,
} from "./units"

/**
 * GROUND TRUTH (exact definitions, not derived from the implementation):
 *   1 lb    = 0.45359237 kg          (international avoirdupois pound, exact)
 *   1 in    = 2.54 cm                (exact)
 *   1 stone = 14 lb = 6.35029318 kg  (exact)
 *   1 kcal  = 4.184 kJ               (thermochemical / FAO-WHO food-energy standard, exact)
 *   1 kg    = 2.2046226218487757 lb  (= 1 / 0.45359237)
 *
 * Every expected number below was computed by hand from these, so a passing
 * test means the code matches reality — not that the code matches itself.
 */

describe("constants", () => {
  it("are the exact standard definitions", () => {
    expect(KG_PER_LB).toBe(0.45359237)
    expect(CM_PER_IN).toBe(2.54)
    expect(LB_PER_STONE).toBe(14)
    expect(KJ_PER_KCAL).toBe(4.184)
    expect(LB_PER_KG).toBeCloseTo(2.2046226218487757, 12)
  })
})

describe("weight: pounds <-> kilograms", () => {
  it("converts pounds to kilograms against known values", () => {
    expect(lbToKg(1)).toBe(0.45359237) // exact by definition
    expect(lbToKg(200)).toBeCloseTo(90.718474, 6)
    expect(lbToKg(150)).toBeCloseTo(68.0388555, 6)
    expect(lbToKg(185)).toBeCloseTo(83.91458845, 6)
    expect(lbToKg(0)).toBe(0)
  })

  it("converts kilograms to pounds against known values", () => {
    expect(kgToLb(1)).toBeCloseTo(2.2046226218, 8)
    expect(kgToLb(100)).toBeCloseTo(220.46226218, 6)
    expect(kgToLb(90.718474)).toBeCloseTo(200, 6)
    expect(kgToLb(83.91458845)).toBeCloseTo(185, 6)
  })

  it("round-trips within floating tolerance", () => {
    for (const kg of [30, 55.5, 68.0388555, 83.9, 100, 176.4, 300]) {
      expect(lbToKg(kgToLb(kg))).toBeCloseTo(kg, 9)
    }
  })
})

describe("weight: stones+pounds <-> kilograms", () => {
  it("joins stones and pounds to kilograms", () => {
    expect(stLbToKg(0, 0)).toBe(0)
    expect(stLbToKg(1, 0)).toBeCloseTo(6.35029318, 8) // one stone
    expect(stLbToKg(0, 1)).toBe(0.45359237)
    expect(stLbToKg(10, 0)).toBeCloseTo(63.5029318, 7)
    // 12 st 6 lb = 174 lb = 78.92507238 kg
    expect(stLbToKg(12, 6)).toBeCloseTo(78.92507238, 6)
    // 14 st 0 lb = 196 lb = 88.90410452 kg
    expect(stLbToKg(14, 0)).toBeCloseTo(88.90410452, 6)
  })

  it("splits kilograms into stones + whole pounds", () => {
    expect(kgToStLb(78.92507238)).toEqual({ st: 12, lb: 6 })
    expect(kgToStLb(6.35029318)).toEqual({ st: 1, lb: 0 })
    expect(kgToStLb(63.5029318)).toEqual({ st: 10, lb: 0 })
    // 100 kg = 220.462 lb = 15 st 10.46 lb -> 15 st 10 lb
    expect(kgToStLb(100)).toEqual({ st: 15, lb: 10 })
  })

  it("carries pounds to the next stone when they round to 14", () => {
    // 88.79 kg = 195.75 lb = 13 st 13.75 lb -> rounds to 14 -> 14 st 0 lb
    expect(kgToStLb(88.79)).toEqual({ st: 14, lb: 0 })
  })

  it("always yields a pounds component in [0, 13]", () => {
    for (let kg = 30; kg <= 300; kg += 0.37) {
      const { st, lb } = kgToStLb(kg)
      expect(lb).toBeGreaterThanOrEqual(0)
      expect(lb).toBeLessThanOrEqual(13)
      expect(Number.isInteger(st)).toBe(true)
      expect(Number.isInteger(lb)).toBe(true)
    }
  })

  it("round-trips stones+pounds through kilograms", () => {
    for (const [st, lb] of [
      [8, 0],
      [10, 7],
      [12, 6],
      [15, 13],
      [20, 3],
    ] as const) {
      const kg = stLbToKg(st, lb)
      expect(kgToStLb(kg)).toEqual({ st, lb })
    }
  })
})

describe("height: feet+inches <-> centimetres", () => {
  it("joins feet and inches to centimetres", () => {
    expect(ftInToCm(0, 1)).toBe(2.54)
    expect(ftInToCm(5, 10)).toBeCloseTo(177.8, 10) // 70 in
    expect(ftInToCm(5, 11)).toBeCloseTo(180.34, 10) // 71 in
    expect(ftInToCm(6, 0)).toBeCloseTo(182.88, 10) // 72 in
    expect(ftInToCm(0, 0)).toBe(0)
  })

  it("splits centimetres into feet + whole inches", () => {
    expect(cmToFtIn(177.8)).toEqual({ ft: 5, in: 10 })
    expect(cmToFtIn(182.88)).toEqual({ ft: 6, in: 0 })
    // 180 cm = 70.866 in -> 71 in -> 5 ft 11 in
    expect(cmToFtIn(180)).toEqual({ ft: 5, in: 11 })
    // 200 cm = 78.74 in -> 79 in -> 6 ft 7 in
    expect(cmToFtIn(200)).toEqual({ ft: 6, in: 7 })
  })

  it("carries inches to the next foot when they round to 12", () => {
    // 182.5 cm = 71.85 in -> rounds to 72 -> 6 ft 0 in
    expect(cmToFtIn(182.5)).toEqual({ ft: 6, in: 0 })
  })

  it("always yields an inches component in [0, 11]", () => {
    for (let cm = 120; cm <= 250; cm += 0.31) {
      const { ft, in: inches } = cmToFtIn(cm)
      expect(inches).toBeGreaterThanOrEqual(0)
      expect(inches).toBeLessThanOrEqual(11)
      expect(Number.isInteger(ft)).toBe(true)
      expect(Number.isInteger(inches)).toBe(true)
    }
  })
})

describe("length (waist): inches <-> centimetres", () => {
  it("converts against known values", () => {
    expect(inToCm(1)).toBe(2.54)
    expect(inToCm(30)).toBeCloseTo(76.2, 10)
    expect(cmToIn(2.54)).toBeCloseTo(1, 12)
    expect(cmToIn(100)).toBeCloseTo(39.3700787, 6)
  })

  it("round-trips", () => {
    for (const cm of [50, 76.2, 90, 101.6, 200]) {
      expect(inToCm(cmToIn(cm))).toBeCloseTo(cm, 9)
    }
  })
})

describe("energy: kilocalories <-> kilojoules", () => {
  it("converts against the food-energy standard", () => {
    expect(kcalToKj(2000)).toBeCloseTo(8368, 6) // exact: 2000 * 4.184
    expect(kcalToKj(1)).toBeCloseTo(4.184, 10)
    expect(kcalToKj(500)).toBeCloseTo(2092, 6)
    expect(kjToKcal(8368)).toBeCloseTo(2000, 6)
    expect(kjToKcal(4.184)).toBeCloseTo(1, 10)
  })

  it("round-trips", () => {
    for (const kcal of [1200, 1500, 2000, 2216, 3000]) {
      expect(kjToKcal(kcalToKj(kcal))).toBeCloseTo(kcal, 8)
    }
  })
})

describe("energyValue (display number, rounded)", () => {
  it("returns kcal unchanged and kJ rounded to a whole number", () => {
    expect(energyValue(2216, "kcal")).toBe(2216)
    expect(energyValue(2000, "kJ")).toBe(8368)
    expect(energyValue(2216, "kJ")).toBe(9272) // 9271.744 -> 9272
    expect(energyValue(100, "kJ")).toBe(418) // 418.4 -> 418
    expect(energyValue(1500, "kJ")).toBe(6276) // exact
  })
})

describe("formatters", () => {
  it("formats energy with a thousands separator and unit", () => {
    expect(formatEnergy(2216, "kcal")).toBe("2,216 kcal")
    expect(formatEnergy(2216, "kJ")).toBe("9,272 kJ")
    expect(formatEnergy(2000, "kJ")).toBe("8,368 kJ")
    expect(formatEnergy(950, "kcal")).toBe("950 kcal")
  })

  it("formats weight per unit with sensible rounding", () => {
    expect(formatWeight(83.91458845, "kg")).toBe("83.9 kg")
    expect(formatWeight(100, "kg")).toBe("100 kg")
    expect(formatWeight(83.91458845, "lb")).toBe("185 lb")
    expect(formatWeight(100, "lb")).toBe("220.5 lb")
    expect(formatWeight(78.92507238, "st-lb")).toBe("12 st 6 lb")
    expect(formatWeight(100, "st-lb")).toBe("15 st 10 lb")
  })

  it("formats height per unit", () => {
    expect(formatHeight(177.8, "cm")).toBe("178 cm")
    expect(formatHeight(180, "cm")).toBe("180 cm")
    expect(formatHeight(177.8, "ft-in")).toBe("5'10\"")
    expect(formatHeight(182.88, "ft-in")).toBe("6'0\"")
    expect(formatHeight(200, "ft-in")).toBe("6'7\"")
  })

  it("formats waist length per unit", () => {
    expect(formatLength(90, "cm")).toBe("90 cm")
    expect(formatLength(101.6, "in")).toBe("40 in")
    expect(formatLength(90, "in")).toBe("35 in") // 35.43 -> 35
  })

  it("exposes unit labels", () => {
    expect(energyLabel("kcal")).toBe("kcal")
    expect(energyLabel("kJ")).toBe("kJ")
    expect(weightUnitLabel("kg")).toBe("kg")
    expect(weightUnitLabel("lb")).toBe("lb")
    expect(weightUnitLabel("st-lb")).toBe("st")
  })
})

describe("protein density framing", () => {
  it("converts grams-per-kg to grams-per-lb", () => {
    // 2.2 g/kg * 0.45359237 kg/lb = 0.99790 g/lb ~ 1.0
    expect(perKgToPerLb(2.2)).toBeCloseTo(0.9979032, 6)
    expect(perKgToPerLb(1)).toBeCloseTo(0.45359237, 8)
  })
})

describe("validation ranges (metric bounds 30-300 kg, 120-250 cm, 50-200 cm)", () => {
  it("maps weight bounds inward so the hint never admits an out-of-range value", () => {
    expect(weightRangeIn("kg")).toEqual({ min: 30, max: 300 })
    // 30 kg = 66.14 lb -> ceil 67 ; 300 kg = 661.39 lb -> floor 661
    expect(weightRangeIn("lb")).toEqual({ min: 67, max: 661 })
  })

  it("maps height bounds inward", () => {
    expect(heightRangeIn("cm")).toEqual({ min: 120, max: 250 })
    // 120 cm = 47.24 in -> ceil 48 (4'0") ; 250 cm = 98.43 in -> floor 98 (8'2")
    expect(heightRangeIn("ft-in")).toEqual({ min: 48, max: 98 })
  })

  it("maps waist bounds inward", () => {
    expect(waistRangeIn("cm")).toEqual({ min: 50, max: 200 })
    // 50 cm = 19.69 in -> ceil 20 ; 200 cm = 78.74 in -> floor 78
    expect(waistRangeIn("in")).toEqual({ min: 20, max: 78 })
  })

  it("produces readable range hints", () => {
    expect(rangeHint("weight", "kg")).toBe("Between 30 and 300 kg")
    expect(rangeHint("weight", "lb")).toBe("Between 67 and 661 lb")
    expect(rangeHint("height", "cm")).toBe("Between 120 and 250 cm")
    expect(rangeHint("waist", "in")).toBe("Between 20 and 78 in")
  })
})

describe("locale-based default units", () => {
  it("uses pounds + feet/inches for the US", () => {
    expect(defaultUnitsFor("en-US")).toEqual({
      weight: "lb",
      height: "ft-in",
      waist: "in",
      energy: "kcal",
    })
  })

  it("uses stones for the UK", () => {
    expect(defaultUnitsFor("en-GB")).toEqual({
      weight: "st-lb",
      height: "ft-in",
      waist: "in",
      energy: "kcal",
    })
  })

  it("uses kilojoules for Australia and New Zealand", () => {
    expect(defaultUnitsFor("en-AU")).toEqual({
      weight: "kg",
      height: "cm",
      waist: "cm",
      energy: "kJ",
    })
    expect(defaultUnitsFor("en-NZ").energy).toBe("kJ")
  })

  it("falls back to metric + kcal everywhere else and for junk input", () => {
    expect(defaultUnitsFor("fr-FR")).toEqual(DEFAULT_UNITS)
    expect(defaultUnitsFor("en-CA")).toEqual(DEFAULT_UNITS)
    expect(defaultUnitsFor("en")).toEqual(DEFAULT_UNITS) // language only, no region
    expect(defaultUnitsFor("")).toEqual(DEFAULT_UNITS)
    expect(defaultUnitsFor(undefined)).toEqual(DEFAULT_UNITS)
    expect(defaultUnitsFor("zz-ZZ")).toEqual(DEFAULT_UNITS)
  })

  it("parses region from underscore and extended tags", () => {
    expect(defaultUnitsFor("en_US").weight).toBe("lb")
    expect(defaultUnitsFor("en-US-POSIX").weight).toBe("lb")
  })
})

describe("edge cases and weird input", () => {
  it("handles zero everywhere", () => {
    expect(lbToKg(0)).toBe(0)
    expect(kgToLb(0)).toBe(0)
    expect(ftInToCm(0, 0)).toBe(0)
    expect(kcalToKj(0)).toBe(0)
    expect(kgToStLb(0)).toEqual({ st: 0, lb: 0 })
    expect(cmToFtIn(0)).toEqual({ ft: 0, in: 0 })
  })

  it("propagates NaN rather than inventing a value", () => {
    expect(Number.isNaN(lbToKg(NaN))).toBe(true)
    expect(Number.isNaN(kcalToKj(NaN))).toBe(true)
    expect(Number.isNaN(energyValue(NaN, "kJ"))).toBe(true)
  })

  it("does not choke on very large values", () => {
    expect(kgToLb(10000)).toBeCloseTo(22046.226218, 4)
    expect(kgToStLb(10000).st).toBe(1574) // 22046.23 lb / 14 = 1574 st r ~10
  })

  it("treats a fractional stone/foot entry as its total", () => {
    // user typing 12 st 20 lb is really 13 st 6 lb worth of mass
    expect(stLbToKg(12, 20)).toBeCloseTo(stLbToKg(13, 6), 9)
    // 5 ft 15 in is really 6 ft 3 in
    expect(ftInToCm(5, 15)).toBeCloseTo(ftInToCm(6, 3), 9)
  })
})
