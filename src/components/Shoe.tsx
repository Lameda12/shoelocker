import type { Colorway, Silhouette } from "@/lib/types";

export type ShoeView = "side" | "detail" | "sole";

/**
 * Original procedural sneaker illustration. These are vector renderings of fictional demo
 * products, not photographs and not 3D models. See docs/ASSETS.md.
 */
const UPPER: Record<Silhouette, string> = {
  low: "M100 292C96 240 98 190 128 172L215 160C240 158 262 140 290 118L330 100L350 112C372 160 420 190 480 205C560 225 650 225 710 262C740 280 748 290 748 292Z",
  high: "M100 292C92 200 94 110 124 76L224 64C252 64 272 58 298 50L340 40L358 90C380 150 420 190 480 205C560 225 650 225 710 262C740 280 748 290 748 292Z",
  runner: "M96 296C92 250 100 200 132 180L214 168C242 166 262 148 292 126L326 110L346 124C372 168 420 192 480 206C566 222 650 226 716 262C744 280 752 292 752 296Z",
};
const SOLE: Record<Silhouette, string> = {
  low: "M88 290L88 322Q88 342 120 342L688 342Q744 342 750 306L750 290Z",
  high: "M88 290L88 322Q88 342 120 342L688 342Q744 342 750 306L750 290Z",
  runner: "M80 294L80 338Q80 362 118 362L696 362Q754 362 760 320L760 296Q700 282 640 300L120 300Z",
};

export function Shoe({ colorway, silhouette, view = "side", title, className = "", priority }: {
  colorway: Colorway; silhouette: Silhouette; view?: ShoeView; title: string; className?: string; priority?: boolean;
}) {
  const id = `${colorway.id}-${silhouette}-${view}`;
  const vb = view === "detail" ? "380 80 420 280" : "0 0 840 420";
  return (
    <svg viewBox={vb} role="img" aria-label={title} className={className} data-priority={priority ? "true" : undefined} preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id={`g-${id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#fff" strokeOpacity=".07" strokeWidth="2" />
        </pattern>
        <linearGradient id={`s-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>
      {view === "sole" ? (
        <g>
          <ellipse cx="420" cy="215" rx="300" ry="86" fill={colorway.sole} stroke="#00000055" strokeWidth="3" transform="rotate(-8 420 215)" />
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1={190 + i * 28} y1="150" x2={170 + i * 28} y2="290" stroke={colorway.accent} strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
          ))}
          <ellipse cx="420" cy="215" rx="300" ry="86" fill="none" stroke={colorway.upper} strokeOpacity=".35" strokeWidth="10" transform="rotate(-8 420 215)" />
        </g>
      ) : (
        <g>
          <ellipse cx="430" cy="372" rx="330" ry="14" fill="#000" opacity=".22" />
          <path d={SOLE[silhouette]} fill={colorway.sole} stroke="#00000044" strokeWidth="2" />
          <path d={SOLE[silhouette]} fill={`url(#s-${id})`} />
          <path d={UPPER[silhouette]} fill={colorway.upper} />
          <path d={UPPER[silhouette]} fill={`url(#g-${id})`} />
          <path d="M560 214C640 222 700 240 748 292L600 292C600 260 590 232 560 214Z" fill={colorway.panel} />
          <path d="M100 292C96 240 98 190 128 172L172 166C166 210 170 260 176 292Z" fill={colorway.panel} />
          <path d="M250 292L330 200L400 215L360 292Z" fill={colorway.panel} stroke={colorway.accent} strokeWidth="3" />
          {Array.from({ length: 5 }, (_, i) => {
            const t = i / 4, x = 336 + t * 140, y = 108 + t * 92;
            return <line key={i} x1={x} y1={y} x2={x - 34} y2={y + 30} stroke={colorway.lace} strokeWidth="7" strokeLinecap="round" />;
          })}
          <path d={UPPER[silhouette]} fill={`url(#s-${id})`} opacity=".35" />
          <path d={UPPER[silhouette]} fill="none" stroke="#00000033" strokeWidth="2" />
          <path d="M100 292L748 292" stroke={colorway.accent} strokeWidth="3" strokeOpacity=".7" />
        </g>
      )}
    </svg>
  );
}
