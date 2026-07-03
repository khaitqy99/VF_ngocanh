import { revalidatePath, unstable_expirePath, unstable_expireTag } from "next/cache";
import { NextResponse } from "next/server";
import { deleteCacheByPrefix } from "@/lib/cache";

type RevalidateBody = {
  tags?: string[];
  paths?: string[];
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

  return NextResponse.json({ revalidated: true, tags, paths, redisDeletedKeys });
}
