#!/usr/bin/env node
/**
 * Sửa cột vehicles.gallery — upload ảnh local lên Supabase Storage, bỏ link hotlink VinFast.
 * Usage: npx tsx scripts/fix-vehicle-galleries-db.ts
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { CAR_GALLERIES } from "../apps/webclient/src/lib/vinfast-galleries.ts";

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

function isBlockedHotlink(url: string): boolean {
  if (!url.startsWith("http")) return false;
  try {
    const host = new URL(url).hostname;
    return host === "vinfastauto.com" || host.endsWith(".vinfastauto.com");
  } catch {
    return false;
  }
}

function localPathFromUrl(url: string): string | null {
  if (!url.startsWith("/")) return null;
  const filePath = resolve(publicRoot, url.slice(1).replace(/\//g, "\\"));
  return existsSync(filePath) ? filePath : null;
}

async function uploadLocalFile(absPath: string): Promise<string> {
  const rel = relative(publicRoot, absPath).replace(/\\/g, "/");
  if (uploaded.has(rel)) return uploaded.get(rel)!;

  const ext = extname(absPath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const body = readFileSync(absPath);

  const { error } = await admin.storage.from("media").upload(rel, body, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Upload ${rel}: ${error.message}`);

  const { data } = admin.storage.from("media").getPublicUrl(rel);
  uploaded.set(rel, data.publicUrl);
  return data.publicUrl;
}

async function resolveToStorageUrl(url: string): Promise<string | null> {
  if (!url) return null;
  if (url.includes("supabase.co/storage")) return url;
  if (isBlockedHotlink(url)) return null;

  const local = localPathFromUrl(url);
  if (local) return uploadLocalFile(local);

  if (url.startsWith("http")) return url;
  return null;
}

async function galleryFromCatalog(carId: string): Promise<string[]> {
  const paths = CAR_GALLERIES[carId] ?? [];
  const out: string[] = [];
  for (const p of paths) {
    if (isBlockedHotlink(p)) continue;
    const resolved = await resolveToStorageUrl(p);
    if (resolved && !out.includes(resolved)) out.push(resolved);
  }
  return out;
}

async function main() {
  const { data: vehicles, error } = await admin.from("vehicles").select("id,gallery,hero_image_url");
  if (error) throw error;

  let fixed = 0;
  for (const row of vehicles ?? []) {
    const current = Array.isArray(row.gallery)
      ? (row.gallery as string[]).filter((u) => typeof u === "string")
      : [];

    const hadBlocked = current.some(isBlockedHotlink);
    const clean = (
      await Promise.all(current.map((u) => resolveToStorageUrl(u)))
    ).filter((u): u is string => Boolean(u));

    let next = clean;
    if (!next.length || hadBlocked) {
      const catalog = await galleryFromCatalog(row.id);
      if (catalog.length) next = catalog;
    }
    if (!next.length && row.hero_image_url) {
      const hero = await resolveToStorageUrl(row.hero_image_url);
      if (hero) next = [hero];
    }

    const unchanged =
      next.length === current.length && next.every((u, i) => u === current[i]);
    if (unchanged || !next.length) continue;

    const { error: upErr } = await admin.from("vehicles").update({ gallery: next }).eq("id", row.id);
    if (upErr) {
      console.error(`✗ ${row.id}:`, upErr.message);
      continue;
    }
    console.log(`✓ ${row.id}: ${next.length} ảnh (Storage)`);
    fixed++;
  }

  console.log(`\nĐã cập nhật ${fixed} xe.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
