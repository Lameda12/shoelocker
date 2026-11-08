"use client";
import Link from "next/link";
import { useState } from "react";
import { Shoe } from "@/components/Shoe";
import { useStore } from "@/components/Providers";
import { findVariant } from "@/lib/catalog";
import { formatCAD } from "@/lib/money";
import { totals, FREE_SHIPPING_OVER_CENTS } from "@/lib/shipping";

export default function Cart() {
  const { cart, setQty, removeFromCart, ready } = useStore(); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const lines = cart.map((l) => ({ ...l, hit: findVariant(l.sku) })).filter((l) => l.hit);
  const subtotal = lines.reduce((n, l) => n + l.hit!.product.priceCents * l.qty, 0); const t = totals(subtotal);
  async function checkout() {
    setBusy(true); setErr("");
    const r = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lines: cart }) });
    const d = await r.json().catch(() => ({})); setBusy(false);
    if (r.ok && d.url) { window.location.href = d.url; return; }
    setErr(d.error ?? "Checkout failed. Please try again.");
  }
  if (!ready) return <div className="wrap py-16"><div className="skel h-20 w-1/2" /></div>;
  if (!lines.length) return (<div className="wrap py-24 text-center"><h1 className="display text-6xl">Your cart is empty</h1><p className="mt-4 text-mute">Pairs you add will wait here, with the size you chose.</p><Link href="/shop" className="btn btn-solid mt-8">Start exploring</Link></div>);
  return (<div className="wrap py-12"><h1 className="display text-[clamp(2.6rem,6vw,5rem)]">Cart</h1>
    <div className="grid-cols-1 mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-black/15 border-y border-black/15">{lines.map(({ sku, qty, hit }) => { const { product: p, variant: v } = hit!; const cw = p.colorways.find((c) => c.id === v.colorwayId)!; return (
        <li key={sku} className="grid grid-cols-[110px_1fr] gap-4 py-5 sm:grid-cols-[160px_1fr_auto]"><Link href={`/product/${p.slug}`} className="stage flex items-center"><Shoe colorway={cw} silhouette={p.silhouette} title={p.name} className="w-full" /></Link>
          <div><h2 className="font-bold uppercase">{p.name}</h2><p className="label mt-1 text-mute">{cw.name} · US {v.sizeUS}</p><p className="label text-mute">{sku}</p>
            <div className="mt-3 flex items-center gap-1"><button className="btn !min-h-10 !px-3" aria-label={`Decrease quantity of ${p.name}`} onClick={() => setQty(sku, qty - 1)}>−</button><span className="w-10 text-center font-mono" aria-live="polite">{qty}</span><button className="btn !min-h-10 !px-3" aria-label={`Increase quantity of ${p.name}`} onClick={() => setQty(sku, qty + 1)} disabled={qty >= 5}>+</button><button className="label ml-4 underline" onClick={() => removeFromCart(sku)}>Remove</button></div></div>
          <p className="col-span-2 text-right font-semibold sm:col-span-1">{formatCAD(p.priceCents * qty)}</p></li>); })}</ul>
      <aside className="h-fit border border-black p-6" aria-label="Order summary"><h2 className="label">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">{[["Subtotal", t.subtotal], ["Shipping", t.shipping], ["Estimated tax (15%)", t.tax]].map(([l, v]) => (<div key={l as string} className="flex justify-between"><dt>{l}</dt><dd>{v === 0 && l === "Shipping" ? "Free" : formatCAD(v as number)}</dd></div>))}
          <div className="flex justify-between border-t border-black pt-3 text-lg font-bold"><dt>Total</dt><dd>{formatCAD(t.total)}</dd></div></dl>
        {t.shipping > 0 && <p className="mt-3 text-xs text-mute">Add {formatCAD(FREE_SHIPPING_OVER_CENTS - subtotal)} for free shipping.</p>}
        <p className="mt-3 text-xs text-mute">Final prices, stock and tax are re-verified on our server at checkout. Payment is handled by Stripe (test mode).</p>
        <button className="btn btn-solid mt-5 w-full" onClick={checkout} disabled={busy}>{busy ? "Reserving your pairs…" : "Checkout securely"}</button>
        {err && <p role="alert" className="mt-3 border border-black p-3 text-sm">{err}</p>}</aside></div></div>);
}
