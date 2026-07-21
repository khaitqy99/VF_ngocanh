import { IMAGES } from "@/lib/images";
import {
  CHARGING_FAQ,
  CHARGING_PRODUCTS,
  CHARGING_STEPS,
  NETWORK_STATS,
  STATION_TYPES,
  WHY_CHARGING,
  type ChargingProduct,
} from "@/lib/charging";
import {
  ENERGY_APPLICATIONS,
  ENERGY_BENEFITS,
  ENERGY_FAQS,
  ENERGY_SOLUTIONS,
  ENERGY_SPECS,
  ENERGY_STATS,
  ENERGY_WHY_CHOOSE_ITEMS,
  INSTALLATION_STEPS,
} from "@/lib/energy-storage";
import { DEFAULT_ABOUT_CONTENT, DEFAULT_AFTER_SALES_CONTENT } from "@/lib/cms/static-page-defaults";

export type StaticPageSlug = "about" | "after-sales" | "charging" | "energy";

export type CmsFaqItem = { q: string; a: string };
export type CmsStatItem = { value: string; label: string };

export type CmsBannerInput = {
  id?: string;
  desktop: string;
  mobile: string;
  alt: string;
  sortOrder?: number;
};

export type AboutMilestone = {
  year: string;
  title: string;
  desc: string;
  image: string;
};

export type AboutWhyItem = {
  title: string;
  desc: string;
};

export type AboutPageContent = {
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    imagePosition?: "top" | "center" | "bottom";
  };
  stats?: CmsStatItem[];
  milestones?: AboutMilestone[];
  whyChoose?: AboutWhyItem[];
  mission?: { title?: string; content?: string; image?: string };
  vision?: { title?: string; content?: string; image?: string };
  faq?: CmsFaqItem[];
};

export type AfterSalesService = {
  title: string;
  desc: string;
  items: string[];
};

export type AfterSalesWarranty = {
  title: string;
  highlight: string;
  items: string[];
};

export type AfterSalesPageContent = {
  hero?: {
    eyebrow?: string;
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    highlights?: CmsStatItem[];
  };
  services?: AfterSalesService[];
  warranty?: AfterSalesWarranty[];
  faq?: CmsFaqItem[];
};

export type ChargingPageContent = {
  hero?: {
    eyebrow?: string;
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    highlights?: CmsStatItem[];
  };
  stats?: CmsStatItem[];
  stationTypes?: {
    id: string;
    title: string;
    power: string;
    time: string;
    desc: string;
    features: string[];
    image: string;
  }[];
  products?: ChargingProduct[];
  steps?: { step: string; title: string; desc: string }[];
  whyCharging?: { title: string; desc: string }[];
  faq?: CmsFaqItem[];
};

export type EnergyPageContent = {
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    imageAlt?: string;
    imagePosition?: "top" | "center" | "bottom";
  };
  intro?: { image?: string };
  calculator?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    note?: string;
  };
  stats?: CmsStatItem[];
  solutions?: typeof ENERGY_SOLUTIONS;
  benefits?: { title: string; desc: string }[];
  applications?: { title: string; desc: string; benefits: string[] }[];
  specs?: { label: string; value: string }[];
  steps?: { step: string; title: string; desc: string }[];
  whyChoose?: {
    eyebrow?: string;
    title?: string;
    image?: string;
    imageAlt?: string;
    items?: { title: string; desc: string }[];
  };
  faq?: CmsFaqItem[];
};

export type StaticPageContentMap = {
  about: AboutPageContent;
  "after-sales": AfterSalesPageContent;
  charging: ChargingPageContent;
  energy: EnergyPageContent;
};

export const STATIC_PAGE_SLUGS: StaticPageSlug[] = ["about", "after-sales", "charging", "energy"];

export const STATIC_PAGE_META: Record<
  StaticPageSlug,
  { label: string; path: string; bannerPlacement?: "after_sales" | "charging" }
