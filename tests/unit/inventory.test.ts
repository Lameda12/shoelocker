import { beforeEach, describe, expect, it } from "vitest";
import { commit, getStock, release, reserve, setStock } from "@/lib/inventory";

const SKU = "NORD01-BLK-12"; // seeded with 0 in demo data; we set explicitly
beforeEach(() => { setStock(SKU, 1, "test-reset"); });

describe("inventory reservation", () => {
  it("lets exactly one of many concurrent buyers take the last pair", async () => {
    const results = await Promise.all(Array.from({ length: 50 }, async () => reserve([{ sku: SKU, qty: 1 }])));
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(getStock(SKU)).toBe(0);
  });
  it("is all-or-nothing across lines", () => {
    setStock("NORD01-BLK-7", 3, "t"); setStock(SKU, 0, "t");
    const r = reserve([{ sku: "NORD01-BLK-7", qty: 1 }, { sku: SKU, qty: 1 }]);
    expect(r.ok).toBe(false); expect(getStock("NORD01-BLK-7")).toBe(3);
  });
  it("release restores stock once and is idempotent", () => {
    const r = reserve([{ sku: SKU, qty: 1 }]); if (!r.ok) throw new Error("expected ok");
    expect(release(r.id)).toBe(true); expect(release(r.id)).toBe(false); expect(getStock(SKU)).toBe(1);
  });
  it("does not release a committed reservation", () => {
    const r = reserve([{ sku: SKU, qty: 1 }]); if (!r.ok) throw new Error("expected ok");
    commit(r.id); expect(release(r.id)).toBe(false); expect(getStock(SKU)).toBe(0);
  });
});
