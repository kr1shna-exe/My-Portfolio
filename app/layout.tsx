import type { Metadata } from "next";
import { Archivo, Spline_Sans_Mono } from "next/font/google";

import { SmoothScroll } from "@/components/providers/smooth-scroll";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krishna",
  description: "Founding AI/ML engineer. I build AI products end to end.",
  openGraph: {
    title: "Krishna",
    description: "Founding AI/ML engineer. I build AI products end to end.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishna",
    description: "Founding AI/ML engineer. I build AI products end to end.",
  },
};

export const viewport = {
  themeColor: "#edebe7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${splineMono.variable} antialiased`}>
        <a href="#main" className="skip-link">
          skip to content
        </a>
        <SmoothScroll />
        <div
          aria-hidden
          className="grain pointer-events-none fixed inset-0 z-60 opacity-[0.05]"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMDAnIGhlaWdodD0nMjAwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC44JyBudW1PY3RhdmVzPSc0JyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI24pJyBvcGFjaXR5PScwLjI1Jy8+PC9zdmc+')",
            backgroundSize: "200px 200px",
          }}
        />
        {children}
      </body>
    </html>
  );
}
