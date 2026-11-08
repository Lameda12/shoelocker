"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  if (usePathname().startsWith("/vault")) return null;
  return (
    <footer className="dark-zone mt-24">
      <div className="grid-cols-1 wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div><Mark className="h-10 w-10" /><p className="display mt-6 text-4xl">Not just worn.<br />Discovered.</p>
          <div className="mt-8 max-w-md"><NewsletterForm tone="dark" /></div></div>
        {[["Shop", [["New Arrivals", "/shop?new=1&sort=newest"], ["All sneakers", "/shop"], ["Compare", "/compare"], ["Sale", "/shop?sale=1"]]],
          ["Discover", [["The Vault", "/vault"], ["Collections", "/collections"], ["Archive", "/archive"], ["Fit Passport", "/fit-passport"]]],
          ["Care", [["Shipping & returns", "/policies"], ["Privacy", "/policies#privacy"], ["Terms", "/policies#terms"], ["Your Locker", "/locker"]]]].map(([h, ls]) => (
          <div key={h as string}><h2 className="label text-white/60">{h as string}</h2><ul className="mt-4 space-y-3">{(ls as string[][]).map(([l, href]) => (<li key={l}><Link href={href} className="link-u text-sm">{l}</Link></li>))}</ul></div>))}
      </div>
      <div className="wrap border-t border-white/15 py-6 text-xs text-white/60">
        <p>Demonstration catalog. All products, brands and collections are fictional and no real footwear brand affiliation is implied. Checkout runs in test mode only. “Shoe Locker” is pending trademark clearance.</p>
      </div>
    </footer>);
}
