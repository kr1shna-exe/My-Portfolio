import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { site } from "@/data/site";

import "./launch.css";

const sans = Geist({ variable: "--launch-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--launch-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--launch-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: "Krishna · Founding AI/ML engineer",
  description: site.headline,
};

export const viewport: Viewport = {
  themeColor: "#07070a",
};

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${sans.variable} ${mono.variable} ${serif.variable}`} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
