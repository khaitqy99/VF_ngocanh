import { buildSitemapEntries, renderImageSitemapXml } from "@/lib/seo/build-sitemap";

export const revalidate = 86400;

/** Dedicated Google image sitemap — registered in robots.txt alongside /sitemap.xml. */
export async function GET() {
  const entries = await buildSitemapEntries();
  const xml = renderImageSitemapXml(entries);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
