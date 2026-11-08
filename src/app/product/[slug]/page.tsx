import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductExperience } from "@/components/PurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, isUpcoming, products } from "@/lib/catalog";
import { getStock } from "@/lib/inventory";
import { formatCAD } from "@/lib/money";

export const dynamic = "force-dynamic"; // live stock
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug); return p ? { title: p.name, description: p.description, openGraph: { title: p.name, description: p.description } } : {};
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug); if (!p) notFound();
  const stock = Object.fromEntries(p.variants.map((v) => [v.sku, getStock(v.sku)])); const up = isUpcoming(p);
  const total = Object.values(stock).reduce((a, b) => a + b, 0);
  const related = products.filter((x) => x.slug !== p.slug && (x.category === p.category || x.collection === p.collection)).slice(0, 3);
  const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, brand: { "@type": "Brand", name: p.brand }, description: p.description, sku: p.variants[0].sku,
    offers: { "@type": "Offer", priceCurrency: "CAD", price: (p.priceCents / 100).toFixed(2), availability: up ? "https://schema.org/PreOrder" : total > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return (<div className="wrap pb-28 pt-8 sm:pb-12">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    <nav aria-label="Breadcrumb" className="label mb-6 text-mute"><Link href="/shop" className="link-u">Shop</Link> / <Link href={`/shop?category=${p.category}`} className="link-u">{p.category}</Link> / {p.name}</nav>
    <ProductExperience p={p} stock={stock} upcoming={up} />
    {related.length > 0 && <section className="mt-24" aria-label="Related"><h2 className="display text-4xl">Related</h2><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div><p className="label mt-3 text-mute">From {formatCAD(Math.min(...related.map((r) => r.priceCents)))}</p></section>}
  </div>);
}
