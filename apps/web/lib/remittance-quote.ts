// Figma's illustrative BRL -> BOB rate. This is NOT a live exchange quote.
export const DEMO_RATE_LABEL = "1BRL=2.3BOB";

export function parseAmount(value: string): number | null {
  if (!/^\d{1,9}(?:[.,]\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.replace(",", ".").split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2).replace(/\.?0+$/, "");
}

export function convertAmount(value: string, direction: "send" | "receive"): string {
  const cents = parseAmount(value);
  if (cents === null) return "";
  const converted = direction === "send" ? Math.round(cents * 23 / 10) : Math.round(cents * 10 / 23);
  return formatAmount(converted);
}
