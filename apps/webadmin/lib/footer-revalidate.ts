import { CMS_FOOTER_TAG } from "@/lib/cms/footer";
import { revalidateWebclient, sitewideLayoutRevalidatePayload } from "./revalidate-webclient";

export async function revalidateFooter(): Promise<boolean> {
  return revalidateWebclient(
    sitewideLayoutRevalidatePayload([CMS_FOOTER_TAG, "cms-seo"]),
  );
}
