export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "1768938617764504";

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

export function trackMetaLead(
  eventId: string,
  customData?: Record<string, string | number | undefined>,
) {
  if (typeof window === "undefined" || !META_PIXEL_ID || typeof window.fbq !== "function") {
    return;
  }

  const payload = Object.fromEntries(
    Object.entries(customData ?? {}).filter(([, value]) => value !== undefined),
  );

  window.fbq("track", "Lead", payload, { eventID: eventId });
}
