"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/* Adds `is-in` once the element scrolls into view. Every reveal in this
   variant is a CSS transition keyed off that class, so reduced motion is a
   single media query in the stylesheet. */
export function InView({
  as: Tag = "div",
  className,
  children,
  amount = 0.25,
  id,
}: {
  as?: "div" | "section" | "header" | "ol" | "figure";
  className?: string;
  children: React.ReactNode;
  amount?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <Tag
      ref={ref as React.RefObject<never>}
      id={id}
      className={cn(className, inView && "is-in")}
    >
      {children}
    </Tag>
  );
}

/** Section heading: a heavy rule with an optional one-line fact, then a
    poster-scale title whose width axis opens as it arrives. */
export function SectionHead({
  title,
  aside,
  id,
  tone,
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  id: string;
  tone?: "ink";
}) {
  return (
    <InView as="header" className={cn("index-shead", tone === "ink" && "index-shead-ink")}>
      <div className="index-shead-bar">{aside && <span className="index-shead-aside">{aside}</span>}</div>
      <h2 id={id} className="index-shead-title">
        {title}
      </h2>
    </InView>
  );
}
