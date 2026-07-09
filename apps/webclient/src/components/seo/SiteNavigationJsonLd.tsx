import { JsonLd } from "@/components/seo/JsonLd";
import { buildSiteNavigationSchema } from "@/lib/seo/local-business";

export function SiteNavigationJsonLd() {
  return <JsonLd data={buildSiteNavigationSchema()} />;
}
