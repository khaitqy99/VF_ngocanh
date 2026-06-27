/**
 * Tải banner desktop/mobile từ CDN VinFast (cùng nguồn trang chủ vinfastauto.com/vn_vi).
 * Dữ liệu URL: scripts/vinfast-vehicles.json hoặc fetch HTML cache scripts/vinfast-home.html
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "banners");
const DATA_FILE = path.join(ROOT, "scripts", "vinfast-vehicles.json");
const CACHE_HTML = path.join(ROOT, "scripts", "vinfast-home.html");

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

function slugify(alt) {
  return alt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function mobileFromDesktop(url) {
  if (url.includes("-desktop.")) return url.replace("-desktop.", "-mobile.");
  return url;
}

function extractSwiperWrapper(html, blockId) {
  const start = html.indexOf(`id="${blockId}"`);
  if (start === -1) return "";
  const wrapperStart = html.indexOf('<div class="swiper-wrapper">', start);
  if (wrapperStart === -1) return "";
  const contentStart = wrapperStart + '<div class="swiper-wrapper">'.length;
  const end = html.indexOf('<div class="slide-content-navigation">', contentStart);
  return end === -1 ? "" : html.slice(contentStart, end);
}

function parseBannersFromHtml(html) {
  const block = extractSwiperWrapper(html, "block-home-banner");
  const slides = [];
  const slideRe =
    /<div class="swiper-slide slide-item">([\s\S]*?)<\/div>\s*(?=<div class="swiper-slide|<div class="slide-content-navigation")/g;
  let m;
  while ((m = slideRe.exec(block)) !== null) {
    const chunk = m[1];
    const desktop = chunk.match(/class="d-none d-lg-block"[^>]*src="([^"]+)"/);
    const mobile = chunk.match(/class="d-block d-lg-none"[^>]*src="([^"]+)"/);
    const alt = chunk.match(/alt="([^"]*)"/);
    const href = chunk.match(/<a[^>]*href="([^"]+)"/);
    if (desktop) {
      slides.push({
        desktop: desktop[1],
        mobile: mobile?.[1] ?? mobileFromDesktop(desktop[1]),
        alt: alt?.[1] ?? "VinFast",
        href: href?.[1] ?? "",
      });
    }
  }
  return slides;
}

function classifyBanner(banner) {
  const text = `${banner.alt} ${banner.href}`.toLowerCase();
  const isScooter =
    /xe-may|xe máy|xmd|1-trieu|1 triệu|dat-mua-xe-may/.test(text) ||
    (/uu-dai-he-16/.test(text) && !/vf\s*[0-9]|mpv|o-to|oto/.test(text));
  const isCar =
    /o-to|oto|vf\s*[0-9]|vf-|mpv|vinfascination|dat-coc-xe|car-vf/.test(text) && !isScooter;
  if (isCar && !isScooter) return "car";
  if (isScooter) return "scooter";
  return "car";
}

async function loadBanners() {
  try {
    const res = await fetch("https://vinfastauto.com/vn_vi", { headers: HEADERS });
    if (res.ok) {
      const html = await res.text();
      fs.writeFileSync(CACHE_HTML, html);
      const parsed = parseBannersFromHtml(html);
      if (parsed.length) {
        console.log(`Parsed ${parsed.length} banners from live homepage`);
        return parsed;
      }
    }
  } catch {
    /* fallback below */
  }

  if (fs.existsSync(CACHE_HTML)) {
    const html = fs.readFileSync(CACHE_HTML, "utf8");
    const parsed = parseBannersFromHtml(html);
    if (parsed.length) {
      console.log(`Parsed ${parsed.length} banners from cache ${CACHE_HTML}`);
      return parsed;
    }
  }

  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    console.log(`Using ${data.banners.length} banners from ${DATA_FILE}`);
    return data.banners.map((b) => ({
      desktop: b.desktopSrc,
      mobile: mobileFromDesktop(b.desktopSrc),
      alt: b.alt,
      href: b.href ?? "",
    }));
  }

  throw new Error("No banner source available");
}

async function download(url, dest) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  OK ${path.basename(dest)} (${(buf.length / 1024).toFixed(0)} KB)`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const banners = await loadBanners();
const carBanners = [];
const scooterBanners = [];

for (let i = 0; i < banners.length; i++) {
  const b = banners[i];
  const id = `${String(i + 1).padStart(2, "0")}-${slugify(b.alt) || `banner-${i + 1}`}`;
  const desktopPath = path.join(OUT_DIR, `${id}-desktop.jpg`);
  const mobilePath = path.join(OUT_DIR, `${id}-mobile.jpg`);

  console.log(`\n[${i + 1}/${banners.length}] ${b.alt.slice(0, 60)}`);
  await download(b.desktop, desktopPath);
  await download(b.mobile, mobilePath);

  const slide = {
    desktop: `/images/banners/${id}-desktop.jpg`,
    mobile: `/images/banners/${id}-mobile.jpg`,
    alt: b.alt,
  };

  if (classifyBanner(b) === "scooter") scooterBanners.push(slide);
  else carBanners.push(slide);
}

const manifest = {
  syncedAt: new Date().toISOString(),
  source: "https://vinfastauto.com/vn_vi",
  carBanners,
  scooterBanners,
  allBanners: banners.map((b, i) => ({
    ...b,
    id: `${String(i + 1).padStart(2, "0")}-${slugify(b.alt)}`,
  })),
};

fs.writeFileSync(
  path.join(ROOT, "scripts", "page-banners.json"),
  JSON.stringify(manifest, null, 2),
);

console.log(`\nDone: ${banners.length} banners`);
console.log(`  Ô tô: ${carBanners.length} | Xe máy: ${scooterBanners.length}`);
console.log("Manifest: scripts/page-banners.json");
