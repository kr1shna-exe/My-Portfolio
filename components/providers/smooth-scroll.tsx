"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({ lerp: 0.115, anchors: true });

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  // Next's built-in hash scroll races client-rendered layout (the sticky
  // sheets) and loses, so land on the hash target ourselves after CLIENT
  // navigations, with one retry once layout has settled. On initial load
  // and refresh we do nothing: the browser's own scroll restoration should
  // put the visitor back exactly where they were, and a stale hash in the
  // URL must not override that.
  const pathname = usePathname();
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    const land = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const raf = requestAnimationFrame(land);
    const retry = setTimeout(land, 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(retry);
    };
  }, [pathname]);

  return null;
}
