import { NextResponse } from "next/server";
import { getAdminMediaFolders } from "@/lib/cms";
import { getMediaFolder, type MediaCategory } from "@/lib/media-library";
import { getSessionAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { deleteMediaFolder, getMediaFolderDeletePreview } from "@/lib/media-folder-delete";
import { revalidateAdminMedia } from "@/lib/media-revalidate";
import {
  slugFromFolderName,
  sanitizeMediaFolderSlug,
} from "@/lib/media-storage";
import {
  addCustomMediaFolder,
} from "@/lib/media-custom-folders";

const VALID_CATEGORIES = new Set<MediaCategory>(["cars", "scooters", "accessories", "news", "pages"]);

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

const CUSTOM_FOLDER_CATEGORIES = new Set<MediaCategory>(["news", "pages"]);

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { category?: MediaCategory; name?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const category = body.category;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!category || !CUSTOM_FOLDER_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Chỉ hỗ trợ tạo thư mục cho mục Bài viết hoặc Trang" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Tên thư mục không được để trống" }, { status: 400 });
  }

  const slug = body.slug ? sanitizeMediaFolderSlug(body.slug) : slugFromFolderName(name);
  if (!slug) {
    return NextResponse.json({ error: "Slug thư mục không hợp lệ" }, { status: 400 });
  }
  if (category === "news" && slug === "chung") {
    return NextResponse.json({ error: 'Slug "chung" đã được dùng cho thư mục mặc định' }, { status: 400 });
  }

  const folders = await getAdminMediaFolders();
  if (getMediaFolder(folders, category, slug)) {
    return NextResponse.json({ error: "Thư mục đã tồn tại" }, { status: 409 });
  }

  try {
    const folder = await addCustomMediaFolder({
      category,
      slug,
      name,
      subtitle: "Thư mục tùy chỉnh",
    });
    await revalidateAdminMedia();
    return NextResponse.json({ ok: true, folder });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tạo thư mục thất bại";
    return NextResponse.json({ error: message }, { status: 400 });
  }
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
