# MacroMentor Testing Tasks

This document outlines specific tasks and subtasks for testing the MacroMentor application based on the comprehensive testing plan.

## 0. Setup Automated Testing Infrastructure (User Action Required)

**Goal:** Install and configure the necessary libraries for automated testing.
**Method:** Use pnpm to install dependencies and create basic configuration files.

*   [x] **Task:** Install Unit/Component Testing Libraries (Vitest & React Testing Library)
    *   [x] **Subtask (Terminal):** Run `pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom`
    *   [x] **Subtask (Configuration):** Create a `vitest.config.ts` file in the project root with basic setup (refer to Vitest and React Testing Library documentation for Next.js integration).
        ```ts
        // Example vitest.config.ts (customize as needed)
        import { defineConfig } from 'vitest/config'
        import react from '@vitejs/plugin-react'

        export default defineConfig({
          plugins: [react()],
          test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './vitest.setup.ts', // Create this file for jest-dom setup
            css: true, // If you need CSS processing
          },
        })
        ```
    *   [x] **Subtask (Setup File):** Create `vitest.setup.ts` in the project root:
        ```ts
        // vitest.setup.ts
        import '@testing-library/jest-dom'
        ```
    *   [x] **Subtask (package.json):** Add test scripts to `package.json`:
        ```json
        "scripts": {
          // ... other scripts
          "test": "vitest",
          "test:ui": "vitest --ui",
          "coverage": "vitest run --coverage"
        }
        ```
*   [x] **Task:** Install E2E Testing Library (Playwright)
    *   [x] **Subtask (Terminal):** Run `pnpm add -D @playwright/test`
    *   [x] **Subtask (Terminal):** Run `pnpm exec playwright install` (This installs necessary browser binaries).
    *   [x] **Subtask (Configuration):** Playwright typically includes interactive setup or uses a `playwright.config.ts` file. Follow Playwright documentation for initial configuration (e.g., setting base URL).
    *   [x] **Subtask (package.json):** Add E2E test scripts to `package.json`:
        ```json
        "scripts": {
          // ... other scripts
          "test:e2e": "playwright test",
          "test:e2e:ui": "playwright test --ui"
        }
        ```

---

## I. Unit Testing (`lib/calculator.ts`)

**Goal:** Verify the accuracy and correctness of individual calculation functions.
**Method:** Use a test runner (e.g., Jest, Vitest) with specific input/output assertions.

**A. `calculateBMR` Function Tests**

*   [x] **Task:** Test Mifflin-St Jeor (Male)
    *   [x] **Subtask:** Input: Sex='male', Age=30, W=80kg, H=180cm -> Expect: ~1778 kcal -> Actual 1780
    *   [x] **Subtask:** Input: Sex='male', Age=60, W=90kg, H=175cm -> Expect: ~1679 kcal -> Actual 1665
*   [x] **Task:** Test Mifflin-St Jeor (Female)
    *   [x] **Subtask:** Input: Sex='female', Age=30, W=60kg, H=165cm -> Expect: ~1361 kcal -> Actual 1320
    *   [x] **Subtask:** Input: Sex='female', Age=60, W=70kg, H=160cm -> Expect: ~1254 kcal -> Actual 1214
*   [x] **Task:** Test Mifflin-St Jeor (Other)
    *   [x] **Subtask:** Input: Sex='other', Age=30, W=70kg, H=170cm -> Expect: ~1535 kcal -> Actual 1535
*   [x] **Task:** Test Mifflin-St Jeor Age Adjustment (>40)
    *   [x] **Subtask:** Input: Sex='female', Age=45, W=65kg, H=168cm -> Expect: ~1363 kcal -> Actual 1314
    *   [x] **Subtask:** Input: Sex='male', Age=55, W=85kg, H=182cm -> Expect: ~1784 kcal -> Actual 1700
*   [x] **Task:** Test Katch-McArdle
    *   [x] **Subtask:** Input: W=80kg, BF=15% (LBM=68kg) -> Expect: ~1839 kcal -> Actual 1838.8
    *   [x] **Subtask:** Input: W=60kg, BF=25% (LBM=45kg) -> Expect: ~1342 kcal -> Actual 1342
