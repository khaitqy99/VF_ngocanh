import { CMS_CAR_PRICING_TAG } from "@/lib/cms/car-pricing";
import { revalidateWebclient } from "./revalidate-webclient";

export async function revalidateCarPricing() {
  await revalidateWebclient({
    tags: ["cms", CMS_CAR_PRICING_TAG],
    paths: ["/oto"],
  });
}
