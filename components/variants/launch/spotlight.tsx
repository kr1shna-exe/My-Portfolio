"use client";

import { useRef, type ReactNode } from "react";

/* One pointer listener for the whole grid: every card's border picks up the
   cursor glow, so light bleeds across neighbours like on Linear's bento. */
export function SpotlightGrid({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "ul";
}) {
  const ref = useRef<HTMLDivElement & HTMLUListElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const x = e.clientX;
    const y = e.clientY;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const root = ref.current;
      if (!root) return;
      root.querySelectorAll<HTMLElement>(".launch-spot").forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${x - r.left}px`);
        card.style.setProperty("--my", `${y - r.top}px`);
      });
    });
  };

  return (
    <Tag ref={ref} className={`launch-spotgrid ${className ?? ""}`} onPointerMove={onMove}>
      {children}
    </Tag>
  );
}
