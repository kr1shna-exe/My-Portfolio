/* The trading platform has no public screenshot, so it gets a set plate:
   an ink panel with a typeset candlestick strip. Purely illustrative; the
   candles are a fixed decorative pattern, not market data. */
const CANDLES = [
  [40, 62, 46, 58], [52, 70, 56, 66], [60, 74, 64, 61], [48, 66, 60, 52],
  [44, 58, 50, 55], [50, 72, 54, 69], [62, 84, 68, 80], [70, 88, 78, 74],
  [64, 80, 72, 68], [60, 76, 66, 73], [68, 92, 72, 88], [80, 98, 86, 94],
  [84, 100, 92, 87], [78, 94, 86, 90], [82, 104, 88, 101], [90, 110, 98, 96],
];

export function TradingPlate({ compact = false }: { compact?: boolean }) {
  return (
    <div className="index-plate" role="img" aria-label="Trading Platform, illustrative plate">
      <svg viewBox="0 0 320 200" preserveAspectRatio="none" className="index-plate-svg" aria-hidden>
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} className="index-plate-grid" />
        ))}
        {CANDLES.map(([lo, hi, open, close], i) => {
          const x = 14 + i * 19;
          const y = (v: number) => 190 - v * 1.6;
          const up = close >= open;
          return (
            <g key={i} className={up ? "index-plate-up" : "index-plate-down"}>
              <line x1={x + 5} x2={x + 5} y1={y(hi)} y2={y(lo)} />
              <rect x={x} width="10" y={y(Math.max(open, close))} height={Math.max(2, Math.abs(close - open) * 1.6)} />
            </g>
          );
        })}
      </svg>
      {!compact && (
        <div className="index-plate-cap">
          <span>Trading Platform</span>
        </div>
      )}
    </div>
  );
}
