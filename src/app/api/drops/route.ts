import { NextResponse } from "next/server";
import { z } from "zod";
import { limited, ipOf } from "@/lib/rate";
import { getProduct } from "@/lib/catalog";
import { audit } from "@/lib/orders";

const schema = z.object({ email: z.email().max(200), consent: z.literal(true), topic: z.enum(["newsletter", "drop"]), slug: z.string().max(80).optional() });
const g = globalThis as unknown as { __slSubs?: { email: string; topic: string; slug?: string; at: string; consentText: string }[] };

export async function POST(req: Request) {
  if (limited(`drops:${ipOf(req)}`, 6)) return NextResponse.json({ message: "Too many requests. Try again shortly." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Enter a valid email and confirm consent." }, { status: 400 });
  const { email, topic, slug } = parsed.data;
  if (slug && !getProduct(slug)) return NextResponse.json({ message: "Unknown release." }, { status: 404 });
  const list = (g.__slSubs ??= []);
  if (!list.some((s) => s.email === email && s.topic === topic && s.slug === slug))
    list.push({ email, topic, slug, at: new Date().toISOString(), consentText: "Express consent checkbox, CASL wording v1" });
  audit("system", "subscription.created", `${topic}${slug ? `:${slug}` : ""}`);
  return NextResponse.json({ message: topic === "drop" ? "You're on the list. We'll email once, when it releases." : "Subscribed. Unsubscribe anytime." });
}
