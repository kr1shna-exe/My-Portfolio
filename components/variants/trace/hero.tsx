import { ArrowDown, ArrowUpRight } from "lucide-react";

import { contributionStats, contributionsByRepo } from "@/data/open-source";
import { site } from "@/data/site";

import { AskConsole } from "./ask";
import { RUN_ID } from "./meta";
import { PaletteButton } from "./palette";

const NAME = "KRISHNA";

export function Hero() {
  return (
    <section className="trace-hero" id="top" aria-label="Introduction">
      <div className="trace-hero-meta" aria-hidden>
        <span>
          <i className="trace-dot trace-dot-amber" /> root span
        </span>
        <span>krishna.portfolio</span>
        <span className="trace-hide-sm">run {RUN_ID}</span>
        <span className="trace-hide-sm">status ok</span>
        <span className="trace-hero-meta-end">updated {site.updated}</span>
      </div>

      <h1 className="trace-name">
        <span className="trace-sr">Krishna, {site.role}</span>
        <span className="trace-name-vis" aria-hidden>
          {NAME.split("").map((ch, i) => (
            <span key={i} className="trace-ch" style={{ "--i": i } as React.CSSProperties}>
              {ch}
            </span>
          ))}
          <span className="trace-name-caret" style={{ "--i": NAME.length } as React.CSSProperties} />
        </span>
      </h1>

      <div className="trace-hero-grid">
        <div className="trace-hero-copy">
          <p className="trace-role">
            <span className="trace-role-chip">
              <i className="trace-dot trace-dot-amber trace-pulse" aria-hidden />
              {site.role}
            </span>
            <span className="trace-role-at">at</span>
            <a href={site.company.href} target="_blank" rel="noreferrer" className="trace-link">
              {site.company.name}
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </p>
          <p className="trace-headline">{site.headline}</p>
          <p className="trace-subline">{site.subline}</p>
          <a href="#outbound" className="trace-proof">
            <i className="trace-dot trace-dot-mint" aria-hidden />
            <span>
              <b className="trace-num">{contributionStats.merged} PRs merged</b> into{" "}
              {contributionsByRepo
                .slice(0, 3)
                .map((r) => r.name)
                .join(", ")}{" "}
              and {contributionsByRepo.length - 3} more
            </span>
            <ArrowDown size={13} aria-hidden />
          </a>

          <dl className="trace-stats">
            {site.stats.map((s) => (
              <div key={s.label} className="trace-stat">
                <dt>{s.label}</dt>
                <dd className="trace-num">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="trace-hero-ctas">
            <a href="#work" className="trace-btn trace-btn-primary">
              Inspect the work <ArrowDown size={15} aria-hidden />
            </a>
            <PaletteButton className="trace-btn trace-btn-ghost" label="Open command palette to get in touch">
              <span>Get in touch</span>
            </PaletteButton>
          </div>
        </div>

        <AskConsole />
      </div>
    </section>
  );
}
