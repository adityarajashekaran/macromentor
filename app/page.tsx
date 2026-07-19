import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
} from "@/lib/calculator"

/* Honest sample: computed by the real engine at build time, not made up. */
const SAMPLE = (() => {
  const profile = { age: 29, sex: "male" as const, height: 178, weight: 82 }
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.sex)
  const tdee = calculateTDEE(bmr, "moderate")
  const { calorieTarget, deficitSurplus } = calculateCalorieTarget(
    tdee,
    "lose_fat",
    "moderate",
    undefined,
    undefined,
    profile.sex,
  )
  const macros = calculateMacros(profile.weight, calorieTarget, "lose_fat")
  return { profile, bmr, tdee, calorieTarget, deficitSurplus, macros }
})()

function HeroArt() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      style={{
        opacity: 0.22,
        maskImage: "linear-gradient(#0000 0%, #000 30%, #000 75%, #0000 100%)",
        WebkitMaskImage: "linear-gradient(#0000 0%, #000 30%, #000 75%, #0000 100%)",
      }}
    >
      <defs>
        <filter id="mm-blur-a">
          <feGaussianBlur stdDeviation="48" />
        </filter>
        <filter id="mm-blur-b">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <filter id="mm-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0" />
        </filter>
      </defs>
      <ellipse cx="850" cy="240" rx="340" ry="220" fill="hsl(var(--primary))" filter="url(#mm-blur-a)" />
      <ellipse cx="280" cy="520" rx="300" ry="180" fill="hsl(var(--pop-gold))" filter="url(#mm-blur-a)" opacity="0.7" />
      <ellipse cx="1050" cy="620" rx="220" ry="160" fill="hsl(var(--pop-orange))" filter="url(#mm-blur-b)" opacity="0.5" />
      <path
        d="M -50 560 Q 400 460 720 520 T 1250 480"
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx="720" cy="520" r="130" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.6" />
      <circle cx="720" cy="520" r="170" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.75" opacity="0.3" />
      <rect width="100%" height="100%" filter="url(#mm-grain)" />
    </svg>
  )
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
        <span
          className="inline-block h-2.5 w-2.5 rounded-[2px]"
          style={{ background: `var(${colorVar})` }}
        />
        {name}
      </span>
      <span className="font-mono text-sm tnum">
        {grams}g <span className="text-muted-foreground">· {pct}%</span>
      </span>
    </div>
  )
}

