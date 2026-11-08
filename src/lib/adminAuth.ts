import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const NAME = "sl_admin";
export const adminEnabled = () => !!process.env.ADMIN_PASSWORD && !!process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 24;
const sign = (v: string) => createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(v).digest("hex");
const eq = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export async function login(pw: string) {
  if (!adminEnabled() || !eq(pw, process.env.ADMIN_PASSWORD!)) return false;
  const exp = Date.now() + 8 * 3600_000; const v = `admin.${exp}`;
  (await cookies()).set(NAME, `${v}.${sign(v)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 8 * 3600 });
  return true;
}
export async function isAdmin() {
  if (!adminEnabled()) return false;
  const c = (await cookies()).get(NAME)?.value; if (!c) return false;
  const i = c.lastIndexOf("."); const v = c.slice(0, i); const exp = Number(v.split(".")[1]);
  return eq(c.slice(i + 1), sign(v)) && exp > Date.now();
}
export async function logout() { (await cookies()).delete({ name: NAME, path: "/admin" }); }
