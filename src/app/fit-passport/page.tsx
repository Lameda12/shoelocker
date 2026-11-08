"use client";
import { useState } from "react";
import { useStore, type FitProfile } from "@/components/Providers";
import { SIZE_CHART, SIZE_SOURCE_NOTE, convertFromUS, toUS, type Region } from "@/lib/sizes";
import { products } from "@/lib/catalog";

const blank: FitProfile = { region: "US", size: "", width: "", preference: "", known: [] };
export default function FitPassport() {
  const { fit, setFit, notify, ready } = useStore(); const [draft, setDraft] = useState<FitProfile | null>(null); const f = draft ?? fit ?? blank;
  const upd = (p: Partial<FitProfile>) => setDraft({ ...f, ...p });
  const us = f.size ? toUS(parseFloat(f.size), f.region) : null; const valid = us !== null && us >= 3 && us <= 18;
  if (!ready) return <div className="wrap py-16"><div className="skel h-20 w-1/2" /></div>;
  return (<div className="wrap max-w-4xl py-14"><p className="label text-mute">Fit Passport</p><h1 className="display mt-2 text-[clamp(2.6rem,7vw,6rem)]">Your sizes, remembered.</h1>
    <p className="mt-4 max-w-xl text-lg">Saved on this device only. We never predict fit accuracy; we show your own history next to each product&apos;s documented data.</p>
    <form className="grid-cols-1 mt-10 grid gap-6 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); if (!valid) return notify("Enter a valid size"); setFit({ ...f, known: f.known.filter((k) => k.model && k.size) }); setDraft(null); notify("Fit Passport saved"); }}>
      <div><label className="label" htmlFor="reg">Region</label><select id="reg" value={f.region} onChange={(e) => upd({ region: e.target.value as Region })} className="mt-2 h-12 w-full border border-black/40 bg-white px-3"><option>US</option><option>UK</option><option>EU</option></select></div>
      <div><label className="label" htmlFor="sz">Preferred size ({f.region} men’s scale)</label><input id="sz" inputMode="decimal" value={f.size} onChange={(e) => upd({ size: e.target.value })} aria-invalid={!!f.size && !valid} className="mt-2 h-12 w-full border border-black/40 px-3" placeholder={f.region === "EU" ? "42.5" : "9"} /></div>
      <div><label className="label" htmlFor="w">Width (optional)</label><select id="w" value={f.width} onChange={(e) => upd({ width: e.target.value as FitProfile["width"] })} className="mt-2 h-12 w-full border border-black/40 bg-white px-3"><option value="">No preference</option><option value="narrow">Narrow</option><option value="regular">Regular</option><option value="wide">Wide</option></select></div>
      <div><label className="label" htmlFor="p">Fit preference (optional)</label><select id="p" value={f.preference} onChange={(e) => upd({ preference: e.target.value as FitProfile["preference"] })} className="mt-2 h-12 w-full border border-black/40 bg-white px-3"><option value="">No preference</option><option value="snug">Snug</option><option value="true">True to size</option><option value="roomy">Roomy</option></select></div>
      <fieldset className="sm:col-span-2"><legend className="label">Sizes you know in specific models</legend>
        {f.known.map((k, i) => (<div key={i} className="mt-2 flex gap-2"><select aria-label="Model" value={k.model} onChange={(e) => upd({ known: f.known.map((x, j) => (j === i ? { ...x, model: e.target.value } : x)) })} className="h-11 flex-1 border border-black/40 bg-white px-2"><option value="">Choose a model</option>{products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}</select>
          <input aria-label="Size (US)" placeholder="US size" value={k.size} onChange={(e) => upd({ known: f.known.map((x, j) => (j === i ? { ...x, size: e.target.value } : x)) })} className="h-11 w-28 border border-black/40 px-2" /><button type="button" className="btn !min-h-11" onClick={() => upd({ known: f.known.filter((_, j) => j !== i) })}>Remove</button></div>))}
        <button type="button" className="btn mt-3" onClick={() => upd({ known: [...f.known, { model: "", size: "" }] })}>+ Add a model</button></fieldset>
      <div className="flex flex-wrap gap-3 sm:col-span-2"><button className="btn btn-solid">Save Fit Passport</button>
        {fit && <button type="button" className="btn" onClick={() => { setFit(null); setDraft(null); notify("Fit information deleted"); }}>Delete my fit information</button>}</div></form>
    {valid && us !== null && <section className="mt-12" aria-label="Conversions"><h2 className="label">Your size across regions</h2><p className="display mt-2 text-4xl">US {us} · UK {convertFromUS(us, "UK")} · EU {convertFromUS(us, "EU")}</p></section>}
    <section className="mt-12"><h2 className="label">Conversion table</h2><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[420px] text-left text-sm"><thead><tr className="border-b border-black"><th className="py-2">US</th><th>UK</th><th>EU</th><th>Foot (cm)</th></tr></thead><tbody>{SIZE_CHART.map((r) => (<tr key={r.US} className="border-b border-black/10"><td className="py-2">{r.US}</td><td>{r.UK}</td><td>{r.EU}</td><td>{r.cm}</td></tr>))}</tbody></table></div><p className="mt-3 text-sm text-mute">{SIZE_SOURCE_NOTE}</p></section></div>);
}
