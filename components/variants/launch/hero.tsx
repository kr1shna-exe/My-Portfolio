"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { contributionStats } from "@/data/open-source";
import { site } from "@/data/site";

import { GitHubIcon } from "./icons";
import { ProductShot } from "./product-shot";

const ACCENT = new Set(["real", "work"]);
const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const words = site.headline.split(" ");
  const github = site.socials.find((s) => s.label === "GitHub")!;

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  const lastWordDelay = 0.2 + words.length * 0.05;

  return (
    <section className="launch-hero" aria-labelledby="launch-h1">
      <div className="launch-wrap">
        <motion.div {...fade(0.05)}>
          <a
            className="launch-announce"
            href={site.company.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="launch-announce-tag">
              <span className="launch-livedot" aria-hidden />
              Now
            </span>
            <span className="launch-announce-text">
              {site.role} at {site.company.name}
            </span>
            <ArrowRight size={14} aria-hidden />
          </a>
        </motion.div>

        <h1 id="launch-h1" className="launch-h1">
          {words.map((w, i) => {
            const accent = ACCENT.has(w.replace(/[^a-z]/gi, "").toLowerCase());
            return (
              <span key={i}>
                <motion.span
                  className={accent ? "launch-word is-accent" : "launch-word"}
                  initial={reduce ? false : { opacity: 0, y: "0.4em", filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: EASE }}
                >
                  {w}
                </motion.span>
                {i < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </h1>

        <motion.p className="launch-sub" {...fade(lastWordDelay)}>
          {site.subline}
        </motion.p>

        <motion.div className="launch-ctas" {...fade(lastWordDelay + 0.1)}>
          <a href="#work" className="launch-btn launch-btn-primary">
            See the work
            <ArrowRight size={16} className="launch-nudge" aria-hidden />
          </a>
          <a
            href={github.href}
            target="_blank"
            rel="noreferrer"
            className="launch-btn launch-btn-ghost"
          >
            <GitHubIcon />
            GitHub
          </a>
        </motion.div>

        <motion.dl className="launch-stats" {...fade(lastWordDelay + 0.2)}>
          {site.stats.map((s) => (
            <div key={s.label} className="launch-stat">
              <dt className="launch-stat-label">{s.label}</dt>
              <dd className="launch-stat-value">{s.value}</dd>
            </div>
          ))}
          <div className="launch-stat launch-stat-link">
            <dt className="launch-stat-label">PRs merged upstream</dt>
            <dd className="launch-stat-value">
              <a href="#open-source" aria-label={`${contributionStats.merged} pull requests merged upstream, see the changelog`}>
                {contributionStats.merged}
                <ArrowRight size={15} aria-hidden />
              </a>
            </dd>
          </div>
        </motion.dl>

        <ProductShot />
      </div>
    </section>
  );
}
