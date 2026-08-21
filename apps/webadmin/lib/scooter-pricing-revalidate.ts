import { getScooters } from "@webclient/lib/cms";
import { CMS_SCOOTER_PRICING_TAG } from "@/lib/cms/scooter-pricing";
import { scooterDetailPath } from "@webclient/lib/seo/slugs";
import { revalidateWebclient } from "./revalidate-webclient";

export async function revalidateScooterPricing(): Promise<boolean> {
  let detailPaths: string[] = [];
  try {
    const scooters = await getScooters();
    detailPaths = scooters.map((scooter) => scooterDetailPath(scooter));
  } catch (error) {
    console.warn(
      "[revalidate] Không lấy được danh sách xe máy để invalidate /xe-may-dien/[slug]:",
      error,
    );
  }

  return revalidateWebclient({
    tags: ["cms", CMS_SCOOTER_PRICING_TAG, "cms-scooters"],
    paths: ["/", "/xe-may-dien", "/xe-may-dien/preview", ...detailPaths],
  });
}
