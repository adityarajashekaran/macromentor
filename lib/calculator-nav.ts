/**
 * A `<Link href="/calculator">` clicked while already on /calculator is a
 * same-URL no-op in Next.js — no remount, no restore effect re-run. The
 * header button dispatches this instead so the calculator flow can react
 * (e.g. re-surface the resume/start-over choice) even without a real
 * navigation.
 */
export const CALCULATOR_NAV_EVENT = "macromentor:calculator-nav"
