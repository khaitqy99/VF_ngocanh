import type { NewsRelatedProduct, ResolvedNewsProduct } from "@/lib/cms/news-types";

function vehicleHref(type: "car" | "scooter", id: string) {
  return type === "car" ? `/oto/${id}` : `/xe-may-dien/${id}`;
}

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
      if (!car) continue;
      resolved.push({
        type: ref.type,
        id: car.id,
        name: car.name,
        image: car.image,
        href: vehicleHref("car", car.id),
        price: car.price,
      });
      continue;
    }

    if (ref.type === "scooter") {
      const scooter = scooters.find((item) => item.id === ref.id);
      if (!scooter) continue;
      resolved.push({
        type: ref.type,
        id: scooter.id,
        name: scooter.name,
        image: scooter.image,
        href: vehicleHref("scooter", scooter.id),
        price: scooter.price,
      });
      continue;
    }

    const accessory = accessories.find((item) => item.id === ref.id);
    if (!accessory) continue;
    resolved.push({
      type: ref.type,
      id: accessory.id,
      name: accessory.name,
      image: accessory.image,
      href: `/phu-kien/${accessory.id}`,
      price: accessory.price,
    });
  }

  return resolved;
}
