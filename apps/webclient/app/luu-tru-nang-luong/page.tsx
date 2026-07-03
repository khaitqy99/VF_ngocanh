import type { Metadata } from "next";

import EnergyStoragePage from "@/components/energy-storage/EnergyStoragePage";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("energy");
}

export default function LuuTruNangLuongPage() {
  return <EnergyStoragePage />;
}
