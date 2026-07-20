import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import {
  getArticle,
  getArticleSlugs,
  getRelated,
} from "@/lib/content/articles"
import { sourceHost } from "@/lib/content/markdown"
import { ArticleCard } from "@/components/content/article-card"
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR_NAME,
  AUTHOR_URL,
  LEARN_PATH,
} from "@/lib/site"

export const dynamicParams = false

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}

  const url = `${SITE_URL}${LEARN_PATH}/${slug}`
  return {
    title: `${article.metaTitleResolved} · ${SITE_NAME}`,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `${LEARN_PATH}/${slug}` },
    openGraph: {
      title: article.headline,
      description: article.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: article.published,
      modifiedTime: article.updated,
      authors: [AUTHOR_URL],
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.description,
    },
  }
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const url = `${SITE_URL}${LEARN_PATH}/${slug}`
  const related = getRelated(slug, 2)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    datePublished: article.published,
    dateModified: article.updated,
    author: { "@type": "Person", name: AUTHOR_NAME, url: AUTHOR_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${url}/opengraph-image`,
    citation: article.links.map((l) => l.href),
    isAccessibleForFree: true,
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Learn", item: `${SITE_URL}${LEARN_PATH}` },
      {
        "@type": "ListItem",
        position: 3,
        name: article.headline,
        item: url,
      },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="container max-w-[46rem] py-12 md:py-16">
        <Link
          href={LEARN_PATH}
          className="eyebrow inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All articles
        </Link>

        <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl">
          {article.headline}
        </h1>

        <div className="eyebrow mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
          <span>By {AUTHOR_NAME}</span>
          <span aria-hidden>·</span>
          <span>{article.readingMinutes} min read</span>
          <span aria-hidden>·</span>
          <span>{article.sourceCount} sources</span>
          <span aria-hidden>·</span>
          <time dateTime={article.updated}>Updated {formatDate(article.updated)}</time>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Independently fact-checked. Every study is linked inline so you can read the source
          yourself.
        </p>

        <div
          className="article-prose mt-10"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        {/* ————— References ————— */}
        {article.links.length > 0 && (
          <section className="mt-14 border-t border-border pt-8">
            <h2 className="font-heading text-xl font-bold">References</h2>
            <ol className="mt-5 space-y-3">
              {article.links.map((link, i) => (
                <li key={link.href} className="flex gap-3 text-sm leading-relaxed">
                  <span className="eyebrow shrink-0 text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mm-inline-link break-words"
                  >
                    {link.text}{" "}
                    <span className="text-muted-foreground/70">({sourceHost(link.href)})</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ————— Inline CTA ————— */}
        <div className="mt-14 rounded-lg border border-border bg-card p-6 md:p-8">
          <p className="eyebrow text-primary">Your turn</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">See your own numbers.</h2>
          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
            MacroMentor runs the whole calculation in your browser, picks the formula your data
            supports, and shows every step. No account, nothing stored.
          </p>
          <Link
            href="/calculator"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Start the calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      {/* ————— Related ————— */}
      {related.length > 0 && (
        <section className="container max-w-5xl pb-20">
          <div className="border-t border-border pt-10">
            <p className="eyebrow text-primary">Keep reading</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
