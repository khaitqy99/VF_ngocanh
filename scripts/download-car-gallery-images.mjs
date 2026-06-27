import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDP = JSON.parse(fs.readFileSync(path.join(__dirname, "vinfast-pdp-urls.json"), "utf8"));
const COLOR_IMAGES = JSON.parse(
  fs.readFileSync(path.join(__dirname, "vinfast-color-images.json"), "utf8"),
);
const OUT_DIR = path.join(__dirname, "..", "public", "images", "vinfast", "gallery");
const OUT_JSON = path.join(__dirname, "vinfast-gallery-images.json");

const CAR_ID_MAP = {
  "VF 3": "vf3",
  "VF 5": "vf5",
  "VF 6": "vf6",
  "VF 7": "vf7",
  "VF 8": "vf8",
  "VF 8 All New": "vf8-all-new",
  "VF 9": "vf9",
  "VF MPV 7": "vf-mpv7",
  "EC VAN": "ec-van",
  "Minio Green": "minio-green",
  "Herio Green": "herio-green",
  "Limo Green": "limo-green",
  "Nerio Green": "nerio-green",
};

const URL_HINTS = {
  vf3: [/VF3/i, /vf3/i],
  vf5: [/VF5/i, /vf5/i],
  vf6: [/VF6/i, /vf6/i],
  vf7: [/VF7/i, /vf7/i],
  vf8: [/VF8/i, /vf8/i, /PDP\/vf8/i],
  vf9: [/vf9/i, /VF9/i, /PDP\/vf9/i],
  "vf-mpv7": [/mpv7/i, /MPV/i],
  "ec-van": [/ecvan/i, /ec-van/i, /ECVAN/i],
  "minio-green": [/minio/i],
  "herio-green": [/herio/i],
  "limo-green": [/limo/i],
  "nerio-green": [/nerio/i],
};

const SKIP_RE =
  /logo|\.svg|icon\/|mega-menu|hover\.|thumb|preview-bg|separate-line|exclusive-bg|tag-line|charging-station|home-charger|battery-lease|video\/|\/sp\/|f-CE|dat-coc|uu-diem|map\.jpg|bannermobile|_mb\.|-mb\.|mobile\.jpg/i;

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fileNameFromUrl(url) {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  const base = parts.length >= 2 ? parts.slice(-3).join("-") : (parts.at(-1) ?? "image");
  return base.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function matchesCar(url, carId) {
  const hints = URL_HINTS[carId];
  if (!hints) return true;
  return hints.some((re) => re.test(url));
}

function scoreUrl(url) {
  const u = url.toLowerCase();
  if (/hero\.(webp|jpg|png)/.test(u) && !/lead-hero/.test(u)) return 0;
  if (/img-top|banner\.(webp|jpg)/.test(u)) return 1;
  if (/top-side|lead-hero/.test(u)) return 2;
  if (/exterior\/product-|exterior\/ce|360\/.*\/f1\.png/i.test(u)) return 3;
  if (/interior-first-sight|interior-img|int-slide|interior\/int/.test(u)) return 4;
  if (/thietke|panorama|guong|section/.test(u)) return 5;
  return 6;
}

function parseGalleryUrls(html, carId) {
  const found = [];
  const seen = new Set();
  const re =
    /https:\/\/shop\.vinfastauto\.com\/on\/demandware\.static[^"']+\.(webp|jpg|jpeg|png)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[0].split("?")[0];
    if (seen.has(url) || SKIP_RE.test(url)) continue;
    if (!matchesCar(url, carId)) continue;
    seen.add(url);
    found.push({ url, index: m.index, score: scoreUrl(url) });
  }
  found.sort((a, b) => a.score - b.score || a.index - b.index);
  return found.map((f) => f.url).slice(0, 24);
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://shop.vinfastauto.com/" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

async function downloadFile(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const vehicles = JSON.parse(
    fs.readFileSync(path.join(__dirname, "vinfast-vehicles.json"), "utf8"),
  );
  const result = { cars: {}, syncedAt: new Date().toISOString() };

  for (const car of vehicles.cars) {
    const carId = CAR_ID_MAP[car.name];
    if (!carId) continue;
    const shopUrl = PDP.cars[carId];
    if (!shopUrl) continue;

    console.log(`Gallery: ${car.name} (${carId})...`);
    let urls = [];
    try {
      const html = await fetchHtml(shopUrl);
      urls = parseGalleryUrls(html, carId);
    } catch (e) {
      console.warn(`  skip HTML: ${e.message}`);
    }

    const colorEntries = COLOR_IMAGES.cars?.[carId] ?? [];
    for (const c of colorEntries) {
      if (c.image?.startsWith("http")) urls.push(c.image);
      else if (c.sourceUrl) urls.push(c.sourceUrl);
    }

    const uniqueUrls = [...new Set(urls)];
    if (!uniqueUrls.length) continue;

    const images = [];
    for (const url of uniqueUrls) {
      const fileName = fileNameFromUrl(url);
      const localPath = `/images/vinfast/gallery/${carId}/${fileName}`;
      const dest = path.join(OUT_DIR, carId, fileName);
      try {
        if (!fs.existsSync(dest) || fs.statSync(dest).size < 500) {
          await downloadFile(url, dest);
        }
        images.push(localPath);
        console.log(`  ✓ ${fileName}`);
      } catch (e) {
        console.warn(`  ✗ ${fileName}: ${e.message}`);
        if (url.startsWith("http")) images.push(url);
      }
    }

    if (images.length) result.cars[carId] = images;
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${OUT_JSON} — ${Object.keys(result.cars).length} models`);
}

main();
