"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Hit { slug: string; name: string; brand: string }
export function SearchBox({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState(""); const [hits, setHits] = useState<Hit[]>([]); const [open, setOpen] = useState(false); const [active, setActive] = useState(-1);
  const router = useRouter(); const id = useId(); const box = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (q.trim().length < 2) return;
    const ctl = new AbortController();
    const t = setTimeout(() => fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctl.signal }).then((r) => r.json()).then((d) => { setHits(d.hits); setOpen(true); }).catch(() => {}), 120);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q]);
  useEffect(() => { const h = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const go = (href: string) => { setOpen(false); onDone?.(); router.push(href); };
  return (
    <form ref={box} role="search" className="relative w-full" onSubmit={(e) => { e.preventDefault(); if (active >= 0 && hits[active]) go(`/product/${hits[active].slug}`); else if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`); }}>
      <label htmlFor={id} className="sr-only">Search sneakers</label>
      <input id={id} value={q} onChange={(e) => { setQ(e.target.value); setActive(-1); }} placeholder="Search sneakers, brands, colours" autoComplete="off" role="combobox" aria-expanded={open} aria-controls={`${id}-l`} aria-autocomplete="list"
        onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); } if (e.key === "Escape") setOpen(false); }}
        className="h-12 w-full border border-black/30 bg-white px-4 text-sm outline-none focus:border-black" />
      {open && q.trim().length >= 2 && (
        <ul id={`${id}-l`} role="listbox" className="absolute left-0 right-0 top-full z-50 border border-black bg-white text-black">
          {hits.length === 0 ? <li className="p-4 text-sm text-mute">No sneakers match “{q}”. Try a brand, colour or category.</li> :
            hits.map((h, i) => (<li key={h.slug} role="option" aria-selected={i === active}><button type="button" onClick={() => go(`/product/${h.slug}`)} className={`flex w-full justify-between px-4 py-3 text-left text-sm hover:bg-arch ${i === active ? "bg-arch" : ""}`}><span className="font-semibold">{h.name}</span><span className="label text-mute">{h.brand}</span></button></li>))}
        </ul>)}
    </form>);
}
