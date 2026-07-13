"use client";

import { useMemo } from "react";

import HomePage from "@/components/home/HomePage";
import {
  HomeAdminEditProvider,
  useHomeAdminEdit,
} from "@/components/admin-edit/home/HomeAdminEditContext";
import { HomeAdminEditToolbar } from "@/components/admin-edit/home/HomeAdminEditToolbar";
import { usePreviewEditEnabled } from "@/components/admin-edit/PreviewEditScope";
import type { DealershipContact } from "@/lib/dealership";
import type { HomeEditorData } from "@/lib/cms/home-editor";
import { resolveFeaturedAccessories } from "@/lib/cms/home-content";
import {
  buildFeaturedSlidesFromIds,
  applyFeaturedPriceOverrides,
  applyFeaturedSlideOverrides,
} from "@/lib/cms/mappers";
import type { AccessoryProduct } from "@/lib/accessories";
import type { HeroBannerSlide } from "@/lib/images";
import { VINFAST_FEATURED_CARS, VINFAST_FEATURED_SCOOTERS } from "@/lib/vinfast-home";
import type { VinFastHomeSlide } from "@/lib/vinfast-home";
import type { CarModel } from "@/lib/cars";
import type { ScooterModel } from "@/lib/scooters";

function mapBannerToSlide(banner: HomeEditorData["banners"][number]): HeroBannerSlide {
  return {
    desktop: banner.desktop,
    mobile: banner.mobile || banner.desktop,
    alt: banner.alt,
  };
}

function HomePreviewDraftBody({
  fallbackHeroBanners,
  fallbackFeaturedCars,
  fallbackFeaturedScooters,
  accessories,
  contact,
  cars,
  scooters,
}: {
  fallbackHeroBanners: HeroBannerSlide[];
  fallbackFeaturedCars: VinFastHomeSlide[];
  fallbackFeaturedScooters: VinFastHomeSlide[];
  accessories: AccessoryProduct[];
  contact: DealershipContact;
  cars: CarModel[];
  scooters: ScooterModel[];
}) {
  const edit = useHomeAdminEdit();
  const draft = edit?.draft;

  const catalogCars = useMemo(
    () =>
      cars.map((car) => ({
        id: car.id,
        name: car.name,
        subtitle: car.subtitle,
        image: car.image,
        price: car.price,
      })),
    [cars],
  );

  const catalogScooters = useMemo(
    () =>
      scooters.map((scooter) => ({
        id: scooter.id,
        name: scooter.name,
        subtitle: scooter.subtitle,
        image: scooter.image,
        price: scooter.price,
      })),
    [scooters],
  );

  const previewBanners = useMemo(
    () =>
      draft && draft.banners.length > 0
        ? draft.banners.filter((banner) => banner.desktop).map(mapBannerToSlide)
        : fallbackHeroBanners,
    [draft, fallbackHeroBanners],
  );

  const previewFeaturedCars = useMemo(() => {
    if (!draft) return fallbackFeaturedCars;
    const slides = buildFeaturedSlidesFromIds(
      draft.featuredCarIds,
      VINFAST_FEATURED_CARS,
      catalogCars,
      "car",
    );
    return applyFeaturedSlideOverrides(
      applyFeaturedPriceOverrides(slides, draft.featuredCarIds, draft.featuredCarPrices, "car"),
      draft.featuredCarIds,
      draft.featuredCarSlideOverrides,
      "car",
    );
  }, [draft, catalogCars, fallbackFeaturedCars]);

  const previewFeaturedScooters = useMemo(() => {
    if (!draft) return fallbackFeaturedScooters;
    const slides = buildFeaturedSlidesFromIds(
      draft.featuredScooterIds,
      VINFAST_FEATURED_SCOOTERS,
      catalogScooters,
      "scooter",
    );
    return applyFeaturedSlideOverrides(
      applyFeaturedPriceOverrides(
        slides,
        draft.featuredScooterIds,
        draft.featuredScooterPrices,
        "scooter",
      ),
      draft.featuredScooterIds,
      draft.featuredScooterSlideOverrides,
      "scooter",
    );
  }, [draft, catalogScooters, fallbackFeaturedScooters]);

  const previewAccessories = useMemo(
    () =>
      draft ? resolveFeaturedAccessories(accessories, draft.featuredAccessoryIds) : accessories,
    [accessories, draft],
  );

  if (!edit) return null;

  return (
    <>
      <HomePage
        heroBanners={previewBanners}
        featuredCars={previewFeaturedCars.length ? previewFeaturedCars : fallbackFeaturedCars}
        featuredScooters={
          previewFeaturedScooters.length ? previewFeaturedScooters : fallbackFeaturedScooters
        }
        accessories={accessories}
        latestNews={[]}
        contact={contact}
        sections={edit.draft.sections}
      />
      <HomeAdminEditToolbar />
    </>
  );
}

export function HomePreviewClient({
  heroBanners,
  featuredCars,
  featuredScooters,
  accessories,
  latestNews,
  contact,
  editorData,
  cars,
  scooters,
}: {
  heroBanners: HeroBannerSlide[];
  featuredCars: VinFastHomeSlide[];
  featuredScooters: VinFastHomeSlide[];
  accessories: AccessoryProduct[];
  latestNews: import("@/lib/cms/news-types").NewsArticle[];
  contact: DealershipContact;
  editorData: HomeEditorData;
  cars: CarModel[];
  scooters: ScooterModel[];
}) {
  const adminEdit = usePreviewEditEnabled();

  if (adminEdit) {
    return (
      <HomeAdminEditProvider initial={editorData}>
        <HomePreviewDraftBody
          fallbackHeroBanners={heroBanners}
          fallbackFeaturedCars={featuredCars}
          fallbackFeaturedScooters={featuredScooters}
          accessories={accessories}
          contact={contact}
          cars={cars}
          scooters={scooters}
        />
      </HomeAdminEditProvider>
    );
  }

  return (
    <HomePage
      heroBanners={heroBanners}
      featuredCars={featuredCars}
      featuredScooters={featuredScooters}
      accessories={accessories}
      latestNews={latestNews}
      contact={contact}
      sections={editorData.sections}
    />
  );
}
