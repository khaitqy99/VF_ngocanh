#!/usr/bin/env node
/**
 * Push local migrations to remote Supabase via direct Postgres connection.
 * If schema đã tồn tại nhưng chưa có migration history, tự repair rồi push tiếp.
 * Usage: npm run db:push
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import postgres from "postgres";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("❌ Không tìm thấy .env ở root");
    process.exit(1);
  }
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

function getDbUrl() {
  const password = process.env.SUPABASE_DB_PASSWORD;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectRef = projectRefMatch?.[1] ?? "lqdvwzcxmvvyqzrykdjq";

  if (!password) {
    console.error("❌ Thiếu SUPABASE_DB_PASSWORD trong .env");
    process.exit(1);
  }

  return {
    projectRef,
    dbUrl:
      process.env.DATABASE_URL ??
      `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`,
  };
}

function runSupabase(args) {
  execSync(`npx supabase ${args}`, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
}

function listMigrationVersions() {
  const dir = resolve(root, "supabase/migrations");
  return readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .map((file) => file.replace(/_.+$/, ""))
    .sort();
}

async function remoteHasCoreSchema(dbUrl) {
  const sql = postgres(dbUrl, { ssl: "require", max: 1 });
  try {
    const rows = await sql`
      select tablename
      from pg_tables
      where schemaname = 'public'
        and tablename in ('vehicles', 'cms_pages', 'banners', 'leads', 'admin_users')
    `;
    return rows.length >= 4;
  } finally {
    await sql.end({ timeout: 1 });
  }
}

async function remoteMigrationCount(dbUrl) {
  const sql = postgres(dbUrl, { ssl: "require", max: 1 });
  try {
    const rows = await sql`
      select count(*)::int as count
      from supabase_migrations.schema_migrations
    `;
    return rows[0]?.count ?? 0;
  } catch {
    return 0;
  } finally {
    await sql.end({ timeout: 1 });
  }
}

loadEnv();
const { projectRef, dbUrl } = getDbUrl();
const versions = listMigrationVersions();

console.log(`\n🚀 Push migrations → ${projectRef}\n`);

const hasSchema = await remoteHasCoreSchema(dbUrl);
const migrationCount = await remoteMigrationCount(dbUrl);

if (hasSchema && migrationCount === 0) {
  console.log("ℹ️  Schema remote đã có nhưng chưa ghi migration history — đang repair...\n");
  runSupabase(
    `migration repair --status applied --db-url "${dbUrl}" ${versions.join(" ")}`,
  );
}

try {
  runSupabase(`db push --db-url "${dbUrl}" --yes`);
  console.log("\n✅ Migrations đã push xong\n");
} catch {
  process.exit(1);
}
