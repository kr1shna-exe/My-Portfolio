import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { featured, moreWork, site } from "@/data/site";

import { CopyEmail } from "./copy-email";
import { SocialIcon } from "./icons";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section id="contact" className="launch-cta" aria-labelledby="launch-cta-h">
      <div className="launch-cta-aurora" aria-hidden />
      <div className="launch-cta-dots" aria-hidden />
      <Reveal className="launch-wrap">
        <span className="launch-eyebrow">06 · Contact</span>
        <h2 id="launch-cta-h" className="launch-cta-h">
          Let&apos;s build something people use.
        </h2>
        <p>Hiring, building, or just curious about an agent loop? My inbox is open.</p>
        <div className="launch-email">
          <span className="launch-email-addr">{site.email}</span>
          <CopyEmail email={site.email} />
          <a href={`mailto:${site.email}`} className="launch-btn launch-btn-primary" style={{ height: 40 }}>
            Email me
            <ArrowRight size={15} className="launch-nudge" aria-hidden />
          </a>
        </div>
        <div className="launch-cta-socials">
          {site.socials.map((s) => (
            <a key={s.label} className="launch-linkpill" href={s.href} target="_blank" rel="noreferrer">
              <SocialIcon label={s.label} size={13} />
              {s.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="launch-footer">
      <div className="launch-wrap">
        <div className="launch-footer-grid">
          <div>
            <a href="#main" className="launch-brand" aria-label="Krishna, back to top">
              <span className="launch-mark" aria-hidden>
                K
              </span>
              <span>Krishna</span>
            </a>
            <p className="launch-footer-blurb">
              {site.role} at {site.company.name}. {site.subline}
            </p>
          </div>
          <nav aria-label="Featured work">
            <h3>Work</h3>
            <ul>
              {featured.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="More work">
            <h3>More</h3>
            <ul>
              {moreWork.map((p) =>
                p.repo ? (
                  <li key={p.slug}>
                    <a href={p.liveUrl ?? p.repo} target="_blank" rel="noreferrer">
                      {p.title}
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </nav>
          <nav aria-label="Elsewhere">
            <h3>Elsewhere</h3>
            <ul>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`}>Email</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="launch-footer-bottom">
          <span className="launch-status">
            <i aria-hidden />
            All systems operational
          </span>
          <span>Updated {site.updated}</span>
        </div>
      </div>
      <div className="launch-wordmark" aria-hidden>
        krishna
      </div>
    </footer>
  );
}
