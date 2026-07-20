# MacroMentor: the how and why

Source material for horizonfall blog posts about *how* this got built and *why* the
calls were made the way they were. Not finished posts. Each section below is a
self-contained story with the real details, numbers, and the thing that was actually
learned, flagged with a blog angle where there's a strong one. Written in the house
voice (no em-dashes, no throat-clearing) so paragraphs can lift straight into a draft.

Timeline anchor: the calculator engine and UI came first (a redesign push on 2026-07-20).
The SEO and content system, which is what most of this document is about, was built the
same day on top of a finished product with near-zero organic traffic.

---

## 1. The reality check that killed the obvious SEO plan

**Blog angle (strong): "I ran real keyword data before writing a word. It said stop."**

The default move for a calculator site is to chase the head terms: `tdee calculator`,
`macro calculator`, `bmr calculator`. So the first step was pulling real Google Ads
Keyword Planner data (US), driven through a browser session rather than guessed.

What it showed:

- The head terms do 100K to 1M searches a month each. Enormous.
- Their "competition" reads as **Low** in the Planner. That number is a trap. It measures
  *ad-auction* competition, not organic difficulty. calculator.net, Omni Calculator, and
  Mayo Clinic own page one and are not moving for a new subdomain. "Low" was not a green light.
- The clever differentiator phrases, the ones the product actually wins on
  (`ethnicity adjusted bmr calculator`, `tdee calculator without body fat percentage`,
  `minimum safe calorie intake calculator`, and seven more), returned **zero measurable
  volume**. Nobody types the exact differentiator.

The lesson reshaped the whole plan: the target is the *topic cluster* people ask about a
hundred different ways, not one exact-match string, and not the head terms a new site can't
take. Own the long tail by being genuinely more useful on the "why," where the incumbents
are thin. Every "keyword" in the plan became content territory, not a title tag.

Two more findings that set guardrails, both worth a paragraph in a post about doing SEO
honestly in 2026:

- The March 2026 core update hammered templated, programmatic page sets, 60 to 90 percent
  traffic collapses. So: no programmatic per-keyword landing pages. If ever revisited, cap
  at a handful of genuinely distinct, 400-plus-word pages.
- Google pulled FAQ rich results in May 2026 and killed HowTo back in 2023. So FAQ/HowTo
  schema is fine as a UI feature but pointless as an SEO play, and it was deliberately left
  out of the structured data.

---

## 2. Two audiences, two homes: the content placement call

**Blog angle: "Where does the writing go, the product or the portfolio? Split by audience, not domain."**

MacroMentor lives at `macromentor.horizonfall.com`; the build story lives at
`horizonfall.com/projects/macromentor`. The temptation is to dump all the writing in one
place. The decision was to split by *who is reading and why*:

- **The product subdomain** gets the nutrition explainers. Third person, tool voice.
  Written to be found by someone searching a specific question ("does ethnicity affect BMR,"
  "how often should I refeed"). Every piece links back into `/calculator`, because content
  that exists for its own sake doesn't help the product.
- **The portfolio project page** gets the process and the learnings. First person, "here's
  what I found out." Read by people evaluating the builder (recruiters, collaborators, other
  builders), not people trying to hit a calorie target. This document is raw material for exactly that.

Why not put the SEO content on the portfolio instead: horizonfall's topical focus is
product/AI-builder work. Publishing "which BMR formula should I use" there would rank for
nothing (wrong topical relevance) and bury the actual portfolio under nutrition FAQs. The
split by *audience intent* is what lets both sites rank for what they're each actually about.

---

## 3. The content pipeline: research, write, then an adversary

**Blog angle (strong): "The fact-checker is a unit test for prose."**

Eleven long-form articles now sit in the Learn hub. None were written in one pass. Each ran
through a three-stage pipeline, and the stages matter:

1. **Research.** Gather primary sources and *verify* each one by actually reading the
   abstract or full text. Record exact sample sizes and effect sizes. No trusting memory.
2. **Write.** Turn verified notes into an article in a fixed house voice, every claim
   hyperlinked to a source that exists.
3. **Independent adversarial fact-check.** A separate pass that does its *own* fresh
   research and tries to disprove the draft, then corrects it in place.

That third stage is the whole point, and it's the same instinct as the test-first method on
the calculator (see section 6). It is not a proofread. It is an independent verifier whose
job is to catch the confident-but-wrong. What it actually caught, across two batches:

