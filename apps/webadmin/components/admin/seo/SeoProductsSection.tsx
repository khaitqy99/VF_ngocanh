import Link from "next/link";
import { Car, Bike, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { getAccessoryCatalogItems, getVehicleCatalogItems } from "@/lib/product-catalog";

export async function SeoProductsSection() {
  const [cars, scooters, accessories] = await Promise.all([
    getVehicleCatalogItems("car"),
    getVehicleCatalogItems("scooter"),
    getAccessoryCatalogItems(),
  ]);

  const sections = [
    {
      title: "Ô tô điện",
      icon: Car,
      baseHref: "/admin/cars",
      items: cars,
    },
    {
      title: "Xe máy điện",
      icon: Bike,
      baseHref: "/admin/scooters",
      items: scooters,
    },
    {
      title: "Phụ kiện",
      icon: Wrench,
      baseHref: "/admin/accessories",
      items: accessories,
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.title}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Icon className="h-4 w-4" />
              {section.title}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Card key={item.id} className="transition hover:border-red-200 hover:shadow-sm">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-900">{item.name}</p>
                      <p className="truncate text-xs text-zinc-500">/{item.slug}</p>
                    </div>
                    <div className="flex shrink-0 gap-2 text-xs">
                      <Link
                        href={`${section.baseHref}/${item.id}?tab=settings`}
                        className="font-medium text-zinc-600 hover:text-zinc-900"
                      >
                        Thông tin
                      </Link>
                      <Link
                        href={`${section.baseHref}/${item.id}?tab=seo`}
                        className="font-medium text-red-600 hover:underline"
                      >
                        SEO
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
