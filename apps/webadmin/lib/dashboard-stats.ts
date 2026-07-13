import { unstable_cache } from "next/cache";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Tables } from "@vinfast3s/supabase";
import { mapLeadRow, type LeadStatus, type LeadType } from "@vinfast3s/supabase/leads";
import {
  buildAccessoryPublishCheck,
  buildVehiclePublishCheck,
  vehicleMissingRealImage,
  accessoryMissingRealImage,
} from "@/lib/product-publish-check";
import { getAdminMediaFolders } from "@/lib/cms";
import { getWarmCacheConfigStatus } from "@/lib/warm-webclient-cache";

export type DashboardProductStatusCounts = {
  published: number;
  draft: number;
  archived: number;
};

export type DashboardLeadSummary = {
  new: number;
  inProgress: number;
  converted: number;
  closed: number;
  total: number;
  today: number;
  staleNew: number;
  byType: Partial<Record<LeadType, number>>;
};

export type DashboardRecentLead = {
  id: string;
  fullName: string;
  phone: string;
  type: LeadType;
  status: LeadStatus;
  vehicleInterest?: string;
  createdAt: string;
};

export type DashboardIncompleteProduct = {
  id: string;
  name: string;
  kind: "car" | "scooter" | "accessory";
  href: string;
  issues: string[];
};

export type DashboardNewsStats = {
  draft: number;
  published: number;
  scheduled: number;
  archived: number;
  total: number;
};

export type DashboardCmsPageItem = {
  slug: string;
  label: string;
  adminHref: string;
  status: "published" | "draft" | "missing";
};

export type DashboardOverview = {
  configured: boolean;
  siteUrl: string | null;
  cacheReady: boolean;
  carCount: number;
  scooterCount: number;
  accessoryCount: number;
  mediaFolderCount: number;
  mediaImageCount: number;
  draftCarCount: number;
  draftScooterCount: number;
  draftAccessoryCount: number;
  draftMissingImageCount: number;
  productStatus: {
    cars: DashboardProductStatusCounts;
    scooters: DashboardProductStatusCounts;
    accessories: DashboardProductStatusCounts;
  };
  incompletePublished: DashboardIncompleteProduct[];
  incompletePublishedCount: number;
  leads: DashboardLeadSummary;
  recentLeads: DashboardRecentLead[];
  news: DashboardNewsStats;
  cmsPages: DashboardCmsPageItem[];
  adminUserCount: number;
  seoGlobalConfigured: boolean;
};

const CMS_PAGE_DEFS: Omit<DashboardCmsPageItem, "status">[] = [
  { slug: "home", label: "Trang chủ", adminHref: "/admin/homepage" },
  { slug: "about", label: "Giới thiệu", adminHref: "/admin/pages/about" },
  { slug: "after-sales", label: "Dịch vụ hậu mãi", adminHref: "/admin/pages/after-sales" },
  { slug: "charging", label: "Pin & trạm sạc", adminHref: "/admin/pages/charging" },
  { slug: "energy", label: "Lưu trữ năng lượng", adminHref: "/admin/pages/energy" },
];

function countProductStatus(rows: { status: string }[]): DashboardProductStatusCounts {
  return rows.reduce(
    (acc, row) => {
      if (row.status === "published") acc.published += 1;
      else if (row.status === "draft") acc.draft += 1;
      else if (row.status === "archived") acc.archived += 1;
      return acc;
    },
    { published: 0, draft: 0, archived: 0 },
  );
}

function productAdminHref(kind: "car" | "scooter" | "accessory", id: string): string {
  if (kind === "car") return `/admin/cars/${id}`;
  if (kind === "scooter") return `/admin/scooters/${id}`;
  return `/admin/accessories/${id}`;
}

function buildIncompleteList(
  vehicles: Tables<"vehicles">[],
  accessories: Tables<"accessories">[],
  limit = 10,
): { items: DashboardIncompleteProduct[]; total: number } {
  const items: DashboardIncompleteProduct[] = [];

  for (const row of vehicles) {
    if (row.status !== "published") continue;
    const issues = buildVehiclePublishCheck(row);
    if (!issues.length) continue;
    items.push({
      id: row.id,
      name: row.name,
      kind: row.type === "car" ? "car" : "scooter",
      href: productAdminHref(row.type === "car" ? "car" : "scooter", row.id),
      issues: issues.map((i) => i.label),
    });
  }

  for (const row of accessories) {
    if (row.status !== "published") continue;
    const issues = buildAccessoryPublishCheck(row);
    if (!issues.length) continue;
    items.push({
      id: row.id,
      name: row.name,
      kind: "accessory",
      href: productAdminHref("accessory", row.id),
      issues: issues.map((i) => i.label),
    });
  }

  items.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  return { items: items.slice(0, limit), total: items.length };
}

