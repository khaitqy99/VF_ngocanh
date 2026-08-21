import { createHash } from "node:crypto";

const GRAPH_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string): string | undefined {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) return undefined;
  return trimmed;
}

function normalizePhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return undefined;
  if (digits.startsWith("84")) return digits;
  if (digits.startsWith("0")) return `84${digits.slice(1)}`;
  return digits;
}

function cookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  const value = match?.[1]?.trim();
  return value || undefined;
}

function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim();
  return ip || undefined;
}

export async function sendMetaLeadConversion(options: {
  request: Request;
  eventId: string;
  email?: string;
  phone?: string;
  eventSourceUrl?: string;
  contentName?: string;
}): Promise<void> {
  const pixelId =
    process.env.META_PIXEL_ID?.trim() || process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!pixelId || !accessToken) return;

  const email = options.email ? normalizeEmail(options.email) : undefined;
  const phone = options.phone ? normalizePhone(options.phone) : undefined;
  const cookies = options.request.headers.get("cookie");
  const fbp = cookieValue(cookies, "_fbp");
  const fbc = cookieValue(cookies, "_fbc");

  const userData: Record<string, unknown> = {};
  if (email) userData.em = [sha256(email)];
  if (phone) userData.ph = [sha256(phone)];
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const ip = clientIp(options.request);
  const userAgent = options.request.headers.get("user-agent")?.trim();
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;

  const event: Record<string, unknown> = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: options.eventId,
    action_source: "website",
    event_source_url:
      options.eventSourceUrl?.trim() ||
      options.request.headers.get("referer")?.trim() ||
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      undefined,
    user_data: userData,
    original_event_data: {
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
    },
  };

  if (options.contentName?.trim()) {
    event.custom_data = {
      content_name: options.contentName.trim(),
      currency: "VND",
    };
  }

  const payload: Record<string, unknown> = {
    data: [event],
  };

  const testCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("[meta-capi] Lead event failed:", response.status, text.slice(0, 500));
  }
}
