/* Designed stand-in for the Trading Platform, which has no screenshot.
   Deterministic candles so server and client render the same SVG. */
const CANDLES = (() => {
  let v = 40;
  let s = 7;
  const out: { o: number; c: number; h: number; l: number }[] = [];
  for (let i = 0; i < 28; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const o = v;
    const c = Math.max(12, Math.min(70, v + (r - 0.46) * 14));
    out.push({ o, c, h: Math.max(o, c) + 2 + r * 4, l: Math.min(o, c) - 2 - (1 - r) * 4 });
    v = c;
  }
  return out;
})();

export function TradingPlaceholder() {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a candlestick chart: Trading Platform has no screenshot yet">
      <rect width="160" height="100" fill="#0e1440" />
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="0" x2="160" y1={y} y2={y} stroke="rgba(245,243,236,.08)" strokeWidth=".4" />
      ))}
      {CANDLES.map((k, i) => {
        const x = 8 + i * 5.2;
        const up = k.c >= k.o;
        const col = up ? "#6fe3b5" : "#ff9fc0";
        const y = (n: number) => 92 - n;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} stroke={col} strokeWidth=".5" />
            <rect x={x - 1.5} width="3" y={y(Math.max(k.o, k.c))} height={Math.max(0.8, Math.abs(k.c - k.o))} fill={col} />
          </g>
        );
      })}
      <text x="8" y="96" fill="#f5f3ec" fontSize="3.6" fontFamily="var(--font-azeret), monospace" opacity=".8">
        TRADING PLATFORM · no screenshot yet
      </text>
    </svg>
  );
}