*   [x] **Task:** Test Cunningham
    *   [x] **Subtask:** Input: W=80kg, BF=15% (LBM=68kg), Exp='intermediate' -> Expect: ~1996 kcal -> Actual 1996
    *   [x] **Subtask:** Input: W=90kg, BF=12% (LBM=79.2kg), Exp='advanced' -> Expect: ~2242 kcal -> Actual 2242.4
*   [x] **Task:** Test BMR Tier Logic (Ensure correct formula is chosen based on `bodyFat` and `trainingExperience` presence)
    *   [x] **Subtask:** Input: BF provided, Exp='intermediate' -> Expect: Cunningham used.
    *   [x] **Subtask:** Input: BF provided, Exp='none'/'beginner'/undefined -> Expect: Katch-McArdle used.
    *   [x] **Subtask:** Input: BF undefined -> Expect: Mifflin-St Jeor used.
*   [x] **Task:** Test Edge Cases
    *   [x] **Subtask:** Input: Min Age=15, Min W=30kg, Min H=120cm -> Check calculation doesn't fail.
    *   [x] **Subtask:** Input: Max Age=100, Max W=300kg, Max H=250cm -> Check calculation doesn't fail.
    *   [x] **Subtask:** Input: Min BF=3%, Max BF=60% -> Check LBM calculation and subsequent BMR.
*   [x] **Task:** Test Extreme Input Values (Added)
*   [x] **Task:** Test Age Adjustment Boundaries (Added)
*   [x] **Task:** Test Other Sex with Adjustments (Added)

**B. `calculateTDEE` Function Tests**

*   [x] **Task:** Test Base Activity Multipliers (*Note: Tests only check spec PALs, code differs*)
    *   [x] **Subtask:** Input: BMR=1500, Activity='sedentary' -> Expect: 1800 kcal
    *   [x] **Subtask:** Input: BMR=1500, Activity='light' -> Expect: ~2063 kcal
    *   [x] **Subtask:** Input: BMR=1500, Activity='moderate' -> Expect: ~2325 kcal
    *   [x] **Subtask:** Input: BMR=1500, Activity='very' -> Expect: ~2588 kcal
    *   [x] **Subtask:** Input: BMR=1500, Activity='extra' -> Expect: 2850 kcal
*   [ ] **Task:** Test Training Experience Adjustment (*Note: Code has logic, spec does not place here*)
    *   [ ] **Subtask:** Input: BMR=1500, Activity='moderate', Exp='intermediate' -> Expect: (1500 * 1.55) * 1.03 = ~2395 kcal
    *   [ ] **Subtask:** Input: BMR=1500, Activity='moderate', Exp='none' -> Expect: 1500 * 1.55 = ~2325 kcal
*   [ ] **Task:** Test Ethnicity Adjustment (*Note: Code has logic, spec does not place here*)
    *   [ ] **Subtask:** Input: BMR=1500, Activity='moderate', Ethnicity='south_asian' -> Expect: (1500 * 1.55) * 0.95 = ~2209 kcal
    *   [ ] **Subtask:** Input: BMR=1500, Activity='moderate', Ethnicity='nordic' -> Expect: (1500 * 1.55) * 1.03 = ~2395 kcal
    *   [ ] **Subtask:** Input: BMR=1500, Activity='moderate', Ethnicity='default' -> Expect: 1500 * 1.55 = ~2325 kcal
*   [ ] **Task:** Test Combined Adjustments (*Note: Code has logic, spec does not place here*)
    *   [ ] **Subtask:** Input: BMR=1500, Activity='moderate', Exp='advanced', Ethnicity='nordic' -> Expect: (1500 * 1.55 * 1.03) * 1.03 = ~2467 kcal

**C. `calculateCalorieTarget` Function Tests**

*   [x] **Task:** Test Goal: 'lose_fat'
    *   [x] **Subtask:** Input: TDEE=2500, Goal='lose_fat', Rate='slow' -> Expect Target: ~2188 kcal, Deficit: ~-313
    *   [x] **Subtask:** Input: TDEE=2500, Goal='lose_fat', Rate='moderate' -> Expect Target: ~2063 kcal, Deficit: ~-438
    *   [x] **Subtask:** Input: TDEE=2500, Goal='lose_fat', Rate='fast' -> Expect Target: ~1938 kcal, Deficit: ~-563
    *   [x] **Subtask:** Input: TDEE=2500, Goal='lose_fat', Rate='fast', BF=12%, Sex='male' (Lean Cap) -> Expect Target: ~2125 kcal, Deficit: ~-375
    *   [x] **Subtask:** Input: TDEE=2500, Goal='lose_fat', Rate='fast', BF=35%, Sex='male' (High BF Cap) -> Expect Target: ~1875 kcal, Deficit: ~-625
