"use client";

import { ArrowUpRight, Check, Copy, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { site } from "@/data/site";

import { PaletteButton } from "./palette";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className="trace-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
        } catch {
          window.location.href = `mailto:${site.email}`;
        }
      }}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      <span>{copied ? "copied" : "copy"}</span>
      <span className="trace-sr" aria-live="polite">
        {copied ? "Email copied" : ""}
      </span>
    </button>
  );
}

export function Contact() {
  return (
    <div className="trace-ct">
      <PaletteButton className="trace-ct-cmd" label="Open command palette">
        <Search size={18} aria-hidden />
        <span className="trace-ct-cmd-text">Type a command: copy email, open GitHub, jump to…</span>
      </PaletteButton>

      <div className="trace-ct-grid">
        <div className="trace-ct-cell trace-ct-mail">
          <span className="trace-dimlabel">email · fastest</span>
          <a href={`mailto:${site.email}`} className="trace-ct-email">
            {site.email}
          </a>
          <CopyEmail />
        </div>
        {site.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="trace-ct-cell trace-ct-social">
            <span className="trace-dimlabel">{s.label.toLowerCase()}</span>
            <span className="trace-ct-handle">
              {s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").split("/").pop()}
            </span>
            <ArrowUpRight size={16} aria-hidden className="trace-ct-arrow" />
            <span className="trace-sr"> on {s.label} (opens in a new tab)</span>
          </a>
        ))}
      </div>

    </div>
  );
}
