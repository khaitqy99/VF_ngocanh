import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cdpFile = process.argv[2];
const outDir = path.join(__dirname, "..", "public", "images", "vinfast", "cars");

if (!cdpFile) {
  console.error("Usage: node scripts/extract-cdp-images.mjs <cdp-response.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(cdpFile, "utf8"));
const items = raw.result?.value ?? raw.result?.result?.value ?? raw.value;
if (!Array.isArray(items)) {
  console.error("Unexpected CDP payload shape");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
for (const item of items) {
  if (!item?.b64 || item.status !== 200) {
    console.warn("skip", item?.id, item?.status);
    continue;
  }
  const dest = path.join(outDir, `${item.id}${item.ext}`);
  fs.writeFileSync(dest, Buffer.from(item.b64, "base64"));
  console.log(`saved ${item.id}${item.ext} (${(item.size / 1024).toFixed(0)} KB)`);
}
