import sharp from "sharp";
import { sanitizeMediaFilename } from "@/lib/media-storage";

export const WEBP_QUALITY = 85;
export const WEBP_EFFORT = 4;
export const MAX_IMAGE_DIMENSION = 2560;

export type PreparedUploadImage = {
  buffer: Buffer;
  contentType: string;
  filename: string;
};

function filenameStem(filename: string): string {
  const safe = sanitizeMediaFilename(filename);
  return safe.includes(".") ? safe.slice(0, safe.lastIndexOf(".")) : safe;
}

function isValidSvgBuffer(buffer: Buffer): boolean {
  const head = buffer.subarray(0, 4096).toString("utf8").trimStart();
  if (!head || head.includes("\0")) return false;
  return /^(<\?xml[\s>]|<svg[\s>])/i.test(head);
}

async function tryRasterWebp(rawBuffer: Buffer): Promise<Buffer | null> {
  try {
    const image = sharp(rawBuffer, { failOn: "none" }).rotate();
    const metadata = await image.metadata();
    if (!metadata.format || metadata.format === "svg") return null;

    return image
      .resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toBuffer();
  } catch {
    return null;
  }
}

export async function prepareUploadImage(
  file: File,
  rawBuffer: Buffer,
): Promise<PreparedUploadImage> {
  const stem = filenameStem(file.name);

  const rasterWebp = await tryRasterWebp(rawBuffer);
  if (rasterWebp) {
    return {
      buffer: rasterWebp,
      contentType: "image/webp",
      filename: `${stem}.webp`,
    };
  }

  if (isValidSvgBuffer(rawBuffer)) {
    return {
      buffer: rawBuffer,
      contentType: "image/svg+xml",
      filename: `${stem}.svg`,
    };
  }

  const webpBuffer = await sharp(rawBuffer)
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toBuffer();

  return {
    buffer: webpBuffer,
    contentType: "image/webp",
    filename: `${stem}.webp`,
  };
}