export default function Home() {
  const { profile, bmr, tdee, calorieTarget, deficitSurplus, macros } = SAMPLE
  const segments = [
    { key: "protein", pct: macros.protein.percentage, colorVar: "--color-protein" },
    { key: "carbs", pct: macros.carbs.percentage, colorVar: "--color-carbs" },
    { key: "fat", pct: macros.fat.percentage, colorVar: "--color-fat" },
  ]

  return (
    <main>
      {/* ————— Hero ————— */}
      <section className="relative overflow-hidden">
        <HeroArt />
        <div className="container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-primary">Free calorie &amp; macro calculator</p>
            <h1 className="mt-4 max-w-[16ch] text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Know exactly how much to eat.
            </h1>
            <p className="mt-6 max-w-[52ch] leading-relaxed text-muted-foreground">
              Your daily calories and macros, worked out the way a sports scientist would: it picks
              the most accurate formula your data supports, refuses to hand you a dangerous number,
              and shows every step of the math. Built with AI deep-research across the published
              literature — the kind of synthesis that used to need a dietitian and a stack of
              journals.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Start the calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="eyebrow text-muted-foreground">
                3 steps · ~2 min · nothing stored
              </p>
            </div>
          </div>

          {/* Sample plan — real output */}
          <div className="grain relative rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-primary">Sample plan</p>
              <p className="eyebrow text-muted-foreground">computed live</p>
            </div>
            <p className="mt-6 font-heading text-6xl font-extrabold tracking-tight tnum">
              {calorieTarget.toLocaleString()}
            </p>
            <p className="eyebrow mt-1 text-muted-foreground">
              kcal / day · {Math.abs(deficitSurplus)} below maintenance
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
              {profile.age}-year-old male, {profile.height} cm, {profile.weight} kg, moderately
              active, moderate fat loss. BMR {bmr.toLocaleString()} → TDEE {tdee.toLocaleString()}{" "}
              kcal. These numbers come from the same engine you&apos;re about to use.
            </p>
          </div>
        </div>
      </section>

      {/* ————— Pipeline: what happens when you hit calculate ————— */}
      <section className="container py-16 md:py-24">
        <div className="border-b border-border pb-6">
          <p className="eyebrow text-primary">Under the hood</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            What happens when you hit calculate.
          </h2>
          <p className="mt-3 max-w-[60ch] text-muted-foreground">
            Four stages, each backed by published research. No black box — your results page shows
            which path your numbers took.
          </p>
        </div>

        <ol className="mt-8 grid gap-4 lg:grid-cols-4">
          {[
            {
              num: "01",
              title: "Resting burn",
              tag: "BMR",
              body: "What your body burns doing nothing — keeping your heart beating, brain running, muscles ticking over. This is where the tiered formulas kick in.",
            },
            {
              num: "02",
              title: "Daily burn",
              tag: "TDEE",
              body: "Your resting burn multiplied by how active your life actually is, from desk job (×1.2) to physical work plus hard training (×1.9).",
            },
            {
              num: "03",
              title: "Goal adjustment",
              tag: "TARGET",
              body: "Cutting? A deficit sized to your body fat, so lean people aren't pushed too hard. Building? A surplus sized to your training age, so beginners get more.",
            },
            {
              num: "04",
              title: "Macro split",
              tag: "PROTEIN · CARBS · FAT",
              body: "Protein set per kg of body weight for your goal, fat held above a healthy floor, carbs fill the rest to fuel training.",
            },
          ].map((s) => (
            <li key={s.num} className="lift rounded-lg border border-border bg-card p-6">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-primary">{s.num}</span>
                <span className="eyebrow text-muted-foreground">{s.tag}</span>
              </div>
              <h3 className="mt-3 font-heading text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ————— Method ————— */}
      <section className="container py-16 md:py-24">
        <div className="border-b border-border pb-6">
          <p className="eyebrow text-primary">The clever bit</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Three formulas. It picks the best one you qualify for.
          </h2>
          <p className="mt-3 max-w-[60ch] text-muted-foreground">
            Most calculators run one equation for everyone. But the research is clear: the more you
            know about your body composition, the more accurate the math can get. Tell it more,
            get a better number — and it always tells you which formula it used.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              tier: "Tier 01",
              name: "Cunningham",
              needs: "body-fat % + training history",
              body: "The researcher's choice for trained athletes. Works from lean body mass, so muscle actually counts.",
            },
            {
              tier: "Tier 02",
              name: "Katch-McArdle",
              needs: "body-fat %",
              body: "Lean-mass based without the training requirement. A rough body-fat estimate is fine — precision matters less than you'd think.",
            },
            {
              tier: "Tier 03",
              name: "Mifflin-St Jeor",
              needs: "just the basics",
              body: "The gold-standard general formula — the one clinicians reach for. Small age and ancestry adjustments are applied only where research supports them, and always flagged.",
            },
          ].map((t) => (
            <div key={t.name} className="lift rounded-lg border border-border bg-card p-6">
              <p className="eyebrow text-primary">{t.tier}</p>
              <h3 className="mt-2 font-heading text-xl font-bold">{t.name}</h3>
              <p className="eyebrow mt-1 text-muted-foreground">needs {t.needs}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ————— Guardrails ————— */}
      <section className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-primary">Guardrails</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              It will refuse to give you a reckless number.
            </h2>
            <p className="mt-4 max-w-[52ch] leading-relaxed text-muted-foreground">
              Aggressive targets are easy to generate and miserable to live with. The engine caps
              what it will recommend and warns you when your inputs push against the limits.
            </p>
            <blockquote className="mt-8 border-l-2 border-primary pl-4">
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                &ldquo;It hasn&apos;t helped me lose weight yet. The tool works; adherence is its
                own problem.&rdquo;
              </p>
              <cite className="eyebrow mt-2 block not-italic text-muted-foreground">
                — Aditya, who built this
              </cite>
            </blockquote>
          </div>

          <ul className="space-y-0 divide-y divide-border rounded-lg border border-border bg-card px-6">
            {[
              ["Calorie floors", "Never below 1,200 kcal (women) or 1,500 kcal (men)"],
              ["Deficit caps", "Maximum deficit scales with your body-fat percentage — leaner means gentler"],
              ["Refeed flags", "Deficits past 20% trigger a periodic refeed recommendation"],
              ["Macro minimums", "Fat never drops below 0.6 g/kg; carbs never below 50 g"],
              ["Transparent adjustments", "Any population-level tweak is flagged in your results, never silent"],
            ].map(([k, v]) => (
              <li key={k} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="eyebrow shrink-0 text-foreground">{k}</span>
                <span className="text-sm text-muted-foreground sm:text-right">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————— Privacy ————— */}
      <section className="container py-16 md:py-24">
        <div className="rounded-lg border border-border bg-card p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow text-primary">Your data</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Yours. Not ours. Not anyone&apos;s.
              </h2>
              <p className="mt-4 max-w-[56ch] leading-relaxed text-muted-foreground">
                Your body, your numbers. Everything is computed inside your browser — there is no
                account to create, no server receiving your inputs, and no database holding them.
                Close the tab and it&apos;s gone. Health information belongs to the person it
                describes.
              </p>
            </div>
            <ul className="flex flex-row flex-wrap gap-2.5 lg:flex-col">
              {["No account", "No server", "No database", "No tracking scripts"].map((item) => (
                <li
                  key={item}
                  className="eyebrow rounded-full border border-primary/40 px-4 py-2 text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ————— Bottom CTA ————— */}
      <section className="container py-16 md:py-20">
        <div className="grain relative overflow-hidden rounded-lg border border-border bg-card px-6 py-12 text-center md:py-16">
          <p className="eyebrow text-primary">Free · no account · runs in your browser</p>
          <h2 className="mx-auto mt-4 max-w-[22ch] text-3xl font-bold sm:text-4xl">
            Two minutes of honest inputs. A plan that shows its working.
          </h2>
          <Link
            href="/calculator"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Start the calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
