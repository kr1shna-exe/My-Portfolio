"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";

import { featured } from "@/data/site";

function host(url?: string) {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function ProductShot() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const inView = useInView(stageRef, { amount: 0.25 });

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "start 0.18"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [-30, 0]);

  const paused = hovered || touched || !inView || !!reduce;
  const project = featured[active];

  const select = (i: number, user = true) => {
    setActive((i + featured.length) % featured.length);
    if (user) setTouched(true);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = -1;
    if (e.key === "ArrowRight") next = active + 1;
    else if (e.key === "ArrowLeft") next = active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = featured.length - 1;
    if (next === -1) return;
    e.preventDefault();
    const n = (next + featured.length) % featured.length;
    select(n);
    tabRefs.current[n]?.focus();
  };

  return (
    <div className="launch-shot-stage" ref={stageRef}>
      <div className="launch-shot-glow" aria-hidden />
      <motion.div
        className="launch-shot"
        data-paused={paused}
        style={reduce ? undefined : { rotateX, scale, y }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <div className="launch-chrome">
          <div className="launch-dotsrow" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <div
            className="launch-tabs"
            role="tablist"
            aria-label="Featured products"
            onKeyDown={onKey}
          >
            {featured.map((p, i) => (
              <button
                key={p.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`launch-tab-${p.slug}`}
                aria-selected={i === active}
                aria-controls="launch-shot-panel"
                tabIndex={i === active ? 0 : -1}
                className="launch-tab"
                onClick={() => select(i)}
              >
                {p.title}
                {i === active && !touched && !reduce ? (
                  <span
                    key={`p-${active}`}
                    className="launch-tab-progress"
                    aria-hidden
                    onAnimationEnd={() => select(active + 1, false)}
                  />
                ) : null}
              </button>
            ))}
          </div>
          {project.liveUrl ? (
            <a
              className="launch-url launch-mono"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} live site`}
            >
              <Lock size={11} aria-hidden />
              <span>{host(project.liveUrl)}</span>
              <ArrowUpRight size={12} aria-hidden />
            </a>
          ) : null}
        </div>

        <div
          className="launch-viewport"
          id="launch-shot-panel"
          role="tabpanel"
          aria-labelledby={`launch-tab-${project.slug}`}
        >
          {featured.map((p, i) => (
            <motion.div
              key={p.slug}
              className="launch-viewport-layer"
              aria-hidden={i !== active}
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, scale: i === active || reduce ? 1 : 1.02 }}
              transition={{ duration: reduce ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={p.image}
                alt={i === active ? `${p.title} landing page` : ""}
                fill
                priority={i === 0}
                sizes="(max-width: 1240px) 100vw, 1180px"
              />
            </motion.div>
          ))}
          <div className="launch-shot-caption" aria-live={touched ? "polite" : "off"}>
            <b>{project.title}</b>
            <span>{project.tagline}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
