import type { MetadataRoute } from "next";
import { articles, collections, products } from "@/lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shoelocker.vercel.app";
  return ["", "/shop", "/vault", "/collections", "/archive", "/fit-passport", "/policies",
    ...products.map((p) => `/product/${p.slug}`), ...collections.map((c) => `/collections/${c.slug}`), ...articles.map((a) => `/archive/${a.slug}`)].map((u) => ({ url: base + u }));
}
