const IMAGE_PATH_PATTERN =
  /^(\/images\/|https?:\/\/[^\s"']+\.(webp|jpg|jpeg|png|gif|svg|avif))(\?[^\s"']*)?$/i;

const IMAGE_FIELD_NAMES = new Set([
  "image",
  "desktop",
  "mobile",
  "coverimageurl",
  "coverimage",
  "heroimage",
  "thumbnail",
  "icon",
  "iconsvg",
  "background",
  "src",
  "url",
]);

function looksLikeImagePath(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/images/")) return true;
  if (/^https?:\/\//i.test(trimmed) && /\.(webp|jpg|jpeg|png|gif|svg|avif)(\?|$)/i.test(trimmed)) {
    return true;
  }
  return IMAGE_PATH_PATTERN.test(trimmed);
}

export function collectImagePathsFromValue(value: unknown, output = new Set<string>()): string[] {
  if (typeof value === "string") {
    if (looksLikeImagePath(value)) output.add(value.trim());
    return [...output];
  }

  if (Array.isArray(value)) {
    for (const item of value) collectImagePathsFromValue(item, output);
    return [...output];
  }

  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (typeof nested === "string" && IMAGE_FIELD_NAMES.has(key.toLowerCase())) {
        if (looksLikeImagePath(nested)) output.add(nested.trim());
        continue;
      }
      collectImagePathsFromValue(nested, output);
    }
  }

  return [...output];
}
