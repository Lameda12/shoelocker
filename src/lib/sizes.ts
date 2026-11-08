/**
 * Size conversion for adult sneakers, men's US as the base scale.
 * Source: generic industry conversion convention (US men's = UK + 1 = EU - 33 approx.,
 * women's US = men's US + 1.5). Brands differ by up to a half size; always defer to the
 * per-product size guide. Verify against manufacturer charts before commercial launch.
 */
export type Region = "US" | "UK" | "EU";
export const SIZE_SOURCE_NOTE =
  "Approximate industry convention (US men's base). Brand lasts vary by up to half a size. Not a fit guarantee.";

const round = (n: number, step: number) => Math.round(n / step) * step;

export function convertFromUS(sizeUS: number, to: Region): number {
  if (to === "US") return sizeUS;
  if (to === "UK") return round(sizeUS - 0.5, 0.5);
  return round(sizeUS + 33, 0.5);
}
export function toUS(size: number, from: Region): number {
  if (from === "US") return size;
  if (from === "UK") return round(size + 0.5, 0.5);
  return round(size - 33, 0.5);
}
export const womensUS = (mensUS: number) => mensUS + 1.5;
export const SIZE_CHART = Array.from({ length: 15 }, (_, i) => 6 + i * 0.5).map((us) => ({
  US: us, UK: convertFromUS(us, "UK"), EU: convertFromUS(us, "EU"), cm: us + 18,
}));
