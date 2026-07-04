"use client";

import CarDetailPage from "@/components/cars/CarDetailPage";
import { CarAdminEditProvider, useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import type { CarDetail } from "@/lib/car-details";

function MergedCarDetailPage({ detail }: { detail: CarDetail }) {
  const edit = useAdminEdit();
  const merged = (edit?.values ?? detail) as CarDetail;
  return <CarDetailPage detail={merged} embedded adminEdit />;
}

export function CarPreviewClient({ detail, admin }: { detail: CarDetail; admin?: boolean }) {
  if (admin) {
    return (
      <CarAdminEditProvider detail={detail}>
        <MergedCarDetailPage detail={detail} />
      </CarAdminEditProvider>
    );
  }

  return <CarDetailPage detail={detail} embedded />;
}
