import { createAdminClient } from "@vinfast3s/supabase/admin";
import type { MediaCategory } from "@/lib/media-library";
import { mediaFolderStoragePrefix, storagePathFromPublicUrl } from "@/lib/media-storage";

async function listStoragePaths(prefix: string): Promise<string[]> {
  const admin = createAdminClient();
  const paths: string[] = [];

  async function walk(folder: string) {
    const { data, error } = await admin.storage.from("media").list(folder, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    });
    if (error || !data?.length) return;

    for (const item of data) {
      const fullPath = folder ? `${folder}/${item.name}` : item.name;
      if (item.id === null) {
        await walk(fullPath);
      } else {
        paths.push(fullPath);
      }
    }
  }

  await walk(prefix);
  return paths;
}

export async function deleteMediaFolderAssets(
  category: MediaCategory,
  slug: string,
): Promise<{ deletedAssets: number; deletedFiles: number }> {
  const admin = createAdminClient();
  const folderPrefix = mediaFolderStoragePrefix(category, slug);

  const { data: assets, error: assetsError } = await admin
    .from("media_assets")
    .select("id, url")
    .eq("folder", folderPrefix);

  if (assetsError) throw new Error(assetsError.message);

  const storagePaths = new Set<string>();
  for (const asset of assets ?? []) {
    const path = storagePathFromPublicUrl(asset.url);
    if (path) storagePaths.add(path);
  }

  for (const path of await listStoragePaths(folderPrefix)) {
    storagePaths.add(path);
  }

  if (storagePaths.size > 0) {
    const { error: storageError } = await admin.storage
      .from("media")
      .remove([...storagePaths]);
    if (storageError) throw new Error(storageError.message);
  }

  const assetIds = (assets ?? []).map((row) => row.id);
  if (assetIds.length > 0) {
    const { error: deleteError } = await admin.from("media_assets").delete().in("id", assetIds);
    if (deleteError) throw new Error(deleteError.message);
  }

  return {
    deletedAssets: assetIds.length,
    deletedFiles: storagePaths.size,
  };
}

export async function removeUrlFromVehicleGalleries(url: string) {
  const admin = createAdminClient();
  const { data: vehicles } = await admin.from("vehicles").select("id, gallery");
  for (const row of vehicles ?? []) {
    if (!Array.isArray(row.gallery)) continue;
    const next = row.gallery.filter((item) => item !== url);
    if (next.length !== row.gallery.length) {
      await admin.from("vehicles").update({ gallery: next }).eq("id", row.id);
    }
  }
}
