import { CMS_FLOATING_TAG } from "@/lib/cms/floating";
import { revalidateWebclient, sitewideLayoutRevalidatePayload } from "./revalidate-webclient";

export async function revalidateFloating(): Promise<boolean> {
  return revalidateWebclient(sitewideLayoutRevalidatePayload([CMS_FLOATING_TAG, "cms-seo"]));
}