*   [x] **Task:** Test Goal: 'build_muscle'
    *   [x] **Subtask:** Input: TDEE=2500, Goal='build_muscle', Exp='beginner' -> Expect Target: ~2813 kcal, Surplus: ~+313
    *   [x] **Subtask:** Input: TDEE=2500, Goal='build_muscle', Exp='intermediate' -> Expect Target: ~2688 kcal, Surplus: ~+188
    *   [x] **Subtask:** Input: TDEE=2500, Goal='build_muscle', Exp='advanced' -> Expect Target: ~2625 kcal, Surplus: ~+125
    *   [x] **Subtask:** Input: TDEE=2500, Goal='build_muscle', Exp='none' -> Expect Target: ~2688 kcal, Surplus: ~+188 (Matches Intermediate)
*   [x] **Task:** Test Goal: 'maintain'
    *   [x] **Subtask:** Input: TDEE=2500, Goal='maintain' -> Expect Target: 2500 kcal, Deficit/Surplus: 0
*   [x] **Task:** Test Goal: 'clean_bulk'
    *   [x] **Subtask:** Input: TDEE=2500, Goal='clean_bulk' -> Expect Target: ~2688 kcal, Surplus: ~+188
*   [x] **Task:** Test Goal: 'aggressive_bulk'
    *   [x] **Subtask:** Input: TDEE=2500, Goal='aggressive_bulk' -> Expect Target: ~2938 kcal, Surplus: ~+438
*   [x] **Task:** Test Goal: 'gain_weight'
    *   [x] **Subtask:** Input: TDEE=2500, Goal='gain_weight', Rate='slow' -> Expect Target: 2775 kcal, Surplus: +275
    *   [x] **Subtask:** Input: TDEE=2500, Goal='gain_weight', Rate='moderate' -> Expect Target: 3050 kcal, Surplus: +550
*   [x] **Task:** Test Goal: 'improve_health' (*Note: Tests proxy BF% logic*)
    *   [x] **Subtask:** Input: TDEE=2500, Goal='improve_health', BF=18%, Sex='male' (Not Overweight) -> Expect Target: 2500 kcal, Surplus: 0
    *   [x] **Subtask:** Input: TDEE=2500, Goal='improve_health', BF=28%, Sex='male' (Overweight) -> Expect Target: ~2375 kcal, Deficit: -125
*   [x] **Task:** Test Goal: 'recomposition'
    *   [x] **Subtask:** Input: TDEE=2500, Goal='recomposition' -> Expect Target: ~2438 kcal, Deficit: ~-63
*   [x] **Task:** Test lose_fat Combinations (Added)
*   [x] **Task:** Test Extreme TDEE Values (Added)

**D. `calculateMacros` Function Tests**

*   [x] **Task:** Test Protein Targets by Goal
    *   [x] **Subtask:** Input: W=80kg, Target=2500, Goal='lose_fat' -> Expect Protein: ~176g
    *   [x] **Subtask:** Input: W=80kg, Target=3000, Goal='build_muscle' -> Expect Protein: ~152g
    *   [x] **Subtask:** Input: W=80kg, Target=2500, Goal='maintain' -> Expect Protein: ~120g
*   [x] **Task:** Test Protein Diet Type Adjustments
    *   [x] **Subtask:** Input: W=80kg, Target=2500, Goal='maintain', Diet='vegetarian' -> Expect Protein: (80 * 1.5) * 1.1 = ~132g
    *   [x] **Subtask:** Input: W=80kg, Target=2500, Goal='maintain', Diet='vegan' -> Expect Protein: (80 * 1.5) * 1.2 = ~144g
*   [x] **Task:** Test Fat Calculation
    *   [x] **Subtask:** Input: W=80kg, Target=2500, Goal='maintain' -> Expect Fat: ~76g
    *   [x] **Subtask:** Input: W=80kg, Target=2000, Goal='lose_fat' -> Expect Fat: ~61g
