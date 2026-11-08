import type { Article, Collection, Colorway, Product, Variant } from "./types";

/**
 * DEMONSTRATION CATALOG. Every product, brand, collection and story here is fictional.
 * No affiliation with any real footwear brand is implied. Stock figures are demo values.
 */

export const collections: Collection[] = [
  { slug: "noir-series", name: "NOIR SERIES", vault: true, tagline: "Black on black, studied closely.",
    narrative: "Six pairs built around a single question: how much can tonal black say? Different leathers, meshes and finishes, one palette." },
  { slug: "form-function", name: "FORM / FUNCTION", vault: false, tagline: "Nothing added. Nothing missing.",
    narrative: "Everyday shoes where each panel exists for a reason. Honest construction, clean silhouettes." },
  { slug: "after-hours", name: "AFTER HOURS", vault: true, tagline: "Made for the walk home.",
    narrative: "Reflective trims, softer midsoles and quiet colour for the part of the day that starts after the commute." },
  { slug: "motion-studies", name: "MOTION STUDIES", vault: false, tagline: "Performance, drawn carefully.",
    narrative: "Running and court shoes presented with their measurements, intended use and honest limits." },
  { slug: "objects-of-movement", name: "OBJECTS OF MOVEMENT", vault: true, tagline: "Small runs, long arguments.",
    narrative: "Limited demonstration releases. Each has a dated release and a clear eligibility rule shown on its page." },
];

export const articles: Article[] = [
  { slug: "anatomy-of-a-low-top", title: "Anatomy of a Low-Top", kicker: "Design", readMinutes: 4,
    excerpt: "Eleven parts, one silhouette. A walk through what each panel is for.",
    body: ["A low-top looks simple until you list its parts: toe box, vamp, quarter, eyestay, tongue, collar, heel counter, midsole, outsole, lining and insole.",
      "Each part makes a trade. A thicker heel counter steadies the foot and adds weight. A softer collar helps comfort and can loosen heel hold.",
      "When you evaluate a pair, look at the seams first. Where panels meet is where a shoe is either considered or merely assembled."] },
  { slug: "reading-a-size-chart", title: "Reading a Size Chart", kicker: "Fit", readMinutes: 3,
    excerpt: "Why a 9 is not always a 9, and what to do about it.",
    body: ["Size systems are conventions, not measurements. US, UK and EU numbers are related by approximations that drift by brand and last.",
      "The most reliable figure is foot length in centimetres compared against the manufacturer's stated insole length.",
      "Shoe Locker's Fit Passport stores your sizes per model so your own history, not a formula, becomes the guide."] },
  { slug: "why-black-is-hard", title: "Why Black Is Hard", kicker: "Culture", readMinutes: 5,
    excerpt: "Tonal black hides nothing. Texture has to do the talking.",
    body: ["A monochrome shoe removes colour as a crutch. Leather grain, mesh gauge, stitch density and sole finish carry the design.",
      "That is why tonal pairs reward close looking, and why they photograph so differently from their colourful siblings.",
      "NOIR SERIES treats black as a material study rather than a mood."] },
];

const SIZES = [7, 8, 9, 10, 11, 12];
const cw = (id: string, name: string, upper: string, panel: string, sole: string, accent: string, lace = "#E9E9E9"): Colorway =>
  ({ id, name, upper, panel, sole, accent, lace });

function mk(slug: string, colorways: Colorway[], stockPlan: number[][], range: [number, number] = [7, 12]): Variant[] {
  const out: Variant[] = [];
  colorways.forEach((c, ci) => {
    SIZES.filter((s) => s >= range[0] && s <= range[1]).forEach((s, si) => {
      out.push({ sku: `${slug.toUpperCase().replace(/-/g, "").slice(0, 8)}-${c.id.toUpperCase()}-${String(s).replace(".", "")}`,
        colorwayId: c.id, sizeUS: s, stock: stockPlan[ci % stockPlan.length][si % stockPlan[ci % stockPlan.length].length] });
    });
  });
  return out;
}

