import { createAdminClient } from "@vinfast3s/supabase/admin";
import type { MediaCategory } from "@/lib/media-library";
import { deleteMediaFolderAssets } from "@/lib/product-media-cleanup";
import { getAdminMediaFolders } from "@/lib/cms";
import { getMediaFolder } from "@/lib/media-library";

export type MediaFolderDeletePreview = {
  folderName: string;
  imageCount: number;
  warnings: string[];
};

export async function getMediaFolderDeletePreview(
  category: MediaCategory,
  slug: string,
): Promise<MediaFolderDeletePreview | null> {
  const folders = await getAdminMediaFolders();
  const folder = getMediaFolder(folders, category, slug);
  if (!folder) return null;

  const warnings: string[] = [];
  const admin = createAdminClient();

  if (category === "cars" || category === "scooters") {
    const vehicleType = category === "cars" ? "car" : "scooter";
    const { data } = await admin
      .from("vehicles")
      .select("name")
      .eq("id", slug)
      .eq("type", vehicleType)
      .maybeSingle();
    if (data) {
      warnings.push(
        `Sản phẩm "${data.name}" vẫn tồn tại — chỉ xóa file ảnh trong thư mục, không xóa sản phẩm.`,
      );
    }
  }

  if (category === "accessories") {
    warnings.push("Thư mục phụ kiện có thể dùng chung cho nhiều sản phẩm trên web.");
  }

  if (category === "news") {
    if (slug === "chung") {
      warnings.push("Đây là thư mục ảnh chung cho mọi bài viết.");
    } else {
      const { data } = await admin
        .from("news_articles")
        .select("title")
        .eq("slug", slug)
        .maybeSingle();
      if (data) {
        warnings.push(`Bài viết "${data.title}" vẫn tồn tại — ảnh trong bài có thể bị lỗi.`);
      }
    }
  }

  return {
    folderName: folder.name,
    imageCount: folder.images.length,
    warnings,
  };
}

export async function deleteMediaFolder(category: MediaCategory, slug: string) {
  const preview = await getMediaFolderDeletePreview(category, slug);
  if (!preview) throw new Error("Không tìm thấy thư mục ảnh");

  const media = await deleteMediaFolderAssets(category, slug);
  return { ...media, folderName: preview.folderName };
}
