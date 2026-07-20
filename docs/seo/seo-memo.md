# MacroMentor SEO working plan

Living checklist — check items off as they ship. Full narrative version (with the
visual waist-to-height-ratio-style meter) was published as a one-off artifact on
2026-07-20; this file is the version we actually work through and keep in git.

## Reality check first

Real Google Ads Keyword Planner data (United States, Jul 2025–Jun 2026), pulled
2026-07-20:

| Term | Avg. monthly searches | Ads competition |
|---|---|---|
| tdee calculator | 100K – 1M | Low |
| macro calculator | 100K – 1M | Low |
| bmr calculator | 100K – 1M | Low |
| waist to height ratio calculator | 1K – 10K | Low |
| katch mcardle calculator | 100 – 1K | Low |
| recomposition calculator | 100 – 1K | Low |

**"Low" here is ad-auction competition, not organic difficulty.** calculator.net,
Omni Calculator, and Mayo Clinic hold page one of the head terms and aren't
moving for a new subdomain — that label is not a green light.

The differentiator phrases below (`ethnicity adjusted bmr calculator`, `tdee
calculator without body fat percentage`, `minimum safe calorie intake
calculator`, and seven others) returned **no measurable volume at all**. Nobody
types the exact differentiator — the target is the topic cluster people ask
about in a hundred different ways, not one exact-match string. Treat every
"keyword" below as content territory, not a literal phrase for a title tag.

## 1. Content territory (priority order)

- [ ] Formula transparency — "which BMR formula should I use" (no competitor
      explains why it picked one formula over another for a given input)
- [ ] The 1,200-calorie floor — safety caps almost no calculator actually has
- [ ] Ethnicity-adjusted BMR — ship the explainer alongside the feature, not
      after it; this is the easiest feature to attack if under-sourced
- [ ] Micronutrient flags + waist-to-height ratio paired with an actual plan
      (WHtR card shipped 2026-07-20 — this content can reference it directly now)
- [ ] "No account, nothing stored" — a real behavioral claim, not just copy

Deliberately cut for now: recomposition / TDEE-for-lifters / clean-bulk pages —
real volume, but already owned by Gravitus, FatCalc, BuiltWithScience. Use in
FAQ answers and on-page copy, not as page titles to compete on.

## 2. On-page / technical

**This week**
- [ ] Confirm `/calculator` server-renders a real H1 + intro before hydration
- [ ] Visible methodology + citations near the results (Mifflin-St Jeor,
      Katch-McArdle, Cunningham papers)
- [ ] `WebApplication` + `Organization` JSON-LD in `layout.tsx` —
      `applicationCategory: "HealthApplication"`, `offers: {price: "0"}`,
      `sameAs` → horizonfall.com. Skip `aggregateRating`, there's no real
      rating mechanism.

**This month**
- [ ] Dynamically import the print/PDF bundle and dialogs out of first load
- [ ] Retarget title tags / H1s / homepage copy at the territory above
- [ ] "About / methodology" page with a real byline

**Hold off**
- [ ] No FAQ/HowTo schema for SEO purposes (Google pulled FAQ rich results
      May 2026, killed HowTo in 2023 — fine as a UI feature, not an SEO play)
- [ ] No programmatic per-keyword landing pages yet (March 2026 core update
      hit templated page sets with 60–90% traffic collapses) — if revisited,
      cap at 3–5 pages, 400+ genuinely distinct words each, Q4 earliest
- [ ] Don't migrate off the subdomain — see placement strategy below

## 3. Content

Drafted + fact-checked, in `docs/seo/content/`, and **now LIVE on the site** in the `/learn`
hub (built 2026-07-20 — see "Learn content hub" note below):

1. [x] Which BMR formula should you use — Mifflin-St Jeor, Katch-McArdle, or Cunningham?
2. [x] The 1,200-calorie floor: where it comes from, and when a calculator should refuse to go lower
3. [x] Does ethnicity affect your BMR? The research behind the adjustment
4. [x] Why a calorie calculator should flag iron, vitamin D, and waist circumference, not just calories
5. [x] MacroMentor vs. calculator.net vs. TDEE calculator: how the numbers differ, and why
6. [x] Refeed days and diet breaks: a simple, calculator-backed guide
7. [x] Quick answers FAQ: TEF / protein, BMR vs RMR, how much to trust the number
8. [x] NEAT: the ~2,000 kcal/day your activity dropdown flattens
9. [x] Why BMI lies, and lies differently depending on your ancestry
10. [x] Cold-adapted metabolism: the few percent that doesn't save you
11. [x] Does metabolism actually slow with age? (Pontzer 2021)

