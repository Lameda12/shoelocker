import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shoelocker.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "SHOE LOCKER — Not just worn. Discovered.", template: "%s — SHOE LOCKER" },
  description: "A premium sneaker gallery that is also an effortless place to shop. Demonstration catalog.",
  openGraph: { title: "SHOE LOCKER", description: "Not just worn. Discovered.", type: "website", locale: "en_CA" },
};
export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body className="min-h-screen antialiased">
        <Providers><Header /><main id="main">{children}</main><Footer /></Providers>
      </body>
    </html>);
}
