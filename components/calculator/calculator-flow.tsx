"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

import {
  formSchema,
  stepFields,
  sexOptions,
  activityLevelOptions,
  trainingExperienceOptions,
  goalOptions,
  weightLossRateOptions,
  weightGainRateOptions,
  dietTypeOptions,
  ethnicityOptions,
  type CalculatorFormValues,
} from "./schema"
import { buildResults, type CalculationResults } from "./compute"
import { Results } from "./results"
import { ResumePlanDialog } from "./resume-plan-dialog"
import { WeightField, HeightField, LengthField, UnitToggle } from "./unit-inputs"
import { useUnits } from "@/components/units-provider"
import { rangeHint } from "@/lib/units"

/* Session-only persistence: survives refresh, gone when the tab closes —
   which keeps the "close the tab and it's gone" promise intact. */
const STORAGE_KEY = "macromentor-calc"

const STEPS = [
  {
    title: "About you",
    description: "The four numbers every formula needs.",
  },
  {
    title: "Your typical week",
    description: "Movement and training set how much you burn.",
  },
  {
    title: "Your goal",
    description: "This sets your daily target and macros.",
  },
]

/* —— Small local primitives —— */

function UnitInput({
  field,
  unit,
  placeholder,
  autoFocus,
}: {
  field: any
  unit: string
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <div className="relative">
      <Input
        {...field}
        value={field.value ?? ""}
        type="number"
        inputMode="decimal"
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className="h-12 pr-12 font-mono tnum"
      />
      <span className="eyebrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        {unit}
      </span>
    </div>
  )
}

