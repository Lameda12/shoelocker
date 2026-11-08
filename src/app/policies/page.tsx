export const metadata = { title: "Policies" };
const S = ({ id, t, children }: { id: string; t: string; children: React.ReactNode }) => (<section id={id} className="mt-12"><h2 className="display text-4xl">{t}</h2><div className="mt-4 space-y-3 text-lg">{children}</div></section>);
export default function Policies() {
  return (<div className="wrap max-w-3xl py-16"><p className="label text-mute">DRAFT — requires legal review before launch</p><h1 className="display mt-2 text-6xl">Policies</h1>
    <S id="shipping" t="Shipping & returns"><p>First release ships within Canada only. Shipping is $15 flat, free over $200. Taxes are estimated at 15% in this demo; production uses destination-based tax.</p><p>Unworn pairs in original packaging may be returned within 30 days. Refunds go to the original payment method.</p><p>This is a demonstration store: no goods are shipped and no live payments are taken.</p></S>
    <S id="privacy" t="Privacy"><p>Cart, Locker, wishlist and Fit Passport data live in your browser (localStorage) in this build. Fit data can be deleted at any time from the Fit Passport page. Email addresses are collected only with an explicit consent checkbox. Card details are handled by Stripe and never touch our servers.</p><p>Designed with PIPEDA and CASL in mind; a privacy officer and formal policy are required before launch.</p></S>
    <S id="terms" t="Terms"><p>Draft terms placeholder. Prices are in CAD. Release dates shown are scheduled times and may change; changes will be shown on the product page.</p></S></div>);
}