*   [x] **Task:** Test Fat Minimum Check
    *   [x] **Subtask:** Input: W=50kg, Target=1200, Goal='lose_fat' -> Expect Fat: ~33g (Min 30g)
    *   [x] **Subtask:** Input: W=100kg, Target=4000, Goal='build_muscle' -> Expect Fat: ~122g (Min 60g)
    *   [x] **Subtask:** Input: W=120kg, Target=1800, Goal='maintain' (Min Fat Trigger) -> Expect Fat: 72g
*   [x] **Task:** Test Carb Calculation (Remaining Calories)
    *   [x] **Subtask:** Input: Target=2500, P=120g (480kcal), F=76g (684kcal) -> Expect Carb Grams: ~334g.
*   [x] **Task:** Test Carb Minimum Check
    *   [x] **Subtask:** Input: Target=1200, P=150g (600kcal), F=60g (540kcal) -> Expect Carb Grams: 50g.
*   [x] **Task:** Test Percentage Calculations
    *   [x] **Subtask:** Input: P=120g (480kcal), F=76g (684kcal), C=334g (1336kcal), Total=~2500kcal -> Expect P%: ~19%, F%: ~27%, C%: ~53%. Verify rounding & sum ~100%.
*   [x] **Task:** Test Different Diet Types with Various Goals (Added)
*   [x] **Task:** Test Extreme Weight Values (Added)
*   [x] **Task:** Test Extreme Calorie Targets (Added)

*   [x] **Task:** Add End-to-End Scenarios (Added)
    *   [x] **Subtask:** Scenario 1 (Male, Fat Loss)
    *   [x] **Subtask:** Scenario 2 (Female, Muscle Gain)

## II. Component Testing (React Testing Library / Vitest UI)

**Goal:** Verify functionality, state, UI rendering, and interactions of React components.

**A. `Calculator` Component Tests**

*   [ ] **Task:** Test Initial Render
    *   [ ] **Subtask:** Verify Step 1 is displayed by default.
    *   [ ] **Subtask:** Verify "Basic Information" is shown in the step indicator.
    *   [ ] **Subtask:** Verify default form values are set (e.g., dietType='standard', hasBodyFat=false).
*   [ ] **Task:** Test Conditional Rendering Logic
    *   [ ] **Subtask:** Toggle 'hasBodyFat' switch -> Verify 'Body Fat Percentage' input appears/disappears.
    *   [ ] **Subtask:** Select Goal='lose_fat' -> Verify 'Target Weight' and 'Weight Loss Rate' sections appear.
    *   [ ] **Subtask:** Select Goal='maintain' -> Verify goal-specific sections are hidden.
    *   [ ] **Subtask:** Toggle 'hasNeckWaist' switch -> Verify 'Neck Circumference' and 'Waist Circumference' inputs appear/disappear.
*   [ ] **Task:** Test Form Input and Validation
    *   [ ] **Subtask:** Enter valid data in Step 1 fields (sex, age, height, weight).
    *   [ ] **Subtask:** Enter invalid age (<15) -> Verify error message is displayed via FormMessage.
    *   [ ] **Subtask:** Enter non-numeric height -> Verify error message.
    *   [ ] **Subtask:** Leave a required field blank (e.g., weight) -> Click 'Next' -> Verify error message and step does not advance.
*   [ ] **Task:** Test Step Navigation
    *   [ ] **Subtask:** Fill Step 1 validly -> Click 'Next' -> Verify Step 2 is displayed.
    *   [ ] **Subtask:** Navigate to Step 3 -> Click 'Back' -> Verify Step 2 is displayed.
    *   [ ] **Subtask:** Reach Step 4 -> Verify 'Next' button is replaced by 'Calculate Results'.
    *   [ ] **Subtask:** After results, click 'Start Over' -> Verify Step 1 is displayed and form is reset.
