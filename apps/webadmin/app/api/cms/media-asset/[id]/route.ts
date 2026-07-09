import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
import { storagePathFromPublicUrl } from "@/lib/media-storage";
import { revalidateAdminMedia } from "@/lib/media-revalidate";

async function removeUrlFromVehicleGalleries(url: string) {
  const admin = createAdminClient();
  const { data: vehicles } = await admin.from("vehicles").select("id, gallery");
  for (const row of vehicles ?? []) {
    if (!Array.isArray(row.gallery)) continue;
    const next = row.gallery.filter((item) => item !== url);
    if (next.length !== row.gallery.length) {
      await admin.from("vehicles").update({ gallery: next }).eq("id", row.id);
    }
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const admin = createAdminClient();

  const { data: asset, error: fetchError } = await admin
    .from("media_assets")
    .select("id, url")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!asset) {
    return NextResponse.json({ error: "Không tìm thấy ảnh" }, { status: 404 });
  }

  const storagePath = storagePathFromPublicUrl(asset.url);
  if (storagePath) {
    const { error: storageError } = await admin.storage.from("media").remove([storagePath]);
    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }
  }

  const { error: deleteError } = await admin.from("media_assets").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  await removeUrlFromVehicleGalleries(asset.url);
  await revalidateAdminMedia();

  return NextResponse.json({ ok: true });
}
