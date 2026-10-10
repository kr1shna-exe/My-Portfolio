import { ArrowUpRight, Lock } from "lucide-react";
import Image from "next/image";

import { TradingPlaceholder } from "./trading-placeholder";

const host = (url?: string) => (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "");

/* One project per window: a neutral grey "liquid glass" browser frame.
   tone="dark" sits on black, tone="light" sits on cream. */
export function GlassFrame({
  title,
  image,
  url,
  repo,
  tone = "dark",
  sizes,
  priority,
}: {
  title: string;
  image?: string;
  url?: string;
  repo?: string;
  tone?: "dark" | "light";
  sizes: string;
  priority?: boolean;
}) {
  const href = url || repo;
  const label = url ? host(url) : repo ? host(repo) : "";
  return (
    <figure className="latent-glass" data-tone={tone}>
      <div className="latent-glass-bar">
        <span className="latent-glass-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        {href ? (
          <a
            className="latent-glass-url latent-mono"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title}${url ? " live site" : " code"}`}
            tabIndex={-1}
          >
            {url ? <Lock size={10} aria-hidden /> : null}
            <span>{label}</span>
            <ArrowUpRight size={11} aria-hidden />
          </a>
        ) : (
          <span className="latent-glass-url latent-mono">{title}</span>
        )}
      </div>
      <div className="latent-glass-view">
        {image && !image.includes("placeholder") ? (
          <Image src={image} alt={`${title} landing page`} width={1512} height={945} sizes={sizes} priority={priority} />
        ) : (
          <TradingPlaceholder />
        )}
      </div>
    </figure>
  );
}
