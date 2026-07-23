import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured } from "@vinfast3s/supabase";

export type SeoRedirect = {
  fromPath: string;
  toPath: string;
  statusCode: number;
};

const CACHE_TTL_MS = 60_000;

let cache: { at: number; redirects: SeoRedirect[] } | null = null;

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withSlash.length > 1 && withSlash.endsWith("/")) {
    return withSlash.slice(0, -1);
  }
  return withSlash;
}

export function clearSeoRedirectsCache() {
  cache = null;
}

export async function fetchEnabledSeoRedirects(): Promise<SeoRedirect[]> {
  if (!isSupabaseConfigured()) return [];

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return cache.redirects;
  }

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("seo_redirects")
      .select("from_path, to_path, status_code")
      .eq("enabled", true);
    if (error) throw new Error(error.message);

    const redirects = (data ?? []).map((row) => ({
      fromPath: normalizePath(row.from_path),
      toPath: normalizePath(row.to_path),
      statusCode: row.status_code || 301,
    }));

    cache = { at: now, redirects };
    return redirects;
  } catch (error) {
    console.error("[seo-redirects] Failed to load redirects:", error);
    return cache?.redirects ?? [];
  }
}

export async function matchSeoRedirect(pathname: string): Promise<SeoRedirect | null> {
  const normalized = normalizePath(pathname);
  const redirects = await fetchEnabledSeoRedirects();
  return redirects.find((item) => item.fromPath === normalized) ?? null;
}

export { normalizePath as normalizeSeoRedirectPath };
