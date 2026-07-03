export function clientAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatPriceInput(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function parsePriceInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}
