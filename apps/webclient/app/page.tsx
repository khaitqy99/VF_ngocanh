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

export const revalidate = 86400;

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
          buildFaqPageSchema(home.sections.faq.items),
        ]}
      />
      <HomePage
        heroBanners={home.heroBanners}
        featuredCars={home.featuredCars}
        featuredScooters={home.featuredScooters}
        accessories={home.accessories}
        latestNews={home.latestNews}
        contact={resolveDealershipContact(site)}
        sections={home.sections}
      />
    </>
  );
}
