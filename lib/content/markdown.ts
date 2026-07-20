/**
 * A small markdown renderer for the /learn articles.
 *
 * The content is ours and uses a known, constrained subset: one H1 (the
 * headline), H2/H3 section headers, paragraphs, unordered lists, inline
 * `[text](url)` links, `**bold**`, and bare `/calculator` mentions. That
 * narrow surface is why this is a hand-rolled parser with test coverage
 * rather than a general markdown dependency: full control over the emitted
 * markup (and its Tailwind classes) with nothing to pull at runtime.
 *
 * If a future article needs a construct this doesn't handle, extend the
 * parser and add a case to markdown.test.ts rather than reaching for a lib.
 */

export interface ArticleLink {
  href: string
  text: string
}

export interface RenderedMarkdown {
  /** Text of the first H1, used as the on-page headline. */
  title: string
  /** Rendered body HTML (the H1 is stripped). */
  html: string
  /** Distinct external links, in first-seen order (the article's sources). */
  links: ArticleLink[]
  /** Rough body word count, for reading-time estimates. */
  wordCount: number
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;")
}

/** Turn bare `/calculator` mentions in already-escaped text into links. */
function autolinkCalculator(escaped: string): string {
  return escaped.replace(
    /\/calculator\b/g,
    '<a href="/calculator" class="mm-inline-link">/calculator</a>',
  )
}

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g

/** Render inline markdown (links, bold, calculator autolinks) for one text run. */
function renderInline(text: string, links: ArticleLink[]): string {
  let out = ""
  let last = 0
  let m: RegExpExecArray | null
  INLINE.lastIndex = 0
  while ((m = INLINE.exec(text)) !== null) {
    out += autolinkCalculator(escapeHtml(text.slice(last, m.index)))
    if (m[1] !== undefined) {
      const linkText = m[1]
      const href = m[2]
      const external = /^https?:\/\//.test(href)
      if (external) links.push({ href, text: linkText })
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ""
      out += `<a href="${escapeAttr(href)}" class="mm-inline-link"${attrs}>${escapeHtml(linkText)}</a>`
    } else {
      out += `<strong>${escapeHtml(m[3])}</strong>`
    }
    last = m.index + m[0].length
  }
  out += autolinkCalculator(escapeHtml(text.slice(last)))
  return out
}

export function renderMarkdown(md: string): RenderedMarkdown {
  const links: ArticleLink[] = []
  const lines = md.replace(/\r\n/g, "\n").split("\n")

  let title = ""
  const html: string[] = []
  let para: string[] = []
  let list: string[] = []

  const flushPara = () => {
    if (para.length) {
      html.push(`<p>${renderInline(para.join(" "), links)}</p>`)
      para = []
    }
  }
  const flushList = () => {
    if (list.length) {
      const items = list.map((li) => `<li>${renderInline(li, links)}</li>`).join("")
      html.push(`<ul>${items}</ul>`)
      list = []
    }
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (/^#\s+/.test(line)) {
      flushPara()
      flushList()
      if (!title) title = line.replace(/^#\s+/, "").trim()
      continue
    }
    if (/^##\s+/.test(line)) {
      flushPara()
      flushList()
      html.push(`<h2>${renderInline(line.replace(/^##\s+/, "").trim(), links)}</h2>`)
      continue
    }
    if (/^###\s+/.test(line)) {
      flushPara()
      flushList()
      html.push(`<h3>${renderInline(line.replace(/^###\s+/, "").trim(), links)}</h3>`)
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara()
      list.push(line.replace(/^[-*]\s+/, "").trim())
      continue
    }
    if (line === "") {
      flushPara()
      flushList()
      continue
    }

    flushList()
    para.push(line)
  }
  flushPara()
  flushList()

  const wordCount = md
    .replace(/[#*[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length

  const seen = new Set<string>()
  const distinctLinks = links.filter((l) => {
    if (seen.has(l.href)) return false
    seen.add(l.href)
    return true
  })

  return { title, html: html.join("\n"), links: distinctLinks, wordCount }
}

export function readingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 220))
}

/** A readable label for a source link's host, e.g. "pubmed.ncbi.nlm.nih.gov". */
export function sourceHost(href: string): string {
  try {
    return new URL(href).host.replace(/^www\./, "")
  } catch {
    return href
  }
}
