#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");

for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  if (!process.env[key]) process.env[key] = value;
}

const password = process.env.SUPABASE_DB_PASSWORD;
const ref = "lqdvwzcxmvvyqzrykdjq";
const url =
  process.env.DATABASE_URL ??
  `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;

const sql = postgres(url, { ssl: "require", max: 1 });
try {
  const rows = await sql`
    select version, name
    from supabase_migrations.schema_migrations
    order by version
  `;
  console.log("applied migrations:", rows.length ? rows : "none");

  const tables = await sql`
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in ('admin_users', 'leads', 'cms_pages', 'banners')
    order by tablename
  `;
  console.log("tables:", tables.map((row) => row.tablename).join(", ") || "none");
} finally {
  await sql.end({ timeout: 1 });
}
