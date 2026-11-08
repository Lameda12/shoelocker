import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Shoe } from "@/components/Shoe";
import { Countdown } from "@/components/Countdown";
import { NewsletterForm } from "@/components/NewsletterForm";
import { articles, collections, getProduct, isUpcoming, products } from "@/lib/catalog";
import { formatCAD } from "@/lib/money";

const byDate = [...products].filter((p) => !isUpcoming(p)).sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));
const Head = ({ k, t, href, label }: { k: string; t: string; href: string; label: string }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="label text-mute">{k}</p><h2 className="display mt-2 text-[clamp(2.2rem,5vw,4.5rem)]">{t}</h2></div><Link href={href} className="label link-u">{label} →</Link></div>);

export default function Home() {
  const spot = getProduct("object-01")!; const upcoming = products.filter(isUpcoming).sort((a, b) => +new Date(a.releaseAt!) - +new Date(b.releaseAt!));
  const picks = products.filter((p) => p.editorsPick);
  return (<>
    <Hero />
    <section className="wrap pt-20" aria-label="New arrivals"><Head k="01 — New" t="New arrivals" href="/shop?new=1&sort=newest" label="All new" />
      <div className="hscroll">{byDate.slice(0, 6).map((p) => (<div key={p.slug} className="w-[78vw] max-w-[380px]"><ProductCard p={p} /></div>))}</div></section>

    <section className="wrap pt-24" aria-label="Featured silhouettes"><Head k="02 — Form" t="Three silhouettes" href="/shop" label="Browse all" />
      <div className="grid-cols-1 grid gap-4 md:grid-cols-3">{([["low", "Low", "nord-01", "lifestyle"], ["runner", "Runner", "pace-r1", "running"], ["high", "High", "court-h9", "basketball"]] as const).map(([s, l, slug, cat]) => {
        const p = getProduct(slug)!; return (<Link key={s} href={`/shop?category=${cat}`} className="card group stage relative flex aspect-[4/5] flex-col justify-between p-5">
          <span className="display text-5xl">{l}</span><Shoe colorway={p.colorways[0]} silhouette={s} title={`${l} silhouette`} className="card-media w-full" /><span className="label">Shop {cat} →</span></Link>); })}</div></section>

    <section className="dark-zone mt-24" aria-label="The Vault"><div className="grid-cols-1 wrap grid gap-10 py-20 lg:grid-cols-[1fr_1.2fr]">
      <div className="self-center"><p className="label text-white/60">03 — Limited &amp; curated</p><h2 className="display mt-3 text-[clamp(3rem,8vw,7rem)]">The<br />Vault</h2>
        <p className="mt-6 max-w-md text-white/70">A dark gallery of curated collections and dated releases. Every price is shown, every release date is real, and you can leave at any time.</p>
        <Link href="/vault" className="btn btn-solid mt-8">Enter the Vault</Link></div>
      <div className="grid grid-cols-2 gap-4">{products.filter((p) => p.vault && !isUpcoming(p)).slice(0, 4).map((p) => (<ProductCard key={p.slug} p={p} dark />))}</div></div></section>

    <section className="wrap pt-24" aria-label="Editor's picks"><Head k="04 — Selected" t="Editor’s picks" href="/shop" label="See more" />
      <div className="grid-cols-1 grid gap-4 md:grid-cols-12">{picks.slice(0, 4).map((p, i) => (<div key={p.slug} className={i === 0 ? "md:col-span-7" : i === 1 ? "md:col-span-5 md:mt-24" : i === 2 ? "md:col-span-5" : "md:col-span-7 md:mt-16"}><ProductCard p={p} tall={i === 1 || i === 2} /></div>))}</div></section>

    <section className="wrap pt-24" aria-label="Designed for movement"><Head k="05 — Performance" t="Designed for movement" href="/shop?category=running" label="Running" />
      <div className="grid-cols-1 grid gap-4 md:grid-cols-4">{products.filter((p) => p.category !== "lifestyle").slice(0, 4).map((p) => (<div key={p.slug}><ProductCard p={p} /><p className="mt-2 text-sm text-mute">{p.intendedUse}{p.weightGrams ? ` · ${p.weightGrams} g` : ""}</p></div>))}</div></section>

    <section className="wrap pt-24" aria-label="Everyday icons"><Head k="06 — Lifestyle" t="Everyday icons" href="/shop?category=lifestyle" label="Lifestyle" />
      <div className="hscroll">{products.filter((p) => p.category === "lifestyle" && !isUpcoming(p)).map((p) => (<div key={p.slug} className="w-[70vw] max-w-[320px]"><ProductCard p={p} tall /></div>))}</div></section>

    <section className="mt-24 bg-arch" aria-label="Product spotlight"><div className="grid-cols-1 wrap grid items-center gap-10 py-16 lg:grid-cols-2">
      <div className="stage aspect-[5/4] flex items-center justify-center"><Shoe colorway={spot.colorways[0]} silhouette={spot.silhouette} title={spot.name} className="w-[92%]" /></div>
      <div><p className="label text-mute">07 — Spotlight</p><h2 className="display mt-3 text-[clamp(3rem,7vw,6rem)]">{spot.name}</h2><p className="mt-5 max-w-lg text-lg">{spot.story}</p>
        <dl className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-black/20 pt-5 text-sm">{spot.specs.map((s) => (<div key={s.label}><dt className="label text-mute">{s.label}</dt><dd>{s.value}</dd></div>))}</dl>
        <p className="mt-6 text-2xl font-bold">{formatCAD(spot.priceCents)}</p><Link href={`/product/${spot.slug}`} className="btn btn-solid mt-4">Explore this sneaker</Link></div></div></section>

    <section className="wrap pt-24" aria-label="The Archive"><Head k="08 — Reading" t="The Archive" href="/archive" label="All stories" />
      <div className="grid-cols-1 grid gap-px border border-black bg-black md:grid-cols-3">{articles.map((a) => (<Link key={a.slug} href={`/archive/${a.slug}`} className="group bg-white p-6 transition hover:bg-black hover:text-white"><p className="label text-mute group-hover:text-white/60">{a.kicker} · {a.readMinutes} min</p><h3 className="display mt-10 text-4xl">{a.title}</h3><p className="mt-4 text-sm">{a.excerpt}</p></Link>))}</div></section>

    <section className="wrap pt-24" aria-label="Upcoming drops"><Head k="09 — Dates" t="Latest drops" href="/vault" label="The Vault" />
      <p className="mb-6 max-w-xl text-mute">Only dated releases appear here. No release is announced without a scheduled time, and notifications are opt-in.</p>
      <div className="grid-cols-1 grid gap-4 md:grid-cols-2">{upcoming.map((p) => (<div key={p.slug} className="grid-cols-1 grid gap-5 border border-black p-5 sm:grid-cols-[160px_1fr]"><div className="stage-dark flex items-center"><Shoe colorway={p.colorways[0]} silhouette={p.silhouette} title={p.name} className="w-full" /></div>
        <div><p className="label text-mute">{new Date(p.releaseAt!).toLocaleString("en-CA", { dateStyle: "long", timeStyle: "short", timeZone: "America/Halifax" })} AT</p><h3 className="display mt-2 text-3xl">{p.name}</h3><div className="my-3"><Countdown to={p.releaseAt!} /></div><Link href={`/product/${p.slug}`} className="label link-u">Details &amp; notify me →</Link></div></div>))}</div></section>

    <section className="wrap pt-24" aria-label="Brand story"><div className="grid-cols-1 grid gap-10 lg:grid-cols-2"><div><p className="label text-mute">10 — Why</p><h2 className="display mt-3 text-[clamp(2.4rem,6vw,5.5rem)]">Not just worn. Discovered.</h2></div>
      <div className="space-y-5 text-lg"><p>Shoe Locker treats a sneaker as an object of design, engineering and personal identity. We show what each pair is made of, what it is for and what it costs, and we say so plainly when something is sold out.</p><p>No countdown without a real date. No scarcity we didn&apos;t count. {collections.length} collections, each with a point of view.</p><NewsletterForm /></div></div></section>
  </>);
}
