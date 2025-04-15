# MacroMentor - UX Enhancement Tasks

## Phase 1: Foundation & Renaming

*   [x] **Rename Application:**
    *   [x] Update application title in `package.json` (`name` field).
    *   [x] Update title tags and visible names in `app/layout.tsx` or relevant root layout file.
    *   [x] Update instances of "NutriTrack Pro" in `planning.md`.
    *   [x] Update the title in this `tasks.md` file.
    *   [x] Update any other visible mentions (e.g., in `app/page.tsx` headers/content).
*   [x] **Update Planning Document:**
    *   [x] Reflect the name change to "MacroMentor" throughout `planning.md`.
    *   [x] Note the exclusion of "Personalized Next Steps" feature in `planning.md` section 2 (Key Features) and section 4 (Results Display).

## Phase 2: Onboarding & Initial Framing (`app/page.tsx`)

*   [x] **Enhance Homepage Content:**
    *   [x] Add clear value proposition emphasizing hyper-personalization and actionable insights.
    *   [x] Include a concise "How it Works" section (3 steps).
    *   [x] Frame the tool as an empowering guide, not just a calculator.

## Phase 3: Multi-Step Form Enhancements (`components/calculator.tsx`)

*   [x] **Implement Visual Progress Indicator:**
    *   [x] Add a component (e.g., using Shadcn `Progress` or custom steps) to show current step and total steps.
    *   [x] Ensure it updates as the user navigates the form.
*   [ ] **Add Inline Explanations:**
    *   [x] For each input field, add an info icon (`lucide-react/Info`).
    *   [x] Wrap the icon with a Shadcn `Tooltip` or `Popover` component.
    *   [x] Populate the tooltip/popover with the corresponding "Explanation for User" from `healthcalculations.md`.
    *   [ ] Add "Learn More" links/buttons within popovers for complex topics (e.g., BMR Tiers, Ethnicity) linking to modals or expanded sections (implementation TBD - maybe simple text expansion first).
*   [x] **Visually Distinguish Optional Fields:**
    *   [x] Append "(Optional)" text to labels of optional fields (Body Fat %, Training Experience, Ethnicity, Circumferences).
    *   [x] Consider slightly different styling (e.g., lighter label color) if needed for clarity.
    *   [x] Add brief text near optional fields explaining *why* they improve accuracy (e.g., "Providing body fat % allows for a more accurate metabolism calculation").
*   [x] **Improve Input Grouping & Components:**
    *   [x] Visually group related fields within steps (e.g., Height/Weight, Activity/Exercise) using subtle borders, cards, or background shades.
    *   [x] Review input types (e.g., ensure numeric inputs use `<Input type="number">` with appropriate step/min/max if applicable).
    *   [x] *Self-Correction:* Keep Activity Level as radio buttons for simplicity; adding sliders might overcomplicate initially.
*   [x] **Ensure Seamless Navigation:**
    *   [x] Verify "Back" and "Next" buttons work correctly, preserving state between steps.
    *   [x] Ensure the final button is clearly labeled "Calculate" or "See My Results".

## Phase 4: Calculation Transparency (`components/calculator.tsx` -> `components/results-display.tsx` logic + display)

*   [x] **Implement Ethnicity Input Explanation:**
    *   [x] Display the mandatory pre-input explanation text *before* the ethnicity selection field is shown.
    *   [x] Ensure the text is clearly visible and non-dismissible until acknowledged or scrolled past.
    *   [x] Reiterate optionality directly above the input field.
*   [x] **Display BMR/TDEE Formula Used:**
    *   [x] Pass information about which BMR formula (Mifflin, Katch, Cunningham, Singapore) was used from `lib/calculator.ts` to `components/results-display.tsx`.
    *   [x] Display this information clearly in the results section, along with the reason (e.g., "Using Mifflin-St Jeor formula (based on weight, height, age, sex).").
    *   [x] If a Tier 3 ethnic adjustment was applied, explicitly state this in the results (e.g., "A statistical adjustment (-5%) based on population data for African Descent was applied to the initial BMR estimate.").
