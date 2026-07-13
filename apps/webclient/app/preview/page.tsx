import type { Metadata } from "next";

import { HomePreviewClient } from "@/components/admin-edit/HomePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getHomeData, getCars, getScooters } from "@/lib/cms";
import { getHomeEditorData } from "@/lib/cms/home-editor";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Trang chủ");
}

type Props = { searchParams: Promise<{ pt?: string }> };

export default async function HomePreviewRoute({ searchParams }: Props) {
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });

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
        latestNews={home.latestNews}
        contact={resolveDealershipContact(site)}
        editorData={editorData}
        cars={cars}
        scooters={scooters}
      />
    </PreviewEditScopeProvider>
  );
}
