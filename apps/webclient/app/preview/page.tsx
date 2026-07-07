import type { Metadata } from "next";
import { headers } from "next/headers";

import { HomePreviewClient } from "@/components/admin-edit/HomePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getHomeData, getCars, getScooters } from "@/lib/cms";
import { getHomeEditorData } from "@/lib/cms/home-editor";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Trang chủ");
}

export default async function HomePreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });

  const [home, editorData, site, cars, scooters] = await Promise.all([
    getHomeData(),
    getHomeEditorData(),
    getSiteSeo(),
    getCars(),
    getScooters(),
  ]);

  return (
    <PreviewEditScopeProvider scope="home" serverAllowed={serverAllowed}>
      <HomePreviewClient
        heroBanners={home.heroBanners}
        featuredCars={home.featuredCars}
        featuredScooters={home.featuredScooters}
        accessories={home.accessories}
        contact={resolveDealershipContact(site)}
        editorData={editorData}
        cars={cars}
        scooters={scooters}
      />
    </PreviewEditScopeProvider>
  );
}
