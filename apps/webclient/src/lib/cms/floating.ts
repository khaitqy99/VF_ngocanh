import type { Json } from "@vinfast3s/supabase";

export const CMS_FLOATING_TAG = "cms-floating";

export type FloatingButtonKey = "hotline" | "messenger" | "zalo" | "scrollTop";

export type FloatingButtonSetting = {
  key: FloatingButtonKey;
  label: string;
  enabled: boolean;
  href?: string;
};

export type FloatingSettings = {
  buttons: FloatingButtonSetting[];
};

const DEFAULT_FLOATING_BUTTONS: FloatingButtonSetting[] = [
  { key: "hotline", label: "Hotline", enabled: true },
  { key: "messenger", label: "Messenger", enabled: true },
  { key: "zalo", label: "Zalo", enabled: true },
  { key: "scrollTop", label: "Lên đầu trang", enabled: true },
];

const FLOATING_BUTTON_KEYS = new Set<FloatingButtonKey>([
  "hotline",
  "messenger",
  "zalo",
  "scrollTop",
]);

function defaultFloatingButton(key: FloatingButtonKey): FloatingButtonSetting {
  return (
    DEFAULT_FLOATING_BUTTONS.find((button) => button.key === key) ?? {
      key,
      label: key,
      enabled: true,
    }
  );
}

function parseFloatingButton(value: unknown): FloatingButtonSetting | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const key = row.key;
  if (typeof key !== "string" || !FLOATING_BUTTON_KEYS.has(key as FloatingButtonKey)) {
    return null;
  }

  const fallback = defaultFloatingButton(key as FloatingButtonKey);
  const label = typeof row.label === "string" ? row.label.trim() : fallback.label;
  const enabled = typeof row.enabled === "boolean" ? row.enabled : fallback.enabled;
  const href = typeof row.href === "string" ? row.href.trim() : undefined;

  return {
    key: key as FloatingButtonKey,
    label: label || fallback.label,
    enabled,
    ...(href ? { href } : {}),
  };
}

export function defaultFloatingSettings(): FloatingSettings {
  return {
    buttons: DEFAULT_FLOATING_BUTTONS.map((button) => ({ ...button })),
  };
}

export function parseFloatingSettings(value: Json | null | undefined): Partial<FloatingSettings> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const partial: Partial<FloatingSettings> = {};

  if (Array.isArray(row.buttons)) {
    const parsed = row.buttons
      .map(parseFloatingButton)
      .filter((button): button is FloatingButtonSetting => button !== null);
    if (parsed.length > 0) partial.buttons = parsed;
  }

  return partial;
}

export function mergeFloatingSettings(
  input: Partial<FloatingSettings> | null | undefined,
): FloatingSettings {
  const defaults = defaultFloatingSettings();
  if (!input?.buttons?.length) return defaults;

  const byKey = new Map(defaults.buttons.map((button) => [button.key, { ...button }]));
  for (const button of input.buttons) {
    byKey.set(button.key, {
      ...defaultFloatingButton(button.key),
      ...button,
      label: button.label.trim() || defaultFloatingButton(button.key).label,
    });
  }

  return {
    buttons: DEFAULT_FLOATING_BUTTONS.map((button) => byKey.get(button.key) ?? button),
  };
}
