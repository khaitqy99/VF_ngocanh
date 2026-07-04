"use client";

import AccessoryDetailPage from "@/components/accessories/AccessoryDetailPage";
import AccessoriesPage from "@/components/accessories/AccessoriesPage";
import { CarPreviewClient } from "@/components/admin-edit/CarPreviewClient";
import { usePreviewEditEnabled } from "@/components/admin-edit/PreviewEditScope";
import { ScooterPreviewClient } from "@/components/admin-edit/ScooterPreviewClient";
import CarsPage from "@/components/cars/CarsPage";
import ScootersPage from "@/components/scooters/ScootersPage";
import type { AccessoryProduct } from "@/lib/accessories";
import type { CarDetail } from "@/lib/car-details";
import type { CarModel } from "@/lib/cars";
import type { HeroBannerSlide } from "@/lib/images";
import type { ScooterDetail } from "@/lib/scooter-details";
import type { ScooterModel } from "@/lib/scooters";

export function PreviewCarsPage({
  cars,
  heroBanners,
}: {
  cars: CarModel[];
  heroBanners: HeroBannerSlide[];
}) {
  const adminEdit = usePreviewEditEnabled();
  return (
    <CarsPage cars={cars} heroBanners={heroBanners} embedded={adminEdit} adminEdit={adminEdit} />
  );
}

export function PreviewScootersPage({
  scooters,
  heroBanners,
}: {
  scooters: ScooterModel[];
  heroBanners: HeroBannerSlide[];
}) {
  const adminEdit = usePreviewEditEnabled();
  return (
    <ScootersPage
      scooters={scooters}
      heroBanners={heroBanners}
      embedded={adminEdit}
      adminEdit={adminEdit}
    />
  );
}

export function PreviewAccessoriesPage({
  accessories,
  heroBanners,
}: {
  accessories: AccessoryProduct[];
  heroBanners: HeroBannerSlide[];
}) {
  const adminEdit = usePreviewEditEnabled();
  return (
    <AccessoriesPage
      accessories={accessories}
      heroBanners={heroBanners}
      embedded={adminEdit}
      adminEdit={adminEdit}
    />
  );
}

export function PreviewCarDetail({ detail }: { detail: CarDetail }) {
  const adminEdit = usePreviewEditEnabled();
  return <CarPreviewClient detail={detail} admin={adminEdit} />;
}

export function PreviewScooterDetail({ detail }: { detail: ScooterDetail }) {
  const adminEdit = usePreviewEditEnabled();
  return <ScooterPreviewClient detail={detail} admin={adminEdit} />;
}

export function PreviewAccessoryDetail({ product }: { product: AccessoryProduct }) {
  const adminEdit = usePreviewEditEnabled();
  return <AccessoryDetailPage product={product} embedded adminEdit={adminEdit} />;
}
