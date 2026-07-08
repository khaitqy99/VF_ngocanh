import { CMS_FOOTER_TAG } from "@/lib/cms/footer";
import { revalidateWebclient } from "./revalidate-webclient";

export async function revalidateFooter() {
  await revalidateWebclient({
    tags: ["cms", CMS_FOOTER_TAG],
    paths: ["/"],
  });
}
