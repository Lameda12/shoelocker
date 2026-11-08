import { describe, expect, it, beforeEach } from "vitest";
import Stripe from "stripe";
import { POST as webhook } from "@/app/api/webhooks/stripe/route";
import { orders } from "@/lib/orders";
import { getStock, reserve, setStock } from "@/lib/inventory";

process.env.STRIPE_SECRET_KEY = "sk_test_dummy"; process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
const stripe = new Stripe("sk_test_dummy");
const send = (evt: object, sign = true) => { const payload = JSON.stringify(evt); const header = sign ? stripe.webhooks.generateTestHeaderString({ payload, secret: "whsec_test" }) : "t=1,v1=bad";
  return webhook(new Request("http://x/api/webhooks/stripe", { method: "POST", body: payload, headers: { "stripe-signature": header } })); };
const ev = (id: string, type: string, status = "paid") => ({ id, object: "event", type, data: { object: { id: "cs_1", client_reference_id: "ORD1", payment_status: status, customer_details: { email: "a@b.ca" } } } });

beforeEach(() => {
  setStock("NORD01-BLK-9", 5, "t"); const r = reserve([{ sku: "NORD01-BLK-9", qty: 1 }]); if (!r.ok) throw new Error();
  orders().set("ORD1", { id: "ORD1", status: "pending", lines: [], subtotalCents: 1, shippingCents: 0, taxCents: 0, totalCents: 1, currency: "CAD", reservationId: r.id, createdAt: "", refundedCents: 0 });
});
describe("stripe webhook", () => {
  it("rejects bad signatures", async () => { expect((await send(ev("e0", "checkout.session.completed"), false)).status).toBe(400); expect(orders().get("ORD1")!.status).toBe("pending"); });
  it("marks paid once and ignores duplicates", async () => {
    expect((await send(ev("e1", "checkout.session.completed"))).status).toBe(200);
    const dup = await (await send(ev("e1", "checkout.session.completed"))).json(); expect(dup.duplicate).toBe(true); expect(orders().get("ORD1")!.status).toBe("paid");
  });
  it("does not fulfil unpaid sessions", async () => { await send(ev("e2", "checkout.session.completed", "unpaid")); expect(orders().get("ORD1")!.status).toBe("pending"); });
  it("out-of-order: late expiry after payment cannot release stock", async () => {
    await send(ev("e3", "checkout.session.completed")); const before = getStock("NORD01-BLK-9"); await send(ev("e4", "checkout.session.expired"));
    expect(orders().get("ORD1")!.status).toBe("paid"); expect(getStock("NORD01-BLK-9")).toBe(before);
  });
  it("expiry releases the hold for a pending order", async () => { const before = getStock("NORD01-BLK-9"); await send(ev("e5", "checkout.session.expired")); expect(orders().get("ORD1")!.status).toBe("expired"); expect(getStock("NORD01-BLK-9")).toBe(before + 1); });
});
