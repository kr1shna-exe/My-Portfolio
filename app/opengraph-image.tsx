import { ImageResponse } from "next/og";

export const alt = "Krishna, founding AI/ML engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori needs TTF/OTF/WOFF (not woff2). Requesting the Google Fonts CSS
// with a legacy user agent returns truetype sources we can fetch directly.
async function loadArchivo(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Archivo:wght@800&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } }
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const archivo = await loadArchivo();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#EDEBE7",
          color: "#17150F",
          padding: "80px",
          fontFamily: archivo ? "Archivo" : "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            lineHeight: 0.9,
          }}
        >
          Krishna
        </div>
        <div
          style={{
            height: 3,
            background: "#17150F",
            margin: "36px 0 28px",
          }}
        />
        <div style={{ fontSize: 34, color: "#6E6A61" }}>
          Founding AI/ML engineer. I build AI products end to end.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: archivo
        ? [{ name: "Archivo", data: archivo, weight: 800, style: "normal" }]
        : undefined,
    }
  );
}
