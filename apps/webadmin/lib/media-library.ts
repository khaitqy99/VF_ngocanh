import type { CarModel } from "@webclient/lib/cars";
import { getCarGallery } from "@webclient/lib/vinfast-galleries";
import type { ScooterModel } from "@webclient/lib/scooters";
import type { AccessoryProduct } from "@webclient/lib/accessories";

export type MediaCategory = "cars" | "scooters" | "accessories";

export type MediaImage = {
  id: string;
  name: string;
  path: string;
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

export function buildMediaFolders(
  cars: CarModel[],
  scooters: ScooterModel[],
  accessories: AccessoryProduct[],
  galleriesByVehicleId: Map<string, string[]> = new Map(),
): MediaFolder[] {
  const carFolders: MediaFolder[] = cars.map((car) => {
    const fromDb = galleriesByVehicleId.get(car.id);
    const paths = withSharedAssets(
      uniquePaths(fromDb?.length ? fromDb : getCarGallery(car)),
    );
    return {
      category: "cars",
      slug: car.id,
      name: car.name,
      subtitle: car.subtitle,
      coverImage: car.image,
      storagePath: `/images/vinfast/gallery/${car.id}/`,
      images: paths.map((p, i) => toMediaImage(p, i, car.id)),
      productHref: `/admin/cars/${car.id}`,
    };
  });

  const scooterFolders: MediaFolder[] = scooters.map((scooter) => {
    const fromDb = galleriesByVehicleId.get(scooter.id);
    const paths = withSharedAssets(uniquePaths(fromDb?.length ? fromDb : [scooter.image]));
    return {
      category: "scooters",
      slug: scooter.id,
      name: scooter.name,
      subtitle: scooter.subtitle,
      coverImage: scooter.image,
      storagePath: `/images/vinfast/scooters/${scooter.id}/`,
      images: paths.map((p, i) => toMediaImage(p, i, scooter.id)),
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
      return {
        category: "accessories" as const,
        slug: vehicleId,
        name: data.name,
        subtitle: `${paths.length} ảnh · ${data.accessoryIds.length} sản phẩm`,
        coverImage: paths[0] ?? "/images/vinfast/accessories/",
        storagePath: `/images/vinfast/accessories/${vehicleId}/`,
        images: paths.map((p, i) => toMediaImage(p, i, vehicleId)),
      };
    });

  return [...carFolders, ...scooterFolders, ...accessoryFolders];
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