> = {
  about: { label: "Giới thiệu", path: "/gioi-thieu" },
  "after-sales": {
    label: "Dịch vụ hậu mãi",
    path: "/dich-vu-hau-mai",
    bannerPlacement: "after_sales",
  },
  charging: {
    label: "Pin & Trạm sạc",
    path: "/pin-va-tram-sac",
    bannerPlacement: "charging",
  },
  energy: { label: "Lưu trữ năng lượng", path: "/luu-tru-nang-luong" },
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getDefaultStaticPageContent<S extends StaticPageSlug>(
  slug: S,
): StaticPageContentMap[S] {
  switch (slug) {
    case "about":
      return clone(DEFAULT_ABOUT_CONTENT) as StaticPageContentMap[S];
    case "after-sales":
      return clone(DEFAULT_AFTER_SALES_CONTENT) as StaticPageContentMap[S];
    case "charging":
      return {
        hero: {
          title: "Hệ thống trạm sạc & pin",
          titleAccent: "toàn diện, thông minh",
          subtitle:
            "VinFast tự hào xây dựng hạ tầng năng lượng hàng đầu Đông Nam Á với hơn 150.000 cổng sạc thông minh phủ khắp nẻo đường Việt Nam — đồng hành cùng công nghệ pin LFP siêu bền và giải pháp sạc tại nhà tiện ích.",
          highlights: [
            { value: "150.000+", label: "Cổng sạc toàn quốc" },
            { value: "2.500+", label: "Trạm sạc công cộng" },
            { value: "24/7", label: "Hỗ trợ kỹ thuật" },
          ],
        },
        stats: NETWORK_STATS.map(({ value, label }) => ({ value, label })),
        stationTypes: STATION_TYPES.map((item) => ({
          id: item.id,
          title: item.title,
          power: item.power,
          time: item.time,
          desc: item.desc,
          features: [...item.features],
          image: item.image,
        })),
        products: CHARGING_PRODUCTS.map((product) => ({ ...product, specs: [...product.specs] })),
        steps: CHARGING_STEPS.map((step) => ({ ...step })),
        whyCharging: WHY_CHARGING.map(({ title, desc }) => ({ title, desc })),
        faq: CHARGING_FAQ.map(({ q, a }) => ({ q, a })),
      } as StaticPageContentMap[S];
    case "energy":
      return {
        hero: {
          eyebrow: "Giải pháp năng lượng",
          title: "Lưu trữ năng lượng VinFast",
          subtitle:
            "Hệ thống pin lưu trữ năng lượng thông minh — tích hợp điện mặt trời, trạm sạc xe điện và quản lý từ xa.",
          image: IMAGES.chargingStations,
          imageAlt: "Hệ thống lưu trữ năng lượng VinFast",
          imagePosition: "center",
        },
        intro: {
          image: IMAGES.herioGreen,
        },
        calculator: {
          eyebrow: "Năng lượng tương lai",
          title: "Dự toán hiệu quả đầu tư & tiết kiệm",
          description:
            "Nhập số tiền điện tiêu thụ trung bình hàng tháng của bạn để tính toán ngay khả năng tiết kiệm chi phí, giảm phát thải carbon CO2 và thời gian hoàn vốn đầu tư hệ thống pin lưu trữ ESS.",
          note: "Lưu ý: Kết quả trên dựa trên mô hình thuật toán cạo đỉnh giờ cao điểm (Peak Shaving) và tối ưu nguồn sạc giá điện bậc thang của điện lực EVN.",
        },
        stats: ENERGY_STATS.map(({ value, label }) => ({ value, label })),
        solutions: clone(ENERGY_SOLUTIONS),
        benefits: ENERGY_BENEFITS.map(({ title, desc }) => ({ title, desc })),
        applications: ENERGY_APPLICATIONS.map((item) => ({
          title: item.title,
          desc: item.desc,
          benefits: [...item.benefits],
        })),
        specs: ENERGY_SPECS.map(({ label, value }) => ({ label, value })),
        steps: INSTALLATION_STEPS.map((step) => ({ ...step })),
        whyChoose: {
          eyebrow: "Năng lực đại lý",
          title: "Vì sao chọn dịch vụ tại VinFast Ngọc Anh Cà Mau?",
          image: IMAGES.showroom,
          imageAlt: "VinFast Ngọc Anh Cà Mau — Đại lý VinFast",
          items: ENERGY_WHY_CHOOSE_ITEMS.map(({ title, desc }) => ({ title, desc })),
        },
        faq: ENERGY_FAQS.map(({ q, a }) => ({ q, a })),
      } as StaticPageContentMap[S];
    default:
      return {} as StaticPageContentMap[S];
  }
}

function mergeArray<T>(base: T[] | undefined, override: unknown): T[] | undefined {
  if (!Array.isArray(override) || override.length === 0) return base;
  return override as T[];
}

function mergeRecord<T extends Record<string, unknown>>(
  base: T | undefined,
  override: unknown,
): T | undefined {
  if (!override || typeof override !== "object" || Array.isArray(override)) return base;
  const result = { ...(base ?? {}) } as T;
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    (result as Record<string, unknown>)[key] = value;
  }
  return result;
}

