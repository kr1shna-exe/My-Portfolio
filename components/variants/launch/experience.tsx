import { ArrowUpRight } from "lucide-react";

import { experience } from "@/data/site";

import { Reveal } from "./reveal";

export function Experience() {
  return (
    <section id="experience" className="launch-section" aria-labelledby="launch-exp-h">
      <div className="launch-wrap launch-exp">
        <Reveal className="launch-head launch-exp-head">
          <span className="launch-eyebrow">04 · Experience</span>
          <h2 id="launch-exp-h" className="launch-h2">
            Where I&apos;ve shipped.
          </h2>
          <p className="launch-lede">
            From frontends that sell the product to the AI stack that is the product.
          </p>
        </Reveal>

        <ol className="launch-tl">
          {experience.map((e, i) => {
            const now = e.end === "Present";
            return (
              <Reveal as="li" key={e.company} delay={i * 0.06} className={`launch-tl-item${now ? " is-now" : ""}`}>
                <span className="launch-tl-dot" aria-hidden />
                <div className="launch-tl-meta">
                  <span>
                    {e.start} to {e.end}
                  </span>
                  <span aria-hidden>·</span>
                  <span>{e.location}</span>
                  {now ? <span className="launch-chip is-live">Now</span> : null}
                </div>
                <h3 className="launch-tl-role">
                  {e.role}{" "}
                  {e.link ? (
                    <a href={e.link} target="_blank" rel="noreferrer">
                      at {e.company}
                      <ArrowUpRight size={16} aria-hidden style={{ display: "inline", verticalAlign: "-2px", marginLeft: 2 }} />
                    </a>
                  ) : (
                    <span style={{ color: "var(--l-fg-2)" }}>at {e.company}</span>
                  )}
                </h3>
                <p className="launch-tl-summary">{e.summary}</p>
                {e.highlights.length ? (
                  <ul className="launch-tl-hl">
                    {e.highlights.map((h) => (
                      <li key={h}>{h.trim()}</li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
