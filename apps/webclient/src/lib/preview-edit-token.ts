import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 60 * 60 * 1000;

export function getPreviewEditSecret(): string {
  return process.env.PREVIEW_EDIT_SECRET ?? process.env.REVALIDATION_SECRET ?? "";
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** scope: path prefix được phép sửa, vd. `/oto`, `/xe-may-dien`, `/phu-kien` */
export function createPreviewEditToken(scope: string): string {
  const secret = getPreviewEditSecret();
  if (!secret) return "";
  const normalizedScope = scope.split("?")[0].replace(/\/$/, "") || "/";
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${normalizedScope}|${exp}`;
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${signPayload(payload, secret)}`;
}

export function verifyPreviewEditToken(
  requestPath: string,
  token: string | null | undefined,
): boolean {
  const secret = getPreviewEditSecret();
  if (!secret || !token) return false;

  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expectedSig = signPayload(payload, secret);
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expectedSig, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  const [scope, expStr] = payload.split("|");
  const exp = Number(expStr);
  if (!scope || !Number.isFinite(exp) || Date.now() > exp) return false;

  const path = requestPath.split("?")[0].replace(/\/$/, "") || "/";
  return path === scope || path.startsWith(`${scope}/`);
}

export function previewScopeFromPath(previewPath: string): string {
  const path = previewPath.split("?")[0];
  if (path.startsWith("/oto")) return "/oto";
  if (path.startsWith("/xe-may-dien")) return "/xe-may-dien";
  if (path.startsWith("/phu-kien")) return "/phu-kien";
  return path;
}

export function buildPreviewEditUrl(siteUrl: string, previewPath: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const path = previewPath.startsWith("/") ? previewPath : `/${previewPath}`;
  const scope = previewScopeFromPath(path);
  const token = createPreviewEditToken(scope);
  if (!token) return `${base}${path}`;
  const joiner = path.includes("?") ? "&" : "?";
  return `${base}${path}${joiner}edit_token=${encodeURIComponent(token)}`;
}
