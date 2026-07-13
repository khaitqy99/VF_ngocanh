import { slugify } from "@webclient/lib/seo/slugs";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(value: string): string {
  return slugify(value.trim()) || "bai-viet";
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export async function ensureUniqueSlug(
  table: "news_articles",
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  const { createAdminClient } = await import("@vinfast3s/supabase/admin");
  const admin = createAdminClient();
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    let query = admin.from(table).select("id").eq("slug", candidate).limit(1);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const existing = data?.[0];
    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
