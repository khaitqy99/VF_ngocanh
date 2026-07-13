import { NextResponse } from "next/server";

import { deleteCacheByPrefix } from "@/lib/cache";
import { warmCmsRedisCache } from "@/lib/cms/warm-cache";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redisDeletedKeys = await deleteCacheByPrefix("cms:");
    const result = await warmCmsRedisCache();
    return NextResponse.json({ ok: true, redisDeletedKeys, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Warm cache thất bại";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
