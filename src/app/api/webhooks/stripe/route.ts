import { NextResponse } from "next/server";
import Stripe from "stripe";
import { commit, release } from "@/lib/inventory";
import { audit, orders, seenEvents, transition } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET; const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await req.text(); const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  let event: Stripe.Event;
  try { event = new Stripe(key).webhooks.constructEvent(raw, sig, secret); }
  catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }

  // Idempotency: a processed event id is acknowledged without re-applying effects.
  if (seenEvents().has(event.id)) return NextResponse.json({ received: true, duplicate: true });
  seenEvents().add(event.id);

  const obj = event.data.object as { id: string; client_reference_id?: string | null; payment_status?: string; metadata?: Record<string, string> | null; customer_details?: { email?: string | null } | null };
  const order = orders().get(obj.client_reference_id ?? obj.metadata?.orderId ?? "");
  if (!order) return NextResponse.json({ received: true, ignored: "unknown order" });

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      // Fulfil only when Stripe reports the money as paid. Out-of-order safe: transition() is monotone.
      if (obj.payment_status === "paid") {
        if (order.status === "expired") audit("system", "order.late_payment", `${order.id} paid after hold expiry; needs manual stock check`);
        if (transition(order, "paid")) { commit(order.reservationId); order.paidAt = new Date().toISOString(); order.email = obj.customer_details?.email ?? undefined; audit("stripe", "order.paid", order.id); }
      }
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      if (order.status === "pending" && transition(order, "expired")) { release(order.reservationId, "checkout-expired"); audit("stripe", "order.expired", order.id); }
      break;
    case "charge.refunded":
      if (transition(order, "refunded")) audit("stripe", "order.refunded", order.id);
      break;
  }
  return NextResponse.json({ received: true });
}
