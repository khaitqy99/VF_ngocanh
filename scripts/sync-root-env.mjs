#!/usr/bin/env node
/**
 * Copy root .env to apps/webclient and apps/webadmin as .env.local
 * Usage: node scripts/sync-root-env.mjs
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, ".env");
const targets = [
  resolve(root, "apps/webclient/.env.local"),
  resolve(root, "apps/webadmin/.env.local"),
];

if (!existsSync(source)) {
  console.error("❌ Không tìm thấy .env ở root. Chạy: npm run setup:env");
  process.exit(1);
}

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
  console.log(`✅ ${target.replace(root + "\\", "").replace(root + "/", "")}`);
}

console.log("\nĐã đồng bộ .env → apps/webclient & apps/webadmin (.env.local)\n");
