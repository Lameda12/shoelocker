"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Logo";
import { SearchBox } from "./SearchBox";
import { useStore } from "./Providers";

const NAV = [["New Arrivals", "/shop?new=1&sort=newest"], ["Men", "/shop?gender=men"], ["Women", "/shop?gender=women"], ["Running", "/shop?category=running"], ["Basketball", "/shop?category=basketball"], ["Lifestyle", "/shop?category=lifestyle"], ["Collections", "/collections"], ["The Vault", "/vault"], ["Archive", "/archive"]] as const;

export function Header() {
  const [open, setOpen] = useState(false); const [find, setFind] = useState(false); const { cartCount, ready, wishlist } = useStore(); const path = usePathname();
  if (path.startsWith("/vault")) return null; // Vault supplies its own minimal chrome with a clear exit
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur-sm">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-black focus:p-3 focus:text-white">Skip to content</a>
      <div className="wrap flex h-16 items-center justify-between gap-2">
        <Link href="/" aria-label="Shoe Locker home"><Wordmark /></Link>
        <nav aria-label="Primary" className="hidden items-center gap-5 xl:flex">
          {NAV.map(([l, h]) => (<Link key={l} href={h} className={`label link-u ${l === "The Vault" ? "font-bold" : ""}`}>{l}</Link>))}
        </nav>
        <div className="flex shrink-0 items-center">
          <button className="btn !hidden !min-h-11 !border-0 !px-2 sm:!inline-flex sm:!px-3" onClick={() => setFind((v) => !v)} aria-expanded={find} aria-label="Search">Search</button>
          <Link href="/locker" className="btn !hidden !min-h-11 !border-0 !px-2 sm:!inline-flex sm:!px-3">Locker{ready && wishlist.length ? ` ${wishlist.length}` : ""}</Link>
          <Link href="/cart" className="btn !min-h-11 !px-3" aria-label={`Cart, ${ready ? cartCount : 0} items`}>Cart {ready ? cartCount : 0}</Link>
          <button className="btn !min-h-11 !border-0 !px-2 sm:!px-3 xl:hidden" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Menu"}</button>
        </div>
      </div>
      {find && <div className="wrap pb-4"><SearchBox onDone={() => setFind(false)} /></div>}
      {open && (<nav id="mnav" aria-label="Mobile" className="wrap border-t border-black/10 pb-6 xl:hidden">
        <div className="py-4"><SearchBox onDone={() => setOpen(false)} /></div><ul>{NAV.map(([l, h]) => (<li key={l}><Link href={h} onClick={() => setOpen(false)} className="display block border-b border-black/10 py-4 text-3xl">{l}</Link></li>))}
          <li><Link href="/locker" onClick={() => setOpen(false)} className="label block py-4">Your Locker</Link></li><li><Link href="/fit-passport" onClick={() => setOpen(false)} className="label block py-4">Fit Passport</Link></li></ul></nav>)}
    </header>);
}
