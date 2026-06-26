import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "vinfast");
const DATA_FILE = path.join(ROOT, "src", "lib", "vinfast-home.ts");

const VINFAST_BASE = "https://vinfastauto.com";
const VINFAST_HOME = "https://vinfastauto.com/vn_vi";

const NAME_FROM_SRC = {
  "vf8-all-new.png": "VF 8 All New",
  "Homepage_MPV7.webp": "VF MPV 7",
  "ecvan-02.webp": "EC VAN",
  "MinioGreen.webp": "Minio Green",
  "he.png": "Herio Green",
  "NerioGreen.webp": "Nerio Green",
  "limo.png": "Limo Green",
  "VF3.webp": "VF 3",
  "VF5.webp": "VF 5",
  "VF6.webp": "VF 6",
  "VF7.webp": "VF 7",
  "VF8.webp": "VF 8",
  "VF9.webp": "VF 9",
  "FlazzMax.webp": "FLAZZ MAX",
  "AmioS.webp": "AMIO S",
  "evo-lite.png": "EVO Lite",
  "Amio.webp": "Amio",
  "Viper.webp": "Viper",
  "Feliz-II.webp": "Feliz II",
  "evo.webp": "EVO",
  "zgoo.webp": "zgoo",
  "falzzz.webp": "Flazz",
  "verox_d.webp": "Vero X",
  "feliz2025_d.webp": "Feliz 2025",
  "evogrand.webp": "Evo Grand",
  "evogrand_lite.webp": "Evo Grand Lite",
  "EvoLiteNeo.webp": "EVO Lite Neo",
  "VfDrgnFly.webp": "DrgnFly",
};

// Full-size fallbacks for scooters only (theme paths blocked server-side).
const HD_IMAGE_SOURCES = {
  "flazz-max": ["https://static-cms-prod.vinfastauto.com/falzzz.webp"],
  "amio-s": ["https://storage.googleapis.com/vinfast-data-01/pdp/amio/Amio.webp"],
  viper: ["https://static-cms-prod.vinfastauto.com/feliz2025_d.webp"],
  "feliz-ii": ["https://static-cms-prod.vinfastauto.com/feliz2025_d.webp"],
  drgnfly: ["https://static-cms-prod.vinfastauto.com/evo-lite.png"],
  "evo-lite-neo": ["https://static-cms-prod.vinfastauto.com/evo-lite.png"],
};

const CAR_ID_MAP = {
  "VF 3": "vf3",
  "VF 5": "vf5",
  "VF 6": "vf6",
  "VF 7": "vf7",
  "VF 8": "vf8",
  "VF 8 All New": "vf8-all-new",
  "VF 9": "vf9",
  "VF MPV 7": "vf-mpv7",
  "Minio Green": "minio-green",
  "Herio Green": "herio-green",
  "Limo Green": "limo-green",
  "Nerio Green": "nerio-green",
  "EC VAN": "ec-van",
};

const SCOOTER_ID_MAP = {
  "FLAZZ MAX": "flazz-max",
  "AMIO S": "amio-s",
  "EVO Lite": "evo-lite",
  Amio: "amio",
  Viper: "viper",
  "Feliz II": "feliz-ii",
  EVO: "evo",
  zgoo: "zgoo",
  Flazz: "flazz",
  "Vero X": "vero-x",
  "Feliz 2025": "feliz-2025",
  "Evo Grand": "evo-grand",
  "Evo Grand Lite": "evo-grand-lite",
  DrgnFly: "drgnfly",
  "EVO Lite Neo": "evo-lite-neo",
};

async function fetchHtml() {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    Referer: "https://www.google.com/",
    "Cache-Control": "no-cache",
  };

  const res = await fetch(VINFAST_HOME, { headers });
  if (res.ok) return res.text();

  const cachePath = path.join(ROOT, "scripts", "vinfast-home.html");
  if (fs.existsSync(cachePath)) {
    const cached = fs.readFileSync(cachePath, "utf8");
    if (cached.includes("block-slide-cars")) {
      console.warn(`Live fetch returned ${res.status}, using cached HTML at ${cachePath}`);
      return cached;
    }
    console.warn(`Cached HTML at ${cachePath} is stale (no vehicle data), skipping`);
  }

  const jsonPath = path.join(ROOT, "scripts", "vinfast-vehicles.json");
  if (fs.existsSync(jsonPath)) {
    throw new Error(
      `VinFast fetch failed: ${res.status}. Run "npm run sync:catalog" using scripts/vinfast-vehicles.json instead.`,
    );
  }

  throw new Error(`VinFast fetch failed: ${res.status}`);
}

function resolveUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${VINFAST_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveVehicleName(alt, imageSrc) {
  const basename = path.basename(imageSrc.split("?")[0]);
  return NAME_FROM_SRC[basename] ?? alt.trim();
}

async function downloadImage(url, filename) {
  if (url.startsWith("/images/")) {
    const source = path.join(ROOT, "public", url.replace(/^\//, ""));
    if (!fs.existsSync(source)) return null;
    const dest = path.join(OUT_DIR, filename);
    fs.copyFileSync(source, dest);
    console.log(`  copied ${url} -> ${filename}`);
    return `/images/vinfast/${filename}`;
  }

  const dest = path.join(OUT_DIR, filename);
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) {
    return null;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  saved ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
  return `/images/vinfast/${filename}`;
}

function sourceExt(src) {
  if (src.startsWith("/images/")) return path.extname(src).toLowerCase();
  return extFromUrl(src);
}

function findExistingAsset(folder, fileBase) {
  const dir = path.join(OUT_DIR, folder);
  if (!fs.existsSync(dir)) return null;
  const match = fs.readdirSync(dir).find((f) => f.startsWith(`${fileBase}.`));
  return match ? `/images/vinfast/${folder}/${match}` : null;
}

function isBlockedOrLowResSource(src) {
  return src.includes("/themes/porto/");
}

async function resolveVehicleImage(item, folder) {
  const fileBase =
    folder === "cars" ? vehicleImageFileBase(item) : (item.localId ?? slugify(item.name));
  const sourceKey = folder === "cars" ? item.localId : item.localId;
  const hd = folder === "cars" ? [] : (HD_IMAGE_SOURCES[sourceKey] ?? []);
  const sources =
    folder === "cars"
      ? [item.imageSrc]
      : isBlockedOrLowResSource(item.imageSrc)
        ? [...hd, item.imageSrc]
        : [item.imageSrc, ...hd];

  for (const src of sources) {
    const ext = sourceExt(src);
    const local = await downloadImage(src, `${folder}/${fileBase}${ext}`);
    if (local) return local;
    if (!src.startsWith("/")) console.warn(`  skip image: ${src}`);
  }

  const existing = findExistingAsset(folder, fileBase);
  if (existing) {
    console.log(`  keep existing ${existing}`);
    return existing;
  }

  return item.imageSrc;
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  return ".webp";
}

function extractSwiperWrapper(html, blockId) {
  const start = html.indexOf(`id="${blockId}"`);
  if (start === -1) return "";

  const wrapperStart = html.indexOf('<div class="swiper-wrapper">', start);
  if (wrapperStart === -1) return "";

  const contentStart = wrapperStart + '<div class="swiper-wrapper">'.length;
  const endMarkers = [
    '<div class="slide-content-navigation">',
    '<div class="swiper-pagination">',
  ];

  let contentEnd = -1;
  for (const marker of endMarkers) {
    const idx = html.indexOf(marker, contentStart);
    if (idx !== -1 && (contentEnd === -1 || idx < contentEnd)) {
      contentEnd = idx;
    }
  }

  if (contentEnd === -1) return "";
  return html.slice(contentStart, contentEnd);
}

function parseHeroBanners(html) {
  const block = extractSwiperWrapper(html, "block-home-banner");
  const slides = [];
  const slideRe =
    /<div class="swiper-slide slide-item">([\s\S]*?)<\/div>\s*(?=<div class="swiper-slide|<div class="slide-content-navigation")/g;
  let m;
  while ((m = slideRe.exec(block)) !== null) {
    const chunk = m[1];
    const desktop = chunk.match(/class="d-none d-lg-block"[^>]*src="([^"]+)"/);
    const alt = chunk.match(/alt="([^"]*)"/);
    const href = chunk.match(/<a[^>]*href="([^"]+)"/);
    if (desktop) {
      slides.push({
        desktopSrc: resolveUrl(desktop[1]),
        alt: alt?.[1] ?? "VinFast",
        href: href?.[1] ?? "",
      });
    }
  }
  return slides;
}

function parseSpecItems(chunk) {
  const specs = [];
  const specBlockRe =
    /<div class="field-spec-item[^"]*">\s*<div class="field-spec-item--title[^"]*">\s*([^<]+?)\s*<\/div>\s*<div class="field-spec-item--desc[^"]*">\s*([^<]+?)\s*<\/div>(?:\s*<div[^>]*field-spec-item--desc-sub[^>]*>\s*([^<]+?)\s*<\/div>)?/g;
  let m;
  while ((m = specBlockRe.exec(chunk)) !== null) {
    const spec = { label: m[1].trim(), value: m[2].trim() };
    if (m[3]?.trim()) spec.listPrice = m[3].trim();
    specs.push(spec);
  }
  return specs;
}

