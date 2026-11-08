const fmt = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });
export const formatCAD = (cents: number) => fmt.format(cents / 100);
