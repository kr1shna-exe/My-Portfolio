"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Blur-only reveal for media: the image resolves into focus once, like a
   print developing. No translation, media only, never text. */
export function MediaReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0.5, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