function parseVehicleSlides(html, blockId, idMap) {
  const block = extractSwiperWrapper(html, blockId);
  const slides = [];
  const chunks = block.split('<div class="swiper-slide">').slice(1);
  for (const raw of chunks) {
    const chunk = raw.split(/<div class="slide-content-navigation">/)[0];
    const img = chunk.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
    if (!img) continue;

    const imageSrc = resolveUrl(img[1]);
    const name = resolveVehicleName(img[2], imageSrc);

    const specs = parseSpecItems(chunk);

    const detailHref =
      chunk.match(/btn--primary--white"[^>]*href="([^"]+)"/)?.[1] ??
      chunk.match(/href="([^"]+)"[^>]*>Xem chi tiết/)?.[1] ??
      "";
    const depositMatch = chunk.match(/btn--primary--blue"[^>]*href="([^"]+)"/);

    slides.push({
      name,
      imageSrc,
      specs,
      detailHref: detailHref ? resolveUrl(detailHref) : "",
      depositHref: depositMatch?.[1] ? resolveUrl(depositMatch[1]) : "",
      localId: idMap[name] ?? null,
    });
  }
  return slides;
}

function specsToFeatureSpecs(specs, type) {
  const result = [];
  for (const spec of specs) {
    const label = spec.label.toLowerCase();
    if (label.includes("chỗ ngồi") || label.includes("số chỗ")) {
      const seats = spec.value.replace(/\s*chỗ.*/i, "").trim() || spec.value;
      result.push({ value: seats, label: "chỗ ngồi", seats: true });
    } else if (label.includes("quãng đường") || label.includes("tốc độ tối đa")) {
      result.push({ value: spec.value, label: spec.label });
    } else if (
      label.includes("công suất") ||
      label.includes("mô-men") ||
      label.includes("cốp") ||
      label.includes("pin lithium")
    ) {
      result.push({ value: spec.value, label: spec.label });
    } else if (label.includes("giá")) {
      result.push({
        value: spec.value,
        label: spec.label,
        highlight: true,
        ...(spec.listPrice ? { listPrice: spec.listPrice } : {}),
      });
    } else if (type === "car" && label.includes("dòng xe")) {
      // segment shown as subtitle
    }
  }
  return result.slice(0, 4);
}

function vehicleImageFileBase(item) {
  if (item.name === "VF 8 All New") return "vf8-all-new";
  if (item.name === "VF 8") return "vf8";
  return item.localId ?? slugify(item.name);
}

async function processImages(banners, cars, scooters) {
  fs.mkdirSync(path.join(OUT_DIR, "banners"), { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "cars"), { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "scooters"), { recursive: true });

  const processedBanners = [];
  for (let i = 0; i < banners.length; i++) {
    const b = banners[i];
    const ext = extFromUrl(b.desktopSrc);
    const local = await downloadImage(b.desktopSrc, `banners/hero-${i + 1}${ext}`);
    if (local) processedBanners.push({ ...b, image: local });
  }

  const processedCars = [];
  for (const car of cars) {
    const image = await resolveVehicleImage(car, "cars");
    processedCars.push({ ...car, image });
  }

  const processedScooters = [];
  for (const scooter of scooters) {
    const image = await resolveVehicleImage(scooter, "scooters");
    processedScooters.push({ ...scooter, image });
  }

  return { processedBanners, processedCars, processedScooters };
}

function toSlide(item, type) {
  const localPath = type === "car" ? "/oto" : "/xe-may-dien";
  return {
    title: item.name,
    subtitle: item.specs.find((s) => s.label.toLowerCase().includes("dòng xe"))?.value,
    image: item.image,
    imageAlt: item.name,
    imageClass:
      type === "car"
        ? "h-full w-full object-contain object-left"
        : "h-full w-full object-contain object-right",
    specs: specsToFeatureSpecs(item.specs, type),
    primaryCta: "ĐẶT CỌC",
    secondaryCta: "KHÁM PHÁ NGAY",
    href: item.localId ? `${localPath}/${item.localId}` : item.detailHref,
    detailHref: item.detailHref,
  };
}

function generateTs({ processedBanners, processedCars, processedScooters }) {
  const content = `// Auto-generated by scripts/sync-vinfast-home.mjs — do not edit manually
// Source: ${VINFAST_HOME}
// Last synced: ${new Date().toISOString()}

export type VinFastHomeSpec = {
  value: string;
  label: string;
  highlight?: boolean;
  seats?: boolean;
  listPrice?: string;
};

export type VinFastHomeSlide = {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  imageClass: string;
  specs: VinFastHomeSpec[];
  primaryCta: string;
  secondaryCta: string;
  href?: string;
  detailHref?: string;
};

export type VinFastHeroBanner = {
  image: string;
  alt: string;
  href: string;
};

export const VINFAST_HERO_BANNERS: VinFastHeroBanner[] = ${JSON.stringify(
    processedBanners.map((b) => ({
      image: b.image,
      alt: b.alt,
      href: b.href.startsWith("http") ? b.href : `${VINFAST_BASE}${b.href}`,
    })),
    null,
    2,
  )};

export const VINFAST_FEATURED_CARS: VinFastHomeSlide[] = ${JSON.stringify(
    processedCars.map((c) => toSlide(c, "car")),
    null,
    2,
  )};

export const VINFAST_FEATURED_SCOOTERS: VinFastHomeSlide[] = ${JSON.stringify(
    processedScooters.map((s) => toSlide(s, "scooter")),
    null,
    2,
  )};

export const VINFAST_ALL_CARS = ${JSON.stringify(
    processedCars.map((c) => ({
      name: c.name,
      image: c.image,
      specs: c.specs,
      localId: c.localId,
      detailHref: c.detailHref,
    })),
    null,
    2,
  )} as const;

export const VINFAST_ALL_SCOOTERS = ${JSON.stringify(
    processedScooters.map((s) => ({
      name: s.name,
      image: s.image,
      specs: s.specs,
      localId: s.localId,
      detailHref: s.detailHref,
    })),
    null,
    2,
  )} as const;

export const VINFAST_SYNCED_AT = "${new Date().toISOString()}";
`;

  fs.writeFileSync(DATA_FILE, content, "utf8");
  console.log(`\nWrote ${DATA_FILE}`);
}

async function main() {
  console.log("Fetching VinFast homepage...");
  const html = await fetchHtml();
  console.log(`HTML length: ${html.length}`);

  const banners = parseHeroBanners(html);
  const cars = parseVehicleSlides(html, "block-slide-cars", CAR_ID_MAP);
  const scooters = parseVehicleSlides(html, "block-slide-bikes", SCOOTER_ID_MAP);

  console.log(`Found ${banners.length} banners, ${cars.length} cars, ${scooters.length} scooters`);

  const vehiclesJson = {
    syncedAt: new Date().toISOString(),
    source: VINFAST_HOME,
    banners,
    cars: cars.map((c) => ({
      name: c.name,
      imageSrc: c.imageSrc,
      specs: c.specs,
      detailHref: c.detailHref,
      localId: c.localId,
    })),
    scooters: scooters.map((s) => ({
      name: s.name,
      imageSrc: s.imageSrc,
      specs: s.specs,
      detailHref: s.detailHref,
      localId: s.localId,
    })),
  };
  fs.writeFileSync(
    path.join(ROOT, "scripts", "vinfast-vehicles.json"),
    JSON.stringify(vehiclesJson, null, 2),
    "utf8",
  );
  console.log(`Wrote ${path.join(ROOT, "scripts", "vinfast-vehicles.json")}`);

  console.log("\nDownloading images...");
  const data = await processImages(banners, cars, scooters);
  generateTs(data);

  console.log("\nDone! Run npm run dev to preview.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
