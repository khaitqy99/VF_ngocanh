import type { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("about");
}

export default function GioiThieuPage() {
  return <AboutPage />;
}