function OptionCards({
  value,
  onChange,
  options,
  columns = 1,
}: {
  value: string | undefined
  onChange: (v: string) => void
  options: readonly { value: string; label: string; description?: string }[]
  columns?: 1 | 2 | 3
}) {
  const grid =
    columns === 3 ? "grid-cols-3" : columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
  return (
    <div className={`grid gap-2.5 ${grid}`} role="radiogroup">
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`rounded-md border px-4 py-3.5 text-left transition-colors ${
              selected
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <span className={`block text-sm font-medium ${selected ? "text-primary" : ""}`}>
              {opt.label}
            </span>
            {opt.description && (
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                {opt.description}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
}

/* —— The flow —— */

export function CalculatorFlow() {
  const [step, setStep] = useState(1)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [restored, setRestored] = useState(false)
  // A saved plan from an earlier visit, awaiting "resume or start over" —
  // held separately from `results` so it isn't shown until the visitor picks.
  const [resumePrompt, setResumePrompt] = useState<CalculationResults | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const { units } = useUnits()
  const totalSteps = 3

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(formSchema) as Resolver<CalculatorFormValues>,
    defaultValues: {
      trainingExperience: "none",
      weightLossRate: "moderate",
      weightGainRate: "slow",
      dietType: "standard",
      ethnicity: "default",
    },
    mode: "onTouched",
  })

  const watchGoal = form.watch("goal")

  // Restore once on mount (after hydration, so server HTML always matches)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        // keepDefaultValues: otherwise the restored values become the new
        // defaults, and a later "Start over" reset() restores them instead
        // of clearing the form
        if (saved?.values) form.reset(saved.values, { keepDefaultValues: true })
        if (typeof saved?.step === "number" && saved.step >= 1 && saved.step <= 3) {
          setStep(saved.step)
        }
        if (saved?.hasResults) {
          const parsed = formSchema.safeParse(saved.values)
          // Don't jump straight to the saved results — ask first, so a
          // returning visitor isn't dropped past the form with no way back.
          if (parsed.success) setResumePrompt(buildResults(parsed.data))
        }
      }
    } catch {
      // corrupt session data — start fresh
    }
    setRestored(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist on every change once restored. While the resume prompt is up,
  // `results` is still null — count resumePrompt too, or this write would
  // clear the saved hasResults flag before the visitor gets to choose.
  const hasResults = results !== null || resumePrompt !== null
  useEffect(() => {
    if (!restored) return
    const save = () => {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ values: form.getValues(), step, hasResults }),
        )
      } catch {
        // storage full/unavailable — the calculator still works, just won't survive refresh
      }
    }
    save()
    const sub = form.watch(() => save())
    return () => sub.unsubscribe()
  }, [restored, step, hasResults, form])

  async function nextStep() {
    const valid = await form.trigger(stepFields[step])
    if (valid && step < totalSteps) {
      // the resolver validates the whole schema; drop errors that belong to steps
      // the user hasn't reached yet so they don't arrive pre-scolded
      const current = new Set<string>(stepFields[step])
      const futureFields = Object.values(stepFields)
        .flat()
        .filter((f) => !current.has(f))
      form.clearErrors(futureFields)
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }

  function prevStep() {
    if (step > 1) setStep(step - 1)
  }

  function onSubmit(data: CalculatorFormValues) {
    setResults(buildResults(data))
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  function startOver() {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
    form.reset()
    setResults(null)
    setResumePrompt(null)
    setStep(1)
  }

  // One-frame gate so a restored session doesn't flash step 1 before jumping
  if (!restored) {
    return <div className="mx-auto min-h-[50vh] max-w-2xl" aria-hidden />
  }

  if (resumePrompt) {
    return (
      <>
        <div className="mx-auto min-h-[50vh] max-w-2xl" aria-hidden />
        <ResumePlanDialog
          open
          results={resumePrompt}
          units={units}
          onResume={() => {
            setResults(resumePrompt)
            setResumePrompt(null)
          }}
          onStartOver={startOver}
        />
      </>
    )
  }

  if (results) {
    return (
      <Results results={results} onEdit={() => setResults(null)} onReset={startOver} />
    )
  }

  const stepInfo = STEPS[step - 1]

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step header */}
      <div className="mb-2 flex items-baseline justify-between">
        <p className="eyebrow text-primary">
          Step {step} of {totalSteps}
        </p>
        <p className="eyebrow text-muted-foreground">{step < 3 ? "~30 seconds" : "last one"}</p>
      </div>
      <div className="mb-8 flex gap-1.5" aria-hidden>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              s <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <Form {...form}>
        {/* No native submit button anywhere: a Continue click's default action can land on
            the re-rendered final button and phantom-submit the whole form. Enter still works
            via the form's submit event, routed through the step logic. */}
        {/* autoComplete off also opts out of the browser's form-restore-on-reload,
            which would repaint stale values into inputs our state has cleared */}
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault()
            if (step < totalSteps) void nextStep()
            else void form.handleSubmit(onSubmit)()
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-bold">{stepInfo.title}</h1>
              <p className="mt-1.5 text-muted-foreground">{stepInfo.description}</p>

              <div className="mt-8 space-y-8">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sex</FormLabel>
                          <FormControl>
                            <OptionCards
                              value={field.value}
                              onChange={field.onChange}
                              options={sexOptions}
                              columns={3}
                            />
                          </FormControl>
                          <FieldHint>
                            Used in the metabolism formulas. Pick whichever is closest to your
                            hormonal profile — &ldquo;Other&rdquo; uses a midpoint.
                          </FieldHint>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem className="sm:max-w-[10rem]">
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <UnitInput field={field} unit="yrs" placeholder="29" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Height</FormLabel>
                                <UnitToggle dimension="height" />
                              </div>
                              <FormControl>
                                <HeightField key={units.height} field={field} unit={units.height} />
                              </FormControl>
                              <FieldHint>{rangeHint("height", units.height)}</FieldHint>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Weight</FormLabel>
                                <UnitToggle dimension="weight" />
                              </div>
                              <FormControl>
                                <WeightField key={units.weight} field={field} unit={units.weight} />
                              </FormControl>
                              <FieldHint>{rangeHint("weight", units.weight)}</FieldHint>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How active is your average day?</FormLabel>
                          <FormControl>
                            <OptionCards
                              value={field.value}
                              onChange={field.onChange}
                              options={activityLevelOptions}
                            />
                          </FormControl>
                          <FieldHint>
                            Count everything — job, walking, training. Most people overestimate;
                            when in doubt, pick the lower one.
                          </FieldHint>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trainingExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lifting experience</FormLabel>
                          <FormControl>
                            <OptionCards
                              value={field.value}
                              onChange={field.onChange}
                              options={trainingExperienceOptions}
                              columns={2}
                            />
                          </FormControl>
                          <FieldHint>
                            Sets how big a muscle-building surplus makes sense — beginners can grow
                            faster, so they get more.
                          </FieldHint>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bodyFat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Body fat{" "}
                            <span className="eyebrow ml-1.5 text-muted-foreground">optional</span>
                          </FormLabel>
                          <FormControl>
                            <UnitInput field={field} unit="%" placeholder="e.g. 20" />
                          </FormControl>
                          <FieldHint>
                            A rough guess is fine — even a gym-mirror estimate unlocks the more
                            accurate lean-mass formulas. Leave it blank and we use the standard one.
                          </FieldHint>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are you training for?</FormLabel>
                          <FormControl>
                            <OptionCards
                              value={field.value}
                              onChange={field.onChange}
                              options={goalOptions}
                              columns={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchGoal === "lose_fat" && (
                      <FormField
                        control={form.control}
                        name="weightLossRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How fast?</FormLabel>
                            <FormControl>
                              <OptionCards
                                value={field.value}
                                onChange={field.onChange}
                                options={weightLossRateOptions}
                                columns={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {watchGoal === "gain_weight" && (
                      <FormField
                        control={form.control}
                        name="weightGainRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How fast?</FormLabel>
                            <FormControl>
                              <OptionCards
                                value={field.value}
                                onChange={field.onChange}
                                options={weightGainRateOptions}
                                columns={2}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Collapsible>
                      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3.5 text-left">
                        <div>
                          <span className="block text-sm font-medium">Refinements</span>
                          <span className="block text-xs text-muted-foreground">
                            Diet style, background, waist — all optional
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-8 rounded-b-md border-x border-b border-border px-4 py-6">
                          <FormField
                            control={form.control}
                            name="dietType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>How do you eat?</FormLabel>
                                <FormControl>
                                  <OptionCards
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={dietTypeOptions}
                                    columns={3}
                                  />
                                </FormControl>
                                <FieldHint>
                                  Plant proteins digest a little differently, so vegetarian and
                                  vegan targets get a protein bump.
                                </FieldHint>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="ethnicity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Ancestry{" "}
                                  <span className="eyebrow ml-1.5 text-muted-foreground">
                                    optional
                                  </span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="Prefer not to say" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {ethnicityOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FieldHint>
                                  Studies show resting metabolism differs slightly across some
                                  populations. This only nudges the standard formula (±3–5%), is
                                  skipped entirely if you gave a body-fat %, and is always flagged
                                  in your results. Only backgrounds with published research are
                                  listed.
                                </FieldHint>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="waistCircumference"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel>
                                    Waist{" "}
                                    <span className="eyebrow ml-1.5 text-muted-foreground">
                                      optional
                                    </span>
                                  </FormLabel>
                                  <UnitToggle dimension="waist" />
                                </div>
                                <FormControl>
                                  <LengthField key={units.waist} field={field} unit={units.waist} />
                                </FormControl>
                                <FieldHint>
                                  Measured at the navel, in {units.waist === "in" ? "inches" : "cm"}.
                                  Only used for a heart-health check that can raise your omega-3
                                  guidance.
                                </FieldHint>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="mt-10 flex items-center gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                className="h-12 px-5 text-muted-foreground"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step < totalSteps ? (
              <Button key="next" type="button" onClick={nextStep} className="h-12 px-8">
                Continue
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                key="calculate"
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="h-12 px-8"
              >
                Calculate my plan
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>

          {step === totalSteps && (
            <p className="mt-4 text-right text-xs leading-relaxed text-muted-foreground">
              By calculating you acknowledge this is informational guidance, not medical advice.
            </p>
          )}
        </form>
      </Form>
    </div>
  )
}
