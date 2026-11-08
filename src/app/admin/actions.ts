"use server";
import { revalidatePath } from "next/cache";
import { isAdmin, login, logout } from "@/lib/adminAuth";
import { adjust, release, setStock } from "@/lib/inventory";
import { audit, orders, transition } from "@/lib/orders";
import { limited } from "@/lib/rate";
import { z } from "zod";

// Every action re-checks authorization on the server. Never rely on the page having hidden the form.
async function guard() { if (!(await isAdmin())) throw new Error("Unauthorized"); }

export async function loginAction(fd: FormData) {
  if (limited("admin-login", 5, 5 * 60_000)) return;
  const ok = await login(String(fd.get("password") ?? "")); audit("anonymous", ok ? "admin.login" : "admin.login_failed", "");
  revalidatePath("/admin");
}
export async function logoutAction() { await logout(); revalidatePath("/admin"); }
export async function setStockAction(fd: FormData) {
  await guard(); const p = z.object({ sku: z.string().max(40), qty: z.coerce.number().int().min(0).max(10000) }).parse(Object.fromEntries(fd));
  const r = setStock(p.sku, p.qty, "admin-set"); audit("admin", "inventory.set", `${p.sku}=${p.qty}`); if (r === null) throw new Error("Unknown SKU");
  revalidatePath("/admin"); revalidatePath("/product/[slug]", "page");
}
export async function orderAction(fd: FormData) {
  await guard(); const p = z.object({ id: z.string().max(40), op: z.enum(["fulfil", "refund", "cancel"]), tracking: z.string().max(60).optional(), confirm: z.literal("on") }).parse(Object.fromEntries(fd));
  const o = orders().get(p.id); if (!o) throw new Error("No such order");
  if (p.op === "fulfil" && transition(o, "fulfilled")) { if (p.tracking) o.tracking = { carrier: "Canada Post", number: p.tracking }; }
  if (p.op === "refund" && transition(o, "refunded")) { o.refundedCents = o.totalCents; for (const l of o.lines) adjust(l.sku, l.qty, `refund-restock:${o.id}`); }
  if (p.op === "cancel" && transition(o, "cancelled")) release(o.reservationId, "admin-cancel");
  audit("admin", `order.${p.op}`, o.id); revalidatePath("/admin");
}
