import { ImageResponse } from "next/og"
import { OgImageContent, OG_IMAGE_SIZE, OG_IMAGE_ALT } from "./og-image-content"

export const alt = OG_IMAGE_ALT
export const size = OG_IMAGE_SIZE
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(<OgImageContent />, size)
}
