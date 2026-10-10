import Image from "next/image";
import Link from "next/link";

import { experience, moreWork, site } from "@/data/site";

import { Stickers } from "./stickers";
import { TradingPlaceholder } from "./trading-placeholder";

export function LatentNav() {
  const links = [
    ["#map", "map"],
    ["#forward-pass", "forward pass"],
    ["#upstream", "upstream"],
    ["#record", "record"],
    ["#about", "about"],
  ];
  return (
    <header className="latent-nav">
      <a href="#main" className="latent-nav-mark" aria-label="Krishna, back to top">
        <span className="latent-nav-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        krishna
      </a>
      <nav aria-label="Sections" className="latent-nav-links latent-mono">
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a href="#contact" className="latent-nav-cta">
        say hi
      </a>
    </header>
  );
}

export function Marquee({ items, tone }: { items: string[]; tone: "sun" | "pink" | "ink" }) {
  const row = (hidden: boolean) => (
    <div className="latent-marquee-row" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i}>
          {t}
          <b aria-hidden>✺</b>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`latent-marquee latent-marquee-${tone}`}>
      <div className="latent-marquee-inner">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function MoreWork() {
  return (
    <section id="more" className="latent-more" aria-labelledby="latent-more-h" data-nav-section>
      <div className="latent-wrap">
        <header className="latent-sec-head latent-sec-head-row" data-reveal>
          <div>
            <p className="latent-eyebrow latent-mono">
              <span>03</span> more work
            </p>
            <h2 id="latent-more-h" className="latent-h2">
              More samples from <em>the same distribution.</em>
            </h2>
          </div>
          <p className="latent-lede">
            Four more products. Different shapes, same habit: build the whole thing, then put the
            code where you can read it.
          </p>
        </header>
        <ul className="latent-more-grid">
          {moreWork.map((p, i) => {
            const isTwisense = p.slug === "twisense";
            const isExness = p.slug === "exness";
            return (
              <li key={p.slug} data-reveal className="latent-more-card" style={{ ["--r" as string]: `${[-1.2, 0.9, 0.7, -0.8][i % 4]}deg` }}>
                <div className="latent-more-shot">
                  {isExness ? (
                    <TradingPlaceholder />
                  ) : (
                    <Image
                      src={p.image}
                      alt={`${p.title} landing page`}
                      width={1512}
                      height={945}
                      sizes="(max-width: 767px) 92vw, 46vw"
                    />
                  )}
                  <span className="latent-more-seed latent-mono" aria-hidden>
                    {String(i + 4).padStart(2, "0")} / 07
                  </span>
                </div>
                <div className="latent-more-body">
                  <h3 className="latent-more-title">{p.title}</h3>
                  {isExness && <span className="latent-tag latent-tag-outline">in production</span>}
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
    <section id="record" className="latent-xp" aria-labelledby="latent-xp-h" data-nav-section>
      <div className="latent-wrap">
        <header className="latent-sec-head latent-sec-head-row" data-reveal>
          <div>
            <p className="latent-eyebrow latent-mono">
              <span>05</span> experience
            </p>
            <h2 id="latent-xp-h" className="latent-h2 latent-h2-xl">
              The training <em>run.</em>
            </h2>
          </div>
          <p className="latent-lede">Three epochs so far. The latest one is still running.</p>
        </header>
        <ol className="latent-xp-list">
          {experience.map((e, i) => {
            const epoch = experience.length - i;
            const current = e.end === "Present";
            return (
              <li key={e.company} className="latent-xp-row" data-reveal>
                <p className="latent-mono latent-xp-epoch">
                  epoch {String(epoch).padStart(2, "0")}
                  <span>
                    {e.start} → {e.end}
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
                    {current && <span className="latent-sticker latent-sticker-sun latent-sticker-sm">now</span>}
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
  return (
    <section id="about" className="latent-about" aria-labelledby="latent-about-h" data-nav-section>
      <div className="latent-wrap latent-about-grid">
        <div data-reveal>
          <p className="latent-eyebrow latent-mono">
            <span>06</span> about
          </p>
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
        <Stickers />
      </div>
    </section>
  );
}
