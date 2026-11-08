"use client";
import { useEffect, useState } from "react";

/** Countdown only for a verified scheduled release (releaseAt on the product record). */
export function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { const t0 = setTimeout(() => setNow(Date.now()), 0); const t = setInterval(() => setNow(Date.now()), 1000); return () => { clearTimeout(t0); clearInterval(t); }; }, []);
  const target = new Date(to).getTime();
  if (now === null) return <p className="label" aria-hidden>—</p>;
  const d = Math.max(0, target - now); const parts = [["d", Math.floor(d / 864e5)], ["h", Math.floor(d / 36e5) % 24], ["m", Math.floor(d / 6e4) % 60], ["s", Math.floor(d / 1e3) % 60]] as const;
  if (d === 0) return <p className="label">Released</p>;
  return (<p className="font-mono text-3xl tabular-nums" role="timer" aria-label={`Releases in ${parts[0][1]} days ${parts[1][1]} hours`}>{parts.map(([u, n]) => `${String(n).padStart(2, "0")}${u}`).join(" ")}</p>);
}
