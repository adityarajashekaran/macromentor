import { ImageResponse } from "next/og"
import { OgImageContent, OG_IMAGE_SIZE, OG_IMAGE_ALT } from "../../og-image-content"
import { getArticle, getArticleSlugs } from "@/lib/content/articles"

export const alt = OG_IMAGE_ALT
export const size = OG_IMAGE_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  return new ImageResponse(
    <OgImageContent eyebrow="MacroMentor — Learn" title={article?.headline ?? "MacroMentor"} />,
    size,
  )
}
