import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { LoadedArticle } from "@/lib/content/articles"
import { LEARN_PATH } from "@/lib/site"

interface ArticleCardProps {
  article: LoadedArticle
  /** Larger treatment for the featured/cornerstone article. */
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link
      href={`${LEARN_PATH}/${article.slug}`}
      className="lift group flex flex-col rounded-lg border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow text-primary">
          {featured ? "Start here" : `${article.readingMinutes} min read`}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <h3
        className={
          featured
            ? "mt-3 font-heading text-2xl font-bold leading-tight"
            : "mt-3 font-heading text-lg font-bold leading-snug"
        }
      >
        {article.headline}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {article.description}
      </p>

      <p className="eyebrow mt-5 text-muted-foreground/80">
        {article.sourceCount} sources linked
        {featured ? ` · ${article.readingMinutes} min read` : ""}
      </p>
    </Link>
  )
}
