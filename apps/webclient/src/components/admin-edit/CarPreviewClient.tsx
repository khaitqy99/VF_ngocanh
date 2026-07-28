"use client";

import CarDetailPage from "@/components/cars/CarDetailPage";
import { CarAdminEditProvider, useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import type { CarDetail } from "@/lib/car-details";
import type { CarPricingSettings } from "@/lib/cms/car-pricing";

function MergedCarDetailPage({
  detail,
  pricing,
}: {
  detail: CarDetail;
  pricing?: CarPricingSettings;
}) {
  const edit = useAdminEdit();
  const merged = (edit?.values ?? detail) as CarDetail;
  return <CarDetailPage detail={merged} pricing={pricing} embedded adminEdit />;
}

export function CarPreviewClient({
  detail,
  pricing,
  admin,
}: {
  detail: CarDetail;
  pricing?: CarPricingSettings;
  admin?: boolean;
}) {
  if (admin) {
    return (
      <CarAdminEditProvider detail={detail}>
        <MergedCarDetailPage detail={detail} pricing={pricing} />
      </CarAdminEditProvider>
    );
  }

  return <CarDetailPage detail={detail} pricing={pricing} embedded />;
}
