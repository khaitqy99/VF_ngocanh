import { getCars } from "@webclient/lib/cms";
import { CMS_CAR_PRICING_TAG } from "@/lib/cms/car-pricing";
import { carDetailPath } from "@webclient/lib/seo/slugs";
import { revalidateWebclient } from "./revalidate-webclient";

export async function revalidateCarPricing(): Promise<boolean> {
  let detailPaths: string[] = [];
  try {
    const cars = await getCars();
    detailPaths = cars.map((car) => carDetailPath(car));
  } catch (error) {
    console.warn("[revalidate] Không lấy được danh sách xe để invalidate /oto/[slug]:", error);
  }

  return revalidateWebclient({
    tags: ["cms", CMS_CAR_PRICING_TAG, "cms-cars"],
    paths: ["/", "/oto", "/oto/preview", ...detailPaths],
  });
}
