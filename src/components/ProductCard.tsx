"use client";
import Link from "next/link";
import { Shoe } from "./Shoe";
import { formatCAD } from "@/lib/money";
import { isUpcoming, onSale, totalStock } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { useStore } from "./Providers";

export function Status({ p }: { p: Product }) {
  if (isUpcoming(p)) return <span className="label">Upcoming · {new Date(p.releaseAt!).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}</span>;
  if (totalStock(p) === 0) return <span className="label text-mute">Sold out</span>;
  if (totalStock(p) <= 6) return <span className="label">Low stock · {totalStock(p)} left</span>;
  return <span className="label text-mute">In stock</span>;
}

export function ProductCard({ p, dark, onQuick, tall }: { p: Product; dark?: boolean; onQuick?: (p: Product) => void; tall?: boolean }) {
  const { wishlist, toggleWish, compare, toggleCompare, ready } = useStore();
  const saved = ready && wishlist.includes(p.slug); const cmp = ready && compare.includes(p.slug);
  return (
    <article className="card group relative">
      <Link href={`/product/${p.slug}`} className="block" aria-label={`${p.name}, ${formatCAD(p.priceCents)}`}>
        <div className={`${dark ? "stage-dark" : "stage"} overflow-hidden ${tall ? "aspect-[4/5]" : "aspect-[5/4]"} flex items-center justify-center`}>
          <Shoe colorway={p.colorways[0]} silhouette={p.silhouette} title={`${p.name} in ${p.colorways[0].name}`} className="card-media w-[88%]" />
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div><h3 className="text-[15px] font-bold uppercase tracking-tight">{p.name}</h3><p className="label mt-1 text-mute">{p.brand} · {p.colorways.length} colour{p.colorways.length > 1 ? "s" : ""}</p></div>
          <p className="text-right text-sm font-semibold">{onSale(p) && <s className="mr-2 font-normal text-mute">{formatCAD(p.compareAtCents!)}</s>}{formatCAD(p.priceCents)}</p>
        </div>
      </Link>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2"><Status p={p} />
        <span className="flex flex-wrap">
          {onQuick && <button className="label px-1.5 py-3 hover:underline" onClick={() => onQuick(p)}>Quick view</button>}
          <button className="label px-1.5 py-3 hover:underline" aria-pressed={cmp} onClick={() => { const on = toggleCompare(p.slug); if (on) {} }}>{cmp ? "Comparing" : "Compare"}</button>
          <button className="label px-1.5 py-3 hover:underline" aria-pressed={saved} aria-label={saved ? `Remove ${p.name} from Locker` : `Save ${p.name} to Locker`} onClick={() => toggleWish(p.slug)}>{saved ? "Saved ✓" : "Save"}</button>
        </span></div>
    </article>);
}
