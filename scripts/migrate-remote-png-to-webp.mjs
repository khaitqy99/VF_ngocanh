#!/usr/bin/env node
/**
 * Remove PNG objects from Supabase Storage and update DB URLs (.png → .webp).
 * Run after convert-png-to-webp.mjs + replace-png-paths.mjs
 * Usage: node scripts/migrate-remote-png-to-webp.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function replacePngInValue(value) {
  if (typeof value === "string") {
    return value.includes(".png") ? value.replace(/\.png\b/g, ".webp") : value;
  }
  if (Array.isArray(value)) return value.map(replacePngInValue);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = replacePngInValue(v);
    return out;
  }
  return value;
}

async function uploadWebpFromMapping() {
  const mappingPath = resolve(root, "scripts/.png-to-webp-mapping.json");
  if (!existsSync(mappingPath)) {
    console.warn("⚠️  Không có mapping file, bỏ qua upload");
    return 0;
  }
  const mapping = JSON.parse(readFileSync(mappingPath, "utf8"));
  const publicRoot = resolve(root, "apps/webclient/public");
  let uploaded = 0;

  for (const item of mapping) {
    if (item.action !== "converted") continue;
    const localPath = resolve(publicRoot, item.to.slice(1).replace(/\//g, "\\"));
    if (!existsSync(localPath)) continue;
    const storagePath = item.to.slice(1);
    const body = readFileSync(localPath);
    const { error } = await admin.storage.from("media").upload(storagePath, body, {
      contentType: "image/webp",
      upsert: true,
    });
    if (error) {
      console.warn(`   upload ${storagePath}: ${error.message}`);
      continue;
    }
    uploaded++;
  }
  return uploaded;
}

async function deletePngFromStorage() {
  const { data, error } = await admin.from("media_assets").select("id,url,folder,filename").like("filename", "%.png");
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  if (!rows.length) return 0;

  const paths = rows
    .map((r) => (r.folder ? `${r.folder}/${r.filename}` : r.filename))
    .filter(Boolean);

  const chunk = 100;
  let deleted = 0;
  for (let i = 0; i < paths.length; i += chunk) {
    const batch = paths.slice(i, i + chunk);
    const { error: delErr } = await admin.storage.from("media").remove(batch);
    if (delErr) console.warn("   storage remove:", delErr.message);
    else deleted += batch.length;
  }

  const ids = rows.map((r) => r.id);
  for (let i = 0; i < ids.length; i += chunk) {
    await admin.from("media_assets").delete().in("id", ids.slice(i, i + chunk));
  }

  return deleted;
}

async function updateTableJson(table, idCol, rows, jsonCols) {
  let updated = 0;
  for (const row of rows) {
    let changed = false;
    const patch = {};
    for (const col of jsonCols) {
      if (row[col] == null) continue;
      const next = replacePngInValue(row[col]);
      if (JSON.stringify(next) !== JSON.stringify(row[col])) {
        patch[col] = next;
        changed = true;
      }
    }
    for (const col of ["hero_image_url", "image_url", "desktop_image_url", "mobile_image_url", "url"]) {
      if (typeof row[col] === "string" && row[col].includes(".png")) {
        patch[col] = row[col].replace(/\.png\b/g, ".webp");
        changed = true;
      }
    }
    if (!changed) continue;
    const { error } = await admin.from(table).update(patch).eq(idCol, row[idCol]);
    if (error) console.warn(`   ${table} ${row[idCol]}:`, error.message);
    else updated++;
  }
  return updated;
}

async function main() {
  console.log("\n☁️  Migrate remote PNG → WebP\n");

  console.log("→ Upload WebP mới lên Storage...");
  const uploaded = await uploadWebpFromMapping();
  console.log(`✅ Uploaded ${uploaded} webp files\n`);

  console.log("→ Cập nhật URL trong DB...");
  const [vehicles, accessories, banners, mediaAssets] = await Promise.all([
    admin.from("vehicles").select("*"),
    admin.from("accessories").select("*"),
    admin.from("banners").select("*"),
    admin.from("media_assets").select("*"),
  ]);

  const v = await updateTableJson("vehicles", "id", vehicles.data ?? [], [
    "content",
    "gallery",
    "colors",
    "seo",
  ]);
  const a = await updateTableJson("accessories", "id", accessories.data ?? [], ["content"]);
  const b = await updateTableJson("banners", "id", banners.data ?? [], []);
  const m = await updateTableJson("media_assets", "id", mediaAssets.data ?? [], []);

  console.log(`✅ vehicles: ${v}, accessories: ${a}, banners: ${b}, media_assets: ${m}\n`);

  console.log("→ Re-index media_assets từ Storage...");
  const { data: storageList } = await admin.storage.from("media").list("images", { limit: 1000 });
  // Full re-seed of media index is safer — run db:seed for complete sync
  console.log("   (Khuyến nghị chạy npm run db:seed sau bước này để đồng bộ index)\n");

  console.log("→ Xóa PNG khỏi Storage + media_assets...");
  const deleted = await deletePngFromStorage();
  console.log(`✅ Removed ${deleted} PNG objects\n`);

  console.log("🎉 Remote migration hoàn tất!\n");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
