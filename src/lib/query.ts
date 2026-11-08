import { products, totalStock, onSale } from "./catalog";
import type { Product } from "./types";

export interface Filters {
  q?: string; category?: string; gender?: string; brand?: string[]; color?: string[]; size?: number[];
  min?: number; max?: number; inStock?: boolean; sort?: string; collection?: string; vault?: boolean; sale?: boolean; isNew?: boolean;
}
const tokens = (s: string) => s.toLowerCase().split(/\s+/).filter(Boolean);

export function searchScore(p: Product, q: string): number {
  const hay = `${p.name} ${p.brand} ${p.category} ${p.collection} ${p.colorways.map((c) => c.name).join(" ")} ${p.description}`.toLowerCase();
  const ts = tokens(q); if (!ts.length) return 1;
  let score = 0;
  for (const t of ts) { if (!hay.includes(t)) return 0; score += p.name.toLowerCase().includes(t) ? 3 : 1; }
  return score;
}

export function filterProducts(f: Filters, all = products): Product[] {
  let list = all.filter((p) => {
    if (f.q && searchScore(p, f.q) === 0) return false;
    if (f.category && p.category !== f.category) return false;
    if (f.gender && !(p.gender === f.gender || (p.gender === "unisex" && f.gender !== "unisex"))) return false;
    if (f.collection && p.collection !== f.collection) return false;
    if (f.vault && !p.vault) return false;
    if (f.sale && !onSale(p)) return false;
    if (f.isNew && Date.now() - new Date(p.releasedAt).getTime() > 90 * 864e5) return false;
    if (f.brand?.length && !f.brand.includes(p.brand)) return false;
    if (f.color?.length && !p.colorways.some((c) => f.color!.some((x) => c.name.toLowerCase().includes(x.toLowerCase())))) return false;
    if (f.size?.length && !p.variants.some((v) => v.stock > 0 && f.size!.includes(v.sizeUS))) return false;
    if (f.min != null && p.priceCents < f.min * 100) return false;
    if (f.max != null && p.priceCents > f.max * 100) return false;
    if (f.inStock && totalStock(p) === 0) return false;
    return true;
  });
  const by: Record<string, (a: Product, b: Product) => number> = {
    "price-asc": (a, b) => a.priceCents - b.priceCents,
    "price-desc": (a, b) => b.priceCents - a.priceCents,
    newest: (a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt),
    name: (a, b) => a.name.localeCompare(b.name),
  };
  if (f.q && (!f.sort || f.sort === "relevance")) list = list.sort((a, b) => searchScore(b, f.q!) - searchScore(a, f.q!));
  else if (f.sort && by[f.sort]) list = list.sort(by[f.sort]);
  return list;
}

export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined)) || undefined;
  const many = (k: string) => { const v = sp[k]; return v == null ? undefined : (Array.isArray(v) ? v : v.split(",")).filter(Boolean); };
  const num = (k: string) => { const v = one(k); return v && !Number.isNaN(+v) ? +v : undefined; };
  return {
    q: one("q"), category: one("category"), gender: one("gender"), collection: one("collection"),
    brand: many("brand"), color: many("color"), size: many("size")?.map(Number).filter((n) => !Number.isNaN(n)),
    min: num("min"), max: num("max"), inStock: one("stock") === "1", sort: one("sort"),
    vault: one("vault") === "1", sale: one("sale") === "1", isNew: one("new") === "1",
  };
}
