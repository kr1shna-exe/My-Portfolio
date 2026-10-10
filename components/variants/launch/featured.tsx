import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { anatomies } from "@/data/projects";
import { featured } from "@/data/site";

import { GitHubIcon } from "./icons";
import { Pipeline } from "./pipeline";
import { Reveal } from "./reveal";
import { SpotlightGrid } from "./spotlight";

function host(url?: string) {
  return url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
}

export function FeaturedBento() {
  return (
    <section id="work" className="launch-section" aria-labelledby="launch-work-h">
      <div className="launch-wrap">
        <Reveal className="launch-head">
          <span className="launch-eyebrow">01 · Featured work</span>
          <h2 id="launch-work-h" className="launch-h2">
            Three AI products. Live, open source, and built end to end.
          </h2>
          <p className="launch-lede">
            Each one shows its pipeline. Hover a stage to stop the beam and read what happens there.
          </p>
        </Reveal>

        <SpotlightGrid className="launch-bento">
          {featured.map((p, i) => {
            const anatomy = anatomies[p.slug];
            return (
              <Reveal
                key={p.slug}
                as="article"
                delay={i * 0.08}
                className={`launch-card launch-spot launch-feat is-${i}`}
                aria-labelledby={`launch-feat-${p.slug}`}
              >
                <div className="launch-feat-body">
                  <div className="launch-feat-top">
                    <span className="launch-chip launch-mono">
                      {String(i + 1).padStart(2, "0")} · {p.category ?? "AI"}
                    </span>
                    {p.liveUrl ? <span className="launch-chip is-live">Live</span> : null}
                  </div>
                  <h3 id={`launch-feat-${p.slug}`} className="launch-feat-title">
                    {p.title}
                  </h3>
                  <p className="launch-feat-tag">{p.tagline}</p>
                  <div className="launch-feat-links">
                    {p.liveUrl ? (
                      <a
                        className="launch-linkpill is-primary"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${p.title} live site, ${host(p.liveUrl)}`}
                      >
                        {host(p.liveUrl)}
                        <ArrowUpRight size={13} aria-hidden />
                      </a>
                    ) : null}
                    {p.repo ? (
                      <a
                        className="launch-linkpill"
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${p.title} source on GitHub`}
                      >
                        <GitHubIcon size={13} />
                        Source
                      </a>
                    ) : null}
                    <Link
                      className="launch-linkpill"
                      href={`/projects/${p.slug}`}
                      aria-label={`${p.title} case study`}
                    >
                      Case study
                    </Link>
                  </div>
                  {anatomy ? <Pipeline anatomy={anatomy} delay={i * 500} /> : null}
                </div>
                <div className="launch-feat-media">
                  <Image
                    src={p.image}
                    alt={`${p.title} landing page`}
                    fill
                    sizes={
                      i === 2
                        ? "(max-width: 1000px) 100vw, 600px"
                        : i === 0
                          ? "(max-width: 1000px) 100vw, 680px"
                          : "(max-width: 1000px) 100vw, 480px"
                    }
                  />
                </div>
              </Reveal>
            );
          })}
        </SpotlightGrid>
      </div>
    </section>
  );
}
