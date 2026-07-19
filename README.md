# MacroMentor

**A hyper-personalised calorie and macro calculator. [macromentor.horizonfall.com](https://macromentor.horizonfall.com)**

![MacroMentor](docs/screenshot.png)

I decided to get healthy and refused to hand the problem to a generic calorie app. Instead I used deep-research AI tools to read the current academic literature on BMR, TDEE, and macro targeting, the kind of synthesis that used to need a dietitian, a sports-science researcher, or a long stack of journal articles. Then I built the calculator I wished existed. Several personal trainers tried it before launch and called it amazingly useful, and those are people paid to spot bad macro calculators.

## What makes it different

The BMR formula is tiered by what data you can actually give it. Cunningham at the top (needs body-fat percentage and training experience), then Katch-McArdle or the Singapore equation depending on body composition and optional ethnicity input, then Mifflin-St Jeor as the fallback, with population-level adjustments flagged transparently in the output whenever they apply.

TDEE uses Physical Activity Level, which separates baseline daily activity from structured exercise instead of applying one generic multiplier. Calorie targets are goal-calibrated with safety caps built in: 1,200 and 1,500 kcal floors, a maximum deficit tied to body-fat percentage, refeed recommendations for aggressive cuts. Goals cover fat loss at several rates, muscle gain (clean and aggressive), maintenance, and recomposition. Micronutrient guidance fires for iron, calcium, vitamin D, omega-3, and fibre, with risk flags when waist-circumference thresholds are crossed.

Ethnicity input is handled carefully: optional, explained before it's asked, only ever a small refinement in the Mifflin-St Jeor tier, skipped entirely when body-fat percentage is available, and flagged in the output whenever it was used.

## How it's built

The calculation core is a pure function in `calculator.ts`, covered by a 43-test Vitest suite. Every tier, every formula branch, and every safety cap has a named test case with expected values recorded.

One method I arrived at the hard way: write the tests for each section first, then build against them. My first attempts let the AI build the calculator directly and it kept silently dropping steps, a tier firing wrong, a cap not triggering, a macro floor skipped. Once the tests existed as a specification, the AI-generated implementation was correct. It's the only reliable way I've found to keep AI honest on a multi-branch calculation engine, and it generalises to any complex AI-built system.

Stack: Next.js, React, TypeScript, Tailwind, Radix UI, Vitest.

---

Part of [horizonfall.com](https://horizonfall.com). The full story is at **[horizonfall.com/projects/macromentor](https://horizonfall.com/projects/macromentor)**.
