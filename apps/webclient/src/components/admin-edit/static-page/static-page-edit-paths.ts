export function setAtPath<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const parts = path.split(".").filter(Boolean);
  if (!parts.length) return obj;

  const next = structuredClone(obj) as Record<string, unknown>;
  let cursor: Record<string, unknown> | unknown[] = next;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i]!;
    const nextKey = parts[i + 1]!;
    const isNextIndex = /^\d+$/.test(nextKey);

    if (Array.isArray(cursor)) {
      const index = Number(key);
      const current = cursor[index];
      if (current === undefined || current === null) {
        cursor[index] = isNextIndex ? [] : {};
      } else if (typeof current === "object") {
        cursor[index] = structuredClone(current);
      }
      cursor = cursor[index] as Record<string, unknown> | unknown[];
      continue;
    }

    const record = cursor as Record<string, unknown>;
    const current = record[key];
    if (current === undefined || current === null) {
      record[key] = isNextIndex ? [] : {};
    } else if (typeof current === "object") {
      record[key] = structuredClone(current);
    }
    cursor = record[key] as Record<string, unknown> | unknown[];
  }

  const last = parts[parts.length - 1]!;
  if (Array.isArray(cursor)) {
    cursor[Number(last)] = value;
  } else {
    (cursor as Record<string, unknown>)[last] = value;
  }

  return next as T;
}

export function getAtPath(obj: unknown, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let cursor: unknown = obj;
  for (const part of parts) {
    if (cursor === null || cursor === undefined) return undefined;
    if (Array.isArray(cursor)) {
      cursor = cursor[Number(part)];
      continue;
    }
    if (typeof cursor === "object") {
      cursor = (cursor as Record<string, unknown>)[part];
      continue;
    }
    return undefined;
  }
  return cursor;
}
