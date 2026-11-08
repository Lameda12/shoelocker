import Link from "next/link";
import { collections, products } from "@/lib/catalog";
import { Shoe } from "@/components/Shoe";
export const metadata = { title: "Collections" };
export default function Collections() {
  return (<div className="wrap py-12"><h1 className="display text-[clamp(3rem,8vw,7rem)]">Collections</h1><div className="mt-10 space-y-px bg-black">{collections.map((c, i) => { const p = products.find((x) => x.collection === c.slug)!; return (
    <Link key={c.slug} href={`/collections/${c.slug}`} className={`group grid items-center gap-6 bg-white p-6 transition hover:bg-black hover:text-white md:grid-cols-[1fr_1.2fr] ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}><div><p className="label opacity-60">{products.filter((x) => x.collection === c.slug).length} pairs{c.vault ? " · Vault" : ""}</p><h2 className="display mt-2 text-5xl">{c.name}</h2><p className="mt-3 max-w-md">{c.tagline}</p></div><div className="stage flex"><Shoe colorway={p.colorways[0]} silhouette={p.silhouette} title={c.name} className="mx-auto w-[70%]" /></div></Link>); })}</div></div>);
}
