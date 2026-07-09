import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
import { getAdminMediaFolders } from "@/lib/cms";
import { getMediaFolder, type MediaCategory } from "@/lib/media-library";
import { prepareUploadImage } from "@/lib/media-image-processing";
import {
  MAX_MEDIA_UPLOAD_BYTES,
  mediaFolderStoragePrefix,
  uniqueUploadStoragePath,
} from "@/lib/media-storage";
import { revalidateAdminMedia } from "@/lib/media-revalidate";

export const runtime = "nodejs";

const VALID_CATEGORIES = new Set<MediaCategory>(["cars", "scooters", "accessories"]);

async function appendToVehicleGallery(vehicleId: string, url: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("vehicles").select("gallery").eq("id", vehicleId).maybeSingle();
  const current = Array.isArray(data?.gallery)
    ? data.gallery.filter((item): item is string => typeof item === "string")
    : [];
  if (current.includes(url)) return;
  await admin.from("vehicles").update({ gallery: [...current, url] }).eq("id", vehicleId);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Không đọc được form upload" }, { status: 400 });
  }

  const category = formData.get("category");
  const slug = formData.get("slug");
  if (typeof category !== "string" || typeof slug !== "string" || !VALID_CATEGORIES.has(category as MediaCategory)) {
    return NextResponse.json({ error: "Thiếu hoặc sai category/slug" }, { status: 400 });
  }

  const folders = await getAdminMediaFolders();
  const folder = getMediaFolder(folders, category as MediaCategory, slug);
  if (!folder) {
    return NextResponse.json({ error: "Không tìm thấy thư mục ảnh" }, { status: 404 });
  }

  const files = formData.getAll("files").filter((item): item is File => item instanceof File);
  if (!files.length) {
    return NextResponse.json({ error: "Chưa chọn file ảnh" }, { status: 400 });
  }
  if (files.length > 20) {
    return NextResponse.json({ error: "Tối đa 20 ảnh mỗi lần upload" }, { status: 400 });
  }

  const admin = createAdminClient();
  const folderPrefix = mediaFolderStoragePrefix(category as MediaCategory, slug);
  const uploaded: { id: string; name: string; path: string; assetId: string }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      errors.push(`${file.name}: không phải file ảnh`);
      continue;
    }
    if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
      errors.push(`${file.name}: vượt quá 10MB`);
      continue;
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    let prepared;
    try {
      prepared = await prepareUploadImage(file, rawBuffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không chuyển được sang WebP";
      errors.push(`${file.name}: ${message}`);
      continue;
    }

    const storagePath = uniqueUploadStoragePath(folderPrefix, prepared.filename);

    const { error: uploadError } = await admin.storage.from("media").upload(storagePath, prepared.buffer, {
      contentType: prepared.contentType,
      upsert: false,
    });
    if (uploadError) {
      errors.push(`${file.name}: ${uploadError.message}`);
      continue;
    }

    const { data: publicData } = admin.storage.from("media").getPublicUrl(storagePath);
    const url = publicData.publicUrl;

    const { data: row, error: insertError } = await admin
      .from("media_assets")
      .insert({
        filename: prepared.filename,
        url,
        mime_type: prepared.contentType,
        size_bytes: prepared.buffer.length,
        folder: folderPrefix,
        uploaded_by: session.id,
      })
      .select("id, filename, url")
      .single();

    if (insertError || !row) {
      await admin.storage.from("media").remove([storagePath]);
      errors.push(`${file.name}: ${insertError?.message ?? "Không lưu được vào CSDL"}`);
      continue;
    }

    if (category === "cars" || category === "scooters") {
      await appendToVehicleGallery(slug, url);
    }

    uploaded.push({
      id: row.id,
      name: row.filename,
      path: row.url,
      assetId: row.id,
    });
  }

  if (!uploaded.length) {
    return NextResponse.json(
      { error: errors[0] ?? "Upload thất bại", errors },
      { status: 400 },
    );
  }

  await revalidateAdminMedia();

  return NextResponse.json({
    ok: true,
    uploaded,
    errors: errors.length ? errors : undefined,
  });
}
