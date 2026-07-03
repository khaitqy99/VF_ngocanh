import Redis from "ioredis";

declare global {
  var __vinfastRedis: Redis | undefined;
}

function createRedisClient() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  return new Redis(redisUrl, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
  });
}

export function getRedisClient() {
  if (!process.env.REDIS_URL) return null;

  if (!globalThis.__vinfastRedis) {
    globalThis.__vinfastRedis = createRedisClient() ?? undefined;
  }

  return globalThis.__vinfastRedis ?? null;
}