- A **fabricated duplicate citation**: one study (Camps 2016, Singaporean Chinese adults)
  had been written up as two different studies with slightly different numbers. Merged and corrected.
- An **unverifiable statistic**: a "Cunningham overestimates REE by 14 to 15%" figure that
  no indexed study supports. Replaced with a real, confirmed overestimate from a different study.
- A **guideline conflation**: the 1,200-calorie piece had blended a 2013 AHA/ACC/TOS
  recommendation with a 1998 NHLBI one as if one derived from the other. They're different
  documents with different numbers.
- In batch two: a wrong Inuit obesity range, a menopause claim that overreached its source,
  and two citations that pointed at the wrong number and had to be swapped.

The batch-two run: 12 agents, four articles, zero claims cut for being unsupportable, which
is what "good sourcing on the first two stages" looks like when it works.

The quotable line for a post: *anyone can generate a citation that looks right; the
expensive, necessary step is a second pass whose only job is to prove it wrong.*

---

## 4. The hard rule on sensitive claims, and the bug it surfaced

**Blog angle (strong): "The uncomfortable part of health content: a standing rule to cut, not caveat."**

Standing rule, no exceptions: no sensitive group-level claim (ancestry, sex, ethnicity and
metabolism/health/body composition) ships without a credible, linked source. If it can't be
verified, it gets *cut*, not shipped behind a "citation needed" marker. When in doubt, leave
it out.

This is not theoretical. It did two things:

- It **cut a claim**. A line asserting resting energy expenditure falls further in Black
  women than white women over the same weight loss came from an internal research review but
  had no attachable study. It was removed, logged as restore-only-if-verified, and stayed out.
- It **found a bug in the product itself**. While sourcing the ethnicity article, the
  fact-check cross-checked the calculator's actual code against the literature and found the
  shipped adjustments had drifted: the African adjustment was coded `+3%` when the cited
  source (Sharp 2002) shows roughly `-5%`, the sign was inverted. Two other options
  (Nordic, Pacific Islander) carried a fabricated `+3%` with no research behind them. The
  code was corrected (south_asian and east_asian to `-4%`, african to `-5%`, all downward
  because the Caucasian-derived formulas over-predict for these groups) and the two
  unsupported options were removed entirely.

That second one is the strongest single story in the whole project: *writing the honest
article is what caught the dishonest number in the engine.* The content work and the product
correctness turned out to be the same work.

The framing discipline that goes with the rule: population differences are always presented
as environmental and adaptive, never as racial essentialism. The cold-adaptation piece, for
example, spends as much effort on "this is about climate and lifestyle, and it doesn't
actually save you" as it does on the elevated resting burn itself.

---

## 5. The Learn hub architecture: boring on purpose

**Blog angle: "I shipped a blog engine with no CMS and no markdown library. Here's the reasoning."**

The eleven articles render as real, statically generated pages under `/learn`. The
engineering decisions were all in the direction of *less*:

- **No CMS.** The articles are plain markdown files. The source of truth for everything
  else (slug, category, description, keywords, dates) is one typed registry file. Publishing
  a piece is one registry entry plus the fact-checked markdown. That's it.
- **No markdown library at runtime.** The content is ours and uses a known, small subset
  (one H1, H2/H3, paragraphs, lists, inline links, bold). So instead of pulling a general
  markdown dependency, it's a ~160-line in-house renderer with its own 14-test Vitest suite.
  This bought full control over the emitted markup and its styling, and it fit the project's
  test-first culture. The trade-off is honest: if a future article needs a construct the
  renderer doesn't handle, you extend the parser and add a test, rather than reaching for a lib.
- **Read at build, don't duplicate.** The renderer reads the markdown straight out of the
  working `docs/` folder at build time. The drafting copy and the shipped copy are the same
  file. No sync step, no drift.
- **Everything static.** `generateStaticParams` plus `dynamicParams = false`. Every article
  and its Open Graph image is prerendered.

The SEO surface, all built in, none bolted on:

- Per-article canonical URLs, meta descriptions, and keywords.
- `Article` and `BreadcrumbList` structured data per page, `CollectionPage` plus `ItemList`
  on the index. Deliberately no FAQ/HowTo schema (see section 1).
