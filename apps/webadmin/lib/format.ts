export function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}
