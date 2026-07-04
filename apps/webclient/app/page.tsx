import type { Metadata } from "next";

import HomePage from "@/components/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomeData } from "@/lib/cms";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import {
  buildAutoDealerSchema,
  buildFaqPageSchema,
  buildWebSiteSchema,
} from "@/lib/seo/local-business";
import { DEALERSHIP_FAQ } from "@/lib/faq";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("home");
}

export default async function Page() {
  const [home, site] = await Promise.all([getHomeData(), getSiteSeo()]);

  return (
    <>
      <JsonLd
        data={[
          buildWebSiteSchema(site),
          buildAutoDealerSchema(site),
          buildFaqPageSchema(DEALERSHIP_FAQ),
        ]}
      />
      <HomePage
        heroBanners={home.heroBanners}
        featuredCars={home.featuredCars}
        featuredScooters={home.featuredScooters}
        accessories={home.accessories}
        contact={resolveDealershipContact(site)}
      />
    </>
  );
}
