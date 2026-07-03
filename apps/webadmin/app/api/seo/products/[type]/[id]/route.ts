import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import type { Json, TablesUpdate } from "@vinfast3s/supabase";
import {
  buildProductSeoDefaults,
  carDetailPath,
  defaultAccessorySlug,
  defaultCarSlug,
  defaultScooterSlug,
  isValidSlug,
  parseSeoRecord,
  resolveSeoContent,
  scooterDetailPath,
  accessoryDetailPath,
  type SeoRecord,
} from "@/lib/seo";
import { getSiteSeo } from "@/lib/cms/seo";
import { parseRowSeoColumn } from "@/lib/cms/seo";
import { getCarDetail } from "@/lib/car-details";
import { getScooterDetail } from "@/lib/scooter-details";
import { ACCESSORIES } from "@/lib/accessories";
import { revalidateWebclient, vehicleRevalidatePayload, accessoryRevalidatePayload } from "@/lib/revalidate-webclient";

type ProductType = "car" | "scooter" | "accessory";

function parseType(value: string): ProductType | null {
  if (value === "car" || value === "scooter" || value === "accessory") return value;
  return null;
}

function defaultSlugFor(type: ProductType, id: string, name?: string) {
  if (type === "car") return defaultCarSlug(id);
  if (type === "scooter") return defaultScooterSlug(id);
  return defaultAccessorySlug(id, name);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  const { type: rawType, id } = await context.params;
  const type = parseType(rawType);
  if (!type) return NextResponse.json({ error: "Loại sản phẩm không hợp lệ" }, { status: 400 });

  const site = await getSiteSeo();
  let slug = defaultSlugFor(type, id);
  let seo: SeoRecord = {};
  let defaults = buildProductSeoDefaults({
    name: id,
    path: "/",
    productLabel: type === "car" ? "Ô tô điện VinFast" : type === "scooter" ? "Xe máy điện VinFast" : "Phụ kiện VinFast",
  });

  if (!isSupabaseConfigured()) {
    if (type === "car") {
      const detail = getCarDetail(id);
      if (detail) {
        slug = defaultCarSlug(id);
        defaults = buildProductSeoDefaults({
          name: detail.name,
          tagline: detail.tagline,
          slogan: detail.slogan,
          image: detail.image,
          path: carDetailPath({ id, slug }),
          productLabel: "Ô tô điện VinFast",
        });
      }
    }
    return NextResponse.json({ seo, slug, defaults, resolved: resolveSeoContent(seo, defaults, site) });
  }

  const admin = createAdminClient();

  if (type === "accessory") {
    const { data, error } = await admin.from("accessories").select("*").eq("id", id).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const staticItem = ACCESSORIES.find((a) => a.id === id);
    const name = data?.name ?? staticItem?.name ?? id;
    slug = data?.slug ?? defaultAccessorySlug(id, name);
    const content = data?.content as Record<string, unknown> | null;
    seo = parseSeoRecord(content?.seo);
    defaults = buildProductSeoDefaults({
      name,
      description: data?.description ?? staticItem?.description,
      image: data?.image_url ?? staticItem?.image,
      path: accessoryDetailPath({ id, slug, name }),
      productLabel: "Phụ kiện VinFast",
    });
  } else {
    const { data, error } = await admin.from("vehicles").select("*").eq("id", id).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const detail = type === "car" ? getCarDetail(id) : getScooterDetail(id);
    slug = data?.slug ?? defaultSlugFor(type, id);
    seo = data?.seo ? parseRowSeoColumn(data.seo) : {};
    if (detail) {
      defaults = buildProductSeoDefaults({
        name: data?.name ?? detail.name,
        tagline: data?.tagline ?? detail.tagline,
        slogan: data?.slogan ?? detail.slogan,
        image: data?.hero_image_url ?? detail.image,
        path:
          type === "car"
            ? carDetailPath({ id, slug: data?.slug ?? slug })
            : scooterDetailPath({ id, slug: data?.slug ?? slug }),
        productLabel: type === "car" ? "Ô tô điện VinFast" : "Xe máy điện VinFast",
      });
    }
  }

  return NextResponse.json({
    seo,
    slug,
    defaults,
    resolved: resolveSeoContent(seo, defaults, site),
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const { type: rawType, id } = await context.params;
  const type = parseType(rawType);
  if (!type) return NextResponse.json({ error: "Loại sản phẩm không hợp lệ" }, { status: 400 });

  let body: { seo?: SeoRecord; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.slug !== undefined && !isValidSlug(body.slug)) {
    return NextResponse.json({ error: "Slug không hợp lệ" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (type === "accessory") {
    const { data: existing } = await admin.from("accessories").select("content, name").eq("id", id).maybeSingle();
    const content =
      existing?.content && typeof existing.content === "object" && !Array.isArray(existing.content)
        ? (existing.content as Record<string, Json | undefined>)
        : {};
    const update: TablesUpdate<"accessories"> = {
      content: {
        ...content,
        ...(body.seo ? { seo: body.seo as Json } : {}),
      } as Json,
    };
    if (body.slug) {
      update.slug = body.slug;
    }
    const { error } = await admin.from("accessories").update(update).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await revalidateWebclient(accessoryRevalidatePayload(id));
    return NextResponse.json({ ok: true });
  }

  const update: TablesUpdate<"vehicles"> = {};
  if (body.seo) update.seo = body.seo as Json;
  if (body.slug) update.slug = body.slug;

  const { data: existing } = await admin.from("vehicles").select("id, type").eq("id", id).maybeSingle();
  if (existing) {
    const { error } = await admin.from("vehicles").update(update).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const vehicleType = type === "scooter" ? "scooter" : "car";
    const { error } = await admin.from("vehicles").insert({
      id,
      type: vehicleType,
      name: id,
      slug: body.slug ?? defaultSlugFor(type, id),
      seo: (body.seo ?? {}) as Json,
      status: "published",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const vehicleType = type === "scooter" ? "scooter" : "car";
  await revalidateWebclient(vehicleRevalidatePayload(id, vehicleType));
  return NextResponse.json({ ok: true });
}
