"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { Shoe } from "./Shoe";
import { formatCAD } from "@/lib/money";
import { isUpcoming, totalStock } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { useState } from "react";

export function ShopGrid({ items, dark }: { items: Product[]; dark?: boolean }) {
  const [q, setQ] = useState<Product | null>(null); const ref = useRef<HTMLDialogElement>(null); const opener = useRef<HTMLElement | null>(null);
  useEffect(() => { const d = ref.current; if (!d) return; if (q && !d.open) d.showModal(); if (!q && d.open) d.close(); }, [q]);
  return (<>
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">{items.map((p) => (<ProductCard key={p.slug} p={p} dark={dark} onQuick={(x) => { opener.current = document.activeElement as HTMLElement; setQ(x); }} />))}</div>
    <dialog ref={ref} aria-label="Quick view" onClose={() => { setQ(null); opener.current?.focus(); }} className="m-auto w-[min(920px,94vw)] border border-black p-0 backdrop:bg-black/60" onClick={(e) => { if (e.target === ref.current) setQ(null); }}>
      {q && (<div className="grid-cols-1 grid md:grid-cols-2"><div className="stage flex items-center p-4"><Shoe colorway={q.colorways[0]} silhouette={q.silhouette} title={q.name} className="w-full" /></div>
        <div className="p-6"><div className="flex justify-between"><p className="label text-mute">{q.brand}</p><button className="label" onClick={() => setQ(null)} autoFocus>Close ✕</button></div>
          <h2 className="display mt-3 text-4xl">{q.name}</h2><p className="mt-2 text-xl font-bold">{formatCAD(q.priceCents)}</p><p className="mt-4 text-sm">{q.description}</p>
          <p className="label mt-4 text-mute">{isUpcoming(q) ? "Upcoming release" : totalStock(q) ? `${totalStock(q)} pairs in stock across sizes` : "Sold out"}</p>
          <Link href={`/product/${q.slug}`} className="btn btn-solid mt-6 w-full">Choose size &amp; view details</Link></div></div>)}
    </dialog></>);
}
