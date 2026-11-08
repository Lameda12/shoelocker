"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

export interface FitProfile { region: "US" | "UK" | "EU"; size: string; width: "narrow" | "regular" | "wide" | ""; preference: "snug" | "true" | "roomy" | ""; known: { model: string; size: string }[] }
export interface Prefs { trackRecent: boolean }
interface State { cart: { sku: string; qty: number }[]; wishlist: string[]; recent: string[]; compare: string[]; fit: FitProfile | null; prefs: Prefs; alerts: string[] }
const EMPTY: State = { cart: [], wishlist: [], recent: [], compare: [], fit: null, prefs: { trackRecent: true }, alerts: [] };
const KEY = "sl:v1";

// External store so SSR renders EMPTY and the client hydrates without mismatch.
let cache: State = EMPTY; let loaded = false; const subs = new Set<() => void>();
function load() { if (loaded) return; loaded = true; try { const r = localStorage.getItem(KEY); if (r) cache = { ...EMPTY, ...JSON.parse(r) }; } catch {} }
function set(next: State) { cache = next; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} subs.forEach((f) => f()); }
const subscribe = (f: () => void) => { subs.add(f); const h = (e: StorageEvent) => { if (e.key === KEY) { loaded = false; load(); f(); } }; window.addEventListener("storage", h); return () => { subs.delete(f); window.removeEventListener("storage", h); }; };

interface Ctx extends State {
  ready: boolean; toast: string | null; cartCount: number;
  addToCart(sku: string, qty?: number): void; setQty(sku: string, qty: number): void; removeFromCart(sku: string): void; clearCart(): void;
  toggleWish(slug: string): void; toggleCompare(slug: string): boolean; trackView(slug: string): void; clearRecent(): void;
  setFit(f: FitProfile | null): void; setPrefs(p: Prefs): void; toggleAlert(slug: string): void; notify(msg: string): void;
}
const C = createContext<Ctx | null>(null);
export const useStore = () => { const c = useContext(C); if (!c) throw new Error("useStore outside provider"); return c; };

export function Providers({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, () => { load(); return cache; }, () => EMPTY);
  const ready = useSyncExternalStore(() => () => {}, () => true, () => false); const [toast, setToast] = useState<string | null>(null); const timer = useRef<number | undefined>(undefined);
  const notify = useCallback((m: string) => { setToast(m); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(null), 2600); }, []);
  const api = useMemo<Ctx>(() => ({
    ...state, ready, toast, notify, cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
    addToCart(sku, qty = 1) { const ex = cache.cart.find((l) => l.sku === sku); set({ ...cache, cart: ex ? cache.cart.map((l) => (l.sku === sku ? { ...l, qty: Math.min(l.qty + qty, 5) } : l)) : [...cache.cart, { sku, qty }] }); },
    setQty(sku, qty) { set({ ...cache, cart: qty <= 0 ? cache.cart.filter((l) => l.sku !== sku) : cache.cart.map((l) => (l.sku === sku ? { ...l, qty: Math.min(qty, 5) } : l)) }); },
    removeFromCart(sku) { set({ ...cache, cart: cache.cart.filter((l) => l.sku !== sku) }); },
    clearCart() { set({ ...cache, cart: [] }); },
    toggleWish(slug) { const has = cache.wishlist.includes(slug); set({ ...cache, wishlist: has ? cache.wishlist.filter((s) => s !== slug) : [...cache.wishlist, slug] }); notify(has ? "Removed from Locker" : "Saved to your Locker"); },
    toggleCompare(slug) { const has = cache.compare.includes(slug); if (!has && cache.compare.length >= 3) { notify("Compare holds up to 3 pairs"); return false; } set({ ...cache, compare: has ? cache.compare.filter((s) => s !== slug) : [...cache.compare, slug] }); return !has; },
    trackView(slug) { if (!cache.prefs.trackRecent) return; if (cache.recent[0] === slug) return; set({ ...cache, recent: [slug, ...cache.recent.filter((s) => s !== slug)].slice(0, 8) }); },
    clearRecent() { set({ ...cache, recent: [] }); },
    setFit(f) { set({ ...cache, fit: f }); }, setPrefs(p) { set({ ...cache, prefs: p, recent: p.trackRecent ? cache.recent : [] }); },
    toggleAlert(slug) { const has = cache.alerts.includes(slug); set({ ...cache, alerts: has ? cache.alerts.filter((s) => s !== slug) : [...cache.alerts, slug] }); },
  }), [state, ready, toast, notify]);
  return <C.Provider value={api}>{children}<div role="status" aria-live="polite" className={`toast ${toast ? "toast-on" : ""}`}>{toast}</div></C.Provider>;
}
