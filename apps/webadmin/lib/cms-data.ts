export {
  formatPrice,
  type CarModel,
} from "@webclient/lib/cars";

export {
  type ScooterModel,
} from "@webclient/lib/scooters";

export type { AccessoryProduct } from "@webclient/lib/accessories";

export {
  getAdminCars,
  getAdminScooters,
  getAdminAccessories,
  getAdminCarDetail,
  getAdminScooterDetail,
  getAdminAccessoryById,
  getAdminMediaFolders,
  type AdminDashboardStats,
} from "@/lib/cms";

export {
  getDashboardOverview,
  getAdminDashboardStats,
  type DashboardOverview,
  type DashboardLeadSummary,
  type DashboardRecentLead,
} from "./dashboard-stats";
