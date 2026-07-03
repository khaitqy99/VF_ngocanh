/**
 * Tải banner dịch vụ hậu mãi từ trang chính thức VinFast (static-cms-prod).
 * - https://vinfastauto.com/vn_vi/thong-tin-bao-hanh
 * - https://vinfastauto.com/vn_vi/dich-vu-bao-duong
 * - https://vinfastauto.com/vn_vi/dich-vu-sua-chua
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "banners", "after-sales");
const CACHE_DIR = path.join(ROOT, "scripts");

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://vinfastauto.com/vn_vi",
  "Accept-Language": "vi-VN,vi;q=0.9",
};

const PAGES = [
  {
    id: "01-bao-hanh-sua-chua",
    url: "https://vinfastauto.com/vn_vi/thong-tin-bao-hanh",
    cache: "vinfast-dvhm-thong-tin-bao-hanh.html",
    alt: "Bảo hành - sửa chữa VinFast",
    parse(html) {
      const desktop =
        html.match(/field-warranty-main-img[\s\S]*?src="([^"]+)"/)?.[1] ??
        html.match(/warranty-intro-img[\s\S]*?src="([^"]+)"/)?.[1];
      return desktop ? { desktop, mobile: desktop, alt: "Bảo hành - sửa chữa VinFast" } : null;
    },
  },
  {
    id: "02-bao-duong-dinh-ky",
    url: "https://vinfastauto.com/vn_vi/dich-vu-bao-duong",
    cache: "vinfast-dvhm-dich-vu-bao-duong.html",
    alt: "Bảo dưỡng định kỳ VinFast",
    parse(html) {
      const desktop = html.match(/content-banner[\s\S]*?<img[^>]+src="([^"]+)"/)?.[1];
      return desktop ? { desktop, mobile: desktop, alt: "Bảo dưỡng định kỳ VinFast" } : null;
    },
  },
  {
    id: "03-dich-vu-sua-chua",
    url: "https://vinfastauto.com/vn_vi/dich-vu-sua-chua",
    cache: "vinfast-dvhm-dich-vu-sua-chua.html",
    alt: "Dịch vụ sửa chữa VinFast",
    parse(html) {
      const desktop = html.match(
        /src="(https:\/\/static-cms-prod\.vinfastauto\.com\/banner-dich-vu-sua-chua_\d+\.png)"/,
      )?.[1];
      const mobile = html.match(
        /src="(https:\/\/static-cms-prod\.vinfastauto\.com\/banner-dich-vu-sua-chua-mb_\d+\.png)"/,
      )?.[1];
      return desktop
        ? { desktop, mobile: mobile ?? desktop, alt: "Dịch vụ sửa chữa VinFast" }
        : null;
    },
  },
];

function extFromUrl(url) {
  const m = url.match(/\.(\w+)(?:\?|$)/);
  return m?.[1]?.toLowerCase() === "jpeg" ? "jpg" : (m?.[1]?.toLowerCase() ?? "png");
}

async function loadHtml(page) {
  try {
    const res = await fetch(page.url, { headers: HEADERS });
    if (res.ok) {
      const html = await res.text();
      fs.writeFileSync(path.join(CACHE_DIR, page.cache), html);
      console.log(`Fetched ${page.url} (${html.length} bytes)`);
      return html;
    }
    console.warn(`${page.url} -> ${res.status}, using cache`);
  } catch (e) {
    console.warn(`${page.url} fetch error: ${e.message}`);
  }

  const cachePath = path.join(CACHE_DIR, page.cache);
  const fallback = path.join(CACHE_DIR, `vinfast-probe-${page.url.split("/").pop()}.html`);
  if (fs.existsSync(cachePath)) return fs.readFileSync(cachePath, "utf8");
  if (fs.existsSync(fallback)) return fs.readFileSync(fallback, "utf8");
  throw new Error(`No HTML for ${page.url}`);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  OK ${path.basename(dest)} (${(buf.length / 1024).toFixed(0)} KB)`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const banners = [];

for (const page of PAGES) {
  console.log(`\n[${page.id}] ${page.url}`);
  const html = await loadHtml(page);
  const parsed = page.parse(html);
  if (!parsed) throw new Error(`Could not parse banner from ${page.url}`);

  const desktopExt = extFromUrl(parsed.desktop);
  const mobileExt = extFromUrl(parsed.mobile);
  const desktopFile = `${page.id}-desktop.${desktopExt}`;
  const mobileFile =
    parsed.mobile === parsed.desktop ? desktopFile : `${page.id}-mobile.${mobileExt}`;

  await download(parsed.desktop, path.join(OUT_DIR, desktopFile));
  if (mobileFile !== desktopFile) {
    await download(parsed.mobile, path.join(OUT_DIR, mobileFile));
  }

  banners.push({
    id: page.id,
    source: page.url,
    desktop: `/images/banners/after-sales/${desktopFile}`,
    mobile: `/images/banners/after-sales/${mobileFile}`,
    alt: parsed.alt,
    remoteDesktop: parsed.desktop,
    remoteMobile: parsed.mobile,
  });
}

const manifest = {
  syncedAt: new Date().toISOString(),
  source: "https://vinfastauto.com/vn_vi (DVHM pages)",
  banners,
};

fs.writeFileSync(
  path.join(ROOT, "scripts", "after-sales-banners.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`\nDone: ${banners.length} banners -> public/images/banners/after-sales/`);
console.log("Manifest: scripts/after-sales-banners.json");
