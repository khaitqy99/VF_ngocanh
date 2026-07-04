import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";

import Footer from "./Footer";

export default async function SiteFooter() {
  const contact = resolveDealershipContact(await getSiteSeo());
  return <Footer contact={contact} />;
}
