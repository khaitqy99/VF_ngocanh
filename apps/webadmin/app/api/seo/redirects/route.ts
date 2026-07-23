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

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ redirects: [], configured: false });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("seo_redirects")
    .select("*")
    .order("from_path", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    redirects: data ?? [],
    configured: true,
  });
}

export async function POST(request: Request) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

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

  const fromPath = normalizePath(body.fromPath ?? "");
  const toPath = normalizePath(body.toPath ?? "");
  if (!fromPath || !toPath) {
    return NextResponse.json({ error: "Thiếu from_path hoặc to_path" }, { status: 400 });
  }
  if (fromPath === toPath) {
    return NextResponse.json({ error: "from_path và to_path không được trùng nhau" }, { status: 400 });
  }

  const statusCode = [301, 302, 307, 308].includes(body.statusCode ?? 301)
    ? (body.statusCode ?? 301)
    : 301;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("seo_redirects")
    .insert({
      from_path: fromPath,
      to_path: toPath,
      status_code: statusCode,
      enabled: body.enabled !== false,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateSeo([fromPath, toPath]);
  return NextResponse.json({ ok: true, redirect: data });
}
