"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { anatomies, featured, isLive, pad } from "./data";
import { GlassFrame } from "./glass-frame";
import { InView } from "./in-view";

const STICKY_QUERY = "(min-width: 1024px) and (min-height: 720px)";

function useStickySheets() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(STICKY_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(STICKY_QUERY).matches,
    () => false
  );
}

type P = (typeof featured)[number];

function Pipeline({ slug }: { slug: string }) {
  const a = anatomies[slug];
  if (!a) return null;
  return (
    <InView as="figure" className="index-pipe" amount={0.2}>
      <figcaption className="index-pipe-cap">
        <span>How it works</span>
      </figcaption>
      <ol className="index-pipe-list">
        {a.stages.map((s, i) => (
          <li key={s.name} className="index-pipe-stage" style={{ "--i": i } as React.CSSProperties}>
            <span className="index-pipe-rule" aria-hidden>
              {i < a.stages.length - 1 && <span className="index-pipe-arrow">→</span>}
            </span>
            <span className="index-pipe-n">{pad(i + 1)}</span>
            <span className="index-pipe-name">{s.name}</span>
            <span className="index-pipe-desc">{s.desc}</span>
          </li>
        ))}
      </ol>
    </InView>
  );
}

function Sheet({
  p,
  i,
  ownRef,
  nextRef,
  sticky,
}: {
  p: P;
  i: number;
  ownRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null> | null;
  sticky: boolean;
}) {
  const reduce = useReducedMotion();
  const last = nextRef === null;
  const { scrollYProgress: cover } = useScroll({
    target: nextRef ?? ownRef,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(cover, (v) => (last ? 1 : 1 - 0.05 * v));
  const veil = useTransform(cover, (v) => (last ? 0 : 0.6 * v));
  const animate = sticky && !reduce;
  const dark = i === 1;

  return (
    <motion.section
      ref={ownRef as RefObject<HTMLElement>}
      id={`sheet-${p.slug}`}
      aria-labelledby={`sheet-${p.slug}-title`}
      className={cn("index-sheet", dark && "index-sheet-ink", sticky && "is-sticky")}
      style={animate ? { scale } : undefined}
    >
      <div className="index-sheet-inner">
        <div className="index-sheet-bar">
          <span>
            {pad(i + 1)} / {pad(featured.length)}
          </span>
          <span>
            {isLive(p) ? (
              <>
                <i className="index-live-dot" aria-hidden /> Live
              </>
            ) : (
              p.status
            )}
          </span>
        </div>

        <div className="index-sheet-grid">
          <div className="index-sheet-copy">
            <h3 id={`sheet-${p.slug}-title`} className="index-sheet-title">
              {p.title}
            </h3>
            <p className="index-sheet-tag">{p.tagline}</p>
            <p className="index-sheet-tech">{p.tech.join(" · ")}</p>
            <div className="index-sheet-links">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="index-btn index-btn-inv">
                  Visit live <span aria-hidden>↗</span>
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="index-btn">
                  Source <span aria-hidden>↗</span>
                </a>
              )}
              <Link href={`/projects/${p.slug}`} className="index-ul index-sheet-case">
                Case study <span aria-hidden>→</span>
              </Link>
            </div>
            <span className="index-sheet-num" aria-hidden>
              {pad(i + 1)}
            </span>
          </div>
          <a
            href={p.liveUrl ?? `/projects/${p.slug}`}
            target={p.liveUrl ? "_blank" : undefined}
            rel={p.liveUrl ? "noreferrer" : undefined}
            className="index-sheet-shot"
            aria-label={`${p.title}, open the live site`}
          >
            <GlassFrame url={p.liveUrl} label={p.title} tone={dark ? "dark" : "light"}>
              <Image
                src={p.image}
                alt={`${p.title} landing page`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="index-cover"
              />
            </GlassFrame>
          </a>
        </div>

        <Pipeline slug={p.slug} />
      </div>
      {animate && <motion.div aria-hidden className="index-sheet-veil" style={{ opacity: veil }} />}
    </motion.section>
  );
}

export function FeatureSheets() {
  const sticky = useStickySheets();
  const r0 = useRef<HTMLElement>(null);
  const r1 = useRef<HTMLElement>(null);
  const r2 = useRef<HTMLElement>(null);
  const refs = [r0, r1, r2];
  return (
    <div className="index-sheets">
      {featured.map((p, i) => (
        <Sheet
          key={p.slug}
          p={p}
          i={i}
          sticky={sticky}
          ownRef={refs[i]}
          nextRef={i < featured.length - 1 ? refs[i + 1] : null}
        />
      ))}
    </div>
  );
}
