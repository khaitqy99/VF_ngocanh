import type { FaqItem } from "@/lib/faq";
import { DEALERSHIP_FAQ } from "@/lib/faq";
import {
  SHOWROOM_ADDRESS,
  SHOWROOM_EMAIL,
  SHOWROOM_MAP_EMBED,
  SHOWROOM_MAP_URL,
  SHOWROOM_OPENING,
  SHOWROOM_PHONE,
} from "@/lib/dealership";
import { IMAGES } from "@/lib/images";

import { DEFAULT_CHARGING_TILE, DEFAULT_SHOWROOM_CARD } from "./home-list-defaults";

export type HomeChargingTile = {
  img: string;
  title: string;
  desc: string;
  href: string;
  theme: "dark" | "light";
};

export type HomeSpecItem = {
  value: string;
  label: string;
  highlight?: boolean;
};

export type HomeLinkCard = {
  img: string;
  title: string;
  cta: string;
  href: string;
  external?: boolean;
  nofollow?: boolean;
};

export type HomeShowroomLocation = {
  eyebrow: string;
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingOpens: string;
  openingCloses: string;
  mapUrl: string;
  mapEmbed: string;
};

export type HomeSectionsContent = {
  accessories: {
    eyebrow: string;
    title: string;
    viewAllHref: string;
  };
  charging: {
    eyebrow: string;
    title: string;
    tiles: HomeChargingTile[];
  };
  warranty: {
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    specs: HomeSpecItem[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  brandStory: {
    title: string;
    subtitle: string;
    points: string[];
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
  };
  showroomCommunity: {
    cards: HomeLinkCard[];
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonLabel: string;
    disclaimer: string;
    privacyHref: string;
    backgroundImage: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: FaqItem[];
  };
  showroomLocation: HomeShowroomLocation;
};

const CHARGING_DESC =
  "Với phương châm luôn đặt lợi ích Khách hàng lên hàng đầu, VinFast áp dụng chính sách cho thuê pin độc đáo, ưu việt và khác biệt với tất cả các mô hình cho thuê pin từ trước tới nay trên thế giới.";

export const DEFAULT_HOME_SECTIONS: HomeSectionsContent = {
  accessories: {
    eyebrow: "VinFast",
    title: "Phụ kiện chính hãng",
    viewAllHref: "/phu-kien",
  },
  charging: {
    eyebrow: "Hệ sinh thái",
    title: "Pin & trạm sạc",
    tiles: [
      {
        img: IMAGES.chargingStations,
        title: "Pin & Trạm sạc ô tô điện",
        desc: CHARGING_DESC,
        href: "/pin-va-tram-sac",
        theme: "dark",
      },
      {
        img: IMAGES.chargingScooter,
        title: "Pin & Trạm sạc xe máy điện",
        desc: CHARGING_DESC,
        href: "/pin-va-tram-sac",
        theme: "dark",
      },
      {
        img: IMAGES.portableCharger,
        title: "Thiết bị sạc di động",
        desc: "VinFast cung cấp đa dạng giải pháp sạc để đáp ứng nhu cầu sử dụng của khách hàng một cách thuận tiện nhất.",
        href: "/pin-va-tram-sac#san-pham-sac",
        theme: "light",
      },
    ],
  },
  warranty: {
    title: "Bảo hành & Dịch vụ",
    subtitle:
      "VinFast đã đầu tư nghiêm túc và bài bản để phát triển hệ thống Showroom, Nhà phân phối và xưởng dịch vụ rộng khắp, đáp ứng tối đa nhu cầu của Khách hàng.",
    image: IMAGES.warrantyService,
    imageAlt: "Bảo hành và dịch vụ VinFast",
    specs: [
      { value: "63+", label: "Tỉnh thành" },
      { value: "Toàn quốc", label: "Phủ sóng dịch vụ" },
      { value: "Chính hãng", label: "Phụ tùng & bảo dưỡng" },
      { value: "24/7", label: "Hỗ trợ khách hàng", highlight: true },
    ],
    primaryCta: {
      label: "Đặt lịch bảo dưỡng",
      href: "https://vinfastauto.com/vn_vi/dat-lich-dich-vu",
    },
    secondaryCta: {
      label: "Chính sách",
      href: "https://vinfastauto.com/vn_vi/dich-vu-hau-mai/bao-hanh-va-bao-duong",
    },
  },
  brandStory: {
    title: "VinFast - Vì một Việt Nam mạnh mẽ",
    subtitle: "Tự hào thương hiệu Việt",
    points: [
      "Công nghệ đẳng cấp thế giới",
      "Sản xuất tại Việt Nam - Chuỗi giá trị nội địa",
      "Vì tương lai xanh - Bền vững",
    ],
    ctaLabel: "Tìm hiểu thêm",
    ctaHref: "https://vinfastauto.com/vn_vi",
    image: IMAGES.brandStory,
    imageAlt: "VinFast - Vì một Việt Nam mạnh mẽ",
  },
  showroomCommunity: {
    cards: [
      {
        img: IMAGES.showroom,
        title: "Showroom & trạm sạc",
        cta: "Tìm hiểu thêm",
        href: "https://vinfastauto.com/vn_vi/tim-kiem-showroom-tram-sac",
        external: true,
      },
      {
        img: IMAGES.community,
        title: "Cộng đồng VinFast toàn cầu",
        cta: "Tìm hiểu thêm",
        href: "https://vinfast.vn",
        external: true,
        nofollow: true,
      },
    ],
  },
  newsletter: {
    title: "Đăng ký nhận thông tin",
    subtitle: "Đăng ký nhận thông tin chương trình khuyến mãi, dịch vụ VinFast.",
    placeholder: "Nhập email của bạn",
    buttonLabel: "Đăng ký",
    disclaimer: "Bằng cách đăng ký, Quý khách xác nhận đã đọc, hiểu và đồng ý với",
    privacyHref: "https://vinfastauto.com/vn_vi/dieu-khoan-phap-ly",
    backgroundImage: IMAGES.newsletterBg,
  },
  faq: {
    eyebrow: "Hỏi đáp",
    title: "Câu hỏi thường gặp về VinFast Cà Mau",
    description: "Thông tin nhanh về showroom, sản phẩm, trả góp và dịch vụ hậu mãi tại Cà Mau.",
    items: DEALERSHIP_FAQ,
  },
  showroomLocation: {
    eyebrow: "Liên hệ & địa chỉ",
    title: "Ghé thăm showroom tại Cà Mau",
    description: "Đại lý VinFast 3S Cà Mau — tư vấn ô tô và xe máy điện chính hãng.",
    address: SHOWROOM_ADDRESS,
    phone: SHOWROOM_PHONE,
    email: SHOWROOM_EMAIL,
    openingOpens: SHOWROOM_OPENING.opens,
    openingCloses: SHOWROOM_OPENING.closes,
    mapUrl: SHOWROOM_MAP_URL,
    mapEmbed: SHOWROOM_MAP_EMBED,
  },
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function mergeString(current: string, override: unknown): string {
  return typeof override === "string" && override.trim() !== "" ? override : current;
}

function mergeArray<T>(
  base: T[],
  override: unknown,
  mergeItem: (base: T, itemOverride: unknown) => T,
  createDefault: () => T,
): T[] {
  if (!Array.isArray(override)) return base;
  const length = Math.max(base.length, override.length);
  return Array.from({ length }, (_, index) =>
    mergeItem(base[index] ?? createDefault(), override[index]),
  );
}

function mergeShowroomLocation(
  base: HomeShowroomLocation,
  override: unknown,
): HomeShowroomLocation {
  const obj = asRecord(override);
  if (!obj) return base;
  return {
    eyebrow: mergeString(base.eyebrow, obj.eyebrow),
    title: mergeString(base.title, obj.title),
    description: mergeString(base.description, obj.description),
    address: mergeString(base.address, obj.address),
    phone: mergeString(base.phone, obj.phone),
    email: mergeString(base.email, obj.email),
    openingOpens: mergeString(base.openingOpens, obj.openingOpens),
    openingCloses: mergeString(base.openingCloses, obj.openingCloses),
    mapUrl: mergeString(base.mapUrl, obj.mapUrl),
    mapEmbed: mergeString(base.mapEmbed, obj.mapEmbed),
  };
}

function mergeLinkCard(base: HomeLinkCard, override: unknown): HomeLinkCard {
  const obj = asRecord(override);
  if (!obj) return base;
  return {
    img: mergeString(base.img, obj.img),
    title: mergeString(base.title, obj.title),
    cta: mergeString(base.cta, obj.cta),
    href: mergeString(base.href, obj.href),
    external: typeof obj.external === "boolean" ? obj.external : base.external,
    nofollow: typeof obj.nofollow === "boolean" ? obj.nofollow : base.nofollow,
  };
}

function mergeChargingTile(base: HomeChargingTile, override: unknown): HomeChargingTile {
  const obj = asRecord(override);
  if (!obj) return base;
  return {
    img: mergeString(base.img, obj.img),
    title: mergeString(base.title, obj.title),
    desc: mergeString(base.desc, obj.desc),
    href: mergeString(base.href, obj.href),
    theme: obj.theme === "light" || obj.theme === "dark" ? obj.theme : base.theme,
  };
}

function mergeSpecItem(base: HomeSpecItem, override: unknown): HomeSpecItem {
  const obj = asRecord(override);
  if (!obj) return base;
  return {
    value: mergeString(base.value, obj.value),
    label: mergeString(base.label, obj.label),
    highlight: typeof obj.highlight === "boolean" ? obj.highlight : base.highlight,
  };
}

function mergeFaqItems(base: FaqItem[], override: unknown): FaqItem[] {
  return mergeArray(
    base,
    override,
    (fallback, item) => {
      const obj = asRecord(item);
      if (!obj) return fallback;
      return {
        question: mergeString(fallback.question, obj.question),
        answer: mergeString(fallback.answer, obj.answer),
      };
    },
    () => ({ question: "", answer: "" }),
  );
}

export function mergeHomeSections(override: unknown): HomeSectionsContent {
  const root = asRecord(override);
  if (!root) return DEFAULT_HOME_SECTIONS;

  const accessories = asRecord(root.accessories);
  const charging = asRecord(root.charging);
  const warranty = asRecord(root.warranty);
  const brandStory = asRecord(root.brandStory);
  const showroomCommunity = asRecord(root.showroomCommunity);
  const newsletter = asRecord(root.newsletter);
  const faq = asRecord(root.faq);

  const chargingTiles = mergeArray(
    DEFAULT_HOME_SECTIONS.charging.tiles,
    charging?.tiles,
    mergeChargingTile,
    () => ({ ...DEFAULT_CHARGING_TILE }),
  );

  const showroomCards = mergeArray(
    DEFAULT_HOME_SECTIONS.showroomCommunity.cards,
    showroomCommunity?.cards,
    mergeLinkCard,
    () => ({ ...DEFAULT_SHOWROOM_CARD }),
  );

  const warrantySpecs = mergeArray(
    DEFAULT_HOME_SECTIONS.warranty.specs,
    warranty?.specs,
    mergeSpecItem,
    () => ({ value: "—", label: "Nhãn" }),
  );

  const brandPoints = mergeArray(
    DEFAULT_HOME_SECTIONS.brandStory.points,
    brandStory?.points,
    (base, point) => mergeString(base, point),
    () => "",
  );

  const primaryCta = asRecord(warranty?.primaryCta);
  const secondaryCta = asRecord(warranty?.secondaryCta);

  return {
    accessories: {
      eyebrow: mergeString(DEFAULT_HOME_SECTIONS.accessories.eyebrow, accessories?.eyebrow),
      title: mergeString(DEFAULT_HOME_SECTIONS.accessories.title, accessories?.title),
      viewAllHref: mergeString(
        DEFAULT_HOME_SECTIONS.accessories.viewAllHref,
        accessories?.viewAllHref,
      ),
    },
    charging: {
      eyebrow: mergeString(DEFAULT_HOME_SECTIONS.charging.eyebrow, charging?.eyebrow),
      title: mergeString(DEFAULT_HOME_SECTIONS.charging.title, charging?.title),
      tiles: chargingTiles,
    },
    warranty: {
      title: mergeString(DEFAULT_HOME_SECTIONS.warranty.title, warranty?.title),
      subtitle: mergeString(DEFAULT_HOME_SECTIONS.warranty.subtitle, warranty?.subtitle),
      image: mergeString(DEFAULT_HOME_SECTIONS.warranty.image, warranty?.image),
      imageAlt: mergeString(DEFAULT_HOME_SECTIONS.warranty.imageAlt, warranty?.imageAlt),
      specs: warrantySpecs,
      primaryCta: {
        label: mergeString(DEFAULT_HOME_SECTIONS.warranty.primaryCta.label, primaryCta?.label),
        href: mergeString(DEFAULT_HOME_SECTIONS.warranty.primaryCta.href, primaryCta?.href),
      },
      secondaryCta: {
        label: mergeString(DEFAULT_HOME_SECTIONS.warranty.secondaryCta.label, secondaryCta?.label),
        href: mergeString(DEFAULT_HOME_SECTIONS.warranty.secondaryCta.href, secondaryCta?.href),
      },
    },
    brandStory: {
      title: mergeString(DEFAULT_HOME_SECTIONS.brandStory.title, brandStory?.title),
      subtitle: mergeString(DEFAULT_HOME_SECTIONS.brandStory.subtitle, brandStory?.subtitle),
      points: brandPoints,
      ctaLabel: mergeString(DEFAULT_HOME_SECTIONS.brandStory.ctaLabel, brandStory?.ctaLabel),
      ctaHref: mergeString(DEFAULT_HOME_SECTIONS.brandStory.ctaHref, brandStory?.ctaHref),
      image: mergeString(DEFAULT_HOME_SECTIONS.brandStory.image, brandStory?.image),
      imageAlt: mergeString(DEFAULT_HOME_SECTIONS.brandStory.imageAlt, brandStory?.imageAlt),
    },
    showroomCommunity: {
      cards: showroomCards,
    },
    newsletter: {
      title: mergeString(DEFAULT_HOME_SECTIONS.newsletter.title, newsletter?.title),
      subtitle: mergeString(DEFAULT_HOME_SECTIONS.newsletter.subtitle, newsletter?.subtitle),
      placeholder: mergeString(
        DEFAULT_HOME_SECTIONS.newsletter.placeholder,
        newsletter?.placeholder,
      ),
      buttonLabel: mergeString(
        DEFAULT_HOME_SECTIONS.newsletter.buttonLabel,
        newsletter?.buttonLabel,
      ),
      disclaimer: mergeString(DEFAULT_HOME_SECTIONS.newsletter.disclaimer, newsletter?.disclaimer),
      privacyHref: mergeString(
        DEFAULT_HOME_SECTIONS.newsletter.privacyHref,
        newsletter?.privacyHref,
      ),
      backgroundImage: mergeString(
        DEFAULT_HOME_SECTIONS.newsletter.backgroundImage,
        newsletter?.backgroundImage,
      ),
    },
    faq: {
      eyebrow: mergeString(DEFAULT_HOME_SECTIONS.faq.eyebrow, faq?.eyebrow),
      title: mergeString(DEFAULT_HOME_SECTIONS.faq.title, faq?.title),
      description: mergeString(DEFAULT_HOME_SECTIONS.faq.description, faq?.description),
      items: mergeFaqItems(DEFAULT_HOME_SECTIONS.faq.items, faq?.items),
    },
    showroomLocation: mergeShowroomLocation(
      DEFAULT_HOME_SECTIONS.showroomLocation,
      root.showroomLocation,
    ),
  };
}

export type HomeBannerInput = {
  id?: string;
  desktop: string;
  mobile: string;
  alt: string;
  sortOrder: number;
};

/** Giá carousel trang chủ theo vehicle id — chỉ override giá cũ (gạch ngang) */
export type HomeFeaturedPriceOverride = {
  listPrice?: number;
};

export type HomeFeaturedPrices = Record<string, HomeFeaturedPriceOverride>;

import type { VinFastHomeSpec } from "@/lib/vinfast-home";

export type HomeFeaturedSlideOverride = {
  title?: string;
  subtitle?: string;
  /** Thông số hiển thị trên carousel (chỗ ngồi, quãng đường, giá…) */
  specs?: VinFastHomeSpec[];
};

export type HomeFeaturedSlideOverrides = Record<string, HomeFeaturedSlideOverride>;

export function resolveFeaturedAccessories<T extends { id: string }>(
  catalog: T[],
  ids: string[] | undefined,
  limit = 8,
): T[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const resolvedIds = ids?.length ? ids : catalog.slice(0, limit).map((item) => item.id);
  return resolvedIds.map((id) => byId.get(id)).filter((item): item is T => item != null);
}
