"use client";

import ScooterDetailPage from "@/components/scooters/ScooterDetailPage";
import { ScooterAdminEditProvider, useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import type { ScooterDetail } from "@/lib/scooter-details";
import type { ScooterPricingSettings } from "@/lib/cms/scooter-pricing";

function MergedScooterDetailPage({
  detail,
  pricing,
}: {
  detail: ScooterDetail;
  pricing?: ScooterPricingSettings;
}) {
  const edit = useAdminEdit();
  const merged = (edit?.values ?? detail) as ScooterDetail;
  return <ScooterDetailPage detail={merged} pricing={pricing} embedded adminEdit />;
}

export function ScooterPreviewClient({
  detail,
  pricing,
  admin,
}: {
  detail: ScooterDetail;
  pricing?: ScooterPricingSettings;
  admin?: boolean;
}) {
  if (admin) {
    return (
      <ScooterAdminEditProvider detail={detail}>
        <MergedScooterDetailPage detail={detail} pricing={pricing} />
      </ScooterAdminEditProvider>
    );
  }

  return <ScooterDetailPage detail={detail} pricing={pricing} embedded />;
}
