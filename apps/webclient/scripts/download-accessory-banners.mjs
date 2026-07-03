/**
 * Tải banner trang phụ kiện từ shop VinFast (liên kết từ vinfastauto.com/vn_vi).
 * Nguồn HTML: https://shop.vinfastauto.com/vn_vi/phu-kien — content-asset banner-list-page
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "images", "banners", "accessories");
const SHOP_URL = "https://shop.vinfastauto.com/vn_vi/phu-kien";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://vinfastauto.com/vn_vi",
};

function parseBannerUrls(html) {
  const urls = [];
  const listPage = html.match(/banner-list-page[\s\S]*?<\/div>\s*<\/div>/i)?.[0] ?? html;
  for (const m of listPage.matchAll(/<img[^>]+src="([^"]+accessories\/[^"]+)"/gi)) {
    urls.push(m[1].replace(/&amp;/g, "&"));
  }
  const og = html.match(/property="og:image"[^>]*content="([^"]+accessories[^"]+)"/)?.[1];
  if (og) urls.push(og.replace(/&amp;/g, "&"));
  return [...new Set(urls)];
}

async function download(url, dest) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`OK ${path.basename(dest)} (${(buf.length / 1024).toFixed(0)} KB)`);
  return dest;
}

fs.mkdirSync(OUT, { recursive: true });

const res = await fetch(SHOP_URL, { headers });
if (!res.ok) throw new Error(`Shop fetch failed: ${res.status}`);
const html = await res.text();
fs.writeFileSync(path.join(ROOT, "scripts", "vinfast-shop-phu-kien.html"), html);

const urls = parseBannerUrls(html);
if (!urls.length) throw new Error("No accessory banner URLs found in shop HTML");

const bannerUrl =
  urls.find((u) => /img_banner\.(jpg|webp|png)/i.test(u)) ??
  urls.find((u) => !/ogimage/i.test(u)) ??
  urls[0];

const ogUrl = urls.find((u) => /ogimage/i.test(u));

const bannerExt = bannerUrl.match(/\.(\w+)(\?|$)/)?.[1] ?? "jpg";
await download(bannerUrl, path.join(OUT, `phu-kien-banner-desktop.${bannerExt}`));

if (ogUrl && ogUrl !== bannerUrl) {
  const ogExt = ogUrl.match(/\.(\w+)(\?|$)/)?.[1] ?? "jpg";
  await download(ogUrl, path.join(OUT, `phu-kien-og-desktop.${ogExt}`));
}

const manifest = {
  syncedAt: new Date().toISOString(),
  source: SHOP_URL,
  bannerUrl,
  ogUrl: ogUrl ?? null,
  localDesktop: `/images/banners/accessories/phu-kien-banner-desktop.${bannerExt}`,
};

fs.writeFileSync(
  path.join(ROOT, "scripts", "accessory-banners.json"),
  JSON.stringify(manifest, null, 2),
);
console.log("\nDone. Manifest: scripts/accessory-banners.json");
