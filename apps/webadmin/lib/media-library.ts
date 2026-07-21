import type { CarModel } from "@webclient/lib/cars";
import { resolveVehicleMediaPaths } from "@webclient/lib/cms/vehicle-images";
import { getCarGallery } from "@webclient/lib/vinfast-galleries";
import type { ScooterModel } from "@webclient/lib/scooters";
import type { AccessoryProduct } from "@webclient/lib/accessories";
import { mediaFolderStoragePrefix } from "@/lib/media-storage";
import type { CustomMediaFolder } from "@/lib/media-custom-folders";
import { collectImagePathsFromValue } from "@/lib/media-page-images";

export type MediaCategory = "cars" | "scooters" | "accessories" | "news" | "pages";

export type PageMediaRef = {
  slug: string;
  name: string;
  subtitle?: string;
  productHref: string;
  seedPaths: string[];
};

export type NewsArticleMediaRef = {
  id: string;
  slug: string;
  title: string;
  coverImageUrl?: string | null;
};

export type MediaImage = {
  id: string;
  name: string;
  path: string;
  assetId?: string;
};

export type MediaFolder = {
  category: MediaCategory;
  slug: string;
  name: string;
  subtitle?: string;
  coverImage: string;
  storagePath: string;
  images: MediaImage[];
  productHref?: string;
};

export const MEDIA_CATEGORY_OPTIONS: { value: MediaCategory | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "cars", label: "Ô tô" },
  { value: "scooters", label: "Xe máy" },
  { value: "accessories", label: "Phụ kiện theo xe" },
  { value: "news", label: "Bài viết" },
  { value: "pages", label: "Trang" },
];

export function getMediaCategoryLabel(category: MediaCategory): string {
  return MEDIA_CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? category;
}

function imageFileName(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      return new URL(path).pathname.split("/").pop() ?? path;
    } catch {
      return path;
    }
  }
  return path.split("/").pop() ?? path;
}

function toMediaImage(path: string, index: number, prefix: string): MediaImage {
  return {
    id: `${prefix}-${index}-${imageFileName(path)}`,
    name: imageFileName(path),
    path,
  };
}

const SHARED_SVG_ICONS = [
  "/images/icons/tech-app.svg",
  "/images/icons/tech-voice.svg",
  "/images/icons/tech-battery.svg",
  "/images/icons/tech-screen.svg",
  "/images/icons/tech-gps.svg",
  "/images/icons/tech-shield.svg",
];

function withSharedAssets(paths: string[]): string[] {
  return uniquePaths([...paths, ...SHARED_SVG_ICONS]);
}

function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths.filter(Boolean))];
}

function mergeFolderImages(
  dbAssets: MediaImage[],
  paths: string[],
  prefix: string,
): MediaImage[] {
  const merged: MediaImage[] = [];
  const seen = new Set<string>();

  for (const asset of dbAssets) {
    if (seen.has(asset.path)) continue;
    seen.add(asset.path);
    merged.push(asset);
  }

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]!;
    if (seen.has(path)) continue;
    seen.add(path);
    merged.push(toMediaImage(path, i, prefix));
  }

  return merged;
}

