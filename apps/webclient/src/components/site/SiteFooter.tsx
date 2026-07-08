import { getFooterSettings } from "@/lib/cms/footer-fetch";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";

import Footer from "./Footer";

export default async function SiteFooter() {
  const [site, settings] = await Promise.all([getSiteSeo(), getFooterSettings()]);
  const contact = resolveDealershipContact(site);
  return <Footer contact={contact} settings={settings} />;
}
