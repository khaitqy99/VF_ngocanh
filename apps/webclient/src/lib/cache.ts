import { getRedisClient } from "@/lib/redis";

type Loader<T> = () => Promise<T>;

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  loader: Loader<T>,
): Promise<T> {
  const redis = getRedisClient();
  if (!redis) return loader();

  try {
    const cachedValue = await redis.get(key);
    if (cachedValue !== null) {
      return JSON.parse(cachedValue) as T;
    }
  } catch {
    // Fall through to fresh data when cache read fails.
  }

  const freshValue = await loader();

  try {
    await redis.set(key, JSON.stringify(freshValue), "EX", ttlSeconds);
  } catch {
    // Ignore write failure to keep request path healthy.
  }

  return freshValue;
}

export async function deleteCacheByPrefix(prefix: string) {
  const redis = getRedisClient();
  if (!redis) return 0;

  let deletedCount = 0;
  let cursor = "0";

  try {
    do {
      const [nextCursor, keys] = await redis.scan(cursor, "MATCH", `${prefix}*`, "COUNT", 100);
      cursor = nextCursor;

      if (keys.length > 0) {
        deletedCount += await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch {
    return deletedCount;
  }

  return deletedCount;
}
