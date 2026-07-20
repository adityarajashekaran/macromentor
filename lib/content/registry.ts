/**
 * Content registry — the SEO source of truth for the /learn knowledge hub.
 *
 * Each entry maps a published-intent markdown file (in docs/seo/content) to its
 * live URL slug, category, and search metadata. The article's on-page headline
 * and reference list come from the markdown itself (see lib/content/markdown.ts);
 * this file only carries what the markdown can't: the slug, the meta description,
 * keywords, dates, and where it sits in the hub.
 *
 * Adding a new article is a single entry here once its markdown is written and
 * fact-checked. Order within a category follows array order.
 */

export type CategoryKey = "formulas" | "metabolism" | "dieting" | "beyond" | "faq"

export interface Category {
  key: CategoryKey
  label: string
  blurb: string
}

/** Display order of category sections on the /learn index. */
export const CATEGORIES: Category[] = [
  {
    key: "formulas",
    label: "Formulas & accuracy",
    blurb: "How the equations behind your number actually work, and which one to trust.",
  },
  {
    key: "metabolism",
    label: "Metabolism & your body",
    blurb: "Why two people the same size can burn different amounts, and what really moves the needle.",
  },
  {
    key: "dieting",
    label: "Dieting safely",
    blurb: "Deficits, floors, and breaks. The guardrails that keep a plan liveable.",
  },
  {
    key: "beyond",
    label: "Beyond calories",
    blurb: "What a calorie count misses: micronutrients, where your weight sits, and more.",
  },
  {
    key: "faq",
    label: "Quick answers",
    blurb: "Short, sourced answers to the questions that sit just under the number.",
  },
]

