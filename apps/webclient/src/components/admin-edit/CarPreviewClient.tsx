"use client";

import CarDetailPage from "@/components/cars/CarDetailPage";
import { CarAdminEditProvider, useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { PreviewEditTokenProvider } from "@/components/admin-edit/PreviewEditTokenContext";
import type { CarDetail } from "@/lib/car-details";

function MergedCarDetailPage({ detail }: { detail: CarDetail }) {
  const edit = useAdminEdit();
  const merged = (edit?.values ?? detail) as CarDetail;
  return <CarDetailPage detail={merged} embedded adminEdit />;
}

export function CarPreviewClient({
  detail,
  admin,
  editToken = null,
}: {
  detail: CarDetail;
  admin?: boolean;
  editToken?: string | null;
}) {
  if (admin) {
    return (
      <PreviewEditTokenProvider token={editToken}>
        <CarAdminEditProvider detail={detail}>
          <MergedCarDetailPage detail={detail} />
        </CarAdminEditProvider>
      </PreviewEditTokenProvider>
    );
  }

  return <CarDetailPage detail={detail} embedded />;
}
