import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-center px-5 sm:px-6">
      <p className="font-mono text-[0.8rem] text-[var(--muted)]">404</p>
      <h1 className="mt-2 text-[clamp(2.4rem,9vw,8rem)] leading-[0.9] font-[760] tracking-[-0.015em] uppercase">
        Not in this edition
      </h1>
      <div aria-hidden className="mt-6 h-px w-full bg-[var(--ink)]" />
      <p className="mt-5 max-w-[48ch] text-[var(--muted)]">
        The page you asked for is not printed here. The index has everything
        that is.
      </p>
      <Link
        href="/"
        className="mt-6 w-fit border-b pb-px font-mono text-[0.85rem] transition-colors duration-200 hover:text-[var(--muted)]"
      >
        ← back to the index
      </Link>
    </main>
  );
}
