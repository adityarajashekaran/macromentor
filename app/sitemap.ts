import type { MetadataRoute } from "next"
import { getAllArticles } from "@/lib/content/articles"
import { SITE_URL, LEARN_PATH } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const articles: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${SITE_URL}${LEARN_PATH}/${a.slug}`,
    lastModified: new Date(`${a.updated}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}${LEARN_PATH}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...articles,
  ]
}
