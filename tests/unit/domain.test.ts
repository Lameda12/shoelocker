import { describe, expect, it } from "vitest";
import { filterProducts } from "@/lib/query";
import { convertFromUS, toUS } from "@/lib/sizes";
import { products, isUpcoming, onSale } from "@/lib/catalog";
import { transition, type Order } from "@/lib/orders";
import { totals } from "@/lib/shipping";

const order = (status: Order["status"]): Order => ({ id: "x", status, lines: [], subtotalCents: 0, shippingCents: 0, taxCents: 0, totalCents: 0, currency: "CAD", reservationId: "r", createdAt: "", refundedCents: 0 });

describe("catalog integrity", () => {
  it("has unique SKUs and integer prices", () => {
    const skus = products.flatMap((p) => p.variants.map((v) => v.sku)); expect(new Set(skus).size).toBe(skus.length);
    expect(products.every((p) => Number.isInteger(p.priceCents))).toBe(true);
  });
  it("only marks a sale when a real higher compare-at price exists", () => { expect(products.filter(onSale).every((p) => p.compareAtCents! > p.priceCents)).toBe(true); });
  it("upcoming releases have no stock loaded", () => { for (const p of products.filter((p) => isUpcoming(p, Date.parse("2026-11-08")))) expect(p.variants.every((v) => v.stock === 0)).toBe(true); });
});
describe("filters", () => {
  it("filters really change results", () => {
    const all = filterProducts({}).length;
    expect(filterProducts({ category: "running" }).every((p) => p.category === "running")).toBe(true);
    expect(filterProducts({ category: "running" }).length).toBeLessThan(all);
    expect(filterProducts({ max: 170 }).every((p) => p.priceCents <= 17000)).toBe(true);
    expect(filterProducts({ brand: ["Halden"] }).every((p) => p.brand === "Halden")).toBe(true);
    expect(filterProducts({ size: [12], inStock: true }).every((p) => p.variants.some((v) => v.sizeUS === 12 && v.stock > 0))).toBe(true);
  });
  it("search handles no matches and multiple tokens", () => {
    expect(filterProducts({ q: "zzzzqq" })).toHaveLength(0); expect(filterProducts({ q: "pace halden" }).map((p) => p.slug)).toContain("pace-r1");
  });
});
describe("sizes", () => { it("round-trips", () => { for (const r of ["UK", "EU"] as const) expect(toUS(convertFromUS(9, r), r)).toBe(9); }); });
describe("order state machine", () => {
  it("is monotone and idempotent", () => {
    const o = order("pending"); expect(transition(o, "paid")).toBe(true); expect(transition(o, "paid")).toBe(true); expect(transition(o, "pending" as never)).toBe(false);
    expect(transition(o, "fulfilled")).toBe(true); expect(transition(o, "cancelled")).toBe(false); expect(transition(o, "refunded")).toBe(true);
  });
  it("does not let a stale expiry event revert a paid order", () => { const o = order("paid"); expect(transition(o, "expired")).toBe(false); expect(o.status).toBe("paid"); });
});
describe("totals", () => { it("applies free shipping over threshold", () => { expect(totals(25000).shipping).toBe(0); expect(totals(10000).shipping).toBe(1500); }); });
