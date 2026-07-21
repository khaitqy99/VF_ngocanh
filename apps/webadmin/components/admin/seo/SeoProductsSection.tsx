import { getAccessoryCatalogItems, getVehicleCatalogItems } from "@/lib/product-catalog";
import { SeoProductsSectionClient } from "@/components/admin/seo/SeoProductsSectionClient";

export async function SeoProductsSection() {
  const [cars, scooters, accessories] = await Promise.all([
    getVehicleCatalogItems("car"),
    getVehicleCatalogItems("scooter"),
    getAccessoryCatalogItems(),
  ]);

  return (
    <SeoProductsSectionClient cars={cars} scooters={scooters} accessories={accessories} />
  );
}
