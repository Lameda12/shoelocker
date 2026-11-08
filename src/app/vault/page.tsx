import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Countdown } from "@/components/Countdown";
import { Shoe } from "@/components/Shoe";
import { collections, isUpcoming, products } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export default function Vault() {
  const vp = products.filter((p) => p.vault); const up = vp.filter(isUpcoming).sort((a, b) => +new Date(a.releaseAt!) - +new Date(b.releaseAt!)); const live = vp.filter((p) => !isUpcoming(p));
  const next = up[0];
  return (<div>
    <section className="grid-cols-1 wrap grid min-h-[70svh] items-center gap-8 py-12 lg:grid-cols-2"><div><p className="label text-white/60">Curated · Limited · Dated</p><h1 className="display mt-4 text-[clamp(4rem,13vw,11rem)]">The<br />Vault</h1>
      <p className="mt-6 max-w-md text-white/70">Exceptional pairs and small runs. Every release has a real date, a visible price and a stated eligibility rule. Nothing here is faked scarcity.</p></div>
      {next && <div className="stage-dark border border-white/15 p-6"><Shoe colorway={next.colorways[0]} silhouette={next.silhouette} title={next.name} className="w-full" /><div className="mt-4 flex flex-wrap items-end justify-between gap-4"><div><p className="label text-white/60">Next release</p><h2 className="display text-3xl">{next.name}</h2></div><Countdown to={next.releaseAt!} /></div><Link href={`/vault/${next.slug}`} className="btn mt-4">Details &amp; notify me</Link></div>}</section>
    <section className="wrap py-12" aria-label="Collections"><h2 className="label text-white/60">Vault collections</h2><div className="grid-cols-1 mt-4 grid gap-px border border-white/20 bg-white/20 md:grid-cols-3">{collections.filter((c) => c.vault).map((c) => (<Link key={c.slug} href={`/vault/${c.slug}`} className="group bg-black p-6 transition hover:bg-white hover:text-black"><p className="label opacity-60">{products.filter((p) => p.collection === c.slug).length} pairs</p><h3 className="display mt-12 text-4xl">{c.name}</h3><p className="mt-3 text-sm opacity-70">{c.tagline}</p></Link>))}</div></section>
    <section className="wrap py-12" aria-label="Available now"><h2 className="label text-white/60">Available now</h2><div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{live.map((p) => <ProductCard key={p.slug} p={p} dark />)}</div></section>
    <section className="wrap py-12" aria-label="Upcoming"><h2 className="label text-white/60">Upcoming · dates are scheduled</h2><div className="grid-cols-1 mt-6 grid gap-4 md:grid-cols-2">{up.map((p) => (<div key={p.slug} className="border border-white/20 p-5"><h3 className="display text-3xl">{p.name}</h3><p className="label mt-2 text-white/60">{new Date(p.releaseAt!).toLocaleString("en-CA", { dateStyle: "long", timeStyle: "short", timeZone: "America/Halifax" })} Halifax</p><div className="my-4"><Countdown to={p.releaseAt!} /></div><Link href={`/vault/${p.slug}`} className="label link-u">Details →</Link></div>))}</div></section></div>);
}
