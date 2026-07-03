#!/usr/bin/env node
/**
 * Convert PNG files under apps/webclient/public/images to WebP and delete originals.
 * Usage: node scripts/convert-png-to-webp.mjs
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, extname, relative, basename } from "node:path";
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

const pngFiles = walkFiles(imagesRoot).filter((f) => extname(f).toLowerCase() === ".png");
const mapping = [];
let converted = 0;
let deletedOnly = 0;
let failed = 0;

console.log(`\n🖼️  Convert ${pngFiles.length} PNG → WebP\n`);

for (const pngPath of pngFiles) {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");
  const relPng = "/" + relative(publicRoot, pngPath).replace(/\\/g, "/");
  const relWebp = "/" + relative(publicRoot, webpPath).replace(/\\/g, "/");

  try {
    if (existsSync(webpPath)) {
      unlinkSync(pngPath);
      mapping.push({ from: relPng, to: relWebp, action: "deleted-png-webp-existed" });
      deletedOnly++;
      continue;
    }

    const buffer = readFileSync(pngPath);
    const webpBuffer = await sharp(buffer).webp({ quality: 85, effort: 4 }).toBuffer();
    writeFileSync(webpPath, webpBuffer);
    unlinkSync(pngPath);
    mapping.push({ from: relPng, to: relWebp, action: "converted" });
    converted++;
    process.stdout.write(`✓ ${relative(imagesRoot, pngPath)}\n`);
  } catch (error) {
    failed++;
    console.error(`✗ ${relPng}: ${error.message}`);
  }
}

const reportPath = resolve(root, "scripts/.png-to-webp-mapping.json");
writeFileSync(reportPath, JSON.stringify(mapping, null, 2));

console.log(`\n✅ Converted: ${converted}`);
console.log(`🗑️  Deleted PNG (webp existed): ${deletedOnly}`);
if (failed) console.log(`❌ Failed: ${failed}`);
console.log(`📄 Mapping: ${reportPath}\n`);

if (failed > 0) process.exit(1);
