export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="font-heading text-lg font-bold tracking-tight">
              macromentor<span className="text-primary">.</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Built by{" "}
              <a
                href="https://horizonfall.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ev-link text-foreground"
              >
                Aditya Rajashekaran
              </a>{" "}
              — part of the{" "}
              <a
                href="https://horizonfall.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ev-link text-foreground"
              >
                horizonfall
              </a>{" "}
              family. Building at the frontier, in the open.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="https://horizonfall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-muted-foreground transition-colors hover:text-foreground"
            >
              horizonfall.com ↗
            </a>
            <a
              href="https://github.com/adityarajashekaran/macromentor"
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-muted-foreground transition-colors hover:text-foreground"
            >
              Source on GitHub ↗
            </a>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          MacroMentor is an informational tool, not medical advice. Estimates are population-level
          equations applied to your inputs — a starting point to adjust from, not a prescription.
          Consult a qualified professional before making significant dietary changes, especially if
          you have a medical condition or a history of disordered eating.
        </p>

        <p className="eyebrow mt-6 text-muted-foreground/70">
          © {new Date().getFullYear()} Aditya Rajashekaran · Nothing you enter leaves your browser
        </p>
      </div>
    </footer>
  )
}
