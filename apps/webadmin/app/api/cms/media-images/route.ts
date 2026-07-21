import { NextResponse } from "next/server";
import { getAdminMediaFolders } from "@/lib/cms";
import { getMediaCategoryLabel } from "@/lib/media-library";

export const dynamic = "force-dynamic";

export async function GET() {
  const folders = await getAdminMediaFolders();

  const payload = folders.map((folder) => ({
    category: folder.category,
    categoryLabel: getMediaCategoryLabel(folder.category),
    slug: folder.slug,
    name: folder.name,
    subtitle: folder.subtitle,
    coverImage: folder.coverImage,
    storagePath: folder.storagePath,
    images: folder.images.map((image) => ({
      id: image.id,
      name: image.name,
      path: image.path,
    })),
  }));

  const images = payload.flatMap((folder) =>
    folder.images.map((image) => ({
      ...image,
      folderName: folder.name,
      category: folder.category,
      folderSlug: folder.slug,
    })),
  );

  const unique = new Map<string, (typeof images)[number]>();
  for (const image of images) {
    if (!unique.has(image.path)) unique.set(image.path, image);
  }

  return NextResponse.json({
    folders: payload,
    images: [...unique.values()],
  });
}