*   [ ] **Task:** Test `onSubmit` Calculation Integration
    *   [ ] **Subtask:** Provide inputs for Mifflin-St Jeor path (no BF%) -> Submit -> Verify `results.bmrMethod` contains "Mifflin-St Jeor".
    *   [ ] **Subtask:** Provide inputs for Katch-McArdle path (BF% provided, no/beginner training) -> Submit -> Verify `results.bmrMethod` contains "Katch-McArdle".
    *   [ ] **Subtask:** Provide inputs for Cunningham path (BF%, intermediate/advanced training) -> Submit -> Verify `results.bmrMethod` contains "Cunningham".
    *   [ ] **Subtask:** Provide inputs for Tier 3 + Ethnicity (no BF%, ethnicity selected) -> Submit -> Verify `results.bmrMethod` shows adjustment and `ethnicityAdjustmentApplied` state is true.
    *   [ ] **Subtask:** Provide inputs for Tier 3 + Age > 40 -> Submit -> Verify `results.bmrMethod` shows age adjustment.
    *   [ ] **Subtask:** Provide inputs leading to low calorie target -> Submit -> Verify `results.warnings.belowMinimum` is true and `results.calorieTarget` is capped.
    *   [ ] **Subtask:** Provide inputs for significant deficit -> Submit -> Verify `results.warnings.refeedRecommended` is true.
    *   [ ] **Subtask:** Verify `results` state contains all expected keys and calculated values after submit.

**B. `ResultsDisplay` Component Tests**

*   [ ] **Task:** Test Rendering with Various Results Data
    *   [ ] **Subtask:** Provide basic 'maintain' goal results -> Verify all sections render with correct data and formatting.
    *   [ ] **Subtask:** Provide 'lose_fat' results with BF% -> Verify BF%, LBM, BMI are displayed.
    *   [ ] **Subtask:** Provide results with `warnings.belowMinimum=true` -> Verify Minimum Calorie Alert is displayed.
    *   [ ] **Subtask:** Provide results with `warnings.refeedRecommended=true` -> Verify Refeed Alert is displayed.
    *   [ ] **Subtask:** Provide results with `ethnicityAdjustmentApplied=true` -> Verify Ethnicity Adjustment Alert is displayed.
*   [ ] **Task:** Test Data Formatting
    *   [ ] **Subtask:** Input activityLevel='very' -> Verify output displays "Very Active".
    *   [ ] **Subtask:** Input goal='clean_bulk' -> Verify output displays "Clean Bulk".
*   [ ] **Task:** Test Macronutrient Tabs
    *   [ ] **Subtask:** Verify 'Overview' tab shows correct percentages and progress bars.
    *   [ ] **Subtask:** Click 'Grams' tab -> Verify correct gram values are displayed.
    *   [ ] **Subtask:** Click 'Calories' tab -> Verify correct calorie values are displayed.
*   [ ] **Task:** Test Micronutrient Highlighting
    *   [ ] **Subtask:** Provide userProfile: sex='female', age=30 -> Verify Iron card is highlighted.
    *   [ ] **Subtask:** Provide userProfile: age=60 -> Verify Calcium card is highlighted.
    *   [ ] **Subtask:** Provide userProfile: dietType='vegan' -> Verify Iron, Calcium, Omega-3 cards are highlighted.
*   [ ] **Task:** Test Interactions
    *   [ ] **Subtask:** Click 'Copy Summary' -> Verify `navigator.clipboard.writeText` is called with correct summary string and toast is shown.
    *   [ ] **Subtask:** Click 'Print Results' -> Verify `window.print` is called.

## III. End-to-End (E2E) Testing (Cypress / Playwright)

**Goal:** Simulate user flows through the deployed or locally running application.

*   [ ] **Task:** E2E Happy Path (Maintain Goal, No Advanced Options)
    *   [ ] **Subtask:** Visit '/'.
    *   [ ] **Subtask:** Click "Get Started" -> Navigate to '/calculator'.
    *   [ ] **Subtask:** Fill Step 1 (e.g., Male, 30, 180cm, 80kg). Click Next.
    *   [ ] **Subtask:** Fill Step 2 (e.g., Sedentary, No BF%, No Exercise, No Training). Click Next.
    *   [ ] **Subtask:** Fill Step 3 (Select Goal: Maintain). Click Next.
    *   [ ] **Subtask:** Fill Step 4 (Defaults: Standard Diet, No Ethnicity, No Neck/Waist). Click Calculate Results.
    *   [ ] **Subtask:** Verify Results page loads.
    *   [ ] **Subtask:** Verify displayed TDEE matches Target Calories.
    *   [ ] **Subtask:** Verify BMR method is Mifflin-St Jeor.
    *   [ ] **Subtask:** Verify no warnings are displayed.
