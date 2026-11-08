import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { findVariant, isUpcoming } from "@/lib/catalog";
import { release, reserve } from "@/lib/inventory";
import { orders, type Order } from "@/lib/orders";
import { totals } from "@/lib/shipping";
import { ipOf, limited } from "@/lib/rate";

const body = z.object({ lines: z.array(z.object({ sku: z.string().max(40), qty: z.number().int().min(1).max(5) })).min(1).max(10) });

export async function POST(req: Request) {
  if (limited(`co:${ipOf(req)}`, 10)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart." }, { status: 400 });

  // 1. Validate variants and re-price on the server. Client prices are never read.
  const merged = new Map<string, number>();
  for (const l of parsed.data.lines) merged.set(l.sku, (merged.get(l.sku) ?? 0) + l.qty);
  const lines = [];
  for (const [sku, qty] of merged) {
    const hit = findVariant(sku);
    if (!hit) return NextResponse.json({ error: `Unknown item ${sku}.` }, { status: 400 });
    if (isUpcoming(hit.product)) return NextResponse.json({ error: `${hit.product.name} has not released yet.` }, { status: 409 });
    if (hit.product.slug === "object-01" && qty > 1) return NextResponse.json({ error: "OBJECT 01 is limited to one pair per order." }, { status: 409 });
    const cw = hit.product.colorways.find((c) => c.id === hit.variant.colorwayId)!;
    lines.push({ sku, name: hit.product.name, colorway: cw.name, sizeUS: hit.variant.sizeUS, qty, unitCents: hit.product.priceCents });
  }
  // 2. Atomically reserve stock.
  const res = reserve(lines.map((l) => ({ sku: l.sku, qty: l.qty })));
  if (!res.ok) return NextResponse.json({ error: "Some items just sold out or have fewer pairs available.", sku: res.sku, available: res.available }, { status: 409 });

  const subtotal = lines.reduce((n, l) => n + l.unitCents * l.qty, 0);
  const t = totals(subtotal);
  // 3. Immutable price snapshot on a pending order.
  const id = `SL-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1e3)}`;
  const order: Order = { id, status: "pending", lines, subtotalCents: t.subtotal, shippingCents: t.shipping, taxCents: t.tax, totalCents: t.total, currency: "CAD", reservationId: res.id, createdAt: new Date().toISOString(), refundedCents: 0 };
  orders().set(id, order);

  const key = process.env.STRIPE_SECRET_KEY;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  if (!key || !key.startsWith("sk_test_")) {
    // No test key configured: stock hold is released and we say so honestly.
    release(res.id, "no-payment-provider"); order.status = "cancelled";
    return NextResponse.json({ error: "Payments are not configured in this deployment. Set STRIPE_SECRET_KEY (test mode) to enable checkout.", code: "payments_unconfigured", totals: t }, { status: 503 });
  }
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "payment", currency: "cad",
      line_items: [
        ...lines.map((l) => ({ quantity: l.qty, price_data: { currency: "cad", unit_amount: l.unitCents, product_data: { name: `${l.name} — ${l.colorway}, US ${l.sizeUS}`, metadata: { sku: l.sku } } } })),
        ...(t.shipping ? [{ quantity: 1, price_data: { currency: "cad", unit_amount: t.shipping, product_data: { name: "Shipping" } } }] : []),
        { quantity: 1, price_data: { currency: "cad", unit_amount: t.tax, product_data: { name: "Estimated tax" } } },
      ],
      shipping_address_collection: { allowed_countries: ["CA"] },
      metadata: { orderId: id }, client_reference_id: id,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      success_url: `${origin}/checkout/success?order=${id}`, cancel_url: `${origin}/cart?cancelled=1`,
    }, { idempotencyKey: `checkout-${id}` });
    order.stripeSessionId = session.id;
    return NextResponse.json({ url: session.url });
  } catch (e) {
    release(res.id, "stripe-error"); order.status = "cancelled";
    console.error("stripe checkout error", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "We couldn't start payment. Your cart is unchanged." }, { status: 502 });
  }
}
