/* Meaning-axis nudge: the external-link arrow travels 1px along its own
   diagonal on hover. Fast in, slower out. Parent link needs `group`. */
export function ArrowGlyph() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-[250ms] group-hover:-translate-y-px group-hover:translate-x-px group-hover:duration-150 motion-reduce:transition-none"
    >
      ↗
    </span>
  );
}
