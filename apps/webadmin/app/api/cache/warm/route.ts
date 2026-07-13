import { NextResponse } from "next/server";

import { getSessionAdmin } from "@/lib/auth";
import {
  getWarmCacheConfigStatus,
  warmWebclientCache,
  type WarmWebclientCacheResult,
} from "@/lib/warm-webclient-cache";

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getWarmCacheConfigStatus());
}

export async function POST() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result: WarmWebclientCacheResult = await warmWebclientCache();
  if (!result.ok) {
    return NextResponse.json(result, { status: result.error?.includes("REDIS") ? 503 : 500 });
  }

  return NextResponse.json(result);
}