function parseLeadTypeFromMetadata(metadata: unknown): LeadType {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "general";
  }
  const type = (metadata as Record<string, unknown>).type;
  return typeof type === "string" ? (type as LeadType) : "general";
}

async function fetchDashboardFromDb(): Promise<DashboardOverview> {
  const admin = createAdminClient();
  const warmConfig = getWarmCacheConfigStatus();
  const siteUrl = warmConfig.siteUrl;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartIso = todayStart.toISOString();
  const dayAgoIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    carsRes,
    scootersRes,
    accessoriesRes,
    leadsNewRes,
    leadsInProgressRes,
    leadsConvertedRes,
    leadsClosedRes,
    leadsTotalRes,
    leadsTodayRes,
    leadsStaleRes,
    recentLeadsRes,
    leadsMetaRes,
    newsRes,
    cmsPagesRes,
    seoRes,
    usersRes,
  ] = await Promise.all([
    admin.from("vehicles").select("*").eq("type", "car").order("sort_order"),
    admin.from("vehicles").select("*").eq("type", "scooter").order("sort_order"),
    admin.from("accessories").select("*").order("sort_order"),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "converted"),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "closed"),
    admin.from("leads").select("*", { count: "exact", head: true }),
    admin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStartIso),
    admin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")
      .lt("created_at", dayAgoIso),
    admin.from("leads").select("*").order("created_at", { ascending: false }).limit(8),
    admin.from("leads").select("metadata").limit(2000),
    admin.from("news_articles").select("status"),
    admin.from("cms_pages").select("slug, status"),
    admin.from("site_settings").select("value").eq("key", "seo").maybeSingle(),
    admin.auth.admin.listUsers({ perPage: 200 }),
  ]);

  const cars = carsRes.data ?? [];
  const scooters = scootersRes.data ?? [];
  const accessories = accessoriesRes.data ?? [];

  const draftCars = cars.filter((r) => r.status === "draft");
  const draftScooters = scooters.filter((r) => r.status === "draft");
  const draftAccessories = accessories.filter((r) => r.status === "draft");
  const draftMissingImageCount =
    draftCars.filter(vehicleMissingRealImage).length +
    draftScooters.filter(vehicleMissingRealImage).length +
    draftAccessories.filter(accessoryMissingRealImage).length;

  const { items: incompletePublished, total: incompletePublishedCount } = buildIncompleteList(
    [...cars, ...scooters],
    accessories,
  );

  const mappedLeads = (recentLeadsRes.data ?? []).map(mapLeadRow);

  const byType: Partial<Record<LeadType, number>> = {};
  for (const row of leadsMetaRes.data ?? []) {
    const type = parseLeadTypeFromMetadata(row.metadata);
    byType[type] = (byType[type] ?? 0) + 1;
  }

  const leads: DashboardLeadSummary = {
    new: leadsNewRes.count ?? 0,
    inProgress: leadsInProgressRes.count ?? 0,
    converted: leadsConvertedRes.count ?? 0,
    closed: leadsClosedRes.count ?? 0,
    total: leadsTotalRes.count ?? 0,
    today: leadsTodayRes.count ?? 0,
    staleNew: leadsStaleRes.count ?? 0,
    byType,
  };

  const recentLeads: DashboardRecentLead[] = mappedLeads.map((lead) => ({
    id: lead.id,
    fullName: lead.fullName,
    phone: lead.phone,
    type: lead.type,
    status: lead.status,
    vehicleInterest: lead.vehicleInterest,
    createdAt: lead.createdAt,
  }));

  const newsRows = newsRes.data ?? [];
  const news: DashboardNewsStats = {
    draft: newsRows.filter((r) => r.status === "draft").length,
    published: newsRows.filter((r) => r.status === "published").length,
    scheduled: newsRows.filter((r) => r.status === "scheduled").length,
    archived: newsRows.filter((r) => r.status === "archived").length,
    total: newsRows.length,
  };

  const cmsPageMap = new Map((cmsPagesRes.data ?? []).map((row) => [row.slug, row.status]));
  const cmsPages: DashboardCmsPageItem[] = CMS_PAGE_DEFS.map((page) => {
    const status = cmsPageMap.get(page.slug);
    return {
      ...page,
      status: status === "published" || status === "draft" ? status : "missing",
    };
  });

  const seoValue = seoRes.data?.value;
  const seoGlobalConfigured =
    seoValue != null &&
    typeof seoValue === "object" &&
    !Array.isArray(seoValue) &&
    Boolean(
      (seoValue as Record<string, unknown>).defaultTitle ||
        (seoValue as Record<string, unknown>).siteName,
    );

  const adminUserCount = (usersRes.data?.users ?? []).filter(
    (u) => u.app_metadata?.role === "admin" || u.app_metadata?.role === "super_admin",
  ).length;

  const folders = await getAdminMediaFolders();

  return {
    configured: true,
    siteUrl,
    cacheReady: warmConfig.ready,
    carCount: cars.length,
    scooterCount: scooters.length,
    accessoryCount: accessories.length,
    mediaFolderCount: folders.length,
    mediaImageCount: folders.reduce((sum, f) => sum + f.images.length, 0),
    draftCarCount: draftCars.length,
    draftScooterCount: draftScooters.length,
    draftAccessoryCount: draftAccessories.length,
    draftMissingImageCount,
    productStatus: {
      cars: countProductStatus(cars),
      scooters: countProductStatus(scooters),
      accessories: countProductStatus(accessories),
    },
    incompletePublished,
    incompletePublishedCount,
    leads,
    recentLeads,
    news,
    cmsPages,
    adminUserCount,
    seoGlobalConfigured,
  };
}

