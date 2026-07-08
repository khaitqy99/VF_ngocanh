export function staticEditSectionClass(active?: boolean) {
  return active ? "ring-2 ring-amber-300 ring-offset-2" : "ring-1 ring-brand/15 ring-offset-1";
}

export function heroBannersToCmsInput(
  banners: { desktop: string; mobile: string; alt: string }[],
): import("@/lib/cms/static-pages").CmsBannerInput[] {
  return banners.map((banner, index) => ({
    desktop: banner.desktop,
    mobile: banner.mobile || banner.desktop,
    alt: banner.alt,
    sortOrder: index,
  }));
}
