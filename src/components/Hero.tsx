import Link from "next/link";
import { Shoe } from "./Shoe";
import { getProduct } from "@/lib/catalog";

export function Hero() {
  const p = getProduct("nord-01")!;
  return (
    <section className="dark-zone relative overflow-hidden" aria-labelledby="hero-h">
      <div className="grid-cols-1 wrap grid min-h-[calc(100svh-64px)] items-center gap-6 py-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="hero-in relative z-10">
          <p className="label text-white/60">Campaign 01 · NOIR SERIES</p>
          <h1 id="hero-h" className="display mt-5 text-[clamp(3.2rem,9.2vw,9rem)]">The next<br />pair is<br />personal.</h1>
          <p className="mt-6 max-w-md text-lg text-white/75">Explore footwear through design, performance, and culture.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-solid">Explore collection</Link>
            <Link href={`/product/${p.slug}`} className="btn">Discover the featured sneaker</Link>
          </div>
        </div>
        <Link href={`/product/${p.slug}`} className="hero-shoe stage-dark relative block aspect-[4/3] w-full self-center lg:aspect-[5/4]" aria-label="NORD 01, featured sneaker">
          <div className="absolute inset-0 flex items-center justify-center"><Shoe colorway={{ ...p.colorways[0], upper: "#161616", panel: "#262626", sole: "#e9e9e9", accent: "#ffffff", lace: "#ffffff" }} silhouette="low" title="NORD 01 in Blackout, side profile" className="w-[96%] drop-shadow-[0_40px_40px_rgba(0,0,0,.6)]" priority /></div>
          <span className="label absolute bottom-4 left-4 text-white/60">NORD 01 — Atelier Nord</span>
          <span className="label absolute bottom-4 right-4 text-white/60">Illustration</span>
        </Link>
      </div>
    </section>);
}