export function mergeStaticPageContent<S extends StaticPageSlug>(
  slug: S,
  cmsContent: unknown,
): StaticPageContentMap[S] {
  const defaults = getDefaultStaticPageContent(slug);
  if (!cmsContent || typeof cmsContent !== "object" || Array.isArray(cmsContent)) {
    return defaults;
  }

  const raw = cmsContent as Record<string, unknown>;

  switch (slug) {
    case "about": {
      const base = defaults as AboutPageContent;
      return {
        hero: mergeRecord(base.hero, raw.hero),
        stats: mergeArray(base.stats, raw.stats),
        milestones: mergeArray(base.milestones, raw.milestones),
        whyChoose: mergeArray(base.whyChoose, raw.whyChoose),
        mission: mergeRecord(base.mission, raw.mission),
        vision: mergeRecord(base.vision, raw.vision),
        faq: mergeArray(base.faq, raw.faq),
      } as StaticPageContentMap[S];
    }
    case "after-sales": {
      const base = defaults as AfterSalesPageContent;
      return {
        hero: mergeRecord(base.hero, raw.hero),
        services: mergeArray(base.services, raw.services),
        warranty: mergeArray(base.warranty, raw.warranty),
        faq: mergeArray(base.faq, raw.faq),
      } as StaticPageContentMap[S];
    }
    case "charging": {
      const base = defaults as ChargingPageContent;
      return {
        hero: mergeRecord(base.hero, raw.hero),
        stats: mergeArray(base.stats, raw.stats),
        stationTypes: mergeArray(base.stationTypes, raw.stationTypes),
        products: mergeArray(base.products, raw.products),
        steps: mergeArray(base.steps, raw.steps),
        whyCharging: mergeArray(base.whyCharging, raw.whyCharging),
        faq: mergeArray(base.faq, raw.faq),
      } as StaticPageContentMap[S];
    }
    case "energy": {
      const base = defaults as EnergyPageContent;
      const mergedWhyChoose = mergeRecord(base.whyChoose, raw.whyChoose);
      const rawWhyChoose =
        raw.whyChoose && typeof raw.whyChoose === "object" && !Array.isArray(raw.whyChoose)
          ? (raw.whyChoose as Record<string, unknown>)
          : undefined;
      return {
        hero: mergeRecord(base.hero, raw.hero),
        intro: mergeRecord(base.intro, raw.intro),
        calculator: mergeRecord(base.calculator, raw.calculator),
        stats: mergeArray(base.stats, raw.stats),
        solutions: mergeArray(base.solutions, raw.solutions),
        benefits: mergeArray(base.benefits, raw.benefits),
        applications: mergeArray(base.applications, raw.applications),
        specs: mergeArray(base.specs, raw.specs),
        steps: mergeArray(base.steps, raw.steps),
        whyChoose: mergedWhyChoose
          ? {
              ...mergedWhyChoose,
              items: mergeArray(base.whyChoose?.items, rawWhyChoose?.items),
            }
          : base.whyChoose,
        faq: mergeArray(base.faq, raw.faq),
      } as StaticPageContentMap[S];
    }
    default:
      return defaults;
  }
}

export function isStaticPageSlug(value: string): value is StaticPageSlug {
  return STATIC_PAGE_SLUGS.includes(value as StaticPageSlug);
}
