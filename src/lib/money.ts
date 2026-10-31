export function money(amount: number, currency = "USD") { return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount / 100); }