- A per-article Open Graph image, generated at build by parameterizing the existing brand OG
  component, so social cards can't drift from the brand colors.
- An auto-built references list at the foot of each article, extracted from the inline links,
  so the sourcing is visible as a block, not just scattered through the prose.
- Sitemap entries for the hub and every article, and a "Learn" nav entry.

---

## 6. The through-line: how to keep AI honest

**Blog angle (strongest, ties everything together): "Two years of building with AI taught me one rule: give it something that can't be argued with."**

The single idea that connects the calculator engine and the content system:

On the **engine**, the first attempts let the AI build the multi-branch calculation directly.
It kept silently dropping steps: a tier firing wrong, a cap not triggering, a macro floor
skipped. The fix was to write the tests for each section *first*, as a specification, then
build against them. Once the expected values existed as an executable contract, the
AI-generated implementation was correct. The 43-test suite is that contract.

On the **content**, the equivalent of a failing test is an independent adversarial
fact-checker: a separate pass that has to disprove the draft against fresh sources before it
ships. Same shape, different medium. In both cases the AI is capable but not
self-policing, and the reliable move is to hand it something external that it cannot talk its
way around: a red test, or a citation that doesn't check out.

That generalizes well past this project, which is what makes it the anchor post. The pattern
is: *AI is good at producing plausible output and bad at knowing when it's wrong, so build
the independent check first and make the AI pass it.*

---

## 7. Marketing polish, and the small honest calls

**Blog angle (lighter): "The un-glamorous product decisions that actually matter."**

A cluster of small, deliberate calls worth a short post on taste and restraint:

- **Killed a self-deprecating quote.** The homepage had a real, honest line from the build
  log: "It hasn't helped me lose weight yet. The tool works; adherence is its own problem."
  Charming on a portfolio case study. On the product homepage, under a heading that says the
  tool refuses to give you a reckless number, it reads as "it didn't work for me." Cut it.
- **Removed the personal byline from articles.** The name is already on the site footer;
  putting "By [name]" on every article added nothing and made the authorship the story. The
  byline now leads with "Fact-checked, N sources cited," and the structured-data author is
  the organization. The trust signal people actually want on health content is the sourcing,
  not the person.
- **Made "Learn" look like a control.** It shipped as muted label text sitting next to
  "a horizonfall project," so it read as part of that label, not a button. It became a
  bordered pill, secondary to the primary teal Calculator button, grouped with it.
- **Enticed from the body, not just the nav.** A homepage section pulls three curated
  articles straight from the content registry with an honest hook ("why the scale stalls in
  a deficit that should be working"), so the depth of the content is visible to someone who
  never looks at the header.

Common thread: match the register to the audience and the surface. The honest, self-critical
voice belongs on the build log. The confident, sourced voice belongs on the product.

---

## 8. Expectations, set honestly

**Blog angle: "What a new site can actually expect from SEO, month by month."**

Worth a post purely because most SEO content lies about timelines. The plan set these, and a
follow-up post can check them against reality:

- Month 1: roughly zero organic traffic. Success is clean indexation, directories live,
  launches done once, the content shipped.
- Month 3: first long-tail rankings plausible (positions 10 to 30), low single-digit organic
  clicks a day.
- Month 6: earliest point non-trivial traffic could start. A few hundred organic sessions a
  month would be a good outcome, not thousands.
- Month 12: page one plausible for the differentiated long-tail queries. Head terms stay out
  of reach without a multi-year link-building effort.

The honest version of an SEO post is the one that comes back in six months with the real
Search Console numbers next to these guesses.

---

## Post backlog, ranked

1. **How to keep AI honest** (section 6). The anchor. Tests for code, adversaries for prose.
   Generalizes beyond nutrition.
2. **Writing the honest article caught the dishonest number** (section 4). The ethnicity-code
   bug found by fact-checking the content. Concrete, a little uncomfortable, memorable.
3. **The fact-checker is a unit test for prose** (section 3). The pipeline and the real errors it caught.
4. **I ran real keyword data and it said stop** (section 1). The "Low competition" trap and the zero-volume differentiators.
5. **A blog engine with no CMS and no markdown library** (section 5). For the engineering audience.
6. **Two audiences, two homes** (section 2) and **the small honest calls** (section 7) can be
   one shorter craft-and-taste post.
7. **What a new site can actually expect** (section 8). Best written as a two-parter with the
   six-month follow-up.
