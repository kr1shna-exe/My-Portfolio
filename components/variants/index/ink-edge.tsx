"use client";

import { useEffect } from "react";

/* Every ink hover on the page moves the same way as the pull request rows:
   ink pours in from the edge the pointer crosses and drains out the edge it
   leaves by. Entering or leaving from the side counts as the top on the way
   in and the bottom on the way out, so the motion always reads downward. */
const INK = ".index-btn, .index-listing, .index-row, .index-inside-item, .index-more-btn, .index-trow";

function edge(el: HTMLElement, e: PointerEvent, entering: boolean) {
  const r = el.getBoundingClientRect();
  const d = {
    top: Math.abs(e.clientY - r.top),
    bottom: Math.abs(r.bottom - e.clientY),
    side: Math.min(Math.abs(e.clientX - r.left), Math.abs(r.right - e.clientX)),
  };
  const near = Math.min(d.top, d.bottom, d.side);
  if (near === d.top) return "top";
  if (near === d.bottom) return "bottom";
  return entering ? "top" : "bottom";
}

export function InkEdge() {
  useEffect(() => {
    const on = (entering: boolean) => (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el instanceof HTMLElement && el.matches(INK)) el.dataset.edge = edge(el, e, entering);
    };
    const enter = on(true);
    const leave = on(false);
    // pointerenter/leave don't bubble, but capture-phase listeners still see them.
    document.addEventListener("pointerenter", enter, true);
    document.addEventListener("pointerleave", leave, true);
    return () => {
      document.removeEventListener("pointerenter", enter, true);
      document.removeEventListener("pointerleave", leave, true);
    };
  }, []);
  return null;
}
