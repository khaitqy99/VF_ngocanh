#!/usr/bin/env node
/**
 * Seed remote Supabase from existing webclient static data + local images.
 * Usage: npx tsx scripts/seed-remote.ts
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { CARS } from "../apps/webclient/src/lib/cars.ts";
import { SCOOTERS } from "../apps/webclient/src/lib/scooters.ts";
import { VINFAST_ACCESSORIES } from "../apps/webclient/src/lib/vinfast-accessories.ts";
import { getCarDetail } from "../apps/webclient/src/lib/car-details.ts";
import { getScooterDetail } from "../apps/webclient/src/lib/scooter-details.ts";
import {
  HERO_BANNERS,
  CAR_HERO_BANNERS,
  SCOOTER_HERO_BANNERS,
  ACCESSORY_HERO_BANNERS,
  AFTER_SALES_HERO_BANNERS,
  CHARGING_HERO_BANNERS,
} from "../apps/webclient/src/lib/images.ts";
import { VINFAST_HERO_BANNERS, VINFAST_FEATURED_CARS } from "../apps/webclient/src/lib/vinfast-home.ts";
import {
  SCHEMA_BUSINESS_NAME,
  SHOWROOM_ADDRESS,
  SHOWROOM_CITY,
  SHOWROOM_EMAIL,
  SHOWROOM_LAT,
  SHOWROOM_LNG,
  SHOWROOM_OPENING,
  SHOWROOM_PHONE,
  SHOWROOM_POSTAL,
  SHOWROOM_REGION,
  SHOWROOM_STREET,
  RESCUE_HOTLINE,
  getShowroomSameAs,
} from "../apps/webclient/src/lib/dealership.ts";
import { getCarGallery } from "../apps/webclient/src/lib/vinfast-galleries.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(root, "apps/webclient/public");
const envPath = resolve(root, ".env");

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const uploaded = new Map<string, string>();

function localPathFromUrl(url: string): string | null {
  if (!url.startsWith("/")) return null;
  const filePath = resolve(publicRoot, url.slice(1).replace(/\//g, "\\"));
  return existsSync(filePath) ? filePath : null;
}

function* walkFiles(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) yield* walkFiles(full);
    else yield full;
  }
}

async function ensureMediaBucket() {
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.some((b) => b.id === "media")) {
    const { error } = await admin.storage.createBucket("media", { public: true });
    if (error && !error.message.includes("already exists")) {
      throw new Error(`Create bucket failed: ${error.message}`);
    }
  }
}

async function uploadLocalFile(absPath: string): Promise<string> {
  const rel = relative(publicRoot, absPath).replace(/\\/g, "/");
  const storagePath = rel;
  if (uploaded.has(storagePath)) return uploaded.get(storagePath)!;

  const ext = extname(absPath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const body = readFileSync(absPath);

  const { error } = await admin.storage.from("media").upload(storagePath, body, {
    contentType,
    upsert: true,
  });

  if (error) throw new Error(`Upload ${storagePath}: ${error.message}`);

  const { data } = admin.storage.from("media").getPublicUrl(storagePath);
  uploaded.set(storagePath, data.publicUrl);
  return data.publicUrl;
}

async function resolveImageUrl(url: string): Promise<string> {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const host = new URL(url).hostname;
      if (host === "vinfastauto.com" || host.endsWith(".vinfastauto.com")) {
        return url;
      }
    } catch {
      /* keep */
    }
    return url;
  }
  const local = localPathFromUrl(url);
  if (!local) return url;
  return uploadLocalFile(local);
}

async function uploadAllImages() {
  console.log("→ Upload ảnh local lên Storage...");
  const files = [...walkFiles(resolve(publicRoot, "images"))];
  let count = 0;
  for (const file of files) {
    await uploadLocalFile(file);
    count++;
    if (count % 50 === 0) console.log(`   ${count}/${files.length}...`);
  }
  console.log(`✅ Đã upload ${count} file\n`);
}

function mapUrlSync(url: string): string {
  if (!url || url.startsWith("http")) return url;
  const local = localPathFromUrl(url);
  if (!local) return url;
  const rel = relative(publicRoot, local).replace(/\\/g, "/");
  return uploaded.get(rel) ?? url;
}