type P = Omit<Product, "variants" | "sizeRange"> & { stock: number[][] };
const raw: P[] = [
  { slug: "nord-01", name: "NORD 01", brand: "Atelier Nord", collection: "noir-series", category: "lifestyle", gender: "unisex", silhouette: "low",
    priceCents: 21000, description: "A tonal black low-top in full-grain leather with a stitched cupsole.", story: "NORD 01 is the reference pair of the series: one leather, one stitch pattern, nothing decorative.",
    specs: [{ label: "Upper", value: "Full-grain leather" }, { label: "Sole", value: "Stitched rubber cupsole" }, { label: "Closure", value: "Flat cotton laces" }],
    materials: ["Full-grain leather", "Cotton lining", "Natural rubber"], intendedUse: "Everyday wear", weightGrams: 410,
    colorways: [cw("blk", "Blackout", "#0b0b0b", "#1b1b1b", "#161616", "#343434"), cw("bone", "Bone", "#e9e9e9", "#d6d6d6", "#fafafa", "#151515", "#151515")],
    releasedAt: "2026-09-12", vault: true, featured: true, editorsPick: true, stock: [[3, 5, 6, 4, 2, 0], [2, 4, 3, 5, 1, 2]] },
  { slug: "nord-02-high", name: "NORD 02 HIGH", brand: "Atelier Nord", collection: "noir-series", category: "lifestyle", gender: "unisex", silhouette: "high",
    priceCents: 24000, description: "High-top companion to NORD 01 with a padded collar and nubuck overlays.", story: "A taller read of the same black study, with nubuck panels that change tone as the light moves.",
    specs: [{ label: "Upper", value: "Leather and nubuck" }, { label: "Collar", value: "Padded" }, { label: "Sole", value: "Stitched rubber cupsole" }],
    materials: ["Leather", "Nubuck", "Rubber"], intendedUse: "Everyday wear",
    colorways: [cw("blk", "Blackout", "#0e0e0e", "#262626", "#121212", "#343434")],
    releasedAt: "2026-10-03", vault: true, editorsPick: true, stock: [[1, 2, 3, 2, 1, 0]] },
  { slug: "form-lo", name: "FORM LO", brand: "Atelier Nord", collection: "form-function", category: "lifestyle", gender: "men", silhouette: "low",
    priceCents: 16500, description: "A clean canvas-and-leather low-top for daily use.", story: "Minimal construction with a cushioned insole. It does one thing, quietly.",
    specs: [{ label: "Upper", value: "Cotton canvas, leather heel tab" }, { label: "Sole", value: "Vulcanised rubber" }],
    materials: ["Cotton canvas", "Leather", "Rubber"], intendedUse: "Everyday wear", weightGrams: 360,
    colorways: [cw("wht", "Paper", "#ffffff", "#e9e9e9", "#f3f3f3", "#151515", "#151515"), cw("gry", "Graphite", "#343434", "#4a4a4a", "#e9e9e9", "#ffffff")],
    releasedAt: "2026-06-20", vault: false, stock: [[6, 8, 9, 7, 5, 3], [4, 5, 6, 6, 2, 1]] },
  { slug: "form-lo-wmns", name: "FORM LO W", brand: "Atelier Nord", collection: "form-function", category: "lifestyle", gender: "women", silhouette: "low",
    priceCents: 16500, compareAtCents: 19500, description: "The FORM LO on a narrower last, in a seasonal colourway now marked down.", story: "Same construction as FORM LO, cut on a narrower last. Currently reduced from its original price of $195.",
    specs: [{ label: "Upper", value: "Cotton canvas, leather heel tab" }, { label: "Last", value: "Narrower than FORM LO" }],
    materials: ["Cotton canvas", "Leather", "Rubber"], intendedUse: "Everyday wear",
    colorways: [cw("sand", "Sand", "#e9e9e9", "#d0d0d0", "#ffffff", "#343434", "#343434")],
    releasedAt: "2026-03-01", vault: false, stock: [[2, 4, 5, 3, 0, 0]] },
  { slug: "pace-r1", name: "PACE R1", brand: "Halden", collection: "motion-studies", category: "running", gender: "unisex", silhouette: "runner",
    priceCents: 19000, description: "A neutral daily trainer with an engineered-mesh upper and a foam midsole.", story: "Built for easy and steady miles. Documented weight and heel stack are listed below.",
    specs: [{ label: "Upper", value: "Engineered mesh" }, { label: "Midsole", value: "EVA foam" }, { label: "Heel stack", value: "32 mm (demo spec)" }, { label: "Drop", value: "8 mm (demo spec)" }],
    materials: ["Engineered mesh", "EVA foam", "Carbon rubber outsole"], intendedUse: "Daily road running", weightGrams: 275,
    colorways: [cw("wht", "Ghost", "#f2f2f2", "#cfcfcf", "#ffffff", "#151515"), cw("blk", "Night", "#151515", "#343434", "#e9e9e9", "#ffffff")],
    releasedAt: "2026-08-15", vault: false, featured: true, editorsPick: true, stock: [[7, 9, 8, 6, 4, 2], [5, 6, 7, 4, 3, 1]],
    fitNote: "Engineered mesh has some give. Runners often choose their usual size; verify with your Fit Passport history." },
  { slug: "pace-r2-tempo", name: "PACE R2 TEMPO", brand: "Halden", collection: "motion-studies", category: "running", gender: "men", silhouette: "runner",
    priceCents: 22000, description: "A lighter, firmer trainer for faster sessions.", story: "A firmer midsole and thinner upper for tempo work. Less cushion by design.",
    specs: [{ label: "Upper", value: "Single-layer mesh" }, { label: "Midsole", value: "Firm EVA blend" }, { label: "Heel stack", value: "28 mm (demo spec)" }],
    materials: ["Mesh", "EVA blend", "Rubber"], intendedUse: "Tempo and track sessions", weightGrams: 240,
    colorways: [cw("gry", "Concrete", "#e9e9e9", "#9a9a9a", "#151515", "#000000")],
    releasedAt: "2026-09-30", vault: false, stock: [[4, 5, 4, 3, 2, 1]] },
  { slug: "court-h9", name: "COURT H9", brand: "Kessler & Rowe", collection: "motion-studies", category: "basketball", gender: "men", silhouette: "high",
    priceCents: 21500, description: "A high-top court shoe with ankle support and a herringbone outsole.", story: "Built for indoor courts. The herringbone pattern is for lateral grip on hardwood.",
    specs: [{ label: "Upper", value: "Synthetic leather and mesh" }, { label: "Outsole", value: "Herringbone rubber" }, { label: "Intended surface", value: "Indoor court" }],
    materials: ["Synthetic leather", "Mesh", "Rubber"], intendedUse: "Indoor basketball", weightGrams: 460,
    colorways: [cw("blk", "Hardwood Black", "#111111", "#343434", "#e9e9e9", "#ffffff"), cw("wht", "Gym White", "#ffffff", "#d9d9d9", "#151515", "#000000", "#151515")],
    releasedAt: "2026-07-10", vault: false, stock: [[3, 4, 5, 6, 4, 2], [2, 3, 4, 3, 2, 0]] },
  { slug: "court-l3-wmns", name: "COURT L3 W", brand: "Kessler & Rowe", collection: "motion-studies", category: "basketball", gender: "women", silhouette: "high",
    priceCents: 20500, description: "A mid-weight court shoe cut for a narrower heel.", story: "Same herringbone traction as COURT H9 with a lower collar and narrower heel.",
    specs: [{ label: "Upper", value: "Synthetic leather and mesh" }, { label: "Outsole", value: "Herringbone rubber" }],
    materials: ["Synthetic leather", "Mesh", "Rubber"], intendedUse: "Indoor basketball",
    colorways: [cw("gry", "Smoke", "#9a9a9a", "#e9e9e9", "#151515", "#000000")],
    releasedAt: "2026-07-10", vault: false, stock: [[2, 3, 3, 2, 1, 0]] },
  { slug: "after-hours-ah1", name: "AFTER HOURS AH1", brand: "Halden", collection: "after-hours", category: "lifestyle", gender: "unisex", silhouette: "runner",
    priceCents: 23000, description: "A soft-midsole walker with reflective trim on the heel and tongue.", story: "Made for evening commutes, with reflective detailing that responds to headlights.",
    specs: [{ label: "Upper", value: "Suede and mesh" }, { label: "Trim", value: "Reflective heel and tongue" }],
    materials: ["Suede", "Mesh", "EVA"], intendedUse: "Everyday walking", weightGrams: 330,
    colorways: [cw("dsk", "Dusk", "#343434", "#151515", "#e9e9e9", "#ffffff")],
    releasedAt: "2026-12-05T15:00:00-05:00", releaseAt: "2026-12-05T15:00:00-05:00", vault: true, featured: true, stock: [[0, 0, 0, 0, 0, 0]] },
  { slug: "after-hours-ah2", name: "AFTER HOURS AH2", brand: "Halden", collection: "after-hours", category: "lifestyle", gender: "unisex", silhouette: "low",
    priceCents: 21000, description: "A low-profile follow-up to AH1 with a leather upper.", story: "A quieter second chapter with the same reflective trim on a lower profile.",
    specs: [{ label: "Upper", value: "Leather" }, { label: "Trim", value: "Reflective heel" }],
    materials: ["Leather", "EVA"], intendedUse: "Everyday wear",
    colorways: [cw("blk", "Midnight", "#0e0e0e", "#1b1b1b", "#343434", "#e9e9e9")],
    releasedAt: "2026-12-19T12:00:00-05:00", releaseAt: "2026-12-19T12:00:00-05:00", vault: true, stock: [[0, 0, 0, 0, 0, 0]] },
  { slug: "object-01", name: "OBJECT 01", brand: "Kessler & Rowe", collection: "objects-of-movement", category: "lifestyle", gender: "unisex", silhouette: "runner",
    priceCents: 32000, description: "A small-run sculpted runner with a two-part midsole and suede overlays.", story: "A demonstration limited run: 60 pairs total across the size range. Purchase is open to any signed-in or guest customer; one pair per order.",
    specs: [{ label: "Run size", value: "60 pairs (demo)" }, { label: "Limit", value: "1 pair per order" }, { label: "Upper", value: "Suede and mesh" }],
    materials: ["Suede", "Mesh", "Dual-density foam"], intendedUse: "Collecting and daily wear", weightGrams: 355,
    colorways: [cw("sil", "Silver Fog", "#c9c9c9", "#9a9a9a", "#ffffff", "#000000", "#151515")],
    releasedAt: "2026-10-20", vault: true, editorsPick: true, stock: [[1, 2, 2, 1, 1, 0]] },
  { slug: "archive-79", name: "ARCHIVE 79", brand: "Atelier Nord", collection: "objects-of-movement", category: "lifestyle", gender: "men", silhouette: "low",
    priceCents: 26000, description: "A reissue-style terrace trainer in suede with a gum sole.", story: "A tribute to late-seventies terrace trainers, rebuilt with modern foam under a traditional shape.",
    specs: [{ label: "Upper", value: "Suede" }, { label: "Sole", value: "Gum rubber" }],
    materials: ["Suede", "Rubber"], intendedUse: "Everyday wear", weightGrams: 390,
    colorways: [cw("gum", "Gum", "#d9d9d9", "#343434", "#bdbdbd", "#000000", "#ffffff")],
    releasedAt: "2026-11-01", vault: true, stock: [[2, 3, 4, 3, 2, 1]] },
];

export const products: Product[] = raw.map(({ stock, ...p }) => ({
  ...p, sizeRange: [7, 12], variants: mk(p.slug, p.colorways, stock),
}));

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const totalStock = (p: Product) => p.variants.reduce((n, v) => n + v.stock, 0);
export const findVariant = (sku: string) => {
  for (const p of products) { const v = p.variants.find((x) => x.sku === sku); if (v) return { product: p, variant: v }; }
};
export const isUpcoming = (p: Product, now = Date.now()) => !!p.releaseAt && new Date(p.releaseAt).getTime() > now;
export const onSale = (p: Product) => !!p.compareAtCents && p.compareAtCents > p.priceCents;
