import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { mapNewsRow } from "@webclient/lib/cms/news-mappers";
import { revalidateWebclient, newsRevalidatePayload } from "@/lib/revalidate-webclient";
import { ensureUniqueSlug, isValidSlug, normalizeSlug } from "@/lib/content-slug";
import { getSessionAdmin } from "@/lib/auth";
import {
  buildNewsInsertRow,
  clearOtherFeaturedArticles,
  type NewsPayload,
} from "@/lib/news-api";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ articles: [], configured: false });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("news_articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    articles: (data ?? []).map(mapNewsRow),
    configured: true,
  });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: NewsPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "Tiêu đề là bắt buộc" }, { status: 400 });
  }

  const baseSlug = normalizeSlug(body.slug?.trim() || title);
  if (body.slug && !isValidSlug(baseSlug)) {
    return NextResponse.json({ error: "Slug không hợp lệ" }, { status: 400 });
  }

  const session = await getSessionAdmin();
  const admin = createAdminClient();
  const slug = await ensureUniqueSlug("news_articles", baseSlug);

  if (body.isFeatured) {
    await clearOtherFeaturedArticles(admin);
  }

  const insertRow = buildNewsInsertRow(
    {
      ...body,
      title,
      authorId: body.authorId ?? session?.id ?? null,
      authorName:
        body.authorName ??
        (typeof session?.email === "string" ? session.email : null),
    },
    slug,
  );

  const { data, error } = await admin.from("news_articles").insert(insertRow).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateWebclient(newsRevalidatePayload(slug));
  return NextResponse.json({ article: mapNewsRow(data) });
}
