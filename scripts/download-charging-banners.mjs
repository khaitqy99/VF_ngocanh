/**
 * Tải banner pin & trạm sạc từ trang chính thức VinFast.
 * - https://vinfastauto.com/vn_vi/dich-vu-pin-oto-dien (storage.googleapis.com/vinfast-data-01)
 * - https://vinfastauto.com/vn_vi/dich-vu-pin-xe-may-dien (static-cms-prod)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "banners", "charging");
const CACHE_DIR = path.join(ROOT, "scripts");

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://vinfastauto.com/vn_vi",
};

/** Nguồn xác nhận qua vinfastauto.com (swiper / hero trang dịch vụ pin) */
const BANNERS = [
  {
    id: "01-tram-sac-vinfast",
    alt: "Hệ thống trạm sạc VinFast — Lợi ích thuê pin & sạc công cộng",
    source: "https://vinfastauto.com/vn_vi/dich-vu-pin-oto-dien",
    desktop: "https://storage.googleapis.com/vinfast-data-01/banner-tramsac_1660273569.png",
    mobile: "https://storage.googleapis.com/vinfast-data-01/banner-tramsac-mobi_1660273591.png",
  },
  {
    id: "02-quy-hoach-tram-sac",
    alt: "Quy hoạch trạm sạc VinFast toàn quốc",
    source: "https://vinfastauto.com/vn_vi/dich-vu-pin-oto-dien",
    desktop: "https://storage.googleapis.com/vinfast-data-01/pin-tramsac-6_1660273722.png",
    mobile: "https://storage.googleapis.com/vinfast-data-01/pin-tramsac-6_1660273722.png",
  },
  {
    id: "03-pin-xe-may-dien",
    alt: "Pin và trạm sạc xe máy điện VinFast",
    source: "https://vinfastauto.com/vn_vi/dich-vu-pin-xe-may-dien",
    desktop:
      "https://static-cms-prod.vinfastauto.com/MicrosoftTeams-image%201_1658915764_1659496931.png",
    mobile:
      "https://static-cms-prod.vinfastauto.com/MicrosoftTeams-image%201_1658915764_1659496931.png",
  },
];

const PAGES = [
  {
    url: "https://vinfastauto.com/vn_vi/dich-vu-pin-oto-dien",
    cache: "vinfast-dvhm-dich-vu-pin-oto-dien.html",
  },
  {
    url: "https://vinfastauto.com/vn_vi/dich-vu-pin-xe-may-dien",
    cache: "vinfast-dvhm-dich-vu-pin-xe-may-dien.html",
  },
];

function extFromUrl(url) {
  const m = url.match(/\.(\w+)(?:\?|$)/);
  return m?.[1]?.toLowerCase() === "jpeg" ? "jpg" : (m?.[1]?.toLowerCase() ?? "png");
}

async function cachePages() {
  for (const page of PAGES) {
    try {
      const res = await fetch(page.url, { headers: HEADERS });
      if (res.ok) {
        fs.writeFileSync(path.join(CACHE_DIR, page.cache), await res.text());
        console.log(`Cached ${page.url}`);
      }
    } catch {
      /* optional cache refresh */
    }
  }
}

async function download(url, dest) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  OK ${path.basename(dest)} (${(buf.length / 1024).toFixed(0)} KB)`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
await cachePages();

const manifestBanners = [];

for (const banner of BANNERS) {
  console.log(`\n[${banner.id}] ${banner.source}`);
  const desktopExt = extFromUrl(banner.desktop);
  const mobileExt = extFromUrl(banner.mobile);
  const desktopFile = `${banner.id}-desktop.${desktopExt}`;
  const mobileFile =
    banner.mobile === banner.desktop ? desktopFile : `${banner.id}-mobile.${mobileExt}`;

  await download(banner.desktop, path.join(OUT_DIR, desktopFile));
  if (mobileFile !== desktopFile) {
    await download(banner.mobile, path.join(OUT_DIR, mobileFile));
  }

  manifestBanners.push({
    id: banner.id,
    alt: banner.alt,
    source: banner.source,
    desktop: `/images/banners/charging/${desktopFile}`,
    mobile: `/images/banners/charging/${mobileFile}`,
    remoteDesktop: banner.desktop,
    remoteMobile: banner.mobile,
  });
}

fs.writeFileSync(
  path.join(ROOT, "scripts", "charging-banners.json"),
  JSON.stringify(
    {
      syncedAt: new Date().toISOString(),
      source: "vinfastauto.com/vn_vi (dich-vu-pin-oto-dien, dich-vu-pin-xe-may-dien)",
      banners: manifestBanners,
    },
    null,
    2,
  ),
);

console.log(`\nDone: ${manifestBanners.length} banners -> public/images/banners/charging/`);
