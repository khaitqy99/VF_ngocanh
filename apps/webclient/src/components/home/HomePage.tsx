"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import FaqSection from "@/components/site/FaqSection";
import ShowroomLocationSection from "@/components/site/ShowroomLocationSection";
import FloatingButtons from "@/components/site/FloatingButtons";
import { type DealershipContact } from "@/lib/dealership";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import { CatalogGrid, CatalogGridItem, FadeIn, StaggerItem } from "@/components/motion";
import { MotionButton, MotionLinkButton } from "@/components/motion/MotionButton";
import type { HomeChargingTile, HomeSectionsContent } from "@/lib/cms/home-content";
import type { AccessoryProduct } from "@/lib/accessories";
import { type HeroBannerSlide } from "@/lib/images";
import {
  homeBrandClip,
  homeBrandLine,
  homeNewsletterBlock,
  homeNewsletterChild,
  homeViewport,
} from "@/lib/home-motion";
import { FeatureCarouselSection } from "@/components/shared/FeatureCarouselSection";
import { ShowroomBookingModal } from "@/components/shared/ShowroomBookingModal";
import type { VinFastHomeSlide } from "@/lib/vinfast-home";
import type { NewsArticle } from "@/lib/cms/news-types";
import { vfCardTitle, vfSectionHeadingLeft, vfSlideTitle } from "@/lib/typography";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { Toaster } from "sonner";
import { toast } from "sonner";

import { HomeHero } from "./HomeHero";
import { HomeNewsSection } from "./HomeNewsSection";
import { HomeOverlayCard } from "./HomeOverlayCard";
import { HomeSectionHeader } from "./HomeSectionHeader";
import {
  useHomeAdminEdit,
  homeEditSectionClass,
} from "@/components/admin-edit/home/HomeAdminEditContext";
import { HomeEditableText } from "@/components/admin-edit/home/HomeEditableText";
import { HomeEditableSectionHeader } from "@/components/admin-edit/home/HomeEditableSectionHeader";
import { HomeEditImageButton } from "@/components/admin-edit/home/HomeEditImageButton";
import { HomeFeaturedPicker } from "@/components/admin-edit/home/HomeFeaturedPicker";
import { HomeAccessoryPicker } from "@/components/admin-edit/home/HomeAccessoryPicker";
import {
  HomeEditListControls,
  HomeEditSectionListBar,
  moveListItem,
} from "@/components/admin-edit/home/HomeEditListControls";
import {
  DEFAULT_BRAND_POINT,
  DEFAULT_CHARGING_TILE,
  DEFAULT_FAQ_ITEM,
  DEFAULT_SHOWROOM_CARD,
  DEFAULT_WARRANTY_SPEC,
} from "@/lib/cms/home-list-defaults";

const featureCopy = "relative z-10 w-full min-w-0";
const warrantyTitle = vfSectionHeadingLeft;
const warrantySubtitle =
  "mt-2 text-sm leading-relaxed text-muted-foreground lg:mt-1.5 lg:text-xs lg:leading-relaxed xl:text-sm 2xl:text-[15px]";
const warrantySpecGrid =
  "mt-5 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-6 sm:gap-x-6 sm:gap-y-4 lg:mt-4 lg:gap-x-4 lg:gap-y-2.5 xl:mt-5 xl:grid-cols-4 xl:gap-x-6 2xl:mt-6 2xl:gap-x-8";
const warrantyActions = "mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:mt-4 xl:mt-5 2xl:mt-7";
const warrantyPanel =
  "relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:w-1/2 lg:px-10 lg:py-10 xl:px-14 xl:py-12";
const warrantyBtn =
  "w-full rounded-md px-2.5 py-2 text-center text-[10px] font-semibold tracking-wide transition active:scale-[0.98] sm:px-4 sm:text-[11px] lg:px-3.5 lg:py-1.5 lg:text-[10px] xl:px-4 xl:py-2 xl:text-[11px] 2xl:px-5 2xl:py-2.5 2xl:text-[12px]";

const SCOOTER_BOOKING_SERVICES = [
  "Đặt mua ngay",
  "Đăng ký lái thử",
  "Nhận báo giá",
  "Tư vấn trả góp",
];

