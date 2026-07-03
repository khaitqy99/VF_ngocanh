export const CMS_TAGS = {
  all: "cms",
  cars: "cms-cars",
  scooters: "cms-scooters",
  accessories: "cms-accessories",
  home: "cms-home",
  banners: "cms-banners",
} as const;

export function vehicleTag(id: string) {
  return `vehicle-${id}`;
}
