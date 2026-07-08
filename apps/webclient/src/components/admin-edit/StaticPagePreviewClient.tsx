"use client";

import { useMemo, type ReactNode } from "react";

import AboutPage from "@/components/about/AboutPage";
import AfterSalesPage from "@/components/after-sales/AfterSalesPage";
import ChargingPage from "@/components/charging/ChargingPage";
import EnergyStoragePage from "@/components/energy-storage/EnergyStoragePage";
import {
  StaticPageAdminEditProvider,
  useStaticPageAdminEdit,
} from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import { StaticPageAdminEditToolbar } from "@/components/admin-edit/static-page/StaticPageAdminEditToolbar";
import { heroBannersToCmsInput } from "@/components/admin-edit/static-page/static-edit-section";
import { usePreviewEditEnabled } from "@/components/admin-edit/PreviewEditScope";
import type { DealershipContact } from "@/lib/dealership";
import type { StaticPageEditorData } from "@/lib/cms/static-page-editor";
import type { HeroBannerSlide } from "@/lib/images";
import type { StaticPageSlug } from "@/lib/cms/static-pages";
import type { AboutPageContent } from "@/lib/cms/static-pages";
import type { AfterSalesPageContent } from "@/lib/cms/static-pages";
import type { ChargingPageContent } from "@/lib/cms/static-pages";
import type { EnergyPageContent } from "@/lib/cms/static-pages";

function mapBannerToSlide(banner: StaticPageEditorData["banners"][number]): HeroBannerSlide {
  return {
    desktop: banner.desktop,
    mobile: banner.mobile || banner.desktop,
    alt: banner.alt,
  };
}

function StaticPagePreviewBody({
  slug,
  contact,
  fallbackHeroBanners,
  children,
}: {
  slug: StaticPageSlug;
  contact?: DealershipContact;
  fallbackHeroBanners: HeroBannerSlide[];
  children: (args: {
    content: AboutPageContent | AfterSalesPageContent | ChargingPageContent | EnergyPageContent;
    heroBanners: HeroBannerSlide[];
  }) => ReactNode;
}) {
  const edit = useStaticPageAdminEdit();
  const draftBanners = edit?.draft.banners ?? [];

  const heroBanners = useMemo(() => {
    if (draftBanners.length > 0) {
      return draftBanners.filter((banner) => banner.desktop).map(mapBannerToSlide);
    }
    return fallbackHeroBanners;
  }, [draftBanners, fallbackHeroBanners]);

  if (!edit) return null;

  return (
    <>
      {children({ content: edit.draft.content, heroBanners })}
      <StaticPageAdminEditToolbar />
    </>
  );
}

export function StaticPagePreviewClient({
  slug,
  editorData,
  contact,
  fallbackHeroBanners,
}: {
  slug: StaticPageSlug;
  editorData: StaticPageEditorData;
  contact?: DealershipContact;
  fallbackHeroBanners: HeroBannerSlide[];
}) {
  const adminEdit = usePreviewEditEnabled();

  if (adminEdit) {
    const seededEditorData: StaticPageEditorData =
      editorData.banners.length > 0
        ? editorData
        : { ...editorData, banners: heroBannersToCmsInput(fallbackHeroBanners) };

    return (
      <StaticPageAdminEditProvider initial={seededEditorData}>
        <StaticPagePreviewBody
          slug={slug}
          contact={contact}
          fallbackHeroBanners={fallbackHeroBanners}
        >
          {({ content, heroBanners }) => {
            switch (slug) {
              case "about":
                return <AboutPage contact={contact!} content={content as AboutPageContent} />;
              case "after-sales":
                return (
                  <AfterSalesPage
                    heroBanners={heroBanners}
                    content={content as AfterSalesPageContent}
                  />
                );
              case "charging":
                return (
                  <ChargingPage
                    heroBanners={heroBanners}
                    content={content as ChargingPageContent}
                  />
                );
              case "energy":
                return <EnergyStoragePage content={content as EnergyPageContent} />;
              default:
                return null;
            }
          }}
        </StaticPagePreviewBody>
      </StaticPageAdminEditProvider>
    );
  }

  switch (slug) {
    case "about":
      return <AboutPage contact={contact!} content={editorData.content as AboutPageContent} />;
    case "after-sales":
      return (
        <AfterSalesPage
          heroBanners={fallbackHeroBanners}
          content={editorData.content as AfterSalesPageContent}
        />
      );
    case "charging":
      return (
        <ChargingPage
          heroBanners={fallbackHeroBanners}
          content={editorData.content as ChargingPageContent}
        />
      );
    case "energy":
      return <EnergyStoragePage content={editorData.content as EnergyPageContent} />;
    default:
      return null;
  }
}