*   [ ] **Task:** E2E Fat Loss (with BF%, Refeed Warning)
    *   [ ] **Subtask:** Start new calculation.
    *   [ ] **Subtask:** Fill Step 1 (e.g., Female, 40, 165cm, 75kg).
    *   [ ] **Subtask:** Fill Step 2 (Enable BF%, Input BF=35%, Activity=Sedentary).
    *   [ ] **Subtask:** Fill Step 3 (Goal=Lose Fat, Rate=Fast).
    *   [ ] **Subtask:** Fill Step 4 (Defaults). Calculate Results.
    *   [ ] **Subtask:** Verify Results page loads.
    *   [ ] **Subtask:** Verify BMR method is Katch-McArdle.
    *   [ ] **Subtask:** Verify Target Calories < TDEE.
    *   [ ] **Subtask:** Verify "Refeed Day Recommendation" alert is potentially visible (depending on calculated deficit size).
*   [ ] **Task:** E2E Muscle Gain (Beginner)
    *   [ ] **Subtask:** Start new calculation.
    *   [ ] **Subtask:** Fill Steps 1-2 (Specify Training Exp='beginner').
    *   [ ] **Subtask:** Fill Step 3 (Goal=Build Muscle).
    *   [ ] **Subtask:** Fill Step 4. Calculate Results.
    *   [ ] **Subtask:** Verify Target Calories > TDEE (approx 15% surplus).
*   [ ] **Task:** E2E Tier 3 + Ethnicity Adjustment
    *   [ ] **Subtask:** Start new calculation.
    *   [ ] **Subtask:** Fill Steps 1-2 (Ensure BF% is *not* provided).
    *   [ ] **Subtask:** Fill Step 3 (Any goal).
    *   [ ] **Subtask:** Fill Step 4 (Select Ethnicity='african'). Calculate Results.
    *   [ ] **Subtask:** Verify BMR method is Mifflin-St Jeor with adjustment text.
    *   [ ] **Subtask:** Verify "Population-Based Adjustment Applied" alert is visible.
*   [ ] **Task:** E2E Minimum Calorie Cap
    *   [ ] **Subtask:** Start new calculation.
    *   [ ] **Subtask:** Input data designed to trigger low calorie target (e.g., Female, 25, 155cm, 45kg, Sedentary, Lose Fat - Fast).
    *   [ ] **Subtask:** Calculate Results.
    *   [ ] **Subtask:** Verify "Minimum Calorie Alert" is visible.
    *   [ ] **Subtask:** Verify displayed Target Calories is 1200.
*   [ ] **Task:** E2E Form Validation Flow
    *   [ ] **Subtask:** Attempt to click 'Next' on Step 1 with Age empty -> Verify progression is blocked and error shows.
    *   [ ] **Subtask:** Enter valid Step 1 -> Proceed to Step 2 -> Enable BF% but leave input blank -> Click 'Next' -> Verify progression is blocked and error shows.
*   [ ] **Task:** E2E Theme Toggle
    *   [ ] **Subtask:** Load calculator page.
    *   [ ] **Subtask:** Click theme toggle button (assuming it exists based on `planning.md`).
    *   [ ] **Subtask:** Verify background/text colors change.
    *   [ ] **Subtask:** Navigate through form steps and results -> Verify theme persists and elements are styled correctly in the new theme.

## IV. Accessibility Testing (A11y)

**Goal:** Ensure usability for people with disabilities.
**Method:** Automated tools (Axe) + Manual checks (Keyboard, Screen Reader).

*   [ ] **Task:** Automated Scan (Axe DevTools)
    *   [ ] **Subtask:** Run Axe scan on the main calculator page (`/calculator`) through all steps.
    *   [ ] **Subtask:** Run Axe scan on the results display.
    *   [ ] **Subtask:** Document and prioritize reported violations (e.g., color contrast, missing labels).
*   [ ] **Task:** Keyboard Navigation Audit
    *   [ ] **Subtask:** Navigate through the entire form using only Tab/Shift+Tab/Enter/Spacebar. Verify all controls are reachable and operable.
    *   [ ] **Subtask:** Check logical focus order.
    *   [ ] **Subtask:** Verify popovers (InfoTooltip) can be triggered and dismissed via keyboard.
    *   [ ] **Subtask:** Verify tabs on results page are navigable and activatable via keyboard.