async function seedVehicles() {
  console.log("→ Seed vehicles...");
  const rows = [];

  for (let i = 0; i < CARS.length; i++) {
    const car = CARS[i]!;
    const detail = getCarDetail(car.id);
    const gallery = getCarGallery(car);
    rows.push({
      id: car.id,
      type: "car",
      name: car.name,
      slug: car.id,
      category: car.segment,
      tagline: car.subtitle,
      starting_price: car.price,
      status: "published",
      sort_order: i,
      featured: Boolean(car.isBestSeller || car.isNew),
      hero_image_url: mapUrlSync(car.image),
      gallery: await Promise.all(gallery.map((g) => resolveImageUrl(g))),
      colors: await Promise.all(
        car.colors.map(async (c) => ({
          ...c,
          image: c.image ? await resolveImageUrl(c.image) : undefined,
        })),
      ),
      variants: detail?.variants ?? [],
      spec_table: detail?.specGroups ?? [],
      content: { catalog: car, detail },
      seo: { title: car.name, description: car.subtitle },
    });
  }

  for (let i = 0; i < SCOOTERS.length; i++) {
    const scooter = SCOOTERS[i]!;
    const detail = getScooterDetail(scooter.id);
    rows.push({
      id: scooter.id,
      type: "scooter",
      name: scooter.name,
      slug: scooter.id,
      category: scooter.category,
      tagline: scooter.subtitle,
      starting_price: scooter.price,
      status: "published",
      sort_order: i,
      featured: Boolean(scooter.isBestSeller || scooter.isNew),
      hero_image_url: mapUrlSync(scooter.image),
      gallery: [],
      colors: scooter.colors,
      variants: detail?.variants ?? [],
      spec_table: detail?.specGroups ?? [],
      content: { catalog: scooter, detail },
      seo: { title: scooter.name, description: scooter.subtitle },
    });
  }

  const { error } = await admin.from("vehicles").upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`vehicles: ${error.message}`);
  console.log(`✅ ${rows.length} vehicles\n`);
}

async function seedAccessories() {
  console.log("→ Seed accessories...");
  const rows = VINFAST_ACCESSORIES.map((item, i) => ({
    id: item.id,
    name: item.name,
    slug: item.id,
    category: item.category,
    description: item.description,
    price: item.price,
    image_url: mapUrlSync(item.image),
    in_stock: item.inStock !== false,
    featured: item.badge === "Bán chạy",
    status: "published",
    sort_order: i,
    content: item,
  }));

  const { error } = await admin.from("accessories").upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`accessories: ${error.message}`);
  console.log(`✅ ${rows.length} accessories\n`);
}

type BannerRow = {
  placement: string;
  title: string;
  alt_text: string;
  desktop_image_url: string;
  mobile_image_url: string;
  status: string;
  sort_order: number;
};

async function seedBanners() {
  console.log("→ Seed banners...");
  const rows: BannerRow[] = [];
  let order = 0;

  const pushSlides = async (
    placement: string,
    slides: { desktop: string; mobile: string; alt: string }[],
  ) => {
    for (const slide of slides) {
      rows.push({
        placement,
        title: slide.alt.slice(0, 120),
        alt_text: slide.alt,
        desktop_image_url: await resolveImageUrl(slide.desktop),
        mobile_image_url: await resolveImageUrl(slide.mobile),
        status: "published",
        sort_order: order++,
      });
    }
  };

  for (const b of VINFAST_HERO_BANNERS) {
    rows.push({
      placement: "home",
      title: b.alt.slice(0, 120),
      alt_text: b.alt,
      desktop_image_url: await resolveImageUrl(b.image),
      mobile_image_url: await resolveImageUrl(b.image),
      status: "published",
      sort_order: order++,
    });
  }

  await pushSlides("cars", CAR_HERO_BANNERS);
  await pushSlides("scooters", SCOOTER_HERO_BANNERS);
  await pushSlides("accessories", ACCESSORY_HERO_BANNERS);
  await pushSlides("after_sales", AFTER_SALES_HERO_BANNERS);
  await pushSlides("charging", CHARGING_HERO_BANNERS);

  await admin.from("banners").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await admin.from("banners").insert(rows);
  if (error) throw new Error(`banners: ${error.message}`);
  console.log(`✅ ${rows.length} banners\n`);
}

