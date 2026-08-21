import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";
import {
  defaultLegalPageContent,
  isLegalPageSlug,
  LEGAL_PAGE_META,
  mergeLegalPageContent,
  parseLegalPageContent,
  type LegalPageContent,
} from "@/lib/cms/legal";
import { revalidateLegalPage } from "@/lib/legal-revalidate";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!isLegalPageSlug(slug)) {
    return NextResponse.json({ error: "Trang không hợp lệ" }, { status: 404 });
  }

  const meta = LEGAL_PAGE_META[slug];
  const defaults = defaultLegalPageContent(slug);

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      slug,
      label: meta.label,
      path: meta.path,
      content: defaults,
    });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cms_pages")
    .select("content")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    slug,
    label: meta.label,
    path: meta.path,
    content: mergeLegalPageContent(slug, parseLegalPageContent(data?.content)),
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!isLegalPageSlug(slug)) {
    return NextResponse.json({ error: "Trang không hợp lệ" }, { status: 404 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: { content?: LegalPageContent };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.content || typeof body.content !== "object") {
    return NextResponse.json({ error: "Thiếu content" }, { status: 400 });
  }

  const meta = LEGAL_PAGE_META[slug];
  const content = mergeLegalPageContent(slug, body.content);
  const admin = createAdminClient();

  const { error } = await admin.from("cms_pages").upsert(
    {
      slug,
      title: meta.cmsTitle,
      status: "published",
      content: content as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const revalidated = await revalidateLegalPage(slug);
  return NextResponse.json({ ok: true, content, revalidated });
}
