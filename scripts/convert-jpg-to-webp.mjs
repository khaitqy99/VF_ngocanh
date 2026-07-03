#!/usr/bin/env node
/**
 * Convert JPG/JPEG files under apps/webclient/public/images to WebP and delete originals.
 * Usage: node scripts/convert-jpg-to-webp.mjs
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(root, "apps/webclient/public");
const imagesRoot = resolve(publicRoot, "images");

function walkFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function toWebpPath(filePath) {
  return filePath.replace(/\.jpe?g$/i, ".webp");
}

const jpgFiles = walkFiles(imagesRoot).filter((f) =>
  [".jpg", ".jpeg"].includes(extname(f).toLowerCase()),
);
const mapping = [];
let converted = 0;
let deletedOnly = 0;
let failed = 0;

console.log(`\n🖼️  Convert ${jpgFiles.length} JPG/JPEG → WebP\n`);

for (const jpgPath of jpgFiles) {
  const webpPath = toWebpPath(jpgPath);
  const relJpg = "/" + relative(publicRoot, jpgPath).replace(/\\/g, "/");
  const relWebp = "/" + relative(publicRoot, webpPath).replace(/\\/g, "/");

  try {
    if (existsSync(webpPath)) {
      unlinkSync(jpgPath);
      mapping.push({ from: relJpg, to: relWebp, action: "deleted-jpg-webp-existed" });
      deletedOnly++;
      continue;
    }

    const buffer = readFileSync(jpgPath);
    const webpBuffer = await sharp(buffer).webp({ quality: 85, effort: 4 }).toBuffer();
    writeFileSync(webpPath, webpBuffer);
    unlinkSync(jpgPath);
    mapping.push({ from: relJpg, to: relWebp, action: "converted" });
    converted++;
    process.stdout.write(`✓ ${relative(imagesRoot, jpgPath)}\n`);
  } catch (error) {
    failed++;
    console.error(`✗ ${relJpg}: ${error.message}`);
  }
}

const reportPath = resolve(root, "scripts/.jpg-to-webp-mapping.json");
writeFileSync(reportPath, JSON.stringify(mapping, null, 2));

console.log(`\n✅ Converted: ${converted}`);
console.log(`🗑️  Deleted JPG (webp existed): ${deletedOnly}`);
if (failed) console.log(`❌ Failed: ${failed}`);
console.log(`📄 Mapping: ${reportPath}\n`);

if (failed > 0) process.exit(1);
