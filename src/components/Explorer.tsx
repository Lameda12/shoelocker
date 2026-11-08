"use client";
import { useState } from "react";
import { Shoe, type ShoeView } from "./Shoe";
import type { Colorway, Product } from "@/lib/types";

const VIEWS: { v: ShoeView; label: string }[] = [{ v: "side", label: "Lateral" }, { v: "detail", label: "Material detail" }, { v: "sole", label: "Outsole" }];
export function Explorer({ p, colorway, onColorway, dark }: { p: Product; colorway: Colorway; onColorway: (id: string) => void; dark?: boolean }) {
  const [view, setView] = useState<ShoeView>("side"); const [zoom, setZoom] = useState(false); const [pos, setPos] = useState({ x: 50, y: 50 });
  const move = (e: React.PointerEvent<HTMLButtonElement>) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); };
  return (
    <div>
      <button type="button" aria-pressed={zoom} aria-label={zoom ? "Zoom out" : "Zoom in"} onClick={() => setZoom((z) => !z)} onPointerMove={zoom ? move : undefined}
        className={`${dark ? "stage-dark" : "stage"} relative flex aspect-[5/4] w-full touch-pan-y items-center justify-center overflow-hidden ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}>
        <div className="h-full w-full transition-transform duration-300 ease-out flex items-center justify-center" style={{ transform: zoom ? "scale(2.1)" : "scale(1)", transformOrigin: `${pos.x}% ${pos.y}%` }}>
          <Shoe colorway={colorway} silhouette={p.silhouette} view={view} title={`${p.name}, ${colorway.name}, ${VIEWS.find((x) => x.v === view)!.label}`} className="w-[94%]" priority />
        </div>
        <span className="label absolute left-3 top-3 opacity-60">{VIEWS.find((x) => x.v === view)!.label}</span>
        <span className="label absolute bottom-3 right-3 opacity-60">{zoom ? "Move to pan · tap to exit" : "Tap to zoom"}</span>
      </button>
      <div role="group" aria-label="Product views" className="mt-3 grid grid-cols-3 gap-3">
        {VIEWS.map(({ v, label }) => (<button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`${dark ? "stage-dark" : "stage"} border p-1 ${view === v ? "border-current" : "border-transparent opacity-70 hover:opacity-100"}`}><Shoe colorway={colorway} silhouette={p.silhouette} view={v} title={label} className="aspect-[5/3] w-full" /><span className="label block py-1">{label}</span></button>))}
      </div>
      {p.colorways.length > 1 && (<div role="radiogroup" aria-label="Colourway" className="mt-4 flex flex-wrap gap-2">{p.colorways.map((c) => (<button key={c.id} role="radio" aria-checked={c.id === colorway.id} onClick={() => onColorway(c.id)} className={`flex items-center gap-2 border px-3 py-2 text-sm ${c.id === colorway.id ? "border-current" : "border-current/25 hover:border-current"}`}><span className="h-4 w-4 rounded-full border border-black/30" style={{ background: c.upper }} />{c.name}</button>))}</div>)}
      <p className="label mt-3 opacity-60">Vector illustrations of a demonstration product. No 360° model exists for this item, so none is shown.</p>
    </div>);
}
