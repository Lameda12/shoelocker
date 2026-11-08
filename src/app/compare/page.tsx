"use client";
import Link from "next/link";
import { Shoe } from "@/components/Shoe";
import { useStore } from "@/components/Providers";
import { getProduct } from "@/lib/catalog";
import { formatCAD } from "@/lib/money";

export default function Compare() {
  const { compare, toggleCompare, ready } = useStore(); const items = compare.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
  const rows: [string, (p: (typeof items)[number]) => string][] = [["Price", (p) => formatCAD(p.priceCents)], ["Brand", (p) => p.brand], ["Category", (p) => p.category], ["Intended use", (p) => p.intendedUse], ["Size range (US)", (p) => `${p.sizeRange[0]}–${p.sizeRange[1]}`],
    ["Materials", (p) => p.materials.join(", ")], ["Weight", (p) => (p.weightGrams ? `${p.weightGrams} g` : "Not documented")], ["Colourways", (p) => String(p.colorways.length)]];
  if (!ready) return <div className="wrap py-16"><div className="skel h-20 w-1/2" /></div>;
  if (items.length < 1) return (<div className="wrap py-24 text-center"><h1 className="display text-6xl">Compare</h1><p className="mt-4 text-mute">Add up to three pairs with “Compare” on any product to see verified attributes side by side.</p><Link href="/shop" className="btn btn-solid mt-8">Browse sneakers</Link></div>);
  return (<div className="wrap py-12"><h1 className="display text-6xl">Compare</h1><p className="mt-3 text-mute">Only documented attributes are shown. “Not documented” means we have no verified figure.</p>
    <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[640px] border-collapse text-left text-sm"><thead><tr><th className="w-40" />{items.map((p) => (<th key={p.slug} className="p-3 align-top"><div className="stage"><Shoe colorway={p.colorways[0]} silhouette={p.silhouette} title={p.name} className="w-full" /></div><Link href={`/product/${p.slug}`} className="display mt-2 block text-xl underline">{p.name}</Link><button className="label mt-1 underline" onClick={() => toggleCompare(p.slug)}>Remove</button></th>))}</tr></thead>
      <tbody>{rows.map(([l, f]) => (<tr key={l} className="border-t border-black/20"><th className="label p-3 text-left font-normal text-mute">{l}</th>{items.map((p) => <td key={p.slug} className="p-3">{f(p)}</td>)}</tr>))}</tbody></table></div></div>);
}