export default function HomePage({
  heroBanners,
  featuredCars,
  featuredScooters,
  accessories,
  latestNews,
  contact,
  sections,
}: {
  heroBanners: HeroBannerSlide[];
  featuredCars: VinFastHomeSlide[];
  featuredScooters: VinFastHomeSlide[];
  accessories: AccessoryProduct[];
  latestNews: NewsArticle[];
  contact: DealershipContact;
  sections: HomeSectionsContent;
}) {
  const [bookingSlide, setBookingSlide] = useState<VinFastHomeSlide | null>(null);
  const [bookingKind, setBookingKind] = useState<"car" | "scooter">("car");

  const openDepositModal = (slide: VinFastHomeSlide, kind: "car" | "scooter") => {
    setBookingKind(kind);
    setBookingSlide(slide);
  };

  const edit = useHomeAdminEdit();

  return (
    <div className={`relative min-h-screen bg-background ${edit?.editMode ? "pb-24" : ""}`}>
      <Toaster position="top-center" richColors />
      <main>
        <h1 className="sr-only">VinFast Ngọc Anh Cà Mau — Đại lý ủy quyền chính thức VinFast</h1>
        <HomeHero banners={heroBanners} />
        <FeaturedVehicle
          slides={featuredCars}
          onDeposit={(slide) => openDepositModal(slide, "car")}
        />
        <ScooterSection
          slides={featuredScooters}
          onDeposit={(slide) => openDepositModal(slide, "scooter")}
        />
        <Accessories products={accessories} section={sections.accessories} />
        <ChargingEcosystem section={sections.charging} />
        <WarrantyService section={sections.warranty} />
        <BrandStory section={sections.brandStory} />
        <ShowroomCommunity section={sections.showroomCommunity} />
        <HomeNewsSection articles={latestNews} section={sections.news} />
        <Newsletter section={sections.newsletter} />
        <FaqSection section={sections.faq} />
        <ShowroomLocationSection contact={contact} showroom={sections.showroomLocation} />
      </main>
      <FloatingButtons />
      <ShowroomBookingModal
        open={bookingSlide !== null}
        onClose={() => setBookingSlide(null)}
        vehicleName={bookingSlide?.title ?? ""}
        vehicleImage={bookingSlide?.image ?? ""}
        service={bookingKind === "scooter" ? "Đặt mua ngay" : "Đặt cọc ngay"}
        serviceOptions={bookingKind === "scooter" ? SCOOTER_BOOKING_SERVICES : undefined}
      />
    </div>
  );
}

function FeaturedVehicle({
  slides,
  onDeposit,
}: {
  slides: VinFastHomeSlide[];
  onDeposit: (slide: VinFastHomeSlide) => void;
}) {
  const edit = useHomeAdminEdit();
  return (
    <div className={edit?.editMode ? `container-vf py-4 ${homeEditSectionClass()}` : undefined}>
      {edit?.editMode ? (
        <div className="mb-4">
          <HomeFeaturedPicker kind="car" />
        </div>
      ) : null}
      <FeatureCarouselSection
        slides={slides}
        imageSide="left"
        imageAspect="2544/1500"
        onPrimaryClick={onDeposit}
      />
    </div>
  );
}

function ScooterSection({
  slides,
  onDeposit,
}: {
  slides: VinFastHomeSlide[];
  onDeposit: (slide: VinFastHomeSlide) => void;
}) {
  const edit = useHomeAdminEdit();
  return (
    <div className={edit?.editMode ? `container-vf py-4 ${homeEditSectionClass()}` : undefined}>
      {edit?.editMode ? (
        <div className="mb-4">
          <HomeFeaturedPicker kind="scooter" />
        </div>
      ) : null}
      <FeatureCarouselSection
        slides={slides}
        imageSide="right"
        imageAspect="2544/1500"
        onPrimaryClick={onDeposit}
      />
    </div>
  );
}

function SectionHeader({
  title,
  eyebrow,
  viewAllHref,
  description,
  onEyebrowChange,
  onTitleChange,
  onDescriptionChange,
  onViewAllHrefChange,
  align,
}: {
  title: string;
  eyebrow?: string;
  viewAllHref?: string;
  description?: string;
  onEyebrowChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onViewAllHrefChange?: (value: string) => void;
  align?: "editorial" | "centered";
}) {
  const edit = useHomeAdminEdit();
  if (edit?.editMode) {
    return (
      <HomeEditableSectionHeader
        title={title}
        eyebrow={eyebrow}
        description={description}
        viewAllHref={viewAllHref}
        align={align}
        onEyebrowChange={onEyebrowChange}
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
        onViewAllHrefChange={onViewAllHrefChange}
      />
    );
  }
  return (
    <HomeSectionHeader
      title={title}
      eyebrow={eyebrow}
      viewAllHref={viewAllHref}
      description={description}
      align={align}
    />
  );
}

function Accessories({
  products,
  section,
}: {
  products: AccessoryProduct[];
  section: HomeSectionsContent["accessories"];
}) {
  const edit = useHomeAdminEdit();
  return (
    <section
      className={`section-y bg-surface-muted ${edit?.editMode ? homeEditSectionClass() : ""}`}
    >
      <div className="container-vf">
        {edit?.editMode ? <HomeAccessoryPicker /> : null}
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          viewAllHref={section.viewAllHref}
          onEyebrowChange={
            edit
              ? (eyebrow) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    accessories: { ...sections.accessories, eyebrow },
                  }))
              : undefined
          }
          onTitleChange={
            edit
              ? (title) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    accessories: { ...sections.accessories, title },
                  }))
              : undefined
          }
          onViewAllHrefChange={
            edit
              ? (viewAllHref) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    accessories: { ...sections.accessories, viewAllHref },
                  }))
              : undefined
          }
        />
        <CatalogGrid className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <CatalogGridItem key={product.id} index={index} inView>
              <AccessoryProductCard product={product} />
            </CatalogGridItem>
          ))}
        </CatalogGrid>
      </div>
    </section>
  );
}

