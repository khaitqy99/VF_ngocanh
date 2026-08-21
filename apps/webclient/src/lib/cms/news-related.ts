import type { NewsRelatedProduct, ResolvedNewsProduct } from "@/lib/cms/news-types";

export async function resolveNewsRelatedProducts(
  refs: NewsRelatedProduct[],
): Promise<ResolvedNewsProduct[]> {
  if (!refs.length) return [];

  const { getAccessories, getCars, getScooters } = await import("./index");
  const [cars, scooters, accessories] = await Promise.all([
    getCars(),
    getScooters(),
    getAccessories(),
  ]);

  const resolved: ResolvedNewsProduct[] = [];

  for (const ref of refs) {
    if (ref.type === "car") {
      const car = cars.find((item) => item.id === ref.id);
      if (car) resolved.push({ type: "car", product: car });
      continue;
    }

    if (ref.type === "scooter") {
      const scooter = scooters.find((item) => item.id === ref.id);
      if (scooter) resolved.push({ type: "scooter", product: scooter });
      continue;
    }

    const accessory = accessories.find((item) => item.id === ref.id);
    if (accessory) resolved.push({ type: "accessory", product: accessory });
  }

  return resolved;
}
