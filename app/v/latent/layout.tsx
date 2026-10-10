import type { Metadata, Viewport } from "next";
import { Azeret_Mono, Bricolage_Grotesque, Onest } from "next/font/google";

import "./latent.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});
const onest = Onest({ variable: "--font-onest", subsets: ["latin"] });
const azeret = Azeret_Mono({ variable: "--font-azeret", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krishna · Latent",
  description:
    "Founding AI/ML engineer. I build AI products end to end.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function LatentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-variant="latent"
      className={`latent-root ${bricolage.variable} ${onest.variable} ${azeret.variable}`}
    >
      {children}
    </div>
  );
}
