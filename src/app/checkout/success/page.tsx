import Link from "next/link";
import { orders } from "@/lib/orders";
import { formatCAD } from "@/lib/money";
export const dynamic = "force-dynamic";
export const metadata = { title: "Order status", robots: { index: false } };

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const o = orders().get((await searchParams).order ?? "");
  const paid = o?.status === "paid" || o?.status === "fulfilled";
  return (<div className="wrap py-24 max-w-3xl"><p className="label text-mute">Order {o?.id ?? "unknown"}</p>
    <h1 className="display mt-2 text-6xl">{!o ? "We can't find that order" : paid ? "Payment confirmed" : "Confirming payment…"}</h1>
    <p className="mt-4 text-lg">{!o ? "If you were charged, contact support with your Stripe receipt." : paid ? "Thank you. A confirmation email is sent once email delivery is configured." : "Your pairs are held while Stripe confirms the payment. This page never marks an order paid on its own; only the verified webhook does. Refresh in a moment."}</p>
    {o && <ul className="mt-6 divide-y border-y">{o.lines.map((l) => (<li key={l.sku} className="flex justify-between py-3 text-sm"><span>{l.name} · {l.colorway} · US {l.sizeUS} × {l.qty}</span><span>{formatCAD(l.unitCents * l.qty)}</span></li>))}<li className="flex justify-between py-3 font-bold"><span>Total</span><span>{formatCAD(o.totalCents)}</span></li></ul>}
    <Link href="/shop" className="btn btn-solid mt-8">Keep exploring</Link></div>);
}
