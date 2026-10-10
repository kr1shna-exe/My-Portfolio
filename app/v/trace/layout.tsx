import type { Metadata, Viewport } from "next";
import { Martian_Mono, Schibsted_Grotesk } from "next/font/google";

import "./trace.css";

const mono = Martian_Mono({
  variable: "--font-trace-mono",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const sans = Schibsted_Grotesk({
  variable: "--font-trace-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krishna · Trace",
  description:
    "Founding AI/ML engineer. A portfolio you can question: every project rendered as the trace of its own pipeline.",
};

export const viewport: Viewport = {
  themeColor: "#0d1220",
};

export default function TraceLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${mono.variable} ${sans.variable}`}>{children}</div>;
}
