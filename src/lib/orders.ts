import "server-only";

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled" | "refunded" | "expired";
export interface OrderLine { sku: string; name: string; colorway: string; sizeUS: number; qty: number; unitCents: number }
export interface Order {
  id: string; status: OrderStatus; lines: OrderLine[]; subtotalCents: number; shippingCents: number; taxCents: number; totalCents: number;
  currency: "CAD"; reservationId: string; stripeSessionId?: string; email?: string; createdAt: string; paidAt?: string; refundedCents: number;
  tracking?: { carrier: string; number: string };
}
const g = globalThis as unknown as { __slOrders?: Map<string, Order>; __slEvents?: Set<string>; __slAudit?: { at: string; actor: string; action: string; detail: string }[] };
export const orders = (): Map<string, Order> => (g.__slOrders ??= new Map<string, Order>());
export const seenEvents = () => (g.__slEvents ??= new Set<string>());
export const auditLog = () => (g.__slAudit ??= []);
export const audit = (actor: string, action: string, detail: string) => auditLog().unshift({ at: new Date().toISOString(), actor, action, detail });

const allowed: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled", "expired"], paid: ["fulfilled", "refunded", "cancelled"], fulfilled: ["refunded"],
  cancelled: [], refunded: [], expired: ["paid"], // late payment on an expired hold is flagged for manual review
};
export function transition(o: Order, to: OrderStatus): boolean {
  if (o.status === to) return true; // idempotent
  if (!allowed[o.status].includes(to)) return false;
  o.status = to; return true;
}