async function seedSiteSettings() {
  console.log("→ Seed site settings...");
  const rows = [
    {
      key: "dealership",
      value: {
        name: "VinFast Ngọc Anh Cà Mau",
        address: SHOWROOM_ADDRESS,
        hotline_sales: SHOWROOM_PHONE,
        hotline_service: RESCUE_HOTLINE,
        email: SHOWROOM_EMAIL,
      },
    },
    {
      key: "seo",
      value: {
        siteName: "Vinfast 3S Cà Mau",
        titleTemplate: "%s | Vinfast 3S Cà Mau",
        defaultTitle: "Vinfast 3S Cà Mau — Đại lý VinFast chính hãng",
        defaultDescription:
          "Vinfast 3S Cà Mau — Khám phá ô tô điện, xe máy điện, phụ kiện và dịch vụ hậu mãi tại Cà Mau.",
        defaultOgTitle: "Vinfast 3S Cà Mau — Đại lý VinFast chính hãng",
        defaultOgDescription:
          "Khám phá ô tô điện, xe máy điện VinFast với nhiều ưu đãi hấp dẫn tại Cà Mau.",
        defaultOgImage: "/images/cars/oto-hero.webp",
        robots: { index: true, follow: true },
        organization: {
          name: SCHEMA_BUSINESS_NAME,
          legalName: SCHEMA_BUSINESS_NAME,
          url: "https://vinfast3scamau.com",
          telephone: SHOWROOM_PHONE,
          email: SHOWROOM_EMAIL,
          address: SHOWROOM_ADDRESS,
          streetAddress: SHOWROOM_STREET,
          addressLocality: SHOWROOM_CITY,
          addressRegion: SHOWROOM_REGION,
          postalCode: SHOWROOM_POSTAL,
          geo: { latitude: SHOWROOM_LAT, longitude: SHOWROOM_LNG },
          openingHours: {
            opens: SHOWROOM_OPENING.opens,
            closes: SHOWROOM_OPENING.closes,
            days: [...SHOWROOM_OPENING.days],
          },
          sameAs: getShowroomSameAs(),
        },
      },
    },
  ];

  const { error } = await admin.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(`site_settings: ${error.message}`);
  console.log("✅ site settings\n");
}

async function seedCmsPages() {
  console.log("→ Seed CMS pages...");
  const rows = [
    {
      slug: "home",
      title: "Trang chủ",
      status: "published",
      content: {
        heroBanners: VINFAST_HERO_BANNERS,
        featuredCars: VINFAST_FEATURED_CARS,
        heroBannersAll: HERO_BANNERS,
      },
    },
    { slug: "about", title: "Giới thiệu", status: "published", content: {} },
    { slug: "after-sales", title: "Dịch vụ hậu mãi", status: "published", content: {} },
    { slug: "charging", title: "Pin & Trạm sạc", status: "published", content: {} },
    { slug: "energy", title: "Lưu trữ năng lượng", status: "published", content: {} },
  ];

  const { error } = await admin.from("cms_pages").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`cms_pages: ${error.message}`);
  console.log(`✅ ${rows.length} cms pages\n`);
}

async function seedMediaAssets() {
  console.log("→ Seed media_assets index...");
  const rows = [...uploaded.entries()].map(([path, url]) => ({
    filename: path.split("/").pop()!,
    url,
    mime_type: MIME[extname(path).toLowerCase()] ?? null,
    folder: path.includes("/") ? path.split("/").slice(0, -1).join("/") : null,
    alt_text: null,
  }));

  const chunk = 200;
  for (let i = 0; i < rows.length; i += chunk) {
    const { error } = await admin.from("media_assets").upsert(rows.slice(i, i + chunk), {
      onConflict: "url",
      ignoreDuplicates: false,
    });
    if (error && !error.message.includes("duplicate")) {
      // url may not be unique — insert without upsert conflict
      const { error: insErr } = await admin.from("media_assets").insert(rows.slice(i, i + chunk));
      if (insErr && !insErr.message.includes("duplicate")) {
        console.warn("   media_assets warning:", insErr.message);
      }
    }
  }
  console.log(`✅ ${rows.length} media assets indexed\n`);
}

async function main() {
  console.log("\n🌱 Seed remote Supabase\n");
  await ensureMediaBucket();
  await uploadAllImages();
  await seedSiteSettings();
  await seedCmsPages();
  await seedVehicles();
  await seedAccessories();
  await seedBanners();
  await seedMediaAssets();
  console.log("🎉 Seed hoàn tất!\n");
}

main().catch((error) => {
  console.error("❌", error.message);
  process.exit(1);
});
