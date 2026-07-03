#!/usr/bin/env node
/**
 * Kiểm tra kết nối Supabase từ file .env ở root monorepo.
 * Chạy: npm run db:check
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("❌ Không tìm thấy file .env ở root. Copy từ .env.example:");
    console.error("   cp .env.example .env");
    process.exit(1);
  }

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("\n🔍 Kiểm tra kết nối Supabase (vinfast3scamau)\n");

if (!url || !anonKey) {
  console.error("❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

console.log(`   URL: ${url}`);

const headers = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
};

try {
  const res = await fetch(`${url}/rest/v1/site_settings?select=key&limit=1`, { headers });
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Public API lỗi (${res.status}):`, text.slice(0, 200));
    process.exit(1);
  }
  console.log("✅ Public API (anon key) — OK");
} catch (error) {
  console.error("❌ Không kết nối được Supabase:", error.message);
  process.exit(1);
}

if (serviceKey) {
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?select=key&limit=1`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });
    if (!res.ok) {
      console.warn(`⚠️  Service role key lỗi (${res.status}) — admin API có thể không hoạt động`);
    } else {
      console.log("✅ Service role key — OK");
    }
  } catch {
    console.warn("⚠️  Không kiểm tra được service role key");
  }
} else {
  console.log("ℹ️  Chưa có SUPABASE_SERVICE_ROLE_KEY (tùy chọn cho admin server-side)");
}

console.log("\n✅ Sẵn sàng chạy:");
console.log("   npm run dev:client   → http://localhost:3000");
console.log("   npm run dev:admin    → http://localhost:3001");
console.log("   curl http://localhost:3001/api/health\n");
