import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";
import {
  defaultSiteSeoSettings,
  mergeSiteSeoSettings,
  parseSiteSeoSettings,
  type SitemapSettings,
} from "@/lib/seo";
import { revalidateSeo } from "@/lib/seo-revalidate";

async function loadSiteSeoSettings() {
  if (!isSupabaseConfigured()) {
    return defaultSiteSeoSettings();
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "seo")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return mergeSiteSeoSettings(parseSiteSeoSettings(data?.value));
}

async function fetchSitemapEntries() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const secret = process.env.REVALIDATION_SECRET;

  if (!siteUrl || !secret) {
    return {
      entries: [] as Array<{
        path: string;
        url: string;
        lastModified: string;
        changeFrequency: string;
        priority: number;
        imageCount: number;
      }>,
      previewError:
        "Chưa cấu hình NEXT_PUBLIC_SITE_URL hoặc REVALIDATION_SECRET — không tải được preview sitemap.",
    };
  }

  try {
    const response = await fetch(`${siteUrl}/api/sitemap/entries`, {
      headers: { "x-revalidate-secret": secret },
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as {
      entries?: Array<{
        path: string;
        url: string;
        lastModified: string;
        changeFrequency: string;
        priority: number;
        imageCount: number;
      }>;
      error?: string;
    } | null;

    if (!response.ok) {
      return {
        entries: [],
        previewError: data?.error ?? `Không tải được sitemap từ ${siteUrl} (${response.status}).`,
      };
    }

    return {
      entries: Array.isArray(data?.entries) ? data.entries : [],
      previewError: null as string | null,
    };
  } catch {
    return {
      entries: [],
      previewError: `Không kết nối được webclient tại ${siteUrl}. Hãy chạy npm run dev:client.`,
    };
  }
}

export async function GET() {
  try {
    const [settings, preview] = await Promise.all([loadSiteSeoSettings(), fetchSitemapEntries()]);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? null;

    return NextResponse.json({
      settings: settings.sitemap ?? defaultSiteSeoSettings().sitemap,
      entries: preview.entries,
      previewError: preview.previewError,
      siteUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không tải được sitemap" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: { settings?: SitemapSettings };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.settings || typeof body.settings !== "object") {
    return NextResponse.json({ error: "Thiếu settings" }, { status: 400 });
  }

  try {
    const current = await loadSiteSeoSettings();
    const nextSettings = mergeSiteSeoSettings({
      ...current,
      sitemap: {
        excludePaths: body.settings.excludePaths ?? [],
        includeImageSitemap: body.settings.includeImageSitemap ?? true,
      },
    });

    const admin = createAdminClient();
    const value = nextSettings as unknown as Json;
    const { error } = await admin.from("site_settings").upsert(
      {
        key: "seo",
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const revalidated = await revalidateSeo();
    return NextResponse.json({
      ok: true,
      settings: nextSettings.sitemap,
      revalidated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lưu thất bại" },
      { status: 500 },
    );
  }
}
