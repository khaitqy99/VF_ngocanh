import { MediaLibraryClient } from "@/components/admin/MediaLibraryClient";
import { getAdminMediaFolders } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const folders = await getAdminMediaFolders();
  return <MediaLibraryClient folders={folders} />;
}
