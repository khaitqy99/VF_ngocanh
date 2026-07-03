"use client";

import ScooterDetailPage from "@/components/scooters/ScooterDetailPage";
import { ScooterAdminEditProvider, useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import type { ScooterDetail } from "@/lib/scooter-details";

function MergedScooterDetailPage({ detail }: { detail: ScooterDetail }) {
  const edit = useAdminEdit();
  const merged = (edit?.values ?? detail) as ScooterDetail;
  return <ScooterDetailPage detail={merged} embedded adminEdit />;
}

export function ScooterPreviewClient({
  detail,
  admin,
}: {
  detail: ScooterDetail;
  admin?: boolean;
}) {
  if (admin) {
    return (
      <ScooterAdminEditProvider detail={detail}>
        <MergedScooterDetailPage detail={detail} />
      </ScooterAdminEditProvider>
    );
  }

  return <ScooterDetailPage detail={detail} embedded />;
}
