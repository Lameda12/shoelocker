import Link from "next/link";
import { Mark } from "@/components/Logo";
export const metadata = { title: "The Vault" };
export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (<div className="dark-zone min-h-screen">
    <div className="wrap flex h-14 items-center justify-between border-b border-white/15">
      <Link href="/vault" className="flex items-center gap-3"><Mark className="h-6 w-6" /><span className="label">The Vault</span></Link>
      <Link href="/shop" className="btn !min-h-9 !px-4" aria-label="Exit the Vault and return to shopping">Exit to shop ✕</Link></div>
    {children}
    <div className="wrap border-t border-white/15 py-6 text-xs text-white/60"><Link href="/" className="link-u">← Back to Shoe Locker</Link> · All prices in CAD. Release dates are scheduled times for demonstration products.</div></div>);
}
