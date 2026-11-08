import { notFound } from "next/navigation";
import Link from "next/link";
import { ShopGrid } from "@/components/QuickView";
import { getCollection, products } from "@/lib/catalog";
export default async function Collection({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCollection((await params).slug); if (!c) notFound();
  return (<div className="wrap py-12"><p className="label text-mute">Collection</p><h1 className="display mt-2 text-[clamp(3rem,8vw,7rem)]">{c.name}</h1><p className="mt-4 max-w-xl text-lg">{c.narrative}</p>
    {c.vault && <Link href={`/vault/${c.slug}`} className="btn mt-6">View in the Vault</Link>}<div className="mt-10"><ShopGrid items={products.filter((p) => p.collection === c.slug)} /></div></div>);
}
