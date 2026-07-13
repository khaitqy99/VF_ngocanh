import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { mapNewsRow } from "@webclient/lib/cms/news-mappers";
import { revalidateWebclient, newsRevalidatePayload } from "@/lib/revalidate-webclient";
import { ensureUniqueSlug, isValidSlug, normalizeSlug } from "@/lib/content-slug";
import {
  buildNewsPatchRow,
  clearOtherFeaturedArticles,
  type NewsPayload,
} from "@/lib/news-api";
import type { PublishStatus } from "@webclient/lib/cms/news-types";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("news_articles").select("*").eq("id", id).maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
  }

  return NextResponse.json({ article: mapNewsRow(data) });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: NewsPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing, error: loadError } = await admin
    .from("news_articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
  }

  const patch = buildNewsPatchRow(body, {
    published_at: existing.published_at,
    status: existing.status as PublishStatus,
  });

  if (body.slug !== undefined) {
    const baseSlug = normalizeSlug(body.slug);
    if (!isValidSlug(baseSlug)) {
      return NextResponse.json({ error: "Slug không hợp lệ" }, { status: 400 });
    }
    patch.slug = await ensureUniqueSlug("news_articles", baseSlug, id);
  }

  if (body.isFeatured) {
    await clearOtherFeaturedArticles(admin, id);
  }

  const { data, error } = await admin
    .from("news_articles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateWebclient(newsRevalidatePayload(data.slug));
  return NextResponse.json({ article: mapNewsRow(data) });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin.from("news_articles").select("slug").eq("id", id).maybeSingle();

  const { error } = await admin.from("news_articles").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateWebclient(newsRevalidatePayload(existing?.slug));
  return NextResponse.json({ ok: true });
}
