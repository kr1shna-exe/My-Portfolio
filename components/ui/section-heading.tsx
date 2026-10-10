"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const headingVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, delay: 0.12, ease: [0.25, 1, 0.5, 1] },
  },
};

/* Section headings set themselves once: the text rises through a mask and
   a hairline rule draws in underneath, like a broadsheet being ruled.
   The whileInView trigger lives on the wrapper, not the masked child: a
   child hidden outside its clip box has zero intersection and would never
   fire its own reveal. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="mb-8"
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5, margin: "0px 0px -15% 0px" }}
    >
      <div className="overflow-hidden">
        <motion.h2
          variants={headingVariants}
          className="text-[1.6rem] font-[640] tracking-[-0.01em]"
        >
          {children}
        </motion.h2>
      </div>
      <motion.div
        aria-hidden
        variants={ruleVariants}
        className="mt-4 h-px origin-left bg-[var(--line)]"
      />
    </motion.div>
  );
}
