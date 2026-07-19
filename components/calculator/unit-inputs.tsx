"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useUnits } from "@/components/units-provider"
import {
  kgToLb,
  lbToKg,
  kgToStLb,
  stLbToKg,
  cmToFtIn,
  ftInToCm,
  cmToIn,
  inToCm,
  type WeightUnit,
  type HeightUnit,
  type LengthUnit,
} from "@/lib/units"

const round1 = (x: number) => Math.round(x * 10) / 10
const asNumber = (v: unknown): number | undefined =>
  typeof v === "number" && !Number.isNaN(v) ? v : undefined

/** Single number box with a trailing unit label. Uncontrolled-by-string. */
function Box({
  value,
  onChange,
  onBlur,
  unit,
  placeholder,
  autoFocus,
  width = "full",
}: {
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  unit: string
  placeholder?: string
  autoFocus?: boolean
  width?: "full" | "flex"
}) {
  return (
    <div className={`relative ${width === "flex" ? "flex-1" : ""}`}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
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

/**
 * Weight input. Canonical form value is always kg; this widget displays and
 * edits in the chosen unit and writes kg back. Remounted (keyed) on unit change,
 * so it re-seeds from the canonical value without keystroke fights.
 */
export function WeightField({
  field,
  unit,
  autoFocus,
}: {
  field: any
  unit: WeightUnit
  autoFocus?: boolean
}) {
  const kg = asNumber(field.value)

  if (unit === "st-lb") {
    const seed = kg != null ? kgToStLb(kg) : null
    const [st, setSt] = useState(seed ? String(seed.st) : "")
    const [lb, setLb] = useState(seed ? String(seed.lb) : "")
    const write = (s: string, l: string) => {
      if (s === "" && l === "") return field.onChange(undefined)
      field.onChange(stLbToKg(Number(s || 0), Number(l || 0)))
    }
    return (
      <div className="flex gap-2">
        <Box
          value={st}
          onChange={(v) => {
            setSt(v)
            write(v, lb)
          }}
          onBlur={field.onBlur}
          unit="st"
          placeholder="13"
          autoFocus={autoFocus}
          width="flex"
        />
        <Box
          value={lb}
          onChange={(v) => {
            setLb(v)
            write(st, v)
          }}
          onBlur={field.onBlur}
          unit="lb"
          placeholder="4"
          width="flex"
        />
      </div>
    )
  }

  const seedValue = kg != null ? (unit === "lb" ? round1(kgToLb(kg)) : round1(kg)) : ""
  const [text, setText] = useState(seedValue === "" ? "" : String(seedValue))
  const onChange = (v: string) => {
    setText(v)
    if (v === "") return field.onChange(undefined)
    const n = Number(v)
    if (Number.isNaN(n)) return field.onChange(undefined)
    field.onChange(unit === "lb" ? lbToKg(n) : n)
  }
  return (
    <Box
      value={text}
      onChange={onChange}
      onBlur={field.onBlur}
      unit={unit}
      placeholder={unit === "lb" ? "180" : "82"}
      autoFocus={autoFocus}
    />
  )
}

/** Height input. Canonical value is cm; edits in cm or ft/in. */
export function HeightField({ field, unit }: { field: any; unit: HeightUnit }) {
  const cm = asNumber(field.value)

  if (unit === "ft-in") {
    const seed = cm != null ? cmToFtIn(cm) : null
    const [ft, setFt] = useState(seed ? String(seed.ft) : "")
    const [inch, setInch] = useState(seed ? String(seed.in) : "")
    const write = (f: string, i: string) => {
      if (f === "" && i === "") return field.onChange(undefined)
      field.onChange(ftInToCm(Number(f || 0), Number(i || 0)))
    }
    return (
      <div className="flex gap-2">
        <Box
          value={ft}
          onChange={(v) => {
            setFt(v)
            write(v, inch)
          }}
          onBlur={field.onBlur}
          unit="ft"
          placeholder="5"
          width="flex"
        />
        <Box
          value={inch}
          onChange={(v) => {
            setInch(v)
            write(ft, v)
          }}
          onBlur={field.onBlur}
          unit="in"
          placeholder="10"
          width="flex"
        />
      </div>
    )
  }

  const [text, setText] = useState(cm != null ? String(Math.round(cm)) : "")
  const onChange = (v: string) => {
    setText(v)
    if (v === "") return field.onChange(undefined)
    const n = Number(v)
    field.onChange(Number.isNaN(n) ? undefined : n)
  }
  return <Box value={text} onChange={onChange} onBlur={field.onBlur} unit="cm" placeholder="178" />
}

/** Waist (optional). Canonical value is cm; edits in cm or inches. */
export function LengthField({ field, unit }: { field: any; unit: LengthUnit }) {
  const cm = asNumber(field.value)
  const seedValue = cm != null ? (unit === "in" ? Math.round(cmToIn(cm)) : Math.round(cm)) : ""
  const [text, setText] = useState(seedValue === "" ? "" : String(seedValue))
  const onChange = (v: string) => {
    setText(v)
    if (v === "") return field.onChange(undefined)
    const n = Number(v)
    if (Number.isNaN(n)) return field.onChange(undefined)
    field.onChange(unit === "in" ? inToCm(n) : n)
  }
  return (
    <Box
      value={text}
      onChange={onChange}
      onBlur={field.onBlur}
      unit={unit}
      placeholder={unit === "in" ? "e.g. 35" : "e.g. 90"}
    />
  )
}

const UNIT_OPTIONS = {
  weight: [
    { v: "kg", l: "kg" },
    { v: "lb", l: "lb" },
    { v: "st-lb", l: "st" },
  ],
  height: [
    { v: "cm", l: "cm" },
    { v: "ft-in", l: "ft/in" },
  ],
  waist: [
    { v: "cm", l: "cm" },
    { v: "in", l: "in" },
  ],
} as const

/**
 * Tiny segmented unit switch that sits on a field's label row, so each unit
 * choice lives next to the input it changes instead of in a global bar.
 */
export function UnitToggle({ dimension }: { dimension: keyof typeof UNIT_OPTIONS }) {
  const { units, setUnits } = useUnits()
  return (
    <div
      className="flex rounded-full bg-muted p-0.5"
      role="radiogroup"
      aria-label={`${dimension} unit`}
    >
      {UNIT_OPTIONS[dimension].map((o) => {
        const active = units[dimension] === o.v
        return (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setUnits({ [dimension]: o.v } as any)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.l}
          </button>
        )
      })}
    </div>
  )
}
