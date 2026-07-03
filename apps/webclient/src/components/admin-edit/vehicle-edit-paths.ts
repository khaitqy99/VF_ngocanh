export type PatchValue = string | string[] | Record<string, unknown>[] | number;

function parsePath(path: string): (string | number)[] {
  return path.split(".").map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

export function getAtPath(obj: unknown, path: string): unknown {
  const keys = parsePath(path);
  let cur: unknown = obj;
  for (const key of keys) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

function normalizePatchValue(path: string, value: unknown): unknown {
  if (path.endsWith(".bullets") || path.endsWith(".highlights")) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return value;
}

export function setAtPath<T>(obj: T, path: string, value: unknown): T {
  const keys = parsePath(path);
  const result = structuredClone(obj) as Record<string | number, unknown>;
  let cur: Record<string | number, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    if (cur[key] == null) {
      cur[key] = typeof nextKey === "number" ? [] : {};
    }
    cur = cur[key] as Record<string | number, unknown>;
  }

  const last = keys[keys.length - 1];
  cur[last] = normalizePatchValue(path, value);
  return result as T;
}

export function getImageAtPath(root: unknown, path: string, fallback: string): string {
  const v = getAtPath(root, path);
  return v != null && v !== "" ? String(v) : fallback;
}

export function resolveNumber(
  root: unknown,
  patches: Record<string, PatchValue> | undefined,
  path: string,
  fallback: number,
): number {
  if (patches?.[path] !== undefined) {
    const p = patches[path];
    return typeof p === "number" ? p : Number(p) || fallback;
  }
  const v = getAtPath(root, path);
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (v != null && v !== "") return Number(v) || fallback;
  return fallback;
}

export function applyPatches<T>(obj: T, patches: Record<string, PatchValue>): T {
  let result = obj;
  for (const [path, value] of Object.entries(patches)) {
    result = setAtPath(result, path, value);
  }
  return result;
}

export function resolveField(
  root: unknown,
  patches: Record<string, PatchValue> | undefined,
  path: string,
  fallback = "",
): string {
  if (patches?.[path] !== undefined) {
    const p = patches[path];
    return Array.isArray(p) ? p.join("\n") : String(p);
  }
  const v = getAtPath(root, path);
  if (v != null && v !== "") return String(v);
  return fallback;
}
