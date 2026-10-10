"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "./data";

/* The address is the headline. Each character is its own span so a
   compression wave can run through it on hover; the two lines are fitted
   to the measure with container-query units, so nothing is measured in JS. */
function Wave({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span key={i} className="index-wave" style={{ "--i": i + offset } as React.CSSProperties}>
          {c}
        </span>
      ))}
    </>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const [user, domain] = site.email.split("@");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <div className="index-contact">
      <p className="index-contact-lede">Have something worth building? Write to me.</p>
      <a href={`mailto:${site.email}`} className="index-email" aria-label={`Email ${site.email}`}>
        <span className="index-email-l1" aria-hidden>
          <Wave text={user} />
        </span>
        <span className="index-email-l2" aria-hidden>
          <span>
            <Wave text={`@${domain}`} offset={user.length} />
          </span>
          <span className="index-email-arrow">↗</span>
        </span>
      </a>
      <div className="index-contact-row">
        <button type="button" onClick={copy} className="index-btn index-btn-inv">
          {copied ? "Copied to clipboard" : "Copy address"}
        </button>
        <span className="index-sr" aria-live="polite">
          {copied ? "Email address copied" : ""}
        </span>
        <ul className="index-socials">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="index-ul">
                {s.label}
                <span aria-hidden> ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
