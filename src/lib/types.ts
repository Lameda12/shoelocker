export type Silhouette = "low" | "runner" | "high";
export type Category = "lifestyle" | "running" | "basketball";
export type Gender = "men" | "women" | "unisex";

export interface Colorway {
  id: string;
  name: string;
  upper: string;
  panel: string;
  sole: string;
  accent: string;
  lace: string;
}

export interface Variant {
  sku: string;
  colorwayId: string;
  sizeUS: number; // men's US sizing
  stock: number;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  collection: string; // collection slug
  category: Category;
  gender: Gender;
  silhouette: Silhouette;
  priceCents: number; // CAD minor units
  compareAtCents?: number; // only when a real markdown exists
  description: string;
  story: string;
  specs: { label: string; value: string }[];
  materials: string[];
  weightGrams?: number; // only when documented
  intendedUse: string;
  colorways: Colorway[];
  variants: Variant[];
  releasedAt: string; // ISO
  releaseAt?: string; // ISO, for scheduled vault releases
  vault: boolean;
  editorsPick?: boolean;
  featured?: boolean;
  sizeRange: [number, number];
  fitNote?: string; // only with supporting product data
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  narrative: string;
  vault: boolean;
}

export interface Article {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  body: string[];
  readMinutes: number;
}
