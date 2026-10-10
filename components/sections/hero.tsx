"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

const NAME = "KRISHNA";
const WIDE = 125;
const NARROW = 78;
const POINTER_RADIUS = 210;
const POINTER_WIDTH_BOOST = -26;
const POINTER_LIFT = -9;

function HeroLetter({
  letter,
  index,
  baseWidth,
  pointerX,
  staticRender,
}: {
  letter: string;
  index: number;
  baseWidth: MotionValue<number>;
  pointerX: MotionValue<number>;
  staticRender: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const center = useMotionValue(-9999);

  useEffect(() => {
    const measure = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) center.set(rect.left + rect.width / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [center]);

  const proximity = useTransform(
    [pointerX, center] as const,
    ([px, cx]: number[]) => {
      const distance = Math.abs(px - cx);
      if (distance > POINTER_RADIUS) return 0;
      const falloff = 1 - distance / POINTER_RADIUS;
      return falloff * falloff;
    }
  );
  const widthTarget = useTransform(
    [baseWidth, proximity] as const,
    ([base, p]: number[]) => base + POINTER_WIDTH_BOOST * p
  );
  const liftTarget = useTransform(proximity, (p) => POINTER_LIFT * p);
  const width = useSpring(widthTarget, { stiffness: 320, damping: 30 });
  const lift = useSpring(liftTarget, { stiffness: 320, damping: 26 });

  return (
    <span className="inline-block overflow-hidden pb-[0.06em]">
      <motion.span
        className="inline-block"
        initial={staticRender ? false : { y: "112%", filter: "blur(10px)" }}
        animate={{ y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.95,
          delay: 0.1 + index * 0.055,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.span
          ref={ref}
          className="axis-letter inline-block"
          style={
            staticRender
              ? undefined
              : ({ "--wdth": width, y: lift } as unknown as MotionStyle)
          }
        >
          {letter}
        </motion.span>
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const baseWidth = useTransform(scrollY, [0, 480], [WIDE, NARROW], {
    clamp: true,
  });
  const pointerX = useMotionValue(-9999);

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => pointerX.set(event.clientX);
    const onLeave = () => pointerX.set(-9999);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [pointerX, reduce]);

  return (
    <section
      id="top"
      className="flex min-h-[100dvh] flex-col justify-center px-5 sm:px-6"
    >
      <h1
        aria-label="Krishna"
        className="text-[clamp(2.8rem,14.5vw,16rem)] leading-[0.86] font-[780] tracking-[-0.015em] uppercase"
      >
        <span aria-hidden className="-ml-[0.04em] whitespace-nowrap">
          {NAME.split("").map((letter, index) => (
            <HeroLetter
              key={`${letter}-${index}`}
              letter={letter}
              index={index}
              baseWidth={baseWidth}
              pointerX={pointerX}
              staticRender={!!reduce}
            />
          ))}
        </span>
      </h1>
      <motion.div
        aria-hidden
        className="mt-7 h-px origin-left bg-[var(--ink)]"
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mt-5 font-mono text-[0.95rem]">
          Founding AI/ML engineer. I build AI products end to end.
        </p>
        <p className="mt-1.5 max-w-[42ch] text-[0.95rem] text-[var(--muted)]">
          Seven shipped products, most of them live.
        </p>
      </motion.div>
    </section>
  );
}
