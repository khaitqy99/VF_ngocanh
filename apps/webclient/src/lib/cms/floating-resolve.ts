import type { FloatingButtonSetting, FloatingSettings } from "@/lib/cms/floating";
import {
  FACEBOOK_URL,
  ZALO_URL,
  resolveDealershipContact,
  type DealershipContact,
} from "@/lib/dealership";
import type { SiteSeoSettings } from "@/lib/seo/types";

export type ResolvedFloatingButton = FloatingButtonSetting & {
  resolvedHref?: string;
};

function socialHref(
  contact: DealershipContact,
  kind: "facebook" | "zalo",
  fallback: string,
): string {
  const fromSameAs = contact.socialLinks.find((link) => link.kind === kind)?.href;
  if (fromSameAs) return fromSameAs;
  if (kind === "facebook") {
    return process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || fallback;
  }
  return process.env.NEXT_PUBLIC_ZALO_URL?.trim() || fallback;
}

export function resolveFloatingButtons(
  settings: FloatingSettings,
  site?: SiteSeoSettings | null,
): ResolvedFloatingButton[] {
  const contact = resolveDealershipContact(site);
  const facebook = socialHref(contact, "facebook", FACEBOOK_URL);
  const zalo = socialHref(contact, "zalo", ZALO_URL);

  return settings.buttons.map((button) => {
    if (!button.enabled) return { ...button };

    if (button.key === "scrollTop") {
      return { ...button };
    }

    const custom = button.href?.trim();
    if (custom) return { ...button, resolvedHref: custom };

    if (button.key === "hotline") {
      return { ...button, resolvedHref: contact.phoneTel };
    }
    if (button.key === "messenger") {
      return { ...button, resolvedHref: facebook };
    }
    if (button.key === "zalo") {
      return { ...button, resolvedHref: zalo };
    }
    return { ...button };
  });
}
