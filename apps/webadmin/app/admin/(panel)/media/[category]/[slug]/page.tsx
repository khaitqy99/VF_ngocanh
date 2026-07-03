import Link from "next/link";
import { MediaFolderClient } from "@/components/admin/MediaFolderClient";
import { getAdminMediaFolders } from "@/lib/cms-data";
import { getMediaFolder, type MediaCategory } from "@/lib/media-library";

export const revalidate = 60;

export default async function MediaFolderPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const folders = await getAdminMediaFolders();
  const folder = getMediaFolder(folders, category as MediaCategory, slug);

  if (!folder) {
    return (
      <p className="py-12 text-center text-zinc-500">
        Không tìm thấy thư mục.{" "}
        <Link href="/admin/media" className="text-red-600 hover:underline">
          Quay lại thư viện
        </Link>
      </p>
    );
  }

  return <MediaFolderClient folder={folder} />;
}
