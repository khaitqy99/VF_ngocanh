import { NextResponse } from "next/server";
import { buildSitemapEntries } from "@/lib/seo/build-sitemap";

export async function GET(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await buildSitemapEntries();

  return NextResponse.json({
    entries: entries.map((entry) => ({
      path: entry.path || "/",
      url: entry.url,
      lastModified: entry.lastModified.toISOString(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      imageCount: entry.images.length,
    })),
    total: entries.length,
  });
}
