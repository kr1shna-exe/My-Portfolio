"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  AtSign,
  Copy,
  CornerDownLeft,
  Hash,
  MessageSquareText,
  Search,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { showcase, site } from "@/data/site";

import { ANSWERS } from "./ask-data";
import { SECTIONS } from "./meta";

type Ctx = { open: () => void; isMac: boolean };
const PaletteCtx = createContext<Ctx>({ open: () => {}, isMac: true });
export const usePalette = () => useContext(PaletteCtx);

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: "copy" | "link" | "jump" | "ask" | "mail";
  run: () => void | Promise<void>;
  /** Keeps the palette open after running (used for copy feedback). */
  stay?: boolean;
};

function scrollToId(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "top") window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}

const ICONS = {
  copy: Copy,
  link: ArrowUpRight,
  jump: Hash,
  ask: MessageSquareText,
  mail: AtSign,
};

const subscribeNoop = () => () => {};

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const isMac = useIsMac();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const listId = useId();

  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setCopied(false);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => returnFocus.current?.focus?.(), 0);
  }, []);

  const items = useMemo<Item[]>(() => {
    const ext = (href: string) => () => {
      window.open(href, "_blank", "noopener,noreferrer");
    };
    return [
      {
        id: "copy-email",
        group: "Contact",
        label: "Copy email address",
        hint: site.email,
        icon: "copy",
        stay: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setCopied(true);
          } catch {
            window.location.href = `mailto:${site.email}`;
          }
        },
      },
      {
        id: "mail",
        group: "Contact",
        label: "Write an email",
        hint: "mailto",
        icon: "mail",
        run: () => {
          window.location.href = `mailto:${site.email}`;
        },
      },
      ...site.socials.map<Item>((s) => ({
        id: `social-${s.label}`,
        group: "Contact",
        label: `Open ${s.label}`,
        hint: s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
        icon: "link",
        run: ext(s.href),
      })),
      { id: "jump-top", group: "Jump to", label: "Top", hint: "hero", icon: "jump", run: () => scrollToId("top") },
      ...SECTIONS.map<Item>((s) => ({
        id: `jump-${s.id}`,
        group: "Jump to",
        label: s.title,
        hint: `#${s.id}`,
        icon: "jump",
        run: () => scrollToId(s.id),
      })),
      ...["shipped", "agents", "oss", "codeboss", "memora", "now"]
        .map((id) => ANSWERS.find((a) => a.id === id)!)
        .map<Item>((a) => ({
        id: `ask-${a.id}`,
        group: "Ask",
        label: a.question,
        hint: "replay",
        icon: "ask",
        run: () => {
          scrollToId("top");
          window.dispatchEvent(new CustomEvent("trace:ask", { detail: a.id }));
        },
      })),
      ...showcase
        .filter((p) => p.liveUrl)
        .map<Item>((p) => ({
          id: `live-${p.slug}`,
          group: "Open a product",
          label: p.title,
          hint: p.liveUrl!.replace(/^https?:\/\//, ""),
          icon: "link",
          run: ext(p.liveUrl!),
        })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const words = q.split(/\s+/);
    return items.filter((it) => {
      const hay = `${it.group} ${it.label} ${it.hint ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, query]);

  const activeIndex = Math.min(active, Math.max(0, filtered.length - 1));

  const runItem = async (it: Item) => {
    await it.run();
    if (!it.stay) close();
  };

  // Global shortcut.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (isOpen) close();
      else open();
    }
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      html.style.overflow = prev;
    };
  }, [isOpen]);

  // Keep the active option in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (Math.min(a, filtered.length - 1) + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(
        (a) => (Math.min(a, filtered.length - 1) - 1 + filtered.length) % Math.max(1, filtered.length)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = filtered[activeIndex];
      if (it) void runItem(it);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // Single focus stop inside the dialog: keep focus on the input.
      e.preventDefault();
    }
  };

  let lastGroup = "";
  const ctx = useMemo(() => ({ open, isMac }), [open, isMac]);

  return (
    <PaletteCtx.Provider value={ctx}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="trace-pal-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="trace-pal"
              data-lenis-prevent
              initial={reduce ? false : { opacity: 0, y: -10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="trace-pal-head">
                <Search size={15} aria-hidden />
                <input
                  ref={inputRef}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={
                    filtered[activeIndex] ? `${listId}-${filtered[activeIndex].id}` : undefined
                  }
                  aria-autocomplete="list"
                  aria-label="Type a command"
                  placeholder="Type a command or jump to…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKey}
                  spellCheck={false}
                  autoComplete="off"
                />
                <kbd className="trace-kbd">esc</kbd>
              </div>
              <div className="trace-pal-list" id={listId} role="listbox" ref={listRef} aria-label="Commands">
                {filtered.length === 0 && (
                  <p className="trace-pal-empty">No command matches “{query}”.</p>
                )}
                {filtered.map((it, i) => {
                  const Icon = ICONS[it.icon];
                  const header = it.group !== lastGroup ? it.group : null;
                  lastGroup = it.group;
                  const isCopy = it.id === "copy-email" && copied;
                  return (
                    <div key={it.id} role="presentation">
                      {header && (
                        <div className="trace-pal-group" role="presentation">
                          {header}
                        </div>
                      )}
                      <div
                        id={`${listId}-${it.id}`}
                        role="option"
                        aria-selected={i === activeIndex}
                        data-index={i}
                        className="trace-pal-item"
                        onMouseMove={() => i !== activeIndex && setActive(i)}
                        onClick={() => void runItem(it)}
                      >
                        <Icon size={14} aria-hidden className="trace-pal-icon" />
                        <span className="trace-pal-label">{isCopy ? "Copied to clipboard" : it.label}</span>
                        {it.hint && <span className="trace-pal-hint">{isCopy ? "✓" : it.hint}</span>}
                        <CornerDownLeft size={12} aria-hidden className="trace-pal-enter" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="trace-pal-foot" aria-hidden>
                <span>
                  <kbd className="trace-kbd">↑</kbd>
                  <kbd className="trace-kbd">↓</kbd> navigate
                </span>
                <span>
                  <kbd className="trace-kbd">↵</kbd> run
                </span>
                <span className="trace-pal-count trace-num">{filtered.length} commands</span>
              </div>
              <p className="trace-sr" aria-live="polite">
                {copied ? "Email copied to clipboard" : ""}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaletteCtx.Provider>
  );
}

/** Platform read after hydration; the server snapshot assumes Mac. */
function useIsMac() {
  return useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true
  );
}

export function PaletteButton({
  className,
  children,
  label = "Open command palette",
}: {
  className?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  const { open, isMac } = usePalette();
  return (
    <button type="button" className={className} onClick={open} aria-label={label} aria-haspopup="dialog">
      {children}
      <kbd className="trace-kbd">{isMac ? "⌘" : "Ctrl"}</kbd>
      <kbd className="trace-kbd">K</kbd>
    </button>
  );
}