const chargingOverlayDark =
  "absolute inset-x-0 bottom-0 w-full translate-y-0 bg-[linear-gradient(359deg,#000_0.54%,rgba(0,0,0,0)_98.5%)] p-5 text-white transition-transform duration-500 ease-in-out sm:p-[30px] [@media(hover:hover)_and_(pointer:fine)]:translate-y-[65%] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0";

const chargingOverlayLight =
  "absolute inset-x-0 bottom-0 w-full translate-y-0 bg-[linear-gradient(359deg,#f7f9f9_0.54%,rgba(247,249,249,0)_98.5%)] p-5 text-[#3c3c3c] transition-transform duration-500 ease-in-out sm:p-[30px] [@media(hover:hover)_and_(pointer:fine)]:translate-y-[65%] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0";

type ChargingTileView = HomeChargingTile & {
  aspect: string;
  imageFit?: "contain" | "cover";
  imageZoom?: boolean;
};

function toChargingTileView(tile: HomeChargingTile, index: number): ChargingTileView {
  const isPortable = index === 2 || tile.theme === "light";
  return {
    ...tile,
    aspect: isPortable ? "h-full min-h-full" : "lg:aspect-[21/9]",
    imageFit: isPortable ? "contain" : "cover",
    imageZoom: !isPortable,
  };
}

function ChargingCard({
  item,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  item: ChargingTileView;
  index: number;
  total: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
}) {
  const edit = useHomeAdminEdit();
  const overlay = item.theme === "light" ? chargingOverlayLight : chargingOverlayDark;
  const fillHeight = item.aspect.includes("min-h");
  const mobilePanel =
    item.theme === "light"
      ? "border-t border-slate-100 bg-[#f7f9f9] p-5 text-[#3c3c3c]"
      : "border-t border-brand-dark/20 bg-brand-dark p-5 text-white";

  return (
    <StaggerItem variant="home" index={index} className={fillHeight ? "h-full min-h-0" : undefined}>
      <div className={fillHeight ? "relative h-full" : "relative"}>
        <HomeEditImageButton imagePath={`sections.charging.tiles.${index}.img`} />
        <HomeOverlayCard
          href={item.href}
          title={item.title}
          image={item.img}
          imageAlt={item.title}
          overlayClass={overlay}
          aspectClass={item.aspect}
          fillHeight={fillHeight}
          stackOnMobile={!fillHeight}
          mobilePanelClass={mobilePanel}
          heightClass={fillHeight ? "h-full min-h-[300px] sm:min-h-[340px] lg:min-h-0" : undefined}
          imageFit={item.imageFit ?? "cover"}
          imageZoom={item.imageZoom ?? true}
        >
          <h3 className={`${vfCardTitle} ${item.theme === "light" ? "" : "text-stroke-white"}`}>
            {edit?.editMode ? (
              <HomeEditableText
                value={item.title}
                onChange={(title) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    charging: {
                      ...sections.charging,
                      tiles: sections.charging.tiles.map((tile, tileIndex) =>
                        tileIndex === index ? { ...tile, title } : tile,
                      ),
                    },
                  }))
                }
                className={`${vfCardTitle} ${item.theme === "light" ? "" : "text-stroke-white text-white"}`}
                label="Tiêu đề thẻ"
              />
            ) : (
              item.title
            )}
          </h3>
          <p className="pt-3 text-xs leading-relaxed opacity-90 sm:pt-4 sm:text-sm">
            {edit?.editMode ? (
              <HomeEditableText
                value={item.desc}
                onChange={(desc) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    charging: {
                      ...sections.charging,
                      tiles: sections.charging.tiles.map((tile, tileIndex) =>
                        tileIndex === index ? { ...tile, desc } : tile,
                      ),
                    },
                  }))
                }
                multiline
                className={`text-xs leading-relaxed sm:text-sm ${item.theme === "light" ? "text-[#3c3c3c]" : "text-white"}`}
                label="Mô tả thẻ"
              />
            ) : (
              item.desc
            )}
          </p>
          <span
            className={`mt-3 block pt-1 text-xs font-semibold tracking-wide sm:mt-0 sm:pt-4 ${
              item.theme === "light" ? "text-brand" : "text-white/90"
            }`}
          >
            Xem chi tiết →
          </span>
          {edit?.editMode ? (
            <>
              <div className="mt-2">
                <HomeEditableText
                  value={item.href}
                  onChange={(href) =>
                    edit.updateSections((sections) => ({
                      ...sections,
                      charging: {
                        ...sections.charging,
                        tiles: sections.charging.tiles.map((tile, tileIndex) =>
                          tileIndex === index ? { ...tile, href } : tile,
                        ),
                      },
                    }))
                  }
                  className="text-[10px] text-white/70"
                  label="Link thẻ"
                />
              </div>
              <HomeEditListControls
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onRemove={onRemove}
                canMoveUp={index > 0}
                canMoveDown={index < total - 1}
                canRemove={total > 1}
              />
            </>
          ) : null}
        </HomeOverlayCard>
      </div>
    </StaggerItem>
  );
}

