import { revalidatePath, unstable_expirePath, unstable_expireTag } from "next/cache";
import { NextResponse } from "next/server";
import { deleteCacheByPrefix } from "@/lib/cache";
import { warmCmsRedisCache } from "@/lib/cms/warm-cache";

type RevalidateBody = {
  tags?: string[];
  paths?: string[];
  /** Mặc định true — ghi lại toàn bộ dữ liệu CMS vào Redis sau khi xóa cache. */
  warm?: boolean;
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RevalidateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tags = body.tags ?? [];
  const paths = body.paths ?? [];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json({ error: "Cần ít nhất một tag hoặc path" }, { status: 400 });
  }

  for (const tag of tags) {
    unstable_expireTag(tag);
  }

  for (const path of paths) {
    unstable_expirePath(path, "page");
    revalidatePath(path);
  }

  const redisDeletedKeys = await deleteCacheByPrefix("cms:");

  const shouldWarm = body.warm !== false;
  let warmResult: Awaited<ReturnType<typeof warmCmsRedisCache>> | null = null;
  if (shouldWarm && process.env.REDIS_URL) {
    try {
      warmResult = await warmCmsRedisCache();
    } catch (error) {
      console.error("[revalidate] Warm Redis thất bại:", error);
    }
  }

  return NextResponse.json({
    revalidated: true,
    tags,
    paths,
    redisDeletedKeys,
    redisWarmed: Boolean(warmResult),
    redisKeys: warmResult?.redisKeys ?? null,
  });
}
