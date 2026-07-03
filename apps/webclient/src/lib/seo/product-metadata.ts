import type { Metadata } from "next";

import {
  buildProductSeoDefaults,
  carDetailPath,
  parseSeoRecord,
  resolveSeoContent,
  scooterDetailPath,
  accessoryDetailPath,
  seoToNextMetadata,
} from "@/lib/seo";
import { getSiteSeo, parseRowSeoColumn } from "@/lib/cms/seo";
import {
  getCarBySlug,
  getScooterBySlug,
  getAccessoryBySlugOrId,
} from "@/lib/cms";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured } from "@vinfast3s/supabase";

export async function buildCarMetadata(slug: string): Promise<Metadata> {
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Không tìm thấy xe" };

  const site = await getSiteSeo();
  const path = carDetailPath(car);
  let seo = {};
  if (isSupabaseConfigured()) {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("vehicles")
      .select("seo, tagline, slogan, name, hero_image_url")
      .eq("id", car.id)
      .maybeSingle();
    seo = data?.seo ? parseRowSeoColumn(data.seo) : {};
  }

  const defaults = buildProductSeoDefaults({
    name: car.name,
    tagline: car.subtitle,
    image: car.image,
    path,
    productLabel: "Ô tô điện VinFast",
  });
  const resolved = resolveSeoContent(seo, defaults, site);
  return seoToNextMetadata(resolved, site);
}

export async function buildScooterMetadata(slug: string): Promise<Metadata> {
  const scooter = await getScooterBySlug(slug);
  if (!scooter) return { title: "Không tìm thấy xe máy" };

  const site = await getSiteSeo();
  const path = scooterDetailPath(scooter);
  let seo = {};
  if (isSupabaseConfigured()) {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("vehicles")
      .select("seo, tagline, slogan, name, hero_image_url")
      .eq("id", scooter.id)
      .maybeSingle();
    seo = data?.seo ? parseRowSeoColumn(data.seo) : {};
  }

  const defaults = buildProductSeoDefaults({
    name: scooter.name,
    tagline: scooter.subtitle,
    image: scooter.image,
    path,
    productLabel: "Xe máy điện VinFast",
  });
  const resolved = resolveSeoContent(seo, defaults, site);
  return seoToNextMetadata(resolved, site);
}

export async function buildAccessoryMetadata(slug: string): Promise<Metadata> {
  const product = await getAccessoryBySlugOrId(slug);
  if (!product) return { title: "Không tìm thấy phụ kiện" };

  const site = await getSiteSeo();
  const path = accessoryDetailPath(product);
  let seo = {};
  if (isSupabaseConfigured()) {
    const supabase = createAnonClient();
    const { data } = await supabase.from("accessories").select("content").eq("id", product.id).maybeSingle();
    if (data?.content && typeof data.content === "object" && !Array.isArray(data.content)) {
      seo = parseSeoRecord((data.content as Record<string, unknown>).seo);
    }
  }

  const defaults = buildProductSeoDefaults({
    name: product.name,
    description: product.description,
    image: product.image,
    path,
    productLabel: "Phụ kiện VinFast",
  });
  const resolved = resolveSeoContent(seo, defaults, site);
  return seoToNextMetadata(resolved, site);
}
