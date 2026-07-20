import { describe, it, expect } from "vitest"
import { renderMarkdown, readingTime, sourceHost } from "./markdown"

describe("renderMarkdown", () => {
  it("extracts the first H1 as the title and strips it from the body", () => {
    const { title, html } = renderMarkdown("# Hello World\n\nA paragraph.")
    expect(title).toBe("Hello World")
    expect(html).not.toContain("Hello World")
    expect(html).toContain("<p>A paragraph.</p>")
  })

  it("renders H2 and H3 headings", () => {
    const { html } = renderMarkdown("## Section\n\n### Sub")
    expect(html).toContain("<h2>Section</h2>")
    expect(html).toContain("<h3>Sub</h3>")
  })

  it("renders external links with target and rel, and collects them as sources", () => {
    const { html, links } = renderMarkdown(
      "See [a 1990 study](https://pubmed.ncbi.nlm.nih.gov/2305711/) for detail.",
    )
    expect(html).toContain(
      '<a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" class="mm-inline-link" target="_blank" rel="noopener noreferrer">a 1990 study</a>',
    )
    expect(links).toEqual([
      { href: "https://pubmed.ncbi.nlm.nih.gov/2305711/", text: "a 1990 study" },
    ])
  })

  it("does not mark internal links external, and does not list them as sources", () => {
    const { html, links } = renderMarkdown("Run [the calculator](/calculator) now.")
    expect(html).toContain('<a href="/calculator" class="mm-inline-link">the calculator</a>')
    expect(html).not.toContain("target=")
    expect(links).toHaveLength(0)
  })

  it("autolinks bare /calculator mentions without double-linking explicit ones", () => {
    const { html } = renderMarkdown("Try /calculator today. Also [/calculator](/calculator).")
    // one autolinked bare mention + one explicit link = two anchors, no nesting
    const anchors = html.match(/<a /g) ?? []
    expect(anchors).toHaveLength(2)
    expect(html).not.toContain("<a href=\"/calculator\" class=\"mm-inline-link\"><a")
  })

  it("renders unordered lists", () => {
    const { html } = renderMarkdown("- first\n- second")
    expect(html).toContain("<ul><li>first</li><li>second</li></ul>")
  })

  it("renders bold text", () => {
    const { html } = renderMarkdown("This is **important** here.")
    expect(html).toContain("<strong>important</strong>")
  })

  it("escapes HTML in text to prevent injection", () => {
    const { html } = renderMarkdown("A <script>alert(1)</script> & more.")
    expect(html).toContain("&lt;script&gt;")
    expect(html).not.toContain("<script>")
    expect(html).toContain("&amp;")
  })

  it("dedupes repeated source links by href", () => {
    const md =
      "One [study](https://example.com/a) and again [same study](https://example.com/a)."
    const { links } = renderMarkdown(md)
    expect(links).toHaveLength(1)
  })

  it("joins wrapped paragraph lines with a space", () => {
    const { html } = renderMarkdown("line one\nline two\n\nnext para")
    expect(html).toContain("<p>line one line two</p>")
    expect(html).toContain("<p>next para</p>")
  })
})

describe("readingTime", () => {
  it("returns at least one minute", () => {
    expect(readingTime(10)).toBe(1)
  })
  it("rounds to nearest minute at ~220 wpm", () => {
    expect(readingTime(660)).toBe(3)
  })
})

describe("sourceHost", () => {
  it("strips the www prefix", () => {
    expect(sourceHost("https://www.ncbi.nlm.nih.gov/x")).toBe("ncbi.nlm.nih.gov")
  })
  it("returns pubmed host cleanly", () => {
    expect(sourceHost("https://pubmed.ncbi.nlm.nih.gov/2305711/")).toBe(
      "pubmed.ncbi.nlm.nih.gov",
    )
  })
})
