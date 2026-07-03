"use client";

import ScooterDetailPage from "@/components/scooters/ScooterDetailPage";
import { ScooterAdminEditProvider, useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { PreviewEditTokenProvider } from "@/components/admin-edit/PreviewEditTokenContext";
import type { ScooterDetail } from "@/lib/scooter-details";

function MergedScooterDetailPage({ detail }: { detail: ScooterDetail }) {
  const edit = useAdminEdit();
  const merged = (edit?.values ?? detail) as ScooterDetail;
  return <ScooterDetailPage detail={merged} embedded adminEdit />;
}

export function ScooterPreviewClient({
  detail,
  admin,
  editToken = null,
}: {
  detail: ScooterDetail;
  admin?: boolean;
  editToken?: string | null;
}) {
  if (admin) {
    return (
      <PreviewEditTokenProvider token={editToken}>
        <ScooterAdminEditProvider detail={detail}>
          <MergedScooterDetailPage detail={detail} />
        </ScooterAdminEditProvider>
      </PreviewEditTokenProvider>
    );
  }

  return <ScooterDetailPage detail={detail} embedded />;
}
