#!/usr/bin/env node
/**
 * Apply pending migration SQL to remote Supabase via direct Postgres connection.
 * Usage: node scripts/apply-migration.mjs [migration-file]
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");
const migrationArg = process.argv[2];
const migrationPath = migrationArg
  ? resolve(root, migrationArg)
  : resolve(root, "supabase/migrations/20240706100000_admin_users.sql");

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

const password = process.env.SUPABASE_DB_PASSWORD;
const projectRef = "lqdvwzcxmvvyqzrykdjq";

if (!password) {
  console.error("❌ Thiếu SUPABASE_DB_PASSWORD trong .env");
  process.exit(1);
}

if (!existsSync(migrationPath)) {
  console.error(`❌ Không tìm thấy migration: ${migrationPath}`);
  process.exit(1);
}

const sql = readFileSync(migrationPath, "utf8");

const candidates = [
  process.env.DATABASE_URL,
  `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`,
  `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
].filter(Boolean);

async function tryConnect(url) {
  const sqlClient = postgres(url, { ssl: "require", max: 1, connect_timeout: 15 });
  try {
    await sqlClient`select 1 as ok`;
    return sqlClient;
  } catch (error) {
    await sqlClient.end({ timeout: 1 }).catch(() => undefined);
    throw error;
  }
}

let client;

for (const url of candidates) {
  try {
    console.log(`→ Thử kết nối...`);
    client = await tryConnect(url);
    console.log("✅ Kết nối thành công\n");
    break;
  } catch (error) {
    console.log(`   ✗ ${error.message}\n`);
  }
}

if (!client) {
  console.error("❌ Không kết nối được Postgres.");
  process.exit(1);
}

try {
  console.log(`→ Đang apply: ${migrationPath}`);
  await client.unsafe(sql);
  console.log("✅ Migration đã apply xong");
} catch (error) {
  if (String(error.message).includes("already exists")) {
    console.log("ℹ️  Migration đã tồn tại (already exists)");
  } else {
    console.error("❌ Lỗi apply migration:", error.message);
    process.exit(1);
  }
} finally {
  await client.end({ timeout: 5 });
}