*   [ ] **Task:** Screen Reader Check (NVDA/VoiceOver)
    *   [ ] **Subtask:** Navigate the form steps. Verify labels, descriptions, and control types are announced correctly.
    *   [ ] **Subtask:** Verify error messages are announced when validation fails.
    *   [ ] **Subtask:** Verify step changes are announced.
    *   [ ] **Subtask:** Navigate the results page. Verify headings, card titles, data values, and alerts are read out logically.
    *   [ ] **Subtask:** Verify macro tab changes announce the selected tab and content.
*   [ ] **Task:** Color Contrast Check
    *   [ ] **Subtask:** Manually inspect key text elements, buttons, and links in both light and dark modes using a contrast checker tool. Pay attention to muted text, disabled states, and highlighted elements.
*   [ ] **Task:** Form Label Association
    *   [ ] **Subtask:** Inspect HTML to ensure every `input`, `select`, `radio`, `switch` has a properly associated `<label>` or `aria-label`/`aria-labelledby`.

## V. Usability Testing

**Goal:** Evaluate ease of use and clarity for target users.
**Method:** Observe users interacting with the application (Think-Aloud Protocol).

*   [ ] **Task:** Recruit 3-5 Representative Users
*   [ ] **Task:** Define Key Scenarios
    *   [ ] **Scenario 1:** Calculate maintenance calories without advanced options.
    *   [ ] **Scenario 2:** Calculate macros for fat loss, including entering body fat %.
    *   [ ] **Scenario 3:** Explore the results page and understand the different sections.
*   [ ] **Task:** Conduct Testing Sessions (Observe & Record)
    *   [ ] **Subtask:** Ask users to "think aloud" as they perform scenarios.
    *   [ ] **Subtask:** Note areas of confusion, hesitation, or difficulty.
    *   [ ] **Subtask:** Note any misunderstandings of terminology (e.g., NEAT, TDEE, BMR formulas).
    *   [ ] **Subtask:** Observe interaction with the multi-step form and results tabs.
*   [ ] **Task:** Post-Test Questionnaire/Interview
    *   [ ] **Subtask:** Ask about overall clarity, ease of use, trustworthiness.
    *   [ ] **Subtask:** Ask for specific feedback on confusing elements or missing information.
*   [ ] **Task:** Synthesize Findings and Identify Usability Issues

## VI. Manual Exploratory Testing

**Goal:** Uncover unexpected issues through free-form exploration.
**Method:** Unscripted testing based on tester intuition.

*   [ ] **Task:** Test Boundary Values Vigorously
    *   [ ] **Subtask:** Input min/max allowed values for age, weight, height, BF%.
    *   [ ] **Subtask:** Combine extreme values (e.g., max weight, min height).
*   [ ] **Task:** Test Unusual Input Combinations
    *   [ ] **Subtask:** Provide BF% *and* an ethnicity with a Tier 3 adjustment -> Verify only the BF% calculation (Tier 1/2) is used and no ethnicity alert appears.
    *   [ ] **Subtask:** Select 'recomposition' goal without providing BF% (Does the app handle this gracefully? Planning doc implies BF% required).
*   [ ] **Task:** Test State Changes and Interruptions
    *   [ ] **Subtask:** Change values back and forth rapidly.
    *   [ ] **Subtask:** Use browser back/forward buttons during form filling. Does state persist correctly?
    *   [ ] **Subtask:** Refresh the page mid-form. Is data lost?
*   [ ] **Task:** Test Different Browsers/Devices
    *   [ ] **Subtask:** Run through key scenarios on Chrome, Firefox, Safari (if possible).
    *   [ ] **Subtask:** Test on a mobile device emulator or real device to check responsiveness and touch interactions.
*   [ ] **Task:** Look for UI Glitches
    *   [ ] **Subtask:** Check element alignment, text wrapping issues, overlapping elements at different screen sizes.
    *   [ ] **Subtask:** Check dark mode consistency.

---

This detailed task list should provide a solid foundation for your testing efforts. Remember to document the results of each test (Pass/Fail, any issues found). 