function buildNewsMediaFolders(
  articles: NewsArticleMediaRef[],
  mediaAssetsByFolder: Map<string, MediaImage[]>,
  customFolders: CustomMediaFolder[] = [],
): MediaFolder[] {
  const folders: MediaFolder[] = [];
  const seenSlugs = new Set<string>();

  const chungKey = mediaFolderStoragePrefix("news", "chung");
  const chungDb = mediaAssetsByFolder.get(chungKey) ?? [];
  seenSlugs.add("chung");
  folders.push({
    category: "news",
    slug: "chung",
    name: "Ảnh chung bài viết",
    subtitle: "Ảnh dùng trong nội dung tin tức & blog",
    coverImage: chungDb[0]?.path ?? "/images/vinfast/showroom.webp",
    storagePath: "/images/news/chung/",
    images: mergeFolderImages(chungDb, [], "news-chung"),
    productHref: "/admin/posts",
  });

  for (const article of articles) {
    seenSlugs.add(article.slug);
    const folderKey = mediaFolderStoragePrefix("news", article.slug);
    const dbAssets = mediaAssetsByFolder.get(folderKey) ?? [];
    const seedPaths = article.coverImageUrl ? [article.coverImageUrl] : [];
    const images = mergeFolderImages(dbAssets, seedPaths, article.slug);
    folders.push({
      category: "news",
      slug: article.slug,
      name: article.title,
      subtitle: "Thư mục ảnh bài viết",
      coverImage:
        dbAssets[0]?.path ??
        article.coverImageUrl ??
        images[0]?.path ??
        "/images/vinfast/showroom.webp",
      storagePath: `/images/news/${article.slug}/`,
      images,
      productHref: `/admin/posts/${article.id}`,
    });
  }

  for (const custom of customFolders.filter((folder) => folder.category === "news")) {
    if (seenSlugs.has(custom.slug)) continue;
    seenSlugs.add(custom.slug);
    const folderKey = mediaFolderStoragePrefix("news", custom.slug);
    const dbAssets = mediaAssetsByFolder.get(folderKey) ?? [];
    folders.push({
      category: "news",
      slug: custom.slug,
      name: custom.name,
      subtitle: custom.subtitle ?? "Thư mục tùy chỉnh",
      coverImage: dbAssets[0]?.path ?? "/images/vinfast/showroom.webp",
      storagePath: `/images/news/${custom.slug}/`,
      images: mergeFolderImages(dbAssets, [], custom.slug),
    });
  }

  return folders;
}

function buildPagesMediaFolders(
  pages: PageMediaRef[],
  mediaAssetsByFolder: Map<string, MediaImage[]>,
  customFolders: CustomMediaFolder[] = [],
): MediaFolder[] {
  const folders: MediaFolder[] = [];
  const seenSlugs = new Set<string>();

  for (const page of pages) {
    seenSlugs.add(page.slug);
    const folderKey = mediaFolderStoragePrefix("pages", page.slug);
    const dbAssets = mediaAssetsByFolder.get(folderKey) ?? [];
    const images = mergeFolderImages(dbAssets, page.seedPaths, page.slug);
    folders.push({
      category: "pages",
      slug: page.slug,
      name: page.name,
      subtitle: page.subtitle ?? "Ảnh dùng trên trang",
      coverImage:
        dbAssets[0]?.path ?? page.seedPaths[0] ?? images[0]?.path ?? "/images/vinfast/showroom.webp",
      storagePath: `/images/pages/${page.slug}/`,
      images,
      productHref: page.productHref,
    });
  }

  for (const custom of customFolders.filter((folder) => folder.category === "pages")) {
    if (seenSlugs.has(custom.slug)) continue;
    seenSlugs.add(custom.slug);
    const folderKey = mediaFolderStoragePrefix("pages", custom.slug);
    const dbAssets = mediaAssetsByFolder.get(folderKey) ?? [];
    folders.push({
      category: "pages",
      slug: custom.slug,
      name: custom.name,
      subtitle: custom.subtitle ?? "Thư mục tùy chỉnh",
      coverImage: dbAssets[0]?.path ?? "/images/vinfast/showroom.webp",
      storagePath: `/images/pages/${custom.slug}/`,
      images: mergeFolderImages(dbAssets, [], custom.slug),
    });
  }

  return folders;
}

