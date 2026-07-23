import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
import { revalidateSeo } from "@/lib/seo-revalidate";

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withSlash.length > 1 && withSlash.endsWith("/")) {
    return withSlash.slice(0, -1);
  }
  return withSlash;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const { id } = await context.params;
  let body: {
    fromPath?: string;
    toPath?: string;
    statusCode?: number;
    enabled?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const patch: {
    from_path?: string;
    to_path?: string;
    status_code?: number;
    enabled?: boolean;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };
  if (body.fromPath !== undefined) patch.from_path = normalizePath(body.fromPath);
  if (body.toPath !== undefined) patch.to_path = normalizePath(body.toPath);
  if (body.statusCode !== undefined) {
    patch.status_code = [301, 302, 307, 308].includes(body.statusCode) ? body.statusCode : 301;
  }
  if (body.enabled !== undefined) patch.enabled = Boolean(body.enabled);

  if (
    typeof patch.from_path === "string" &&
    typeof patch.to_path === "string" &&
    patch.from_path === patch.to_path
  ) {
    return NextResponse.json({ error: "from_path và to_path không được trùng nhau" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("seo_redirects")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateSeo(
    [data.from_path, data.to_path].filter((path): path is string => typeof path === "string"),
  );
  return NextResponse.json({ ok: true, redirect: data });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const { id } = await context.params;
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("seo_redirects")
    .select("from_path, to_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.from("seo_redirects").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateSeo(
    [existing?.from_path, existing?.to_path].filter(
      (path): path is string => typeof path === "string",
    ),
  );
  return NextResponse.json({ ok: true });
}
