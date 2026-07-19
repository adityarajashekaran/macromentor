"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Copy, Printer, Pencil, RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { formatSummary, type CalculationResults } from "./compute"

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
  const sign = r.deficitSurplus > 0 ? "+" : "−"
  const hasAdjustment = r.deficitSurplus !== 0

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(formatSummary(r))
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
      {/* ——— Hero number ——— */}
      <div className="text-center">
        <p className="eyebrow text-primary">
          Your plan · {r.goalDescription} · Tier 0{r.tier}
        </p>
        <p className="mt-4 font-heading text-7xl font-extrabold tracking-tight tnum sm:text-8xl">
          {r.calorieTarget.toLocaleString()}
        </p>
        <p className="eyebrow mt-2 text-muted-foreground">kcal per day</p>
        {hasAdjustment ? (
          <p className="mt-3 text-sm text-muted-foreground">
            That&apos;s{" "}
            <span className="font-mono font-medium text-foreground tnum">
              {sign}
              {Math.abs(r.deficitSurplus).toLocaleString()} kcal
            </span>{" "}
            versus the {r.tdee.toLocaleString()} kcal you burn in a typical day.
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Matched to the {r.tdee.toLocaleString()} kcal you burn in a typical day.
          </p>
        )}
      </div>

      {/* ——— Warnings ——— */}
      {(r.warnings.belowMinimum ||
        r.warnings.refeedRecommended ||
        r.warnings.ethnicityAdjustmentApplied) && (
        <div className="mt-8 space-y-2.5">
          {r.warnings.belowMinimum && (
            <WarningPill tone="destructive">
              <strong>This target sits below the safe floor</strong> (
              {r.userProfile.sex === "female" ? "1,200" : "1,500"} kcal). Pick a gentler rate, or
              work with a professional — very low intakes need supervision.
            </WarningPill>
          )}
          {r.warnings.refeedRecommended && (
            <WarningPill tone="gold">
              <strong>Big deficit — plan refeeds.</strong> Every 1–2 weeks, spend a day eating at
              maintenance ({r.tdee.toLocaleString()} kcal, extra from carbs). It helps hormones,
              training, and sanity.
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

      {/* ——— Macros ——— */}
      <div className="mt-10 rounded-lg border border-border bg-card p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-xl font-bold">Daily macros</h2>
          <p className="eyebrow text-muted-foreground">grams per day</p>
        </div>

        <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full">
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
              <div key={m.key} className="rounded-md border border-border p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-[2px]"
                    style={{ background: `var(${m.colorVar})` }}
                  />
                  {m.label}
                </p>
                <p className="mt-2 font-heading text-3xl font-bold tnum">
                  {macro.grams}
                  <span className="ml-0.5 text-base font-normal text-muted-foreground">g</span>
                </p>
                <p className="eyebrow mt-1 text-muted-foreground">
                  {macro.percentage}% · {macro.calories.toLocaleString()} kcal
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{m.note}</p>
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Protein comes to{" "}
          <span className="font-mono tnum">
            {(r.macros.protein.grams / r.userProfile.weight).toFixed(1)} g
          </span>{" "}
          per kg of body weight
          {r.userProfile.dietType !== "standard" && (
            <> — bumped for a {r.userProfile.dietType} diet</>
          )}
          .
        </p>
      </div>

      {/* ——— The numbers underneath ——— */}
      <div
        className={`mt-6 grid grid-cols-2 gap-2.5 ${
          r.metrics.lbm !== undefined ? "sm:grid-cols-5" : "sm:grid-cols-4"
        }`}
      >
        <Stat label="BMR · at rest" value={r.bmr.toLocaleString()} unit="kcal" />
        <Stat label="TDEE · burned daily" value={r.tdee.toLocaleString()} unit="kcal" />
        <Stat
          label="vs maintenance"
          value={hasAdjustment ? `${sign}${Math.abs(r.deficitSurplus).toLocaleString()}` : "±0"}
          unit="kcal"
        />
        <Stat label="BMI" value={r.metrics.bmi.toFixed(1)} />
        {r.metrics.lbm !== undefined && (
          <Stat label="Lean mass" value={r.metrics.lbm.toFixed(1)} unit="kg" />
        )}
      </div>

      {/* ——— How it was calculated ——— */}
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold">How we got here</h2>
        <ol className="mt-4 space-y-3">
          {[
            [
              "01",
              `Resting burn (BMR): ${r.bmr.toLocaleString()} kcal`,
              r.bmrMethod +
                (r.tier < 3
                  ? " — your body-fat % let us use a formula that counts muscle."
                  : "."),
            ],
            [
              "02",
              `Daily burn (TDEE): ×${r.palMultiplier}`,
              `Your activity level multiplies resting burn up to ${r.tdee.toLocaleString()} kcal a day.`,
            ],
            [
              "03",
              `Goal adjustment: ${hasAdjustment ? `${sign}${Math.abs(r.deficitSurplus).toLocaleString()} kcal` : "none"}`,
              `${r.goalDescription} sets the size of the change — with safety caps on how far it can go.`,
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
          Profile: {r.userProfile.age}y · {r.userProfile.sex} · {r.userProfile.height} cm ·{" "}
          {r.userProfile.weight} kg
          {r.userProfile.bodyFat !== undefined && <> · {r.userProfile.bodyFat}% body fat</>}
        </p>
      </div>

      {/* ——— Micronutrients ——— */}
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
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
      <div className="mt-6 rounded-lg border border-primary/40 bg-primary/5 p-6">
        <h2 className="font-heading text-xl font-bold">Now the honest part</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Every formula is an estimate — yours might run 5–10% hot or cold. Eat at this target for
          two to three weeks, weigh yourself a few mornings a week, and watch the trend. Moving the
          wrong way? Adjust by ~150 kcal and give it another two weeks. That feedback loop beats any
          calculator, including this one.
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
