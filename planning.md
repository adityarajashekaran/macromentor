# NutriTrack Pro - Planning Document

## 1. Application Summary

NutriTrack Pro is an advanced, hyper-personalized web application designed to calculate calorie and macronutrient needs. It leverages detailed user input and foundational metabolic science, including recent research on individual variations, to provide tailored nutritional guidance.

The core philosophy emphasizes:
*   **Hyper-Personalization:** Incorporating detailed user data (age, sex, height, weight, activity, body fat %, training experience, diet type, etc.) for accurate calculations.
*   **Evidence-Based:** Utilizing validated equations (Mifflin-St Jeor, Katch-McArdle, Cunningham, Singapore Equation) and research findings.
*   **User Experience:** A multi-step form guides users through data collection, providing clear explanations for each input.
*   **Transparency & Ethics:** Explicitly stating how data (especially sensitive optional data like ethnicity) is used, its limitations, and providing clear disclaimers.
*   **Actionable Guidance:** Presenting results clearly with macro/micro breakdowns and practical recommendations.

The application serves as an informational tool and does not replace professional medical or nutritional advice.

## 2. Key Features

*   **Multi-Step User Input:** Guides users through collecting:
    *   **Basic Information:** Sex, Age, Height, Weight.
    *   **Activity & Body Composition:** Daily Activity Level (NEAT), Planned Exercise (EAT), Optional Body Fat %, Optional Training Experience.
    *   **Goals:** Lose Fat (with rate options), Build Muscle (Clean/Aggressive), Maintain, Gain Weight (with rate options), Improve Health, Body Recomposition.
    *   **Advanced Options:** Optional Diet Type (Standard, Vegetarian, Vegan), Optional Ethnicity (for Tier 3 BMR refinement), Optional Neck/Waist Circumference (for health risk flags).
*   **Tiered BMR/RMR Calculation:** Selects the most appropriate formula based on data availability:
    *   **Tier 1:** Cunningham (BF% + Training Exp.)
    *   **Tier 2:** Katch-McArdle (BF%) or Singapore Equation (BF% + East Asian Descent).
    *   **Tier 3:** Mifflin-St Jeor (Weight-based) with optional, transparent ethnic adjustments and age adjustments (>40).
*   **TDEE Calculation:** Calculates Total Daily Energy Expenditure based on BMR and a Physical Activity Level (PAL) derived from NEAT and EAT inputs.
*   **Goal-Based Calorie Adjustment:** Calculates target daily calories based on the selected goal (deficit for fat loss/recomp, surplus for muscle/weight gain, maintenance). Includes safety caps (min calories, max deficit based on BF%).
*   **Macronutrient Breakdown:** Calculates Protein, Fat, and Carbohydrate targets (in grams, calories, and percentages) based on total calories, goal, weight, and diet type. Ensures minimum fat and carb levels.
*   **Micronutrient Guidance:** Provides targets and food source suggestions for key micronutrients (Iron, Calcium, Vitamin D, Omega-3, Fiber) based on demographics and potential risk factors (e.g., high waist circumference).
*   **Adaptive Features & Warnings:**
    *   Minimum Calorie Alert: Warns if target falls below safe levels (e.g., 1200/1500 kcal) and adjusts upwards.
    *   Refeed Recommendation: Suggests refeed days for significant deficits to mitigate metabolic adaptation.
    *   Ethnicity Adjustment Transparency: Clearly flags if a population-based adjustment was applied in Tier 3.
*   **Detailed Results Display:** Presents a comprehensive summary including:
    *   User profile summary.
    *   BMR, TDEE, Target Calories (with deficit/surplus breakdown).
    *   Macronutrient breakdown (grams, calories, percentage) with visualizations (pie chart, progress bars).
    *   Body Metrics (BMI, LBM if BF% provided).
    *   Micronutrient targets and food source examples.
    *   Personalized recommendations (meal timing, hydration, reassessment, fiber, food quality).
    *   Warnings and disclaimers.
*   **Theming:** Light/Dark mode support.

## 3. Core Components

*   **`app/page.tsx`:** The main landing page, providing an introduction, feature highlights, and rendering the primary calculator component.
*   **`components/calculator.tsx`:** The central multi-step form component. Handles:
    *   User input via various Shadcn/ui controls (RadioGroup, Input, Select, Switch).
    *   Form state management and validation (React Hook Form, Zod).
    *   Step navigation and conditional rendering of form sections.
    *   Triggering calculations upon final submission.
    *   Rendering the results display component.
*   **`components/results-display.tsx`:** Renders the detailed calculation results. Uses:
    *   Cards, Tabs, Badges, Progress bars for data presentation.
    *   Visualizations for macro distribution (SVG pie chart).
    *   Conditional alerts for warnings and recommendations.
    *   Organized sections for Energy Summary, Macros, Micros, and Tips.
*   **`lib/calculator.ts`:** Contains the pure functions for performing the core nutritional calculations (BMR, TDEE, Calorie Target, Macros) based on the logic defined in `healthcalculations.md`.
*   **`components/ui/`:** A collection of reusable, styled UI primitives from Shadcn/ui, used extensively throughout the application.
*   **`components/theme-provider.tsx` & `theme-toggle.tsx`:** Manage and provide the UI toggle for light/dark mode.

## 4. Technologies Used

*   **Framework:** Next.js 15
*   **Language:** TypeScript
*   **UI Library:** React 19
*   **Styling:** Tailwind CSS
*   **Component Library:** Shadcn/ui (built on Radix UI)
*   **Form Management:** React Hook Form
*   **Schema Validation:** Zod
*   **Animation:** Framer Motion
*   **Charting:** Recharts (via `components/ui/chart.tsx`)
*   **Icons:** Lucide React
*   **Utility:** clsx, tailwind-merge
*   **Package Manager:** pnpm
*   **Build Tool:** Next.js CLI (integrated)
*   **Linting/Formatting:** (Assumed via Next.js defaults - ESLint, Prettier) 