function ChargingEcosystem({ section }: { section: HomeSectionsContent["charging"] }) {
  const edit = useHomeAdminEdit();
  const tiles = section.tiles.map(toChargingTileView);
  const leftTiles = tiles.slice(0, 2);
  const rightTiles = tiles.slice(2);

  const updateTiles = (tiles: HomeChargingTile[]) => {
    edit?.updateSections((sections) => ({
      ...sections,
      charging: { ...sections.charging, tiles },
    }));
  };

  const renderCard = (item: ChargingTileView, index: number) => (
    <ChargingCard
      key={`${item.title}-${index}`}
      item={item}
      index={index}
      total={tiles.length}
      onMoveUp={edit ? () => updateTiles(moveListItem(section.tiles, index, index - 1)) : undefined}
      onMoveDown={
        edit ? () => updateTiles(moveListItem(section.tiles, index, index + 1)) : undefined
      }
      onRemove={
        edit
          ? () => updateTiles(section.tiles.filter((_, tileIndex) => tileIndex !== index))
          : undefined
      }
    />
  );

  return (
    <section
      className={`section-y bg-white pb-14 sm:pb-16 lg:pb-20 ${edit?.editMode ? homeEditSectionClass() : ""}`}
    >
      <div className="container-vf">
        {edit?.editMode ? (
          <HomeEditSectionListBar
            addLabel="Thêm thẻ pin & sạc"
            onAdd={() =>
              edit.updateSections((sections) => ({
                ...sections,
                charging: {
                  ...sections.charging,
                  tiles: [...sections.charging.tiles, { ...DEFAULT_CHARGING_TILE }],
                },
              }))
            }
          />
        ) : null}
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          onEyebrowChange={
            edit
              ? (eyebrow) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    charging: { ...sections.charging, eyebrow },
                  }))
              : undefined
          }
          onTitleChange={
            edit
              ? (title) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    charging: { ...sections.charging, title },
                  }))
              : undefined
          }
        />

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-5">
          {tiles.length <= 2 ? (
            <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-5">
              {tiles.map((item, index) => renderCard(item, index))}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 lg:gap-5">
                {leftTiles.map((item, index) => renderCard(item, index))}
              </div>
              <div className="flex flex-col gap-4 lg:gap-5">
                {rightTiles.map((item, index) => renderCard(item, index + 2))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function WarrantyService({ section }: { section: HomeSectionsContent["warranty"] }) {
  const edit = useHomeAdminEdit();
  return (
    <section
      id="block-service"
      className={`relative w-full overflow-hidden bg-white ${edit?.editMode ? homeEditSectionClass() : ""}`}
    >
      <div className="relative w-full home-feature-surface">
        <div className="relative z-10">
          <FadeIn
            direction="right"
            className="relative aspect-[2544/1065] w-full overflow-hidden bg-surface-muted lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2"
          >
            <HomeEditImageButton imagePath="sections.warranty.image" />
            <img
              src={section.image}
              alt={section.imageAlt}
              className="h-full w-full object-cover object-right"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[var(--surface-muted)] to-transparent lg:hidden"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-28 bg-gradient-to-l from-transparent via-[var(--surface-muted)]/70 to-[var(--surface-muted)] lg:block lg:w-40 xl:w-52"
            />
          </FadeIn>

          <div className={warrantyPanel}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-r from-transparent to-[var(--surface-muted)]/80 lg:block lg:w-24 xl:w-32"
            />
            <FadeIn direction="left" blur className={`${featureCopy} lg:overflow-hidden`}>
              <h2 className={warrantyTitle}>
                {edit?.editMode ? (
                  <HomeEditableText
                    value={section.title}
                    onChange={(title) =>
                      edit.updateSections((sections) => ({
                        ...sections,
                        warranty: { ...sections.warranty, title },
                      }))
                    }
                    className={warrantyTitle}
                    label="Tiêu đề"
                  />
                ) : (
                  section.title
                )}
              </h2>
              <p className={warrantySubtitle}>
                {edit?.editMode ? (
                  <HomeEditableText
                    value={section.subtitle}
                    onChange={(subtitle) =>
                      edit.updateSections((sections) => ({
                        ...sections,
                        warranty: { ...sections.warranty, subtitle },
                      }))
                    }
                    multiline
                    className={warrantySubtitle}
                    label="Mô tả"
                  />
                ) : (
                  section.subtitle
                )}
              </p>
              <div className={warrantySpecGrid}>
                {section.specs.map((spec, index) => (
                  <div key={`${spec.label}-${index}`} className="text-center">
                    <p className="text-lg font-bold text-brand-dark sm:text-xl">
                      {edit?.editMode ? (
                        <HomeEditableText
                          value={spec.value}
                          onChange={(value) =>
                            edit.updateSections((sections) => ({
                              ...sections,
                              warranty: {
                                ...sections.warranty,
                                specs: sections.warranty.specs.map((item, specIndex) =>
                                  specIndex === index ? { ...item, value } : item,
                                ),
                              },
                            }))
                          }
                          className="text-lg font-bold text-brand-dark sm:text-xl"
                          label="Giá trị thông số"
                        />
                      ) : (
                        spec.value
                      )}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                      {edit?.editMode ? (
                        <HomeEditableText
                          value={spec.label}
                          onChange={(label) =>
                            edit.updateSections((sections) => ({
                              ...sections,
                              warranty: {
                                ...sections.warranty,
                                specs: sections.warranty.specs.map((item, specIndex) =>
                                  specIndex === index ? { ...item, label } : item,
                                ),
                              },
                            }))
                          }
                          className="text-[10px] text-muted-foreground sm:text-xs"
                          label="Nhãn thông số"
                        />
                      ) : (
                        spec.label
                      )}
                    </p>
                    {edit?.editMode ? (
                      <HomeEditListControls
                        onMoveUp={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            warranty: {
                              ...sections.warranty,
                              specs: moveListItem(sections.warranty.specs, index, index - 1),
                            },
                          }))
                        }
                        onMoveDown={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            warranty: {
                              ...sections.warranty,
                              specs: moveListItem(sections.warranty.specs, index, index + 1),
                            },
                          }))
                        }
                        onRemove={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            warranty: {
                              ...sections.warranty,
                              specs: sections.warranty.specs.filter(
                                (_, specIndex) => specIndex !== index,
                              ),
                            },
                          }))
                        }
                        canMoveUp={index > 0}
                        canMoveDown={index < section.specs.length - 1}
                        canRemove={section.specs.length > 1}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
              {edit?.editMode ? (
                <HomeEditSectionListBar
                  addLabel="Thêm thông số"
                  onAdd={() =>
                    edit.updateSections((sections) => ({
                      ...sections,
                      warranty: {
                        ...sections.warranty,
                        specs: [...sections.warranty.specs, { ...DEFAULT_WARRANTY_SPEC }],
                      },
                    }))
                  }
                />
              ) : null}
              <div className={warrantyActions}>
                {edit?.editMode ? (
                  <div className="col-span-2 grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <HomeEditableText
                        value={section.primaryCta.label}
                        onChange={(label) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            warranty: {
                              ...sections.warranty,
                              primaryCta: { ...sections.warranty.primaryCta, label },
                            },
                          }))
                        }
                        className={`${warrantyBtn} bg-brand text-white`}
                        label="CTA chính"
                      />
                      <HomeEditableText
                        value={section.primaryCta.href}
                        onChange={(href) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            warranty: {
                              ...sections.warranty,
                              primaryCta: { ...sections.warranty.primaryCta, href },
                            },
                          }))
                        }
                        className="text-[10px] text-muted-foreground"
                        label="Link CTA chính"
                      />
                    </div>
                    <div className="space-y-1">
                      <HomeEditableText
                        value={section.secondaryCta.label}
                        onChange={(label) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            warranty: {
                              ...sections.warranty,
                              secondaryCta: { ...sections.warranty.secondaryCta, label },
                            },
                          }))
                        }
                        className={`${warrantyBtn} border border-brand bg-white text-brand`}
                        label="CTA phụ"
                      />
                      <HomeEditableText
                        value={section.secondaryCta.href}
                        onChange={(href) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            warranty: {
                              ...sections.warranty,
                              secondaryCta: { ...sections.warranty.secondaryCta, href },
                            },
                          }))
                        }
                        className="text-[10px] text-muted-foreground"
                        label="Link CTA phụ"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <a
                      href={section.primaryCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${warrantyBtn} bg-brand text-white shadow-sm transition hover:bg-[#0046cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
                    >
                      {section.primaryCta.label}
                    </a>
                    <a
                      href={section.secondaryCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${warrantyBtn} border border-brand bg-white text-brand transition hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
                    >
                      {section.secondaryCta.label}
                    </a>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStory({ section }: { section: HomeSectionsContent["brandStory"] }) {
  const edit = useHomeAdminEdit();
  const { ref: sectionRef, reduced, initial, animate } = useSectionReveal(homeViewport);

  const brandCopy = (
    <div className="w-full max-w-xl text-white lg:max-w-md xl:max-w-lg">
      <motion.h3
        custom={0}
        initial={initial}
        animate={animate}
        variants={reduced ? undefined : homeBrandLine}
        className={vfSlideTitle}
      >
        {edit?.editMode ? (
          <HomeEditableText
            value={section.title}
            onChange={(title) =>
              edit.updateSections((sections) => ({
                ...sections,
                brandStory: { ...sections.brandStory, title },
              }))
            }
            className={`${vfSlideTitle} text-white`}
            label="Tiêu đề"
          />
        ) : (
          section.title
        )}
      </motion.h3>
      <motion.p
        custom={1}
        initial={initial}
        animate={animate}
        variants={reduced ? undefined : homeBrandLine}
        className="mt-2 text-sm opacity-90 md:mt-2.5"
      >
        {edit?.editMode ? (
          <HomeEditableText
            value={section.subtitle}
            onChange={(subtitle) =>
              edit.updateSections((sections) => ({
                ...sections,
                brandStory: { ...sections.brandStory, subtitle },
              }))
            }
            className="text-sm text-white/90"
            label="Phụ đề"
          />
        ) : (
          section.subtitle
        )}
      </motion.p>
      <ul className="mt-5 space-y-3 text-sm md:mt-6 md:space-y-3.5">
        {section.points.map((t, i) => (
          <motion.li
            key={`${t}-${i}`}
            custom={i + 2}
            initial={initial}
            animate={animate}
            variants={reduced ? undefined : homeBrandLine}
            className="flex items-start gap-2.5"
          >
            <Check size={16} className="mt-0.5 shrink-0 text-[#FFD500]" />
            <span>
              {edit?.editMode ? (
                <>
                  <HomeEditableText
                    value={t}
                    onChange={(value) =>
                      edit.updateSections((sections) => ({
                        ...sections,
                        brandStory: {
                          ...sections.brandStory,
                          points: sections.brandStory.points.map((item, pointIndex) =>
                            pointIndex === i ? value : item,
                          ),
                        },
                      }))
                    }
                    className="text-sm text-white"
                    label={`Điểm nổi bật ${i + 1}`}
                  />
                  <HomeEditListControls
                    onMoveUp={() =>
                      edit.updateSections((sections) => ({
                        ...sections,
                        brandStory: {
                          ...sections.brandStory,
                          points: moveListItem(sections.brandStory.points, i, i - 1),
                        },
                      }))
                    }
                    onMoveDown={() =>
                      edit.updateSections((sections) => ({
                        ...sections,
                        brandStory: {
                          ...sections.brandStory,
                          points: moveListItem(sections.brandStory.points, i, i + 1),
                        },
                      }))
                    }
                    onRemove={() =>
                      edit.updateSections((sections) => ({
                        ...sections,
                        brandStory: {
                          ...sections.brandStory,
                          points: sections.brandStory.points.filter(
                            (_, pointIndex) => pointIndex !== i,
                          ),
                        },
                      }))
                    }
                    canMoveUp={i > 0}
                    canMoveDown={i < section.points.length - 1}
                    canRemove={section.points.length > 1}
                  />
                </>
              ) : (
                t
              )}
            </span>
          </motion.li>
        ))}
      </ul>
      {edit?.editMode ? (
        <HomeEditSectionListBar
          addLabel="Thêm điểm nổi bật"
          onAdd={() =>
            edit.updateSections((sections) => ({
              ...sections,
              brandStory: {
                ...sections.brandStory,
                points: [...sections.brandStory.points, DEFAULT_BRAND_POINT],
              },
            }))
          }
        />
      ) : null}
      <motion.div
        custom={5}
        initial={initial}
        animate={animate}
        variants={reduced ? undefined : homeBrandLine}
        className="mt-6 md:mt-8"
      >
        {edit?.editMode ? (
          <div className="space-y-1">
            <HomeEditableText
              value={section.ctaLabel}
              onChange={(ctaLabel) =>
                edit.updateSections((sections) => ({
                  ...sections,
                  brandStory: { ...sections.brandStory, ctaLabel },
                }))
              }
              className="inline-flex rounded-md bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white"
              label="Nút CTA"
            />
            <HomeEditableText
              value={section.ctaHref}
              onChange={(ctaHref) =>
                edit.updateSections((sections) => ({
                  ...sections,
                  brandStory: { ...sections.brandStory, ctaHref },
                }))
              }
              className="text-[10px] text-white/70"
              label="Link CTA"
            />
          </div>
        ) : (
          <MotionLinkButton
            href={section.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow-[var(--shadow-brand)] transition hover:bg-[#0046cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {section.ctaLabel}
          </MotionLinkButton>
        )}
      </motion.div>
    </div>
  );

  return (
    <section
      className={`bg-white py-14 sm:py-16 lg:py-24 ${edit?.editMode ? homeEditSectionClass() : ""}`}
    >
      <div className="container-vf">
        <motion.div
          ref={sectionRef}
          initial={initial}
          animate={animate}
          variants={reduced ? undefined : homeBrandClip}
          className="relative flex flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-brand)] ring-1 ring-black/[0.06] lg:block lg:h-[560px]"
        >
          <div className="relative w-full shrink-0 overflow-hidden bg-brand-dark lg:absolute lg:inset-0 lg:h-full">
            <HomeEditImageButton imagePath="sections.brandStory.image" />
            <img
              src={section.image}
              alt={section.imageAlt}
              className="block h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:object-cover lg:object-center"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,transparent_0%,rgba(11,31,91,0.2)_48%,rgba(11,31,91,0.88)_88%)] lg:block"
            />
          </div>

          {/* Copy: panel dưới ảnh (mobile) → overlay phải (desktop) */}
          <div className="relative z-10 bg-brand-dark p-5 sm:p-8 lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-end lg:bg-transparent lg:p-14">
            {brandCopy}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const showroomCommunityOverlay =
  "absolute inset-x-0 bottom-0 translate-y-0 bg-[linear-gradient(359deg,#000_0.54%,rgba(0,0,0,0)_98.5%)] p-5 text-white transition-transform duration-500 ease-in-out sm:p-[30px] [@media(hover:hover)_and_(pointer:fine)]:translate-y-[40%] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0";

function ShowroomCommunity({ section }: { section: HomeSectionsContent["showroomCommunity"] }) {
  const edit = useHomeAdminEdit();
  return (
    <section
      className={`section-y bg-surface-muted ${edit?.editMode ? homeEditSectionClass() : ""}`}
    >
      <div className="container-vf">
        {edit?.editMode ? (
          <HomeEditSectionListBar
            addLabel="Thêm thẻ showroom / cộng đồng"
            onAdd={() =>
              edit.updateSections((sections) => ({
                ...sections,
                showroomCommunity: {
                  ...sections.showroomCommunity,
                  cards: [...sections.showroomCommunity.cards, { ...DEFAULT_SHOWROOM_CARD }],
                },
              }))
            }
          />
        ) : null}
        <div className="grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
          {section.cards.map((card, index) => (
            <StaggerItem key={card.title} variant="home" index={index} className="w-full">
              <div className="relative">
                <HomeEditImageButton imagePath={`sections.showroomCommunity.cards.${index}.img`} />
                <HomeOverlayCard
                  href={card.href}
                  title={card.title}
                  image={card.img}
                  imageAlt={card.title}
                  overlayClass={showroomCommunityOverlay}
                  aspectClass="h-full"
                  stackOnMobile
                  mobilePanelClass="border-t border-brand-dark/20 bg-brand-dark p-5 text-white"
                  heightClass="lg:min-h-[354px]"
                  external={card.external}
                  rel={
                    "nofollow" in card && card.nofollow
                      ? "nofollow noopener noreferrer"
                      : "noopener noreferrer"
                  }
                >
                  <h3 className={`${vfCardTitle} text-white lg:text-stroke-white`}>
                    {edit?.editMode ? (
                      <HomeEditableText
                        value={card.title}
                        onChange={(title) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            showroomCommunity: {
                              ...sections.showroomCommunity,
                              cards: sections.showroomCommunity.cards.map((item, cardIndex) =>
                                cardIndex === index ? { ...item, title } : item,
                              ),
                            },
                          }))
                        }
                        className={`${vfCardTitle} text-white`}
                        label="Tiêu đề"
                      />
                    ) : (
                      card.title
                    )}
                  </h3>
                  <span className="mt-4 inline-block text-xs font-semibold tracking-wide text-white/90">
                    {edit?.editMode ? (
                      <HomeEditableText
                        value={card.cta}
                        onChange={(cta) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            showroomCommunity: {
                              ...sections.showroomCommunity,
                              cards: sections.showroomCommunity.cards.map((item, cardIndex) =>
                                cardIndex === index ? { ...item, cta } : item,
                              ),
                            },
                          }))
                        }
                        className="text-xs font-semibold tracking-wide text-white/90"
                        label="Nút CTA"
                      />
                    ) : (
                      `${card.cta} →`
                    )}
                  </span>
                  {edit?.editMode ? (
                    <div className="mt-2 space-y-2">
                      <HomeEditableText
                        value={card.href}
                        onChange={(href) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            showroomCommunity: {
                              ...sections.showroomCommunity,
                              cards: sections.showroomCommunity.cards.map((item, cardIndex) =>
                                cardIndex === index ? { ...item, href } : item,
                              ),
                            },
                          }))
                        }
                        className="text-[10px] text-white/70"
                        label="Link"
                      />
                      <HomeEditListControls
                        onMoveUp={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            showroomCommunity: {
                              ...sections.showroomCommunity,
                              cards: moveListItem(
                                sections.showroomCommunity.cards,
                                index,
                                index - 1,
                              ),
                            },
                          }))
                        }
                        onMoveDown={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            showroomCommunity: {
                              ...sections.showroomCommunity,
                              cards: moveListItem(
                                sections.showroomCommunity.cards,
                                index,
                                index + 1,
                              ),
                            },
                          }))
                        }
                        onRemove={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            showroomCommunity: {
                              ...sections.showroomCommunity,
                              cards: sections.showroomCommunity.cards.filter(
                                (_, cardIndex) => cardIndex !== index,
                              ),
                            },
                          }))
                        }
                        canMoveUp={index > 0}
                        canMoveDown={index < section.cards.length - 1}
                        canRemove={section.cards.length > 1}
                      />
                    </div>
                  ) : null}
                </HomeOverlayCard>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter({ section }: { section: HomeSectionsContent["newsletter"] }) {
  const edit = useHomeAdminEdit();
  const [email, setEmail] = useState("");
  const { ref, reduced, initial, animate } = useSectionReveal(homeViewport);

  return (
    <section
      id="block-join-the-charge"
      className={`relative mt-16 overflow-hidden py-24 md:mt-24 ${edit?.editMode ? homeEditSectionClass() : ""}`}
    >
      <div className="absolute inset-0">
        <HomeEditImageButton imagePath="sections.newsletter.backgroundImage" />
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-[position:-112px_50%]"
          style={{ backgroundImage: `url(${section.backgroundImage})` }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,91,0.72)_0%,rgba(11,31,91,0.55)_100%)]"
      />
      <div className="container-vf relative">
        <motion.div
          ref={ref}
          initial={initial}
          animate={animate}
          variants={reduced ? undefined : homeNewsletterBlock}
          className="mx-auto max-w-[668px] text-center"
        >
          <motion.p
            variants={reduced ? undefined : homeNewsletterChild}
            className="text-balance text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
          >
            {edit?.editMode ? (
              <HomeEditableText
                value={section.title}
                onChange={(title) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    newsletter: { ...sections.newsletter, title },
                  }))
                }
                className="text-balance text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
                label="Tiêu đề"
              />
            ) : (
              section.title
            )}
          </motion.p>
          <motion.p
            variants={reduced ? undefined : homeNewsletterChild}
            className="mx-auto mt-4 max-w-[52ch] text-base leading-relaxed text-white/88 sm:text-lg"
          >
            {edit?.editMode ? (
              <HomeEditableText
                value={section.subtitle}
                onChange={(subtitle) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    newsletter: { ...sections.newsletter, subtitle },
                  }))
                }
                multiline
                className="mx-auto max-w-[52ch] text-base leading-relaxed text-white/88 sm:text-lg"
                label="Mô tả"
              />
            ) : (
              section.subtitle
            )}
          </motion.p>
          <motion.form
            variants={reduced ? undefined : homeNewsletterChild}
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Đăng ký thành công. Chúng tôi sẽ liên hệ sớm.");
              setEmail("");
            }}
            className="mt-4"
          >
            <div className="relative overflow-hidden rounded-lg bg-white shadow-[var(--shadow-card)] md:h-12">
              {edit?.editMode ? (
                <HomeEditableText
                  value={section.placeholder}
                  onChange={(placeholder) =>
                    edit.updateSections((sections) => ({
                      ...sections,
                      newsletter: { ...sections.newsletter, placeholder },
                    }))
                  }
                  className="block h-12 w-full bg-white px-4 text-base font-medium text-foreground md:pr-[200px]"
                  label="Placeholder email"
                />
              ) : (
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={section.placeholder}
                  className="block h-12 w-full bg-white px-4 text-base font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground md:pr-[200px] focus-visible:ring-2 focus-visible:ring-brand/30"
                />
              )}
              <MotionButton
                type="submit"
                className="mt-2.5 h-12 w-full bg-brand text-xs font-bold leading-[15px] text-white transition hover:bg-[#0046cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:absolute md:right-0 md:top-1/2 md:mt-0 md:w-[200px] md:-translate-y-1/2"
              >
                {edit?.editMode ? (
                  <HomeEditableText
                    value={section.buttonLabel}
                    onChange={(buttonLabel) =>
                      edit.updateSections((sections) => ({
                        ...sections,
                        newsletter: { ...sections.newsletter, buttonLabel },
                      }))
                    }
                    className="text-xs font-bold leading-[15px] text-white"
                    label="Nút gửi"
                  />
                ) : (
                  section.buttonLabel
                )}
              </MotionButton>
            </div>
          </motion.form>
          <motion.p
            variants={reduced ? undefined : homeNewsletterChild}
            className="mt-4 text-xs leading-[18px] text-white"
          >
            {section.disclaimer}{" "}
            <a
              href={section.privacyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline sm:whitespace-nowrap"
            >
              Chính sách Quyền riêng tư
            </a>{" "}
            của VinFast.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