export function buildMediaFolders(
  cars: CarModel[],
  scooters: ScooterModel[],
  accessories: AccessoryProduct[],
  galleriesByVehicleId: Map<string, string[]> = new Map(),
  mediaAssetsByFolder: Map<string, MediaImage[]> = new Map(),
  newsArticles: NewsArticleMediaRef[] = [],
  customFolders: CustomMediaFolder[] = [],
  pages: PageMediaRef[] = [],
): MediaFolder[] {
  const carFolders: MediaFolder[] = cars.map((car) => {
    const fromDb = galleriesByVehicleId.get(car.id);
    const paths = withSharedAssets(
      resolveVehicleMediaPaths(car.id, fromDb, getCarGallery(car)),
    );
    const folderKey = mediaFolderStoragePrefix("cars", car.id);
    const dbAssets = mediaAssetsByFolder.get(folderKey) ?? [];
    return {
      category: "cars",
      slug: car.id,
      name: car.name,
      subtitle: car.subtitle,
      coverImage: dbAssets[0]?.path ?? car.image,
      storagePath: `/images/vinfast/gallery/${car.id}/`,
      images: mergeFolderImages(dbAssets, paths, car.id),
      productHref: `/admin/cars/${car.id}`,
    };
  });

  const scooterFolders: MediaFolder[] = scooters.map((scooter) => {
    const fromDb = galleriesByVehicleId.get(scooter.id);
    const paths = withSharedAssets(
      resolveVehicleMediaPaths(scooter.id, fromDb, [scooter.image]),
    );
    const folderKey = mediaFolderStoragePrefix("scooters", scooter.id);
    const dbAssets = mediaAssetsByFolder.get(folderKey) ?? [];
    return {
      category: "scooters",
      slug: scooter.id,
      name: scooter.name,
      subtitle: scooter.subtitle,
      coverImage: dbAssets[0]?.path ?? scooter.image,
      storagePath: `/images/vinfast/scooters/${scooter.id}/`,
      images: mergeFolderImages(dbAssets, paths, scooter.id),
      productHref: `/admin/scooters/${scooter.id}`,
    };
  });

  const vehicleNames: Record<string, string> = {};
  for (const car of cars) vehicleNames[car.id] = car.name;
  for (const scooter of scooters) vehicleNames[scooter.id] = scooter.name;

  const byVehicle = new Map<string, { name: string; paths: string[]; accessoryIds: string[] }>();

  for (const item of accessories) {
    const targets = item.vehicles?.length ? item.vehicles : ["chung"];
    for (const vehicleId of targets) {
      const existing = byVehicle.get(vehicleId);
      const label =
        vehicleNames[vehicleId] ?? (vehicleId === "chung" ? "Phụ kiện chung" : vehicleId.toUpperCase());
      if (existing) {
        existing.paths.push(item.image);
        existing.accessoryIds.push(item.id);
      } else {
        byVehicle.set(vehicleId, {
          name: `Phụ kiện ${label}`,
          paths: [item.image],
          accessoryIds: [item.id],
        });
      }
    }
  }

  const accessoryFolders: MediaFolder[] = [...byVehicle.entries()]
    .sort(([a], [b]) => {
      if (a === "chung") return 1;
      if (b === "chung") return -1;
      return a.localeCompare(b);
    })
    .map(([vehicleId, data]) => {
      const paths = uniquePaths(data.paths);
      const folderKey = mediaFolderStoragePrefix("accessories", vehicleId);
      const dbAssets = mediaAssetsByFolder.get(folderKey) ?? [];
      const images = mergeFolderImages(dbAssets, paths, vehicleId);
      return {
        category: "accessories" as const,
        slug: vehicleId,
        name: data.name,
        subtitle: `${images.length} ảnh · ${data.accessoryIds.length} sản phẩm`,
        coverImage: images[0]?.path ?? "/images/vinfast/accessories/",
        storagePath: `/images/vinfast/accessories/${vehicleId}/`,
        images,
      };
    });

  const newsFolders = buildNewsMediaFolders(newsArticles, mediaAssetsByFolder, customFolders);
  const pageFolders = buildPagesMediaFolders(pages, mediaAssetsByFolder, customFolders);

  return [...carFolders, ...scooterFolders, ...accessoryFolders, ...newsFolders, ...pageFolders];
}

export function getMediaFoldersByCategory(
  folders: MediaFolder[],
  category: MediaCategory | "all",
): MediaFolder[] {
  if (category === "all") return folders;
  return folders.filter((f) => f.category === category);
}

export function getMediaFolder(
  folders: MediaFolder[],
  category: MediaCategory,
  slug: string,
): MediaFolder | undefined {
  return folders.find((f) => f.category === category && f.slug === slug);
}
