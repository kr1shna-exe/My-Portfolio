import type { Metadata } from "next";
import Link from "next/link";

import { VARIANTS } from "@/data/site";

export const metadata: Metadata = {
  title: "Redesign variants · Krishna",
  robots: { index: false },
};

/* Comparison hub for the redesign variants. Not linked from the live
   homepage; delete app/v once a direction is chosen and promoted. */
export default function VariantsHub() {
  return (
    <main
      id="main"
      data-variant="hub"
      className="min-h-[100dvh] bg-[#0b0b0f] px-5 py-16 text-white sm:px-10"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono text-xs tracking-[0.12em] text-white/50 uppercase">
          Portfolio redesign · Oct 2026
        </p>
        <h1 className="mt-4 max-w-[18ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] font-[700] tracking-[-0.03em]">
          Four directions. Pick the one that feels like you.
        </h1>
        <p className="mt-5 max-w-[56ch] text-white/60">
          Each one is a full page with the same real content. Use the pill at
          the bottom of any variant to hop between them, or go back to the
          current site to compare.
        </p>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2">
          {VARIANTS.map((v, i) => (
            <li key={v.slug}>
              <Link
                href={`/v/${v.slug}`}
                className="group block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
              >
                <span className="font-mono text-xs text-white/40">
                  0{i + 1}
                </span>
                <h2 className="mt-3 text-3xl font-[650] tracking-[-0.02em]">
                  {v.name}
                  <span
                    aria-hidden
                    className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </h2>
                <p className="mt-2 text-white/80">{v.pitch}</p>
                <p className="mt-4 font-mono text-xs text-white/45">{v.feel}</p>
              </Link>
            </li>
          ))}
        </ol>
        <Link
          href="/"
          className="mt-10 inline-block font-mono text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
        >
          ← current site, unchanged
        </Link>
      </div>
    </main>
  );
}
