import type { Metadata } from "next";
import Link from "next/link";
import { FilterPanel } from "@/components/Filters";
import { ShopGrid } from "@/components/QuickView";
import { brands } from "@/lib/catalog";
import { filterProducts, parseFilters } from "@/lib/query";

export const metadata: Metadata = { title: "Shop sneakers" };
export default async function Shop({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const f = parseFilters(await searchParams); const items = filterProducts(f);
  const title = f.q ? `Results for “${f.q}”` : f.sale ? "Sale" : f.isNew ? "New arrivals" : f.category ? f.category[0].toUpperCase() + f.category.slice(1) : f.gender ? f.gender[0].toUpperCase() + f.gender.slice(1) : "All sneakers";
  return (<div className="wrap py-12">
    <p className="label text-mute">Shop · {items.length} pair{items.length === 1 ? "" : "s"}</p><h1 className="display mt-2 text-[clamp(2.6rem,7vw,6rem)]">{title}</h1>
    <div className="grid-cols-1 mt-10 grid gap-10 lg:grid-cols-[260px_1fr]"><div><FilterPanel f={f} brands={brands} count={items.length} /></div>
      <div>{items.length ? <ShopGrid items={items} /> : (
        <div className="border border-dashed border-black/40 p-12 text-center"><h2 className="display text-3xl">No matches</h2><p className="mx-auto mt-3 max-w-sm text-mute">{f.sale ? "There is no discounted inventory right now. Sale appears only when real markdowns exist." : "Nothing fits those filters. Loosen a filter or reset to see everything."}</p><Link href="/shop" className="btn btn-solid mt-6">Reset filters</Link></div>)}</div></div></div>);
}
