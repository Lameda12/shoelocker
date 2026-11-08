"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Filters } from "@/lib/query";

const SIZES = [7, 8, 9, 10, 11, 12]; const COLORS = ["Black", "White", "Bone", "Grey", "Silver", "Sand", "Gum"];
export function FilterPanel({ f, brands, count, hideCategory }: { f: Filters; brands: string[]; count: number; hideCategory?: boolean }) {
  const [open, setOpen] = useState(false); const router = useRouter(); const path = usePathname();
  const apply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const fd = new FormData(e.currentTarget); const sp = new URLSearchParams();
    for (const k of ["q", "category", "gender", "sort", "min", "max", "collection"]) { const v = fd.get(k); if (v) sp.set(k, String(v)); }
    for (const k of ["brand", "color", "size"]) { const all = fd.getAll(k).map(String); if (all.length) sp.set(k, all.join(",")); }
    if (fd.get("stock")) sp.set("stock", "1"); if (f.vault) sp.set("vault", "1"); if (f.sale) sp.set("sale", "1"); if (f.isNew) sp.set("new", "1");
    router.push(`${path}?${sp}`); setOpen(false);
  };
  const body = (
    <form onSubmit={apply} className="space-y-6" key={JSON.stringify(f)}>
      <div><label className="label block" htmlFor="fq">Search</label><input id="fq" name="q" defaultValue={f.q} className="mt-2 h-11 w-full border border-black/40 px-3 text-sm" /></div>
      <div><label className="label block" htmlFor="fs">Sort</label><select id="fs" name="sort" defaultValue={f.sort ?? ""} className="mt-2 h-11 w-full border border-black/40 bg-white px-3 text-sm"><option value="">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name A–Z</option></select></div>
      {!hideCategory && <div><label className="label block" htmlFor="fc">Category</label><select id="fc" name="category" defaultValue={f.category ?? ""} className="mt-2 h-11 w-full border border-black/40 bg-white px-3 text-sm"><option value="">All</option><option value="lifestyle">Lifestyle</option><option value="running">Running</option><option value="basketball">Basketball</option></select></div>}
      <div><label className="label block" htmlFor="fg">Gender</label><select id="fg" name="gender" defaultValue={f.gender ?? ""} className="mt-2 h-11 w-full border border-black/40 bg-white px-3 text-sm"><option value="">All</option><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option></select></div>
      <fieldset><legend className="label">Brand</legend>{brands.map((b) => (<label key={b} className="mt-2 flex items-center gap-3 text-sm"><input type="checkbox" name="brand" value={b} defaultChecked={f.brand?.includes(b)} className="h-4 w-4" />{b}</label>))}</fieldset>
      <fieldset><legend className="label">US size (in stock)</legend><div className="mt-2 flex flex-wrap gap-2">{SIZES.map((s) => (<label key={s} className="relative"><input type="checkbox" name="size" value={s} defaultChecked={f.size?.includes(s)} className="peer sr-only" /><span className="flex h-11 w-12 cursor-pointer items-center justify-center border border-black/40 text-sm peer-checked:bg-black peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">{s}</span></label>))}</div></fieldset>
      <fieldset><legend className="label">Colour</legend>{COLORS.map((c) => (<label key={c} className="mt-2 inline-flex w-1/2 items-center gap-3 text-sm"><input type="checkbox" name="color" value={c} defaultChecked={f.color?.some((x) => x.toLowerCase() === c.toLowerCase())} className="h-4 w-4" />{c}</label>))}</fieldset>
      <fieldset><legend className="label">Price (CAD)</legend><div className="mt-2 flex gap-2"><input name="min" type="number" min={0} placeholder="Min" defaultValue={f.min} aria-label="Minimum price" className="h-11 w-full border border-black/40 px-3 text-sm" /><input name="max" type="number" min={0} placeholder="Max" defaultValue={f.max} aria-label="Maximum price" className="h-11 w-full border border-black/40 px-3 text-sm" /></div></fieldset>
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="stock" defaultChecked={f.inStock} className="h-4 w-4" />In stock only</label>
      <div className="flex gap-2"><button className="btn btn-solid flex-1">Show results</button><button type="button" className="btn" onClick={() => { router.push(path); setOpen(false); }}>Reset</button></div>
    </form>);
  return (<>
    <button className="btn mb-4 w-full lg:hidden" onClick={() => setOpen(true)} aria-haspopup="dialog">Filter &amp; sort ({count})</button>
    <aside className="hidden lg:block" aria-label="Filters">{body}</aside>
    {open && (<div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-50 overflow-y-auto bg-white p-5 lg:hidden"><div className="mb-6 flex items-center justify-between"><h2 className="display text-3xl">Filters</h2><button className="btn" onClick={() => setOpen(false)} autoFocus>Close</button></div>{body}</div>)}</>);
}
