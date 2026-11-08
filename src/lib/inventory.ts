import "server-only";
import { products } from "./catalog";

/**
 * Demo inventory adapter (in-process). The production adapter is the Prisma/PostgreSQL
 * schema in prisma/schema.prisma, where reserve() becomes a single conditional UPDATE
 * (`WHERE available >= qty`) inside a transaction. Semantics here mirror that contract.
 */
interface Reservation { id: string; lines: { sku: string; qty: number }[]; expiresAt: number; state: "held" | "committed" | "released" }
interface Store { stock: Map<string, number>; reservations: Map<string, Reservation>; movements: { sku: string; delta: number; reason: string; at: string }[] }

const g = globalThis as unknown as { __slStore?: Store };
function store(): Store {
  if (!g.__slStore) {
    const stock = new Map<string, number>();
    for (const p of products) for (const v of p.variants) stock.set(v.sku, v.stock);
    g.__slStore = { stock, reservations: new Map(), movements: [] };
  }
  return g.__slStore;
}

export const HOLD_MS = 30 * 60 * 1000;
export const getStock = (sku: string) => store().stock.get(sku) ?? 0;

export function sweepExpired(now = Date.now()) {
  const s = store();
  for (const r of s.reservations.values())
    if (r.state === "held" && r.expiresAt <= now) release(r.id, "expired");
}

/** All-or-nothing. Synchronous, so no interleaving within one process. */
export function reserve(lines: { sku: string; qty: number }[]): { ok: true; id: string } | { ok: false; sku: string; available: number } {
  sweepExpired();
  const s = store();
  for (const l of lines) {
    const have = s.stock.get(l.sku) ?? 0;
    if (have < l.qty) return { ok: false, sku: l.sku, available: have };
  }
  const id = crypto.randomUUID();
  for (const l of lines) {
    s.stock.set(l.sku, (s.stock.get(l.sku) ?? 0) - l.qty);
    s.movements.push({ sku: l.sku, delta: -l.qty, reason: `reserve:${id}`, at: new Date().toISOString() });
  }
  s.reservations.set(id, { id, lines, expiresAt: Date.now() + HOLD_MS, state: "held" });
  return { ok: true, id };
}

export function commit(id: string) {
  const r = store().reservations.get(id);
  if (r && r.state === "held") r.state = "committed";
  return !!r && r.state === "committed";
}

export function release(id: string, reason = "released") {
  const s = store();
  const r = s.reservations.get(id);
  if (!r || r.state !== "held") return false;
  for (const l of r.lines) {
    s.stock.set(l.sku, (s.stock.get(l.sku) ?? 0) + l.qty);
    s.movements.push({ sku: l.sku, delta: l.qty, reason: `${reason}:${id}`, at: new Date().toISOString() });
  }
  r.state = "released";
  return true;
}

export function adjust(sku: string, delta: number, reason: string) {
  const s = store();
  if (!s.stock.has(sku)) return null;
  const next = Math.max(0, (s.stock.get(sku) ?? 0) + delta);
  s.stock.set(sku, next);
  s.movements.push({ sku, delta, reason, at: new Date().toISOString() });
  return next;
}
export const setStock = (sku: string, qty: number, reason: string) => adjust(sku, qty - getStock(sku), reason);
export const movements = () => store().movements.slice(-50).reverse();
