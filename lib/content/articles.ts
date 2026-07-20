/**
 * Server-side article loader. Reads the published-intent markdown from
 * docs/seo/content at build time, renders it, and joins it with the SEO
 * metadata in registry.ts. Imported only by server components and the
 * sitemap, so the fs access runs at build (every /learn page is static).
 */
import fs from "node:fs"
import path from "node:path"
import {
  ARTICLES,
  CATEGORIES,
  type ArticleMeta,
  type Category,
} from "./registry"
import { renderMarkdown, readingTime, type ArticleLink } from "./markdown"

const CONTENT_DIR = path.join(process.cwd(), "docs", "seo", "content")

export interface LoadedArticle extends ArticleMeta {
  /** The article H1, rendered as the on-page headline. */
  headline: string
  /** Title for the <title> tag (metaTitle override, else the headline). */
  metaTitleResolved: string
  html: string
  links: ArticleLink[]
  readingMinutes: number
  sourceCount: number
}

function load(meta: ArticleMeta): LoadedArticle {
  const md = fs.readFileSync(path.join(CONTENT_DIR, meta.file), "utf8")
  const { title, html, links, wordCount } = renderMarkdown(md)
  return {
    ...meta,
    headline: title,
    metaTitleResolved: meta.metaTitle ?? title,
    html,
    links,
    readingMinutes: readingTime(wordCount),
    sourceCount: links.length,
  }
}

export function getAllArticles(): LoadedArticle[] {
  return ARTICLES.map(load)
}

export function getArticle(slug: string): LoadedArticle | undefined {
  const meta = ARTICLES.find((a) => a.slug === slug)
  return meta ? load(meta) : undefined
}

export function getArticleSlugs(): string[] {
  return ARTICLES.map((a) => a.slug)
}

/** Up to `n` related articles: same category first, then fill by hub order. */
export function getRelated(slug: string, n = 2): LoadedArticle[] {
  const current = ARTICLES.find((a) => a.slug === slug)
  if (!current) return []
  const others = ARTICLES.filter((a) => a.slug !== slug)
  const sameCategory = others.filter((a) => a.category === current.category)
  const rest = others.filter((a) => a.category !== current.category)
  return [...sameCategory, ...rest].slice(0, n).map(load)
}

export interface GroupedArticles {
  category: Category
  items: LoadedArticle[]
}

/** Articles grouped by category, in CATEGORIES order, empty groups dropped. */
export function getGroupedArticles(): GroupedArticles[] {
  const all = getAllArticles()
  return CATEGORIES.map((category) => ({
    category,
    items: all.filter((a) => a.category === category.key),
  })).filter((g) => g.items.length > 0)
}

export function getFeaturedArticle(): LoadedArticle | undefined {
  const meta = ARTICLES.find((a) => a.featured)
  return meta ? load(meta) : undefined
}

/** Load specific articles by slug, in the order given (unknown slugs skipped). */
export function getArticlesBySlugs(slugs: string[]): LoadedArticle[] {
  return slugs
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((m): m is ArticleMeta => Boolean(m))
    .map(load)
}

export function getArticleCount(): number {
  return ARTICLES.length
}
