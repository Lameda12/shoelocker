import Link from "next/link";
import { articles } from "@/lib/catalog";
export const metadata = { title: "The Archive" };
export default function Archive() {
  return (<div className="wrap py-12"><h1 className="display text-[clamp(3rem,8vw,7rem)]">The Archive</h1><p className="mt-4 max-w-lg text-lg text-mute">Design, fit and culture, written about the shoes we sell.</p>
    <ul className="mt-10 border-t border-black">{articles.map((a) => (<li key={a.slug} className="border-b border-black"><Link href={`/archive/${a.slug}`} className="grid-cols-1 group grid gap-2 py-8 md:grid-cols-[160px_1fr_auto] md:items-baseline"><span className="label text-mute">{a.kicker}</span><span><span className="display block text-4xl group-hover:underline">{a.title}</span><span className="mt-2 block text-mute">{a.excerpt}</span></span><span className="label">{a.readMinutes} min →</span></Link></li>))}</ul></div>);
}
