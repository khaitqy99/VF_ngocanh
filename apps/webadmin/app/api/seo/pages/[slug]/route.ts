import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import type { Json, TablesInsert } from "@vinfast3s/supabase";
import {
  getStaticPageSeoDefinition,
  parseSeoRecord,
  resolveStaticPageSeo,
  type SeoRecord,
} from "@/lib/seo";
import { getSiteSeo } from "@/lib/cms/seo";
import { revalidateSeo } from "@/lib/seo-revalidate";

type Body = {
  seo?: SeoRecord;
  slugPath?: string;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const definition = getStaticPageSeoDefinition(slug);
  if (!definition) {
    return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
  }

  if (!isSupabaseConfigured()) {
    const site = await getSiteSeo();
    const resolved = resolveStaticPageSeo(definition, null, site);
    return NextResponse.json({ definition, seo: {}, resolved, configured: false });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cms_pages")
    .select("slug, title, seo, status")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const seo = parseSeoRecord(data?.seo);
  const site = await getSiteSeo();
  const resolved = resolveStaticPageSeo(definition, seo, site);

  return NextResponse.json({
    definition,
    seo,
    resolved,
    status: data?.status ?? "draft",
    configured: true,
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const { slug } = await context.params;
  const definition = getStaticPageSeoDefinition(slug);
  if (!definition) {
    return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const seo = body.seo ?? {};
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("cms_pages")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from("cms_pages")
      .update({
        seo: seo as Json,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const insertPayload: TablesInsert<"cms_pages"> = {
      slug,
      title: definition.label,
      status: "published",
      content: {},
      seo: seo as Json,
    };
    const { error } = await admin.from("cms_pages").insert(insertPayload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const revalidated = await revalidateSeo([definition.path]);
  return NextResponse.json({ ok: true, revalidated });
}
