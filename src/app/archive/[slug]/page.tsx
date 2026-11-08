import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle } from "@/lib/catalog";
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug); if (!a) notFound();
  return (<article className="wrap max-w-3xl py-16"><Link href="/archive" className="label link-u">← The Archive</Link><p className="label mt-8 text-mute">{a.kicker} · {a.readMinutes} min</p><h1 className="display mt-2 text-[clamp(2.6rem,7vw,5.5rem)]">{a.title}</h1>
    <div className="mt-8 space-y-5 text-xl leading-relaxed">{a.body.map((b, i) => <p key={i}>{b}</p>)}</div><Link href="/shop" className="btn btn-solid mt-10">Shop the collection</Link></article>);
}
