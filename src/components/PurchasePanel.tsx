"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Explorer } from "./Explorer";
import { NewsletterForm } from "./NewsletterForm";
import { Countdown } from "./Countdown";
import { useStore } from "./Providers";
import { formatCAD } from "@/lib/money";
import { SIZE_CHART, SIZE_SOURCE_NOTE, convertFromUS, toUS } from "@/lib/sizes";
import type { Product } from "@/lib/types";

export function ProductExperience({ p, stock, upcoming, dark }: { p: Product; stock: Record<string, number>; upcoming: boolean; dark?: boolean }) {
  const [cwId, setCw] = useState(p.colorways[0].id); const [sku, setSku] = useState<string | null>(null);
  const { addToCart, wishlist, toggleWish, trackView, fit, ready, notify, toggleCompare, compare } = useStore();
  useEffect(() => trackView(p.slug), [p.slug, trackView]);
  const cw = p.colorways.find((c) => c.id === cwId)!; const variants = p.variants.filter((v) => v.colorwayId === cwId);
  const sel = sku ? p.variants.find((v) => v.sku === sku && v.colorwayId === cwId) : undefined; const left = sel ? stock[sel.sku] : undefined;
  const total = variants.reduce((n, v) => n + (stock[v.sku] ?? 0), 0);
  const saved = ready && wishlist.includes(p.slug);
  const mySizeUS = fit?.size ? toUS(parseFloat(fit.size), fit.region) : null; const mine = mySizeUS ? variants.find((v) => v.sizeUS === mySizeUS) : undefined;
  const canBuy = !upcoming && !!sel && (left ?? 0) > 0;
  const add = () => { if (!sel) return notify("Choose a size first"); addToCart(sel.sku); notify(`${p.name} · US ${sel.sizeUS} added to cart`); };
  return (
    <div className="grid-cols-1 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
      <Explorer p={p} colorway={cw} onColorway={(id) => { setCw(id); setSku(null); }} dark={dark} />
      <div>
        <p className="label opacity-60">{p.brand} · {p.collection.replace(/-/g, " ")}</p>
        <h1 className="display mt-2 text-[clamp(2.6rem,5vw,4.6rem)]">{p.name}</h1>
        <p className="mt-4 text-2xl font-bold">{p.compareAtCents ? <s className="mr-3 font-normal opacity-60">{formatCAD(p.compareAtCents)}</s> : null}{formatCAD(p.priceCents)} <span className="label font-normal opacity-60">CAD · tax at checkout</span></p>
        <p className="mt-5 max-w-prose">{p.description}</p>

        {upcoming ? (
          <div className="mt-8 border border-current p-5"><p className="label">Scheduled release</p><p className="mt-2">{new Date(p.releaseAt!).toLocaleString("en-CA", { dateStyle: "full", timeStyle: "short", timeZone: "America/Halifax" })} (Halifax)</p><div className="my-3"><Countdown to={p.releaseAt!} /></div>
            <p className="mb-4 text-sm opacity-70">Purchase eligibility: open to everyone once released. Inventory is not yet loaded, so no size can be selected.</p><NewsletterForm topic="drop" slug={p.slug} tone={dark ? "dark" : "light"} /></div>
        ) : (<>
          <div className="mt-8 flex items-baseline justify-between"><h2 className="label">Size (US men’s){sel ? ` · selected US ${sel.sizeUS}` : ""}</h2><details className="label relative"><summary className="cursor-pointer underline">Size guide</summary>
            <div className="absolute right-0 z-30 mt-2 w-[min(88vw,420px)] border border-current bg-white p-4 text-black normal-case tracking-normal shadow-xl"><table className="w-full text-left text-xs"><thead><tr><th>US</th><th>UK</th><th>EU</th><th>Foot cm</th></tr></thead><tbody>{SIZE_CHART.filter((r) => r.US >= 7 && r.US <= 12).map((r) => (<tr key={r.US}><td>{r.US}</td><td>{r.UK}</td><td>{r.EU}</td><td>{r.cm}</td></tr>))}</tbody></table><p className="mt-3 text-xs text-mute">{SIZE_SOURCE_NOTE} Women’s US ≈ men’s + 1.5.</p></div></details></div>
          <div role="group" aria-label="Choose size" className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {variants.map((v) => { const n = stock[v.sku] ?? 0; return (<button key={v.sku} className="size-btn" aria-pressed={sku === v.sku} disabled={n === 0} aria-label={`US ${v.sizeUS}${n === 0 ? ", sold out" : n <= 2 ? `, ${n} left` : ""}`} onClick={() => setSku(v.sku)}>{v.sizeUS}</button>); })}
          </div>
          <p className="mt-3 min-h-5 text-sm" aria-live="polite">
            {sel ? `SKU ${sel.sku} · ${left! <= 3 ? `${left} left` : "In stock"}` : total === 0 ? "This colourway is sold out." : "Select a size to see availability."}
            {mine && ` ${stock[mine.sku] > 0 ? `Your saved size (US ${mine.sizeUS}) is in stock.` : `Your saved size (US ${mine.sizeUS}) is sold out.`}`}</p>
          {p.fitNote ? <p className="mt-1 text-sm opacity-70">Fit note: {p.fitNote}</p> : <p className="mt-1 text-sm opacity-70">No verified fit data for this model yet. See the size guide, or <Link className="underline" href="/fit-passport">use your Fit Passport</Link>.</p>}
          {!total && <div className="mt-4 border border-current p-4 text-sm">Sold out in this colourway. {p.colorways.length > 1 ? "Try another colour above." : "Join the list on the Locker page to hear about restocks."}</div>}
          <div className="mt-6 hidden gap-2 sm:flex"><button className="btn btn-solid flex-1" onClick={add} disabled={total === 0}>{total === 0 ? "Sold out" : sel ? "Add to cart" : "Select a size"}</button>
            <button className="btn" aria-pressed={saved} onClick={() => toggleWish(p.slug)}>{saved ? "Saved ✓" : "Save"}</button></div>
          <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-black bg-white p-3 text-black sm:hidden" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <button className="btn btn-solid flex-1 !bg-black !text-white" onClick={add} disabled={total === 0}>{sel ? `Add · ${formatCAD(p.priceCents)}` : "Select a size"}</button>
            <button className="btn !text-black" aria-pressed={saved} onClick={() => toggleWish(p.slug)} aria-label="Save to Locker">{saved ? "✓" : "♡"}</button></div>
          {canBuy && <p className="sr-only">Ready to add</p>}
        </>)}

        <button className="label mt-5 underline" onClick={() => notify(toggleCompare(p.slug) ? "Added to compare" : "Removed from compare")}>{compare.includes(p.slug) ? "In compare ✓" : "+ Compare"}</button>
        <div className="mt-10 divide-y divide-current/20 border-y border-current/20">
          <details open className="py-4"><summary className="label cursor-pointer">Specifications</summary><dl className="mt-4 grid grid-cols-2 gap-3 text-sm">{[...p.specs, { label: "Materials", value: p.materials.join(", ") }, { label: "Intended use", value: p.intendedUse }, ...(p.weightGrams ? [{ label: "Weight", value: `${p.weightGrams} g (size US 9, as documented)` }] : [])].map((s) => (<div key={s.label}><dt className="label opacity-60">{s.label}</dt><dd>{s.value}</dd></div>))}</dl></details>
          <details className="py-4"><summary className="label cursor-pointer">Story</summary><p className="mt-3 text-sm">{p.story}</p></details>
          <details className="py-4"><summary className="label cursor-pointer">Shipping &amp; returns</summary><p className="mt-3 text-sm">Ships within Canada. Flat $15, free over $200. Dispatch expectations are shown at checkout; this is a demo store, so nothing ships. 30-day returns on unworn pairs (policy draft, see <Link className="underline" href="/policies">policies</Link>).</p></details>
        </div>
        <p className="label mt-4 opacity-50">Sizes shown: {p.sizeRange[0]}–{p.sizeRange[1]} · {convertFromUS(9, "EU")} EU ≈ US 9</p>
      </div>
    </div>);
}