*   [x] **Display BMR, TDEE, and Target Calories clearly:**
    *   [x] Pass information about the calculated BMR, TDEE, and target calories to `components/results-display.tsx`.
    *   [x] Display this information clearly in the results section, along with the reason (e.g., "Using Mifflin-St Jeor formula (based on weight, height, age, sex).").
*   [x] **Show Macronutrient Breakdown (Grams, Calories, Percentages) using tabs/cards:**
    *   [x] Implement a tabbed or card layout to display macronutrient breakdown.
    *   [x] Ensure each tab or card contains relevant information about macronutrient distribution.
*   [x] **Include Micronutrient target suggestions (Fiber, Omega-3, etc.):**
    *   [x] Add micronutrient recommendations based on user inputs.
    *   [x] Ensure these recommendations are clearly displayed in the results section.
*   [x] **Display calculated metrics (BMI, LBM if available):**
    *   [x] Calculate and display BMI and LBM if available.
    *   [x] Ensure this information is clearly visible in the results section.
*   [x] **Show relevant warnings (e.g., below minimum calories, refeed suggestion):**
    *   [x] Implement warning logic to identify potential issues.
    *   [x] Display warnings clearly in the results section.
*   [x] **Add a clear disclaimer about estimates and professional advice:**
    *   [x] Include a disclaimer in the results section explaining that the results are estimates and should not replace professional advice.

## Phase 5: Results Presentation (`components/results-display.tsx`)

*   [x] **Improve Visual Hierarchy:**
    *   [x] Make "Target Daily Calories" and "Macronutrient Targets (Grams)" the most prominent elements (larger font, bolding, prime location).
*   [x] **Contextualize Numbers:**
    *   [x] Display BMR and TDEE values.
    *   [x] Add a brief explanation linking BMR, TDEE, and the final Target Calories based on the goal (e.g., showing the calculated deficit/surplus).
*   [x] **Enhance Charts:**
    *   [x] Ensure macro pie chart (or chosen visualization) is interactive (shows values/percentages on hover using tooltips). -> *Used Tooltips on Progress Bars.*
*   [x] **Clarify Macro Units:**
    *   [x] Display macro targets clearly in Grams, Calories, and Percentages. Use distinct labels for each unit.
*   [x] **Refine Micronutrient Guidance:**
    *   [x] Present micronutrient info clearly (perhaps tabbed or expandable section).
    *   [x] Link recommendations to user inputs where applicable (e.g., Vegan -> Iron/B12).
    *   [x] Include specific food source examples as planned.
*   [x] **Improve Warnings/Alerts:**
    *   [x] Use Shadcn `Alert` components for warnings (e.g., low calorie target).
    *   [x] Frame warnings constructively, explaining the issue and any automatic adjustments made (e.g., minimum calorie enforcement).
*   [x] **Add Save/Download Option:**
    *   [x] Implement buttons/links to allow users to save or download their results (initially, perhaps just trigger browser print or copy-to-clipboard functionality).

## Phase 6: Visual Design & Aesthetics (Global Styles, Theme, Components)

*   [x] **Refine Visuals:**
    *   [x] Ensure clean layout, effective use of whitespace across all components.
    *   [ ] Review and potentially customize the default Shadcn color palette for a more unique/professional feel (`styles/globals.css` or theme configuration). -> *Deferring custom palette.*
*   [x] **Ensure Accessibility:**
    *   [x] Perform basic checks for color contrast in both light/dark modes.
    *   [x] Verify keyboard navigation and focus states for interactive elements.
    *   [x] Use semantic HTML structure.
*   [x] **Add Subtle Animations:**
    *   [x] Use Framer Motion for subtle transitions on step changes, button feedback, or results loading to enhance responsiveness.

[x] **Update the title in this `tasks.md` file.** 