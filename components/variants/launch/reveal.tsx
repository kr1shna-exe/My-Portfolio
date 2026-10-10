"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const TAGS = {
  div: motion.div,
  article: motion.article,
  li: motion.li,
  section: motion.section,
} as const;

export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: keyof typeof TAGS;
  delay?: number;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
