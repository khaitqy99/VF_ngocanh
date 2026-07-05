"use client";

import {
  CatalogHeroIntro,
  type CatalogHeroFeature,
  type CatalogHeroHighlight,
} from "@/components/shared/CatalogHeroIntro";
import { PromoBannerCarousel } from "@/components/shared/PromoBannerCarousel";
import type { HeroBannerSlide } from "@/lib/images";

export function PageMarketingHero({
  banners,
  showControls = true,
  title,
  titleAccent,
  description,
  primaryCta,
  secondaryCta,
  highlights,
  features,
}: {
  banners: HeroBannerSlide[];
  showControls?: boolean;
  title: string;
  titleAccent: string;
  description: string;
  primaryCta: { label: string; onClick: () => void };
  secondaryCta: { label: string; href: string };
  highlights: CatalogHeroHighlight[];
  features: CatalogHeroFeature[];
}) {
  return (
    <div className="relative">
      <section className="relative overflow-hidden bg-brand-dark">
        <PromoBannerCarousel
          banners={banners}
          variant="cinematic"
          showControls={showControls && banners.length > 1}
        />
      </section>
      <CatalogHeroIntro
        title={title}
        titleAccent={titleAccent}
        description={description}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        highlights={highlights}
        features={features}
        overlap
      />
    </div>
  );
}
