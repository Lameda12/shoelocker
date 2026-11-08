"use client";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/components/Providers";
import { getProduct } from "@/lib/catalog";

const list = (slugs: string[]) => slugs.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
export default function Locker() {
  const { wishlist, recent, clearRecent, prefs, setPrefs, fit, alerts, toggleAlert, ready } = useStore();
  if (!ready) return <div className="wrap py-16"><div className="skel h-20 w-1/2" /></div>;
  return (<div className="dark-zone min-h-[80vh]"><div className="wrap py-14"><p className="label text-white/60">Personal Locker</p><h1 className="display mt-2 text-[clamp(3rem,8vw,7rem)]">Your Locker</h1>
    <p className="mt-4 max-w-xl text-white/70">Saved to this device. Sign-in sync (Clerk) and order history activate once authentication keys are configured; see the deployment guide.</p>
    <section className="mt-14" aria-label="Saved sneakers"><h2 className="label text-white/60">Saved sneakers · {wishlist.length}</h2>
      {wishlist.length ? <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{list(wishlist).map((p) => (<div key={p.slug}><ProductCard p={p} dark />{p.releaseAt && <button className="label mt-1 underline" aria-pressed={alerts.includes(p.slug)} onClick={() => toggleAlert(p.slug)}>{alerts.includes(p.slug) ? "Release reminder on (this device)" : "Remind me at release"}</button>}</div>))}</div>
        : <p className="mt-4 border border-dashed border-white/30 p-8 text-white/70">Nothing saved yet. Tap Save on any sneaker to keep it here. <Link href="/shop" className="underline">Browse</Link></p>}</section>
    <section className="grid-cols-1 mt-14 grid gap-10 md:grid-cols-2"><div><h2 className="label text-white/60">Fit Passport</h2>{fit ? <p className="mt-4 text-xl">{fit.region} {fit.size}{fit.width ? ` · ${fit.width} width` : ""}{fit.preference ? ` · ${fit.preference} fit` : ""}</p> : <p className="mt-4 text-white/70">No sizing saved.</p>}<Link href="/fit-passport" className="btn mt-4">{fit ? "Edit Fit Passport" : "Create Fit Passport"}</Link></div>
      <div><h2 className="label text-white/60">Orders &amp; shipments</h2><p className="mt-4 text-white/70">Order history and tracking appear here for signed-in customers after checkout. Guest orders are confirmed by email once Resend is configured.</p></div></section>
    <section className="mt-14" aria-label="Recently viewed"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="label text-white/60">Recently viewed</h2>
      <div className="flex items-center gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={prefs.trackRecent} onChange={(e) => setPrefs({ ...prefs, trackRecent: e.target.checked })} />Remember what I view</label><button className="label underline" onClick={clearRecent} disabled={!recent.length}>Clear</button></div></div>
      {recent.length ? <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">{list(recent).map((p) => <ProductCard key={p.slug} p={p} dark />)}</div> : <p className="mt-4 text-white/70">{prefs.trackRecent ? "Pairs you view will appear here." : "Tracking is off. Nothing is stored."}</p>}</section></div></div>);
}
