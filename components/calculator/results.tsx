"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Copy, Printer, Pencil, RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { formatSummary, type CalculationResults } from "./compute"
import { useUnits } from "@/components/units-provider"
import {
  formatEnergy,
  energyValue,
  formatWeight,
  formatHeight,
  perKgToPerLb,
  type EnergyUnit,
  type WeightUnit,
} from "@/lib/units"

const MACRO_META = [
  {
    key: "protein" as const,
    label: "Protein",
    colorVar: "--color-protein",
    note: "builds and keeps muscle",
  },
  {
    key: "carbs" as const,
    label: "Carbs",
    colorVar: "--color-carbs",
    note: "fuels training and recovery",
  },
  {
    key: "fat" as const,
    label: "Fat",
    colorVar: "--color-fat",
    note: "hormones and health",
  },
]

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-heading text-2xl font-bold tnum">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
    </div>
  )
}

/**
 * The energy map: one axis showing the no-go zone below BMR, BMR itself,
 * the target, and TDEE — so the deficit is a *place*, not three numbers.
 */
function EnergyScale({ r, energy }: { r: CalculationResults; energy: EnergyUnit }) {
  const floor = r.userProfile.sex === "female" ? 1200 : 1500
  const isDeficit = r.deficitSurplus < 0
  const isSurplus = r.deficitSurplus > 0
  // positions stay in kcal (proportional); only the displayed labels convert
  const e = (kcal: number) => energyValue(kcal, energy).toLocaleString("en-US")
  const eu = (kcal: number) => formatEnergy(kcal, energy)

  const lo = Math.min(r.bmr, r.calorieTarget, r.tdee)
  const hi = Math.max(r.tdee, r.calorieTarget)
  const span = Math.max(hi - lo, 300)
  const min = lo - span * 0.35
  const max = hi + span * 0.12
  const pos = (x: number) => Math.min(98, Math.max(2, ((x - min) / (max - min)) * 100))

  const bandLeft = pos(Math.min(r.calorieTarget, r.tdee))
  const bandWidth = Math.abs(pos(r.tdee) - pos(r.calorieTarget))

  return (
    <div className="print-block mt-10 rounded-lg border border-border bg-card p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-xl font-bold">Where your target sits</h2>
        <p className="eyebrow text-muted-foreground">the energy map</p>
      </div>

      {/* Track */}
      <div className="relative mt-10 mb-8">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-border/40">
          {/* no-go zone: below resting burn */}
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${pos(r.bmr)}%`,
              background:
                "repeating-linear-gradient(135deg, hsl(var(--pop-orange) / 0.55) 0 5px, transparent 5px 10px)",
            }}
          />
          {/* deficit / surplus band between target and TDEE */}
          {bandWidth > 0.5 && (
            <div
              className="absolute inset-y-0"
              style={{
                left: `${bandLeft}%`,
                width: `${bandWidth}%`,
                background: isDeficit ? "var(--color-kcal)" : "hsl(var(--pop-gold) / 0.85)",
                opacity: 0.85,
              }}
            />
          )}
        </div>

        {/* markers */}
        {[
          { x: r.bmr, label: "BMR", cls: "border-2 border-[hsl(var(--pop-orange))] bg-background", size: "h-4 w-4" },
          ...(isDeficit || isSurplus
            ? [{ x: r.tdee, label: "TDEE", cls: "border-2 border-foreground/60 bg-background", size: "h-4 w-4" }]
            : []),
          { x: r.calorieTarget, label: "TARGET", cls: "bg-[var(--color-kcal)] ring-4 ring-[var(--color-kcal)]/25", size: "h-5 w-5" },
        ].map((m) => {
          const p = pos(m.x)
          // keep labels (now carrying numbers) inside the track's edges
          const labelShift = p > 85 ? "-translate-x-[85%]" : p < 15 ? "-translate-x-[15%]" : "-translate-x-1/2"
          return (
            <div
              key={m.label}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p}%` }}
            >
              <div className={`rounded-full ${m.size} ${m.cls}`} />
              <p
                className={`eyebrow absolute left-1/2 whitespace-nowrap ${labelShift} ${
                  m.label === "TARGET" ? "-top-7 text-[var(--color-kcal)]" : "top-5 text-muted-foreground"
                }`}
              >
                {m.label}{" "}
                <span className={m.label === "TARGET" ? "" : "text-foreground/80"}>{e(m.x)}</span>
              </p>
            </div>
          )
        })}
      </div>

      {/* Legend rows */}
      <div className="mt-12 space-y-3 border-t border-border pt-5">
        <div className="flex gap-3">
          <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--color-kcal)] ring-4 ring-[var(--color-kcal)]/25" />
          <p className="text-sm leading-relaxed">
            <strong className="font-mono tnum">{eu(r.calorieTarget)} — your target.</strong>{" "}
            <span className="text-muted-foreground">
              {isDeficit &&
                `The ${e(Math.abs(r.deficitSurplus))}-${energy} gap to maintenance is your deficit — sized to move fat while keeping muscle and hormones on side.`}
              {isSurplus &&
                `Sits ${eu(r.deficitSurplus)} above maintenance — growth costs energy, and that's the bill.`}
              {!isDeficit && !isSurplus && "Matched to your maintenance — energy in equals energy out."}
            </span>
          </p>
        </div>
        {(isDeficit || isSurplus) && (
          <div className="flex gap-3">
            <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-foreground/60" />
            <p className="text-sm leading-relaxed">
              <strong className="font-mono tnum">{eu(r.tdee)} — maintenance (TDEE).</strong>{" "}
              <span className="text-muted-foreground">
                What a typical day actually burns. Eat here and the scale holds still.
              </span>
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[hsl(var(--pop-orange))]" />
          <p className="text-sm leading-relaxed">
            <strong className="font-mono tnum">{eu(r.bmr)} — resting burn (BMR).</strong>{" "}
            <span className="text-muted-foreground">
              What your organs spend if you never left bed. Everything striped below it is no-go:
              eat under your resting burn for long and the body starts paying with muscle, downshifts
              your metabolism, and lets hormones slide — which is why crash diets rebound.
              {isDeficit && ` Your hard floor is ${eu(floor)}, and the deficit is capped well before the stripes.`}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

function WarningPill({
  tone,
  children,
}: {
  tone: "destructive" | "gold" | "info"
  children: React.ReactNode
}) {
  const styles =
    tone === "destructive"
      ? "border-destructive/50 bg-destructive/10 text-destructive"
      : tone === "gold"
        ? "border-pop-gold/60 bg-pop-gold/10 text-foreground"
        : "border-primary/50 bg-primary/10 text-foreground"
  return (
    <div className={`rounded-md border px-4 py-3 text-sm leading-relaxed ${styles}`}>{children}</div>
  )
}

/** Live weight + energy switch — the two units that show up on this page. */
function UnitSwitch({
  weightUnit,
  energy,
  setUnits,
}: {
  weightUnit: WeightUnit
  energy: EnergyUnit
  setUnits: (patch: { weight?: WeightUnit; energy?: EnergyUnit }) => void
}) {
  const seg = <T extends string>(
    current: T,
    opts: { v: T; l: string }[],
    onPick: (v: T) => void,
  ) => (
    <div className="flex rounded-md border border-border p-0.5">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onPick(o.v)}
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            current === o.v
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  )
  return (
    <div className="flex items-center gap-3">
      {seg(
        weightUnit,
        [
          { v: "kg" as WeightUnit, l: "kg" },
          { v: "lb" as WeightUnit, l: "lb" },
          { v: "st-lb" as WeightUnit, l: "st" },
        ],
        (v) => setUnits({ weight: v }),
      )}
      {seg(
        energy,
        [
          { v: "kcal" as EnergyUnit, l: "kcal" },
          { v: "kJ" as EnergyUnit, l: "kJ" },
        ],
        (v) => setUnits({ energy: v }),
      )}
    </div>
  )
}

export function Results({
  results: r,
  onEdit,
  onReset,
}: {
  results: CalculationResults
  onEdit: () => void
  onReset: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const { units, setUnits } = useUnits()
  const energy = units.energy
  const weightUnit = units.weight
  const sign = r.deficitSurplus > 0 ? "+" : "−"
  const hasAdjustment = r.deficitSurplus !== 0
  const eu = (kcal: number) => formatEnergy(kcal, energy)

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(formatSummary(r, units))
      toast("Plan copied — paste it anywhere.")
    } catch {
      toast("Couldn't access the clipboard.")
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto max-w-3xl"
    >
      {/* ——— Print-only letterhead ——— */}
      <div className="mb-8 hidden items-baseline justify-between border-b border-border pb-4 print:flex">
        <p className="font-heading text-xl font-bold tracking-tight">
          macromentor<span className="text-primary">.</span>
        </p>
        <p className="eyebrow text-muted-foreground">
          macromentor.horizonfall.com ·{" "}
          {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>

      {/* ——— Unit switch ——— */}
      <div className="no-print mb-6 flex justify-center">
        <UnitSwitch weightUnit={weightUnit} energy={energy} setUnits={setUnits} />
      </div>

      {/* ——— Hero number ——— */}
      <div className="print-block text-center">
        <p className="eyebrow text-primary">
          Your plan · {r.goalDescription} · Tier 0{r.tier}
        </p>
        <p className="mt-4 font-heading text-7xl font-extrabold tracking-tight tnum sm:text-8xl print:text-6xl">
          {energyValue(r.calorieTarget, energy).toLocaleString("en-US")}
        </p>
        <p className="eyebrow mt-2 text-muted-foreground">{energy} per day</p>
        {hasAdjustment ? (
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="mr-1.5 inline-block rounded-full bg-[var(--color-kcal)]/15 px-3 py-1 font-mono font-medium text-[var(--color-kcal)] tnum">
              {sign}
              {energyValue(Math.abs(r.deficitSurplus), energy).toLocaleString("en-US")} {energy}
            </span>
            versus the {eu(r.tdee)} you burn in a typical day.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Matched to the {eu(r.tdee)} you burn in a typical day.
          </p>
        )}
      </div>

      {/* ——— Warnings ——— */}
      {(r.warnings.belowMinimum ||
        r.warnings.refeedRecommended ||
        r.warnings.ethnicityAdjustmentApplied) && (
        <div className="print-block mt-8 space-y-2.5">
          {r.warnings.belowMinimum && (
            <WarningPill tone="destructive">
              <strong>This target sits below the safe floor</strong> (
              {eu(r.userProfile.sex === "female" ? 1200 : 1500)}). Pick a gentler rate, or work with
              a professional — very low intakes need supervision.
            </WarningPill>
          )}
          {r.warnings.refeedRecommended && (
            <WarningPill tone="gold">
              <strong>Big deficit — plan refeeds.</strong> Every 1–2 weeks, spend a day eating at
              maintenance ({eu(r.tdee)}, extra from carbs). It helps hormones, training, and sanity.
            </WarningPill>
          )}
          {r.warnings.ethnicityAdjustmentApplied && (
            <WarningPill tone="info">
              <strong>Population adjustment applied.</strong> Your BMR was nudged based on the
              ancestry you selected, per published research. Provide a body-fat % next time to use
              lean-mass formulas instead.
            </WarningPill>
          )}
        </div>
      )}

      {/* ——— Energy map ——— */}
      <EnergyScale r={r} energy={energy} />

      {/* ——— Macros ——— */}
      <div className="print-block mt-6 rounded-lg border border-border bg-card p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-xl font-bold">Daily macros</h2>
          <p className="eyebrow text-muted-foreground">grams per day</p>
        </div>

        <div className="mt-5 flex h-4 w-full gap-0.5 overflow-hidden rounded-full">
          {MACRO_META.map((m) => (
            <div
              key={m.key}
              style={{
                width: `${r.macros[m.key].percentage}%`,
                background: `var(${m.colorVar})`,
              }}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {MACRO_META.map((m) => {
            const macro = r.macros[m.key]
            return (
              <div
                key={m.key}
                className="rounded-md border p-4"
                style={{
                  borderColor: `color-mix(in srgb, var(${m.colorVar}) 40%, transparent)`,
                  borderTop: `3px solid var(${m.colorVar})`,
                }}
              >
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: `var(${m.colorVar})` }}
                  />
                  {m.label}
                </p>
                <p
                  className="mt-2 font-heading text-4xl font-bold tnum"
                  style={{ color: `var(${m.colorVar})` }}
                >
                  {macro.grams}
                  <span className="ml-0.5 text-base font-normal text-muted-foreground">g</span>
                </p>
                <p className="eyebrow mt-1 text-muted-foreground">
                  {macro.percentage}% · {eu(macro.calories)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{m.note}</p>
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Protein comes to{" "}
          <span className="font-mono tnum">
            {(() => {
              const perKg = r.macros.protein.grams / r.userProfile.weight
              return weightUnit === "kg" ? perKg.toFixed(1) : perKgToPerLb(perKg).toFixed(1)
            })()}{" "}
            g
          </span>{" "}
          per {weightUnit === "kg" ? "kg" : "lb"} of body weight
          {r.userProfile.dietType !== "standard" && (
            <> — bumped for a {r.userProfile.dietType} diet</>
          )}
          .
        </p>
      </div>

      {/* ——— Body metrics (energy numbers live on the map above) ——— */}
      <div className="print-block mt-6 grid grid-cols-2 gap-2.5">
        <Stat label="BMI" value={r.metrics.bmi.toFixed(1)} />
        {r.metrics.lbm !== undefined ? (
          <Stat label="Lean mass" value={formatWeight(r.metrics.lbm, weightUnit)} />
        ) : (
          <Stat label="Weight" value={formatWeight(r.userProfile.weight, weightUnit)} />
        )}
      </div>

      {/* ——— How it was calculated ——— */}
      <div className="print-block mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold">How we got here</h2>
        <ol className="mt-4 space-y-3">
          {[
            [
              "01",
              `Resting burn (BMR): ${eu(r.bmr)}`,
              r.bmrMethod +
                (r.tier < 3
                  ? " — your body-fat % let us use a formula that counts muscle."
                  : "."),
            ],
            [
              "02",
              `Daily burn (TDEE): ×${r.palMultiplier}`,
              `Your activity level multiplies resting burn up to ${eu(r.tdee)} a day.`,
            ],
            [
              "03",
              `Goal adjustment: ${hasAdjustment ? `${sign}${eu(Math.abs(r.deficitSurplus))}` : "none"}`,
              `${r.goalDescription} sets the size of the change — capped so your target stays out of the striped zone on the map above.`,
            ],
            [
              "04",
              "Macros from the target",
              "Protein is set from your body weight and goal, fat gets a healthy minimum, carbs fill the rest.",
            ],
          ].map(([num, title, body]) => (
            <li key={num} className="flex gap-4">
              <span className="eyebrow mt-0.5 shrink-0 text-primary">{num}</span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          Profile: {r.userProfile.age}y · {r.userProfile.sex} ·{" "}
          {formatHeight(r.userProfile.height, units.height)} ·{" "}
          {formatWeight(r.userProfile.weight, weightUnit)}
          {r.userProfile.bodyFat !== undefined && <> · {r.userProfile.bodyFat}% body fat</>}
        </p>
      </div>

      {/* ——— Micronutrients ——— */}
      <div className="print-block mt-6 rounded-lg border border-border bg-card p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-xl font-bold">Worth tracking too</h2>
          <p className="eyebrow text-muted-foreground">daily targets</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {[
            ["Fibre", `${r.micronutrients.fiber}`, "g"],
            ["Iron", `${r.micronutrients.iron}`, "mg"],
            ["Calcium", `${r.micronutrients.calcium.toLocaleString()}`, "mg"],
            ["Vitamin D", `${r.micronutrients.vitaminD.toLocaleString()}`, "IU"],
            ["Omega-3", `${r.micronutrients.omega3.toLocaleString()}`, "mg"],
          ].map(([label, value, unit]) => (
            <div key={label} className="rounded-md border border-border p-3">
              <p className="eyebrow text-muted-foreground">{label}</p>
              <p className="mt-1 font-mono text-lg font-medium tnum">
                {value}
                <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Set from your age, sex, and calories. Fibre scales with intake (14 g per 1,000 kcal);
          omega-3 rises if your waist measurement flags cardiovascular risk.
        </p>
      </div>

      {/* ——— What now ——— */}
      <div className="print-block mt-6 rounded-lg border border-primary/40 bg-primary/5 p-6">
        <h2 className="font-heading text-xl font-bold">Now the honest part</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Every formula is an estimate — yours might run 5–10% hot or cold. Eat at this target for
          two to three weeks, weigh yourself a few mornings a week, and watch the trend. Moving the
          wrong way? Adjust by ~{eu(150)} and give it another two weeks. That feedback loop beats
          any calculator, including this one.
        </p>
      </div>

      {/* ——— Actions ——— */}
      <div className="no-print mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <Button onClick={copySummary} className="h-11 px-5">
          <Copy className="mr-2 h-4 w-4" />
          Copy plan
        </Button>
        <Button variant="outline" onClick={() => window.print()} className="h-11 px-5">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" onClick={onEdit} className="h-11 px-5">
          <Pencil className="mr-2 h-4 w-4" />
          Edit inputs
        </Button>
        <Button
          variant="ghost"
          onClick={onReset}
          className="h-11 px-5 text-muted-foreground"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start over
        </Button>
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
        Informational tool, not medical advice. Talk to a professional before major dietary changes.
        <br />
        Everything above was computed in your browser — your inputs were never sent anywhere.
      </p>
    </motion.div>
  )
}
