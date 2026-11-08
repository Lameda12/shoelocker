/** Configurable shipping/tax (CAD). Replace with Stripe Tax / carrier rates before launch. */
export const FREE_SHIPPING_OVER_CENTS = 20000;
export const FLAT_SHIPPING_CENTS = 1500;
export const DEFAULT_TAX_RATE = 0.15; // placeholder HST (Atlantic); real rate depends on destination province
export function totals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const tax = Math.round((subtotal + shipping) * DEFAULT_TAX_RATE);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}
