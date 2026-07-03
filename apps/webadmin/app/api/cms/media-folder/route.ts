import { NextResponse } from "next/server";
import { getAdminMediaFolders } from "@/lib/cms";
import { getMediaFolder, type MediaCategory } from "@/lib/media-library";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as MediaCategory | null;
  const slug = searchParams.get("slug");

  if (!category || !slug) {
    return NextResponse.json({ error: "Thiếu category hoặc slug" }, { status: 400 });
  }

  const folders = await getAdminMediaFolders();
  const folder = getMediaFolder(folders, category, slug);

  if (!folder) {
    return NextResponse.json({ error: "Không tìm thấy thư mục" }, { status: 404 });
  }

  return NextResponse.json({ folder });
}
