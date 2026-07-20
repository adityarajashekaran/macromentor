/** Shared visual for opengraph-image.tsx and twitter-image.tsx — same brand
 * colors as globals.css (parchment / near-black / teal), rendered by Satori
 * so it can't drift from CSS custom properties it can't read at build time.
 *
 * Default (no props) is the site card. Pass `eyebrow` + `title` for a content
 * article: the wordmark shrinks to a footer and the headline leads. */
export function OgImageContent({
  eyebrow,
  title,
}: {
  eyebrow?: string
  title?: string
} = {}) {
  if (title) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#f5eee0",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 5,
            color: "#0c6468",
          }}
        >
          {(eyebrow ?? "MACROMENTOR — LEARN").toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 62,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#16100c",
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#16100c" }}>
          <span>macromentor</span>
          <span style={{ color: "#0c6468" }}>.</span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5eee0",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
          color: "#0c6468",
          marginBottom: 28,
        }}
      >
        FREE CALORIE &amp; MACRO CALCULATOR
      </div>
      <div style={{ display: "flex", fontSize: 108, fontWeight: 800, color: "#16100c" }}>
        <span>macromentor</span>
        <span style={{ color: "#0c6468" }}>.</span>
      </div>
      <div style={{ display: "flex", fontSize: 34, color: "#6b6154", marginTop: 28 }}>
        Know exactly how much to eat.
      </div>
    </div>
  )
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }
export const OG_IMAGE_ALT = "MacroMentor — a free calorie and macro calculator"
