import { cn } from "@/lib/utils";

export function hostOf(url?: string) {
  return url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
}

/* One shared browser window for every screenshot on the page: grey
   translucent glass, three neutral dots, the project's address. One project
   per window. `size="mini"` drops the address bar to just the dots for
   thumbnails; `tone="dark"` is the same glass on an ink ground. */
export function GlassFrame({
  url,
  label,
  size = "full",
  tone = "light",
  className,
  children,
}: {
  url?: string;
  label: string;
  size?: "full" | "mini";
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "index-glass",
        size === "mini" && "index-glass-mini",
        tone === "dark" && "index-glass-dark",
        className
      )}
    >
      <div className="index-glass-bar" aria-hidden>
        <span className="index-glass-dots">
          <i />
          <i />
          <i />
        </span>
        {size === "full" && <span className="index-glass-url">{hostOf(url) || label}</span>}
      </div>
      <div className="index-glass-view">{children}</div>
    </div>
  );
}