All 11 shipped and fact-checked (batch-2 logs in `_fact-check-summary.md`). Next content batch:
add new briefs to `_queued-articles.md`.

### Learn content hub (shipped 2026-07-20)

The 11 pieces render as real, statically-generated pages under `/learn`, in the site theme:
- `app/learn/page.tsx` — index: hero, featured (piece 01), category sections, CTA. CollectionPage
  + ItemList + BreadcrumbList JSON-LD.
- `app/learn/[slug]/page.tsx` — article template: byline, reading time, source count, rendered
  body, auto-built References list, inline + related-article CTAs. Article + BreadcrumbList JSON-LD,
  per-article canonical + OG.
- `app/learn/[slug]/opengraph-image.tsx` — per-article social image (parameterized
  `og-image-content.tsx`).
- `lib/content/registry.ts` — SEO source of truth (slug, category, description, keywords, dates).
  Adding an article = one entry here once its markdown is written + fact-checked.
- `lib/content/markdown.ts` (+ `.test.ts`, 14 tests) — small in-house markdown renderer for the
  known content subset; no runtime markdown dependency added.
- `lib/content/articles.ts` — build-time loader (reads `docs/seo/content/*.md`).
- `app/sitemap.ts` now includes `/learn` + every article. Header nav has a "Learn" link.

## 4. Distribution / backlinks

**This week**
- [ ] Directory listings: AlternativeTo, SaaSHub, BetaList, Peerlist, Uneed
- [ ] Confirm the horizonfall.com → macromentor link is live and prominent

**This month**
- [ ] One well-prepared Show HN post
- [ ] Product Hunt listing
- [ ] Reddit — community-first, no self-promo (check each subreddit's rules
      first)

**Ongoing**
- [ ] Guest posts on fitness/nutrition blogs (50–100 site outreach list)
- [ ] Embeddable "what's my TDEE" widget — sequence after directories/launches

## 5. Timeline (set expectations, don't chase them)

- Month 1: ~0 organic traffic. Success = indexation clean, directories live,
  launches done once, methodology page shipped.
- Month 3: first long-tail rankings possible (positions 10–30), low
  single-digit organic clicks/day.
- Month 6: earliest point non-trivial traffic starts — a few hundred organic
  sessions/month is a good outcome, not thousands.
- Month 12: page-one plausible for the differentiated long-tail queries. Head
  terms stay out of reach without a multi-year link-building effort.

---

## Content placement: macromentor vs. horizonfall

Researched horizonfall.com directly (2026-07-20) before writing this. It's
Aditya's portfolio: **Work** (client case studies), **Projects** (8 personal
builds, MacroMentor among them), **On Record** (talks), **About**. Content
style is "implementation and results over process writing" — each personal
project gets one case-study page, not a blog. `horizonfall.com/projects/
macromentor` already exists and is a hybrid case study / marketing piece:
conversational but technical, includes the "write the tests first" AI-dev
lesson, and an honest aside ("it hasn't helped me lose weight yet. The tool
works; adherence is its own problem").

That existing page is exactly the venue for process and learnings — it
doesn't need to be invented, it needs to keep growing. Recommended split:

**horizonfall.com/projects/macromentor** — the story, updated over time:
- Why the tiered-formula approach, and what changed since launch
- The test-first-against-AI-drift method (already there — good, keep it)
- Real numbers/learnings as they come in: first Search Console data, what
  actually got backlinks, what launch channels worked or flopped
- Personal voice, first person, "here's what I learned" — this is Aditya's
  brand content, read by people evaluating him (recruiters, collaborators,
  other builders), not people trying to hit a calorie target

**macromentor.horizonfall.com** — the product's own FAQ/blog, all six pieces
in section 3 above:
- Third person, tool-voice, matches the existing site copy
- Written to be found by someone searching a specific nutrition question, not
  by someone reading about Aditya
- Every piece links back into `/calculator` — that's the conversion path,
  content existing for its own sake doesn't help the product

**Why not put the SEO content on horizonfall instead:** horizonfall's own
audience and topical focus (product/AI-builder portfolio) has nothing to do
with "which BMR formula should I use" — publishing it there would rank for
nothing (wrong topical relevance for that domain) and would bury Aditya's
actual portfolio content under nutrition FAQs. Keeping the split by *audience
intent*, not just by domain, is what makes both sites rank for what they're
each actually about.

**One cross-link rule either way:** every macromentor content piece can
mention "built by Aditya Rajashekaran, part of the horizonfall family" (already
in the footer) — and the horizonfall project page should link into whichever
macromentor content piece is most substantial once a couple exist, real
internal linking, not just the current single homepage link.
