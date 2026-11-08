import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductExperience } from "@/components/PurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import { getCollection, getProduct, isUpcoming, products } from "@/lib/catalog";
import { getStock } from "@/lib/inventory";

export const dynamic = "force-dynamic";
export default async function VaultItem({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug; const col = getCollection(slug);
  if (col?.vault) return (<div className="wrap py-12"><p className="label text-white/60">Vault collection</p><h1 className="display mt-2 text-[clamp(3rem,9vw,8rem)]">{col.name}</h1><p className="mt-4 max-w-xl text-lg text-white/70">{col.narrative}</p>
    <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-3">{products.filter((p) => p.collection === col.slug).map((p) => <ProductCard key={p.slug} p={p} dark />)}</div></div>);
  const p = getProduct(slug); if (!p || !p.vault) notFound();
  const stock = Object.fromEntries(p.variants.map((v) => [v.sku, getStock(v.sku)]));
  return (<div className="wrap py-10"><Link href="/vault" className="label link-u">← The Vault</Link><div className="mt-6"><ProductExperience p={p} stock={stock} upcoming={isUpcoming(p)} dark /></div></div>);
}
