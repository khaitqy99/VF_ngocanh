#!/usr/bin/env node
/**
 * Replace .jpg / .jpeg image path references with .webp in webclient source.
 * Usage: node scripts/replace-jpg-paths.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  resolve(root, "apps/webclient/src"),
  resolve(root, "apps/webclient/scripts"),
  resolve(root, "apps/webclient/app"),
];

const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);

function walkFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      out.push(...walkFiles(full));
    } else if (TEXT_EXT.has(extname(full).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

let filesChanged = 0;
let replacements = 0;

for (const dir of targets) {
  for (const file of walkFiles(dir)) {
    const original = readFileSync(file, "utf8");
    if (!/\.jpe?g\b/i.test(original)) continue;

    const updated = original.replace(/\.jpe?g\b/gi, ".webp");
    if (updated === original) continue;

    const count = (original.match(/\.jpe?g\b/gi) ?? []).length;
    writeFileSync(file, updated, "utf8");
    filesChanged++;
    replacements += count;
    console.log(`  ${file.replace(root + "\\", "").replace(root + "/", "")} (${count})`);
  }
}

console.log(`\n✅ ${filesChanged} files, ${replacements} replacements\n`);
