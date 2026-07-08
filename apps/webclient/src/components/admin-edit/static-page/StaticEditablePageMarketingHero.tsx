"use client";

import type { ReactNode } from "react";

import {
  CatalogHeroIntro,
  type CatalogHeroFeature,
  type CatalogHeroHighlight,
} from "@/components/shared/CatalogHeroIntro";
import { PromoBannerCarousel } from "@/components/shared/PromoBannerCarousel";
import type { CmsStatItem } from "@/lib/cms/static-pages";
import type { HeroBannerSlide } from "@/lib/images";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import { StaticEditableBannerCarousel } from "@/components/admin-edit/static-page/StaticEditableBannerCarousel";
import { StaticEditableText } from "@/components/admin-edit/static-page/StaticEditableText";

type MarketingHeroContent = {
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  highlights?: CmsStatItem[];
};

export function StaticEditablePageMarketingHero({
  banners,
  hero,
  defaultHero,
  features,
  primaryCta,
  secondaryCta,
  showControls = true,
}: {
  banners: HeroBannerSlide[];
  hero?: MarketingHeroContent;
  defaultHero: MarketingHeroContent;
  features: CatalogHeroFeature[];
  primaryCta: { label: string; onClick: () => void };
  secondaryCta: { label: string; href: string };
  showControls?: boolean;
}) {
  const edit = useStaticPageAdminEdit();
  const merged = { ...defaultHero, ...hero };
  const highlights = merged.highlights ?? defaultHero.highlights ?? [];

  const highlightItems = highlights.map((item, index) => ({
    value: edit?.editMode ? (
      <StaticEditableText
        value={item.value}
        onChange={(value) => edit.updateField(`hero.highlights.${index}.value`, value)}
        className="text-brand-dark font-bold"
      />
    ) : (
      item.value
    ),
    label: edit?.editMode ? (
      <StaticEditableText
        value={item.label}
        onChange={(value) => edit.updateField(`hero.highlights.${index}.label`, value)}
        className="text-muted-foreground text-[11px]"
        multiline
      />
    ) : (
      item.label
    ),
  })) as CatalogHeroHighlight[];

  const titleNode: ReactNode = edit?.editMode ? (
    <StaticEditableText
      value={merged.title ?? ""}
      onChange={(value) => edit.updateField("hero.title", value)}
      className="text-brand-dark"
    />
  ) : (
    (merged.title ?? "")
  );

  const titleAccentNode: ReactNode = edit?.editMode ? (
    <StaticEditableText
      value={merged.titleAccent ?? ""}
      onChange={(value) => edit.updateField("hero.titleAccent", value)}
      className="text-brand"
    />
  ) : (
    (merged.titleAccent ?? "")
  );

  const descriptionNode: ReactNode = edit?.editMode ? (
    <StaticEditableText
      value={merged.subtitle ?? ""}
      onChange={(value) => edit.updateField("hero.subtitle", value)}
      multiline
    />
  ) : (
    (merged.subtitle ?? "")
  );

  return (
    <div className="relative">
      {edit?.editMode ? (
        <StaticEditableBannerCarousel banners={banners} />
      ) : (
        <section className="relative overflow-hidden bg-brand-dark">
          <PromoBannerCarousel
            banners={banners}
            variant="cinematic"
            showControls={showControls && banners.length > 1}
          />
        </section>
      )}
      <CatalogHeroIntro
        title={titleNode}
        titleAccent={titleAccentNode}
        description={descriptionNode}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        highlights={highlightItems}
        features={features}
        overlap
      />
    </div>
  );
}
