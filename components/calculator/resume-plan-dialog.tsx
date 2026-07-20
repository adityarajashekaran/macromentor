"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { formatEnergy, type UnitPrefs } from "@/lib/units"
import type { CalculationResults } from "./compute"

/**
 * The single "you've got a saved plan" prompt, used anywhere in the app that
 * can land someone on the calculator with results already in session storage
 * — nav link, homepage CTA, a future entry point. Keep it here so every
 * caller shows the same choice instead of rolling its own modal.
 */
export function ResumePlanDialog({
  open,
  results,
  units,
  onResume,
  onStartOver,
}: {
  open: boolean
  results: CalculationResults
  units: UnitPrefs
  onResume: () => void
  onStartOver: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        hideClose
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>
            You've already got a plan from earlier this session —{" "}
            <span className="font-medium text-foreground">
              {results.goalDescription}, {formatEnergy(results.calorieTarget, units.energy)}/day
            </span>
            . Pick up where you left off, or start a fresh calculation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onStartOver} className="h-11">
            Start over
          </Button>
          <Button onClick={onResume} className="h-11">
            View my plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