function emptyOverview(): DashboardOverview {
  return {
    configured: false,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || null,
    cacheReady: getWarmCacheConfigStatus().ready,
    carCount: 0,
    scooterCount: 0,
    accessoryCount: 0,
    mediaFolderCount: 0,
    mediaImageCount: 0,
    draftCarCount: 0,
    draftScooterCount: 0,
    draftAccessoryCount: 0,
    draftMissingImageCount: 0,
    productStatus: {
      cars: { published: 0, draft: 0, archived: 0 },
      scooters: { published: 0, draft: 0, archived: 0 },
      accessories: { published: 0, draft: 0, archived: 0 },
    },
    incompletePublished: [],
    incompletePublishedCount: 0,
    leads: {
      new: 0,
      inProgress: 0,
      converted: 0,
      closed: 0,
      total: 0,
      today: 0,
      staleNew: 0,
      byType: {},
    },
    recentLeads: [],
    news: { draft: 0, published: 0, scheduled: 0, archived: 0, total: 0 },
    cmsPages: CMS_PAGE_DEFS.map((p) => ({ ...p, status: "missing" as const })),
    adminUserCount: 0,
    seoGlobalConfigured: false,
  };
}

export const getDashboardOverview = unstable_cache(
  async (): Promise<DashboardOverview> => {
    if (!isSupabaseConfigured()) return emptyOverview();
    try {
      return await fetchDashboardFromDb();
    } catch (error) {
      console.error("[dashboard] fetch failed:", error);
      return emptyOverview();
    }
  },
  ["admin-dashboard-overview"],
  { revalidate: 30, tags: ["admin-dashboard"] },
);

/** @deprecated Use getDashboardOverview */
export type AdminDashboardStats = Pick<
  DashboardOverview,
  | "carCount"
  | "scooterCount"
  | "accessoryCount"
  | "mediaFolderCount"
  | "mediaImageCount"
  | "draftCarCount"
  | "draftScooterCount"
  | "draftAccessoryCount"
  | "draftMissingImageCount"
>;

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const overview = await getDashboardOverview();
  return {
    carCount: overview.carCount,
    scooterCount: overview.scooterCount,
    accessoryCount: overview.accessoryCount,
    mediaFolderCount: overview.mediaFolderCount,
    mediaImageCount: overview.mediaImageCount,
    draftCarCount: overview.draftCarCount,
    draftScooterCount: overview.draftScooterCount,
    draftAccessoryCount: overview.draftAccessoryCount,
    draftMissingImageCount: overview.draftMissingImageCount,
  };
}
