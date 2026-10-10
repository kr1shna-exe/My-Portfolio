"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      className="launch-iconbtn"
      data-copied={copied}
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      title={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check size={16} aria-hidden /> : <Copy size={15} aria-hidden />}
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
