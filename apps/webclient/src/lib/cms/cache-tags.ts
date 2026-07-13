export const CMS_TAGS = {
  all: "cms",
  cars: "cms-cars",
  scooters: "cms-scooters",
  accessories: "cms-accessories",
  home: "cms-home",
  banners: "cms-banners",
  news: "cms-news",
} as const;

export function staticPageTag(slug: string) {
  return `cms-page-${slug}`;
}

export function vehicleTag(id: string) {
  return `vehicle-${id}`;
}
