import { NextResponse } from "next/server";
import { filterProducts } from "@/lib/query";

export function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 60);
  const hits = filterProducts({ q }).slice(0, 6).map((p) => ({ slug: p.slug, name: p.name, brand: p.brand }));
  return NextResponse.json({ hits });
}
