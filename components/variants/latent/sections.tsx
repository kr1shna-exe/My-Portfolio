import Link from "next/link";

import { contributionStats } from "@/data/open-source";
import { experience, moreWork, site } from "@/data/site";

import { GlassFrame } from "./glass-frame";

export function LatentNav() {
  const links = [
    ["#work", "Work"],
    ["#upstream", "Open source"],
    ["#experience", "Experience"],
    ["#about", "About"],
  ];
  return (
    <header className="latent-nav">
      <a href="#main" className="latent-nav-mark" aria-label="Krishna, back to top">
        Krishna
      </a>
      <nav aria-label="Sections" className="latent-nav-links">
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a href="#contact" className="latent-nav-cta">
        Contact
      </a>
    </header>
  );
}

export function MoreWork() {
  return (
    <section id="more" className="latent-more" aria-labelledby="latent-more-h" data-nav-section>
      <div className="latent-wrap">
        <header className="latent-sec-head" data-reveal>
          <p className="latent-eyebrow latent-mono">More work</p>
          <h2 id="latent-more-h" className="latent-h2">
            Four more products.
          </h2>
        </header>
        <ul className="latent-more-grid">
          {moreWork.map((p) => {
            const isTwisense = p.slug === "twisense";
            const isExness = p.slug === "exness";
            return (
              <li key={p.slug} data-reveal className="latent-more-card">
                <GlassFrame
                  title={p.title}
                  image={isExness ? undefined : p.image}
                  url={p.liveUrl}
                  repo={p.repo}
                  sizes="(max-width: 767px) 92vw, 46vw"
                />
                <div className="latent-more-body">
                  <div className="latent-more-row">
                    <h3 className="latent-more-title">{p.title}</h3>
                    {isExness && <span className="latent-tag">In production</span>}
                  </div>
                  <p className="latent-more-tag">{p.tagline}</p>
                  {!isTwisense && (
                    <ul className="latent-chips" aria-label="Stack">
                      {p.tech.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                  <div className="latent-detail-links">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer">
                        Live site ↗
                      </a>
                    )}
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noreferrer">
                        Code ↗
                      </a>
                    )}
                    {!isTwisense && <Link href={`/projects/${p.slug}`}>Case study →</Link>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="latent-xp" aria-labelledby="latent-xp-h" data-nav-section>
      <div className="latent-wrap">
        <header className="latent-sec-head" data-reveal>
          <p className="latent-eyebrow latent-mono">Experience</p>
          <h2 id="latent-xp-h" className="latent-h2">
            Where I&apos;ve worked.
          </h2>
        </header>
        <ol className="latent-xp-list">
          {experience.map((e) => {
            const current = e.end === "Present";
            return (
              <li key={e.company} className="latent-xp-row" data-reveal>
                <p className="latent-mono latent-xp-when">
                  <span>
                    {e.start} – {e.end}
                  </span>
                  <span>{e.location}</span>
                </p>
                <div className="latent-xp-co">
                  <h3>
                    {e.link ? (
                      <a href={e.link} target="_blank" rel="noreferrer">
                        {e.company}
                        <span aria-hidden> ↗</span>
                      </a>
                    ) : (
                      e.company
                    )}
                  </h3>
                  <p className="latent-xp-role">
                    {e.role}
                    {current && <span className="latent-tag">Current</span>}
                  </p>
                </div>
                <div className="latent-xp-body">
                  <p>{e.summary}</p>
                  {e.highlights.length > 0 && (
                    <ul>
                      {e.highlights.map((h) => (
                        <li key={h}>{h.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function About() {
  const [lead, ...rest] = site.bio;
  const facts: { k: string; v: React.ReactNode }[] = [
    {
      k: "Now",
      v: (
        <>
          {site.role},{" "}
          <a href={site.company.href} target="_blank" rel="noreferrer">
            {site.company.name}
          </a>
        </>
      ),
    },
    {
      k: "Before",
      v: experience
        .slice(1)
        .map((e) => e.company)
        .join(", "),
    },
    { k: "Shipped", v: `${site.stats[0].value} products, ${site.stats[1].value} live` },
    { k: "Open source", v: `${contributionStats.merged} merged PRs across ${contributionStats.repos} projects` },
    {
      k: "Elsewhere",
      v: (
        <>
          {site.socials.map((s, i) => (
            <span key={s.label}>
              {i > 0 && ", "}
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </>
      ),
    },
  ];
  return (
    <section id="about" className="latent-about" aria-labelledby="latent-about-h" data-nav-section>
      <div className="latent-wrap latent-about-grid">
        <div data-reveal>
          <p className="latent-eyebrow latent-mono">About</p>
          <h2 id="latent-about-h" className="latent-sr">
            About Krishna
          </h2>
          <p className="latent-about-lead">{lead}</p>
          {rest.map((p) => (
            <p key={p} className="latent-about-p">
              {p}
            </p>
          ))}
        </div>
        <dl className="latent-facts" data-reveal>
          {facts.map((f) => (
            <div key={f.k}>
              <dt className="latent-mono">{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
