import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  getGroupedArticles,
  getFeaturedArticle,
  getAllArticles,
} from "@/lib/content/articles"
import { ArticleCard } from "@/components/content/article-card"
import { SITE_URL, SITE_NAME, LEARN_PATH } from "@/lib/site"

const TITLE = "Learn — the science behind your calorie number"
const DESCRIPTION =
  "Plain-English, fully sourced explainers on BMR formulas, safe deficits, metabolism, and what a calorie calculator gets right and wrong. Every claim links to the study."

export const metadata: Metadata = {
  title: `${TITLE} · ${SITE_NAME}`,
  description: DESCRIPTION,
  keywords: [
    "BMR formula",
    "TDEE explained",
    "metabolism science",
    "calorie deficit safety",
    "macro calculator guide",
  ],
  alternates: { canonical: LEARN_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${LEARN_PATH}`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function LearnIndexPage() {
  const groups = getGroupedArticles()
  const featured = getFeaturedArticle()
  const all = getAllArticles()

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${LEARN_PATH}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}${LEARN_PATH}/${a.slug}`,
        name: a.headline,
      })),
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Learn", item: `${SITE_URL}${LEARN_PATH}` },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ————— Header ————— */}
      <section className="container py-16 md:py-20">
        <p className="eyebrow text-primary">Learn</p>
        <h1 className="mt-4 max-w-[20ch] text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          The science behind your number.
        </h1>
        <p className="mt-6 max-w-[58ch] leading-relaxed text-muted-foreground">
          A calorie calculator hands you one clean number. These pieces explain where it comes
          from, where it goes wrong, and what to do about it. Every scientific claim links to the
          study behind it, and each one is independently fact-checked before it ships.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Skip to the calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="eyebrow text-muted-foreground">
            {all.length} articles · {all.reduce((n, a) => n + a.sourceCount, 0)} sources linked
          </p>
        </div>
      </section>

      {/* ————— Featured ————— */}
      {featured && (
        <section className="container pb-4">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <ArticleCard article={featured} featured />
            <div className="flex flex-col justify-center rounded-lg border border-dashed border-border p-6">
              <p className="eyebrow text-primary">How to read these</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                No listicles, no hedging every sentence. Real mechanisms, named studies, then the
                practical takeaway. If a claim can&apos;t be sourced, it doesn&apos;t go in.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Start with the formulas piece if you want the foundation, or jump to whatever
                question brought you here.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ————— Category sections ————— */}
      {groups.map(({ category, items }) => (
        <section key={category.key} className="container py-10 md:py-12">
          <div className="border-b border-border pb-5">
            <h2 className="text-2xl font-bold sm:text-3xl">{category.label}</h2>
            <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">{category.blurb}</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ))}

      {/* ————— CTA ————— */}
      <section className="container py-16 md:py-20">
        <div className="grain relative overflow-hidden rounded-lg border border-border bg-card px-6 py-12 text-center md:py-16">
          <p className="eyebrow text-primary">Free · no account · runs in your browser</p>
          <h2 className="mx-auto mt-4 max-w-[24ch] text-3xl font-bold sm:text-4xl">
            Enough theory. See your own numbers.
          </h2>
          <Link
            href="/calculator"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Start the calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
