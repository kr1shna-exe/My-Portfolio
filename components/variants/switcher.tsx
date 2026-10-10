import Link from "next/link";

import { VARIANTS } from "@/data/site";
import { cn } from "@/lib/utils";

/* Floating pill for hopping between redesign variants while comparing.
   Deliberately neutral (dark glass) so it sits on top of every theme. */
export function VariantSwitcher({ current }: { current: string }) {
  return (
    <nav
      aria-label="Redesign variants"
      className="fixed bottom-4 left-1/2 z-[90] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border border-white/15 bg-[#0b0b0f]/80 p-1 text-[12px] text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl [font-family:ui-sans-serif,system-ui,sans-serif] [scrollbar-width:none]"
    >
      <Link
        href="/v"
        className="shrink-0 rounded-full px-3 py-1.5 text-white/60 transition-colors hover:text-white"
      >
        All
      </Link>
      {VARIANTS.map((v) => (
        <Link
          key={v.slug}
          href={`/v/${v.slug}`}
          aria-current={current === v.slug ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 transition-colors",
            current === v.slug
              ? "bg-white text-black"
              : "text-white/75 hover:bg-white/10 hover:text-white"
          )}
        >
          {v.name}
        </Link>
      ))}
      <Link
        href="/"
        className="shrink-0 rounded-full px-3 py-1.5 text-white/60 transition-colors hover:text-white"
      >
        Current
      </Link>
    </nav>
  );
}
