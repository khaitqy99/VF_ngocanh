import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_TTL_SECONDS = 60 * 60;

function getPreviewSecret(): string | null {
  const secret = process.env.REVALIDATION_SECRET?.trim();
  return secret || null;
}

function signPayload(exp: string, secret: string): string {
  return createHmac("sha256", secret).update(exp).digest("base64url");
}

/** Token ngắn hạn cho iframe preview admin — ký bằng REVALIDATION_SECRET. */
export function createPreviewEditToken(ttlSeconds = DEFAULT_TTL_SECONDS): string | null {
  const secret = getPreviewSecret();
  if (!secret) return null;

  const exp = String(Math.floor(Date.now() / 1000) + ttlSeconds);
  return `${exp}.${signPayload(exp, secret)}`;
}

export function verifyPreviewEditToken(token: string | null | undefined): boolean {
  if (!token) return false;

  const secret = getPreviewSecret();
  if (!secret) return false;

  const [expStr, signature] = token.split(".");
  if (!expStr || !signature) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;

  const expected = signPayload(expStr, secret);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function appendPreviewTokenToPath(path: string, token: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}pt=${encodeURIComponent(token)}`;
}
