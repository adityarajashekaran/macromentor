"use client"

import { useUnits } from "@/components/units-provider"
import { energyValue, formatEnergy, formatHeight, formatWeight } from "@/lib/units"

interface SampleData {
  profile: { age: number; height: number; weight: number }
  bmr: number
  tdee: number
  calorieTarget: number
  deficitSurplus: number
  macros: {
    protein: { grams: number; percentage: number }
    carbs: { grams: number; percentage: number }
    fat: { grams: number; percentage: number }
  }
}

function MacroRow({
  name,
  grams,
  pct,
  colorVar,
}: {
  name: string
  grams: number
  pct: number
  colorVar: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="flex items-center gap-2 text-sm">
        <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: `var(${colorVar})` }} />
        {name}
      </span>
      <span className="font-mono text-sm tnum">
        {grams}g <span className="text-muted-foreground">· {pct}%</span>
      </span>
    </div>
  )
}

/** Landing sample card — formats energy/weight/height in the visitor's units. */
export function SamplePlan({ sample }: { sample: SampleData }) {
  const { units } = useUnits()
  const { profile, bmr, tdee, calorieTarget, deficitSurplus, macros } = sample
  const e = units.energy
  const segments = [
    { key: "protein", pct: macros.protein.percentage, colorVar: "--color-protein" },
    { key: "carbs", pct: macros.carbs.percentage, colorVar: "--color-carbs" },
    { key: "fat", pct: macros.fat.percentage, colorVar: "--color-fat" },
  ]

  return (
    <div className="grain relative rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-primary">Sample plan</p>
        <p className="eyebrow text-muted-foreground">computed live</p>
      </div>
      <p className="mt-6 font-heading text-6xl font-extrabold tracking-tight tnum">
        {energyValue(calorieTarget, e).toLocaleString("en-US")}
      </p>
      <p className="eyebrow mt-1 text-muted-foreground">
        {e} / day · {formatEnergy(Math.abs(deficitSurplus), e)} below maintenance
      </p>

      <div className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full">
        {segments.map((s) => (
          <div key={s.key} style={{ width: `${s.pct}%`, background: `var(${s.colorVar})` }} />
        ))}
      </div>

      <div className="mt-5 space-y-2.5">
        <MacroRow name="Protein" grams={macros.protein.grams} pct={macros.protein.percentage} colorVar="--color-protein" />
        <MacroRow name="Carbs" grams={macros.carbs.grams} pct={macros.carbs.percentage} colorVar="--color-carbs" />
        <MacroRow name="Fat" grams={macros.fat.grams} pct={macros.fat.percentage} colorVar="--color-fat" />
      </div>

      <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        {profile.age}-year-old male, {formatHeight(profile.height, units.height)},{" "}
        {formatWeight(profile.weight, units.weight)}, moderately active, moderate fat loss. BMR{" "}
        {formatEnergy(bmr, e)} → TDEE {formatEnergy(tdee, e)}. These numbers come from the same
        engine you&apos;re about to use.
      </p>
    </div>
  )
}
