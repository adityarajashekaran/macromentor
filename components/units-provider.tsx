"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  DEFAULT_UNITS,
  defaultUnitsFor,
  type UnitPrefs,
} from "@/lib/units"

const STORAGE_KEY = "macromentor-units"

interface UnitsContextValue {
  units: UnitPrefs
  setUnits: (patch: Partial<UnitPrefs>) => void
  /** false until the stored/locale preference has been read (SSR guard) */
  ready: boolean
}

const UnitsContext = createContext<UnitsContextValue | null>(null)

export function UnitsProvider({ children }: { children: ReactNode }) {
  // Server + first paint use metric defaults so SSR HTML is stable; the stored
  // or locale-inferred preference is applied after mount (like the theme toggle).
  const [units, setUnitsState] = useState<UnitPrefs>(DEFAULT_UNITS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let next = DEFAULT_UNITS
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        next = { ...DEFAULT_UNITS, ...saved }
      } else {
        next = defaultUnitsFor(navigator.language)
      }
    } catch {
      next = DEFAULT_UNITS
    }
    setUnitsState(next)
    setReady(true)
  }, [])

  function setUnits(patch: Partial<UnitPrefs>) {
    setUnitsState((prev) => {
      const merged = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      } catch {
        // storage unavailable — preference just won't persist
      }
      return merged
    })
  }

  return (
    <UnitsContext.Provider value={{ units, setUnits, ready }}>{children}</UnitsContext.Provider>
  )
}

export function useUnits(): UnitsContextValue {
  const ctx = useContext(UnitsContext)
  if (!ctx) throw new Error("useUnits must be used within a UnitsProvider")
  return ctx
}
