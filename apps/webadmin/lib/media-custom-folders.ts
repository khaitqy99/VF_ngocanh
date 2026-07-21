import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";
import type { MediaCategory } from "@/lib/media-library";
import { sanitizeMediaFolderSlug, slugFromFolderName } from "@/lib/media-storage";

export const MEDIA_CUSTOM_FOLDERS_KEY = "media_custom_folders";

export type CustomMediaFolder = {
  category: MediaCategory;
  slug: string;
  name: string;
  subtitle?: string;
  createdAt: string;
};

export function parseCustomMediaFolders(value: unknown): CustomMediaFolder[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CustomMediaFolder => {
    return (
      !!item &&
      typeof item === "object" &&
      typeof (item as CustomMediaFolder).category === "string" &&
      typeof (item as CustomMediaFolder).slug === "string" &&
      typeof (item as CustomMediaFolder).name === "string" &&
      typeof (item as CustomMediaFolder).createdAt === "string"
    );
  });
}

export async function getCustomMediaFolders(): Promise<CustomMediaFolder[]> {
  if (!isSupabaseConfigured()) return [];

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", MEDIA_CUSTOM_FOLDERS_KEY)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return parseCustomMediaFolders(data?.value);
}

export async function addCustomMediaFolder(
  folder: Omit<CustomMediaFolder, "createdAt">,
): Promise<CustomMediaFolder> {
  if (!isSupabaseConfigured()) {
    throw new Error("Database chưa được cấu hình");
  }

  const admin = createAdminClient();
  const existing = await getCustomMediaFolders();
  const entry: CustomMediaFolder = { ...folder, createdAt: new Date().toISOString() };
  const next = [
    ...existing.filter((item) => !(item.category === entry.category && item.slug === entry.slug)),
    entry,
  ];

  const { error } = await admin.from("site_settings").upsert(
    {
      key: MEDIA_CUSTOM_FOLDERS_KEY,
      value: next as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) throw new Error(error.message);
  return entry;
}

export async function removeCustomMediaFolder(
  category: MediaCategory,
  slug: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const admin = createAdminClient();
  const existing = await getCustomMediaFolders();
  const next = existing.filter((item) => !(item.category === category && item.slug === slug));
  if (next.length === existing.length) return;

  const { error } = await admin.from("site_settings").upsert(
    {
      key: MEDIA_CUSTOM_FOLDERS_KEY,
      value: next as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) throw new Error(error.message);
}

export function isCustomMediaFolder(
  customFolders: CustomMediaFolder[],
  category: MediaCategory,
  slug: string,
): boolean {
  return customFolders.some((folder) => folder.category === category && folder.slug === slug);
}
