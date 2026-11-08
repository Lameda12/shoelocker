"use client";
import { useState } from "react";

export function NewsletterForm({ tone = "light", topic = "newsletter", slug }: { tone?: "light" | "dark"; topic?: "newsletter" | "drop"; slug?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle"); const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); setState("busy");
    const r = await fetch("/api/drops", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: f.get("email"), consent: f.get("consent") === "on", topic, slug }) });
    const d = await r.json().catch(() => ({})); setState(r.ok ? "ok" : "err"); setMsg(d.message ?? (r.ok ? "Subscribed." : "Something went wrong."));
  }
  if (state === "ok") return <p role="status" className="label">{msg}</p>;
  return (<form onSubmit={submit} className="space-y-3" noValidate={false}>
    <label className="label block" htmlFor={`e-${topic}-${slug}`}>{topic === "drop" ? "Notify me when this releases" : "Email"}</label>
    <div className="flex"><input id={`e-${topic}-${slug}`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={`h-12 min-w-0 flex-1 border px-4 text-sm outline-none ${tone === "dark" ? "border-white/40 bg-transparent text-white focus:border-white" : "border-black/40 bg-white focus:border-black"}`} />
      <button className={`btn ${tone === "dark" ? "btn-solid" : "btn-solid"}`} disabled={state === "busy"}>{state === "busy" ? "…" : "Subscribe"}</button></div>
    <label className="flex items-start gap-3 text-xs leading-snug opacity-80"><input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4" />I agree to receive {topic === "drop" ? "a release notification" : "emails"} from Shoe Locker. I can unsubscribe at any time (CASL).</label>
    {state === "err" && <p role="alert" className="text-xs">{msg}</p>}</form>);
}