export interface ArticleMeta {
  slug: string
  /** Filename under docs/seo/content. */
  file: string
  category: CategoryKey
  /** Meta description, kept under ~155 characters. */
  description: string
  keywords: string[]
  /** ISO date (YYYY-MM-DD). */
  published: string
  updated: string
  /** Optional shorter title for the <title> tag; defaults to the H1 headline. */
  metaTitle?: string
  featured?: boolean
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "which-bmr-formula",
    file: "01-which-bmr-formula.md",
    category: "formulas",
    description:
      "Mifflin-St Jeor, Katch-McArdle, or Cunningham? How the three main BMR formulas differ, which the research backs, and when to use each.",
    keywords: [
      "which BMR formula",
      "Mifflin-St Jeor",
      "Katch-McArdle",
      "Cunningham equation",
      "most accurate BMR formula",
      "resting metabolic rate",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "Which BMR Formula Should You Use?",
    featured: true,
  },
  {
    slug: "1200-calorie-floor",
    file: "02-1200-calorie-floor.md",
    category: "dieting",
    description:
      "Where the 1,200-calorie minimum comes from, what the guidelines actually say, and why a calculator should warn you before going lower.",
    keywords: [
      "1200 calorie floor",
      "minimum safe calorie intake",
      "very low calorie diet",
      "calorie deficit safety",
      "lowest calories to eat",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "The 1,200-Calorie Floor, Explained",
  },
  {
    slug: "ethnicity-and-bmr",
    file: "03-ethnicity-and-bmr.md",
    category: "metabolism",
    description:
      "Does ancestry change your basal metabolic rate? What the studies show, why the effect is small, and how MacroMentor handles it honestly.",
    keywords: [
      "ethnicity and BMR",
      "does ethnicity affect metabolism",
      "ethnicity adjusted BMR calculator",
      "Asian BMR",
      "resting metabolic rate by ethnicity",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "Does Ethnicity Affect Your BMR?",
  },
  {
    slug: "micronutrients-and-waist-to-height",
    file: "04-micronutrients-and-whtr.md",
    category: "beyond",
    description:
      "Calorie counts miss iron, vitamin D, and where your weight sits. Why a good calculator flags micronutrients and waist-to-height ratio too.",
    keywords: [
      "micronutrients weight loss",
      "waist to height ratio",
      "iron vitamin D deficiency diet",
      "calorie calculator micronutrients",
      "waist to height ratio calculator",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "Beyond Calories: Micronutrients & Waist-to-Height",
  },
  {
    slug: "macromentor-vs-calculator-net",
    file: "05-macromentor-vs-competitors.md",
    category: "formulas",
    description:
      "How MacroMentor, calculator.net, and tdeecalculator.net reach different numbers from the same inputs, and which choices actually matter.",
    keywords: [
      "macro calculator comparison",
      "best TDEE calculator",
      "calculator.net accuracy",
      "TDEE calculator differences",
      "which calorie calculator is accurate",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "MacroMentor vs. calculator.net vs. TDEE Calculators",
  },
  {
    slug: "refeed-days-and-diet-breaks",
    file: "06-refeed-days-diet-breaks.md",
    category: "dieting",
    description:
      "What refeed days and diet breaks do to metabolism, what the trials actually found, and a simple cadence backed by the calculator.",
    keywords: [
      "refeed day",
      "diet break",
      "metabolic adaptation",
      "refeed calculator",
      "diet break calculator",
      "how often to refeed",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "Refeed Days & Diet Breaks: A Simple Guide",
  },
  {
    slug: "metabolism-faqs",
    file: "07-metabolism-faqs.md",
    category: "faq",
    description:
      "Short, sourced answers on the thermic effect of protein, BMR vs. RMR, and how much to trust a calculated calorie number.",
    keywords: [
      "thermic effect of food",
      "does protein burn calories",
      "BMR vs RMR",
      "how accurate are calorie calculators",
      "metabolism FAQ",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "TEF, BMR vs. RMR & Trusting Your Number",
  },
  {
    slug: "neat-activity-thermogenesis",
    file: "08-neat-activity-thermogenesis.md",
    category: "formulas",
    description:
      "Non-exercise activity can vary ~2,000 kcal/day between people and quietly drops when you diet. Why NEAT, not your BMR formula, drives TDEE accuracy.",
    keywords: [
      "NEAT",
      "non-exercise activity thermogenesis",
      "why am I not losing weight in a deficit",
      "how to increase NEAT",
      "activity level calculator",
      "TDEE accuracy",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "NEAT: The Activity Your Calculator Misses",
  },
  {
    slug: "bmi-and-ancestry",
    file: "09-bmi-and-ancestry.md",
    category: "beyond",
    description:
      "BMI misreads body fat differently by ancestry, and the WHO uses lower Asian cutoffs for it. Why a tape measure beats the number on the chart.",
    keywords: [
      "is BMI accurate",
      "BMI for Asians",
      "Asian BMI cutoff",
      "BMI vs body fat",
      "waist to height ratio",
      "BMI by ethnicity",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "Why BMI Lies, and Lies by Ancestry",
  },
  {
    slug: "cold-adapted-metabolism",
    file: "10-cold-adapted-metabolism.md",
    category: "metabolism",
    description:
      "Circumpolar populations run a higher resting burn from cold adaptation, a few percent. Why that edge still loses to lifestyle and diet.",
    keywords: [
      "do cold climates increase metabolism",
      "circumpolar metabolism",
      "brown fat metabolism",
      "does cold weather burn more calories",
      "cold adaptation BMR",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "Cold-Adapted Metabolism, and Its Limits",
  },
  {
    slug: "does-metabolism-slow-with-age",
    file: "11-does-metabolism-slow-with-age.md",
    category: "metabolism",
    description:
      "A 2021 Science study found metabolism is stable from 20 to 60, not sliding from your thirties. What actually changes with age, and why 40 feels slower.",
    keywords: [
      "does metabolism slow with age",
      "metabolism by age",
      "why is my metabolism slower",
      "metabolism after 40",
      "Pontzer metabolism study",
    ],
    published: "2026-07-20",
    updated: "2026-07-20",
    metaTitle: "Does Metabolism Really Slow With Age?",
  },
]
