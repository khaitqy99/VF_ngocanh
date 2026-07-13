import { NextResponse } from "next/server";
import { getAdminMediaFolders } from "@/lib/cms";
import { getMediaFolder, type MediaCategory } from "@/lib/media-library";
import { getSessionAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { deleteMediaFolder, getMediaFolderDeletePreview } from "@/lib/media-folder-delete";
import { revalidateAdminMedia } from "@/lib/media-revalidate";

const VALID_CATEGORIES = new Set<MediaCategory>(["cars", "scooters", "accessories", "news"]);

function parseCategory(value: string | null): MediaCategory | null {
  if (!value || !VALID_CATEGORIES.has(value as MediaCategory)) return null;
  return value as MediaCategory;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = parseCategory(searchParams.get("category"));
  const slug = searchParams.get("slug");

  if (!category || !slug) {
    return NextResponse.json({ error: "Thiếu category hoặc slug" }, { status: 400 });
  }

  if (searchParams.get("preview") === "delete") {
    const session = await getSessionAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const preview = await getMediaFolderDeletePreview(category, slug);
    if (!preview) {
      return NextResponse.json({ error: "Không tìm thấy thư mục" }, { status: 404 });
    }
    return NextResponse.json({ preview });
  }

  const folders = await getAdminMediaFolders();
  const folder = getMediaFolder(folders, category, slug);

  if (!folder) {
    return NextResponse.json({ error: "Không tìm thấy thư mục" }, { status: 404 });
  }

  return NextResponse.json({ folder });
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const category = parseCategory(searchParams.get("category"));
  const slug = searchParams.get("slug");

  if (!category || !slug) {
    return NextResponse.json({ error: "Thiếu category hoặc slug" }, { status: 400 });
  }

  try {
    const result = await deleteMediaFolder(category, slug);
    await revalidateAdminMedia();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Xóa thư mục thất bại";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
