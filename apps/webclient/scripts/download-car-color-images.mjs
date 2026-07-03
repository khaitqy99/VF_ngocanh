import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDP = JSON.parse(fs.readFileSync(path.join(__dirname, "vinfast-pdp-urls.json"), "utf8"));
const OUT_DIR = path.join(__dirname, "..", "public", "images", "vinfast", "colors");
const OUT_JSON = path.join(__dirname, "vinfast-color-images.json");
const DETAILS_FILE = path.join(__dirname, "vinfast-details.json");

const SHOP_BASE =
  "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default";

/** VinFast exterior color SKU → display name (shared across models) */
const CODE_NAMES = {
  CE18: "Infinity Blanc",
  CE11: "Jet Black",
  CE1V: "Zenith Grey",
  CE1W: "Urban Mint",
  CE1M: "Solar Ruby",
  CE2Q: "Solar Ruby",
  CE17: "Deep Ocean",
  CE22: "Crimson Red",
  "181U": "Summer Yellow",
  1821: "Rose Pink",
  "181Y": "Sky Blue",
  CE1J: "Astral Blue",
  CE1X: "Ivy Green",
  2927: "Desat Silver",
  "171V": "Brahminy White",
  "1V18": "Sunset Orange",
  2911: "Dragon Forged",
};

const VINFAST_PDP = {
  "vf8-all-new": "https://vinfastauto.com/vn_vi/dat-coc-xe-vf8-the-all-new-2026",
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeColorName(name) {
  return name
    .replace(/^(Trắng|Đen|Xanh|Bạc|Cam|Vàng|Hồng)\s+/i, "")
    .replace(/^Brahminy\s+/i, "")
    .trim();
}

function matchColorName(catalogName, scrapedName) {
  const a = catalogName.toLowerCase();
  const b = scrapedName.toLowerCase();
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const na = normalizeColorName(catalogName).toLowerCase();
  const nb = normalizeColorName(scrapedName).toLowerCase();
  return na === nb || na.includes(nb) || nb.includes(na);
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://shop.vinfastauto.com/" },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

function parse360Colors(html) {
  const template = html.match(/data-folder-template="([^"]+)"/)?.[1];
  if (!template) return null;
  const colors = [];
  const liRe = /<li[^>]*data-id="([^"]+)"[^>]*>[\s\S]*?alt="([^"]+)"/gi;
  let m;
  while ((m = liRe.exec(html)) !== null) {
    if (m[2].length < 50) colors.push({ code: m[1], name: m[2] });
  }
  if (!colors.length) return null;
  return colors.map((c) => ({
    name: c.name,
    code: c.code,
    url: template.replace("PRODUCT.COLOR", c.code) + "F1.png",
  }));
}

function parseReserveExterior(html, modelFolder) {
  const re = new RegExp(`reserves\\/${modelFolder}\\/exterior\\/product-([^."']+)\\.webp`, "gi");
  const codes = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  return codes.map((code) => ({
    code,
    name: CODE_NAMES[code] ?? code,
    url: `${SHOP_BASE}/reserves/${modelFolder}/exterior/product-${code}.webp`,
  }));
}

/** VF9-style PDP exterior: images/PDP/vf9/.../exterior/CE18.webp */
function parsePdpExterior(html, modelSlug) {
  const re = new RegExp(
    `images\\/PDP\\/${modelSlug}\\/[^"']+\\/exterior\\/(CE[A-Z0-9]+)\\.webp`,
    "gi",
  );
  const seen = new Set();
  const items = [];
  for (const m of html.matchAll(re)) {
    const code = m[1];
    if (code.startsWith("f-") || seen.has(code)) continue;
    seen.add(code);
    const full = html.match(
      new RegExp(
        `https://shop\\.vinfastauto\\.com/on/demandware\\.static[^"']+images/PDP/${modelSlug}/[^"']+/exterior/${code}\\.webp`,
      ),
    )?.[0];
    if (!full) continue;
    const name =
      modelSlug === "vf9" && code === "CE17"
        ? "Ivy Green"
        : modelSlug === "vf9" && code === "CE1M"
          ? "Desat Silver"
          : (CODE_NAMES[code] ?? code);
    items.push({ code, name, url: full });
  }
  return items;
}

/** VF5-style reserves/VF5/2025/Main(-N).webp mapped by index to catalog color order */
function parseReserveMain(html, folder, colorNames) {
  const re = new RegExp(
    `https://shop\\.vinfastauto\\.com/on/demandware\\.static[^"']+reserves\\/${folder}\\/[^"']+Main(-\\d+)?\\.webp`,
    "gi",
  );
  const urls = [...html.matchAll(re)].map((m) => m[0]);
  const desktop = urls.filter((u) => !u.includes("/sp/"));
  const unique = [];
  const seen = new Set();
  for (const u of desktop) {
    const key = u.match(/Main(-\d+)?\.webp/)?.[0];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(u);
  }
  unique.sort((a, b) => {
    const idx = (u) => {
      const m = u.match(/Main-(\d+)\.webp/);
      return m ? Number(m[1]) : 0;
    };
    return idx(a) - idx(b);
  });
  return unique.map((url, i) => ({
    code: `Main-${i}`,
    name: colorNames[i] ?? `Color ${i + 1}`,
    url,
  }));
}

const VF8_ALL_NEW_COLORS = [
  { code: "13", name: "Solar Ruby" },
  { code: "15", name: "Infinity Blanc" },
  { code: "21", name: "Jet Black" },
  { code: "23", name: "Starburst Blue" },
  { code: "17", name: "Mysterioso Purple" },
  { code: "19", name: "Vitality Orange" },
  { code: "14", name: "Solar Ruby Body - Jet Black Roof" },
  { code: "16", name: "Vitality Orange Body - Infinity Blanc Roof" },
  { code: "18", name: "Mysterioso Purple Body - Stealth Gray Roof" },
  { code: "20", name: "Vitality Orange Body - Jet Black Roof" },
  { code: "22", name: "Jet Black Body - Stealth Gray Roof" },
  { code: "24", name: "Starburst Blue Body - Infinity Blanc Roof" },
];

function parseFullImageUrls(html) {
  const items = [];
  const re =
    /reserves\/(VF[^/]+)\/exterior\/product-([^."']+)\.webp[^"']*"[^>]*>[\s\S]*?colorExterior([^"-]+)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const code = m[2];
    items.push({
      code,
      name: CODE_NAMES[code] ?? code,
      url: html.match(
        new RegExp(
          `https://shop\\.vinfastauto\\.com/on/demandware\\.static[^"']+reserves/${m[1]}/exterior/product-${code}\\.webp`,
        ),
      )?.[0],
    });
  }
  // fallback: unique full URLs from srcset
  const urls = [
    ...html.matchAll(
      /https:\/\/shop\.vinfastauto\.com\/on\/demandware\.static[^"']+reserves\/(VF[^/]+)\/exterior\/product-([^."']+)\.webp/g,
    ),
  ];
  const seen = new Set();
  for (const u of urls) {
    const key = `${u[1]}-${u[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ code: u[2], name: CODE_NAMES[u[2]] ?? u[2], url: u[0] });
  }
  return items;
}

function parseVinfastPdpColors(html, carId) {
  if (!html.includes("vf8-new-product")) return null;
  const items = [];
  const re = /data-variant-code:(\d+)[^>]*data-variant-label:([^,]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const code = `VF8PH-${m[1]}`;
    items.push({
      code,
      name: m[2].trim(),
      url: `https://vinfastauto.com/themes/porto/img/vf8-new-product/color/car/${code}.png`,
    });
  }
  if (!items.length) {
    const btns = [...html.matchAll(/data-variant-code="(\d+)"[^>]*data-variant-label="([^"]+)"/g)];
    for (const b of btns) {
      const code = `VF8PH-${b[1]}`;
      items.push({
        code,
        name: b[2],
        url: `https://vinfastauto.com/themes/porto/img/vf8-new-product/color/car/${code}.png`,
      });
    }
  }
  return items.length ? items : null;
}

const MODEL_FOLDER = {
  vf3: "VF3",
  vf5: "VF5",
  vf6: "VF6",
  vf7: "VF7",
  vf8: "VF8",
  vf9: "VF9",
};

const PDP_MODEL_SLUG = {
  vf9: "vf9",
};

function loadDetailColorNames(carId) {
  if (!fs.existsSync(DETAILS_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(DETAILS_FILE, "utf8"));
  const detail = data.cars?.find((c) => c.id === carId);
  if (detail?.colorHex?.length) return detail.colorHex.map((c) => c.name);
  if (detail?.colors?.length) return detail.colors;
  return [];
}

async function downloadFile(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function scrapeCarColors(carId, shopUrl, extraUrl) {
  const sources = [];
  if (shopUrl) {
    try {
      const html = await fetchHtml(shopUrl);
      const folder = MODEL_FOLDER[carId];
      const from360 = parse360Colors(html);
      if (from360) {
        for (const c of from360) {
          sources.push(c);
        }
      }
      if (folder) {
        for (const item of parseFullImageUrls(html)) {
          if (item.url) sources.push(item);
        }
      }
      const pdpSlug = PDP_MODEL_SLUG[carId];
      if (pdpSlug) {
        sources.push(...parsePdpExterior(html, pdpSlug));
      }
      if (carId === "vf5") {
        const names = loadDetailColorNames(carId);
        sources.push(...parseReserveMain(html, "VF5", names));
      }
    } catch (e) {
      console.warn(`  shop skip ${carId}:`, e.message);
    }
  }
  if (extraUrl) {
    try {
      const html = await fetchHtml(extraUrl);
      const pdp = parseVinfastPdpColors(html, carId);
      if (pdp) sources.push(...pdp);
    } catch (e) {
      console.warn(`  pdp skip ${carId}:`, e.message);
    }
  }
  if (carId === "vf8-all-new") {
    for (const c of VF8_ALL_NEW_COLORS) {
      sources.push({
        code: `VF8PH-${c.code}`,
        name: c.name,
        url: `https://vinfastauto.com/themes/porto/img/vf8-new-product/color/car/VF8PH-${c.code}.png`,
      });
    }
  }
  const uniq = new Map();
  for (const s of sources) {
    if (!s.url) continue;
    uniq.set(`${s.name}|${s.code}`, s);
  }
  return [...uniq.values()];
}

async function main() {
  const vehicles = JSON.parse(
    fs.readFileSync(path.join(__dirname, "vinfast-vehicles.json"), "utf8"),
  );
  const result = { cars: {}, scooters: {}, syncedAt: new Date().toISOString() };

  for (const car of vehicles.cars) {
    const carIdMap = {
      "VF 9": "vf9",
      "VF 8 All New": "vf8-all-new",
      "VF MPV 7": "vf-mpv7",
      "EC VAN": "ec-van",
      "Minio Green": "minio-green",
      "Herio Green": "herio-green",
      "Nerio Green": "nerio-green",
      "Limo Green": "limo-green",
      "VF 3": "vf3",
      "VF 5": "vf5",
      "VF 6": "vf6",
      "VF 7": "vf7",
      "VF 8": "vf8",
    };
    const carId = carIdMap[car.name];
    if (!carId) continue;

    const shopUrl = PDP.cars[carId];
    const extraUrl = VINFAST_PDP[carId];
    console.log(`Scraping colors for ${car.name} (${carId})...`);
    const scraped = await scrapeCarColors(carId, shopUrl, extraUrl);
    if (!scraped.length) continue;

    const entries = [];
    for (const item of scraped) {
      const ext = path.extname(new URL(item.url).pathname) || ".webp";
      const fileName = `${slugify(item.name)}${ext}`;
      const localPath = `/images/vinfast/colors/${carId}/${fileName}`;
      const dest = path.join(OUT_DIR, carId, fileName);
      try {
        const bytes = await downloadFile(item.url, dest);
        console.log(`  ✓ ${item.name} → ${fileName} (${(bytes / 1024).toFixed(0)} KB)`);
        entries.push({ name: item.name, code: item.code, image: localPath, sourceUrl: item.url });
      } catch (e) {
        console.warn(`  ✗ ${item.name} (local):`, e.message);
        entries.push({ name: item.name, code: item.code, image: item.url, sourceUrl: item.url });
      }
    }

    if (entries.length) result.cars[carId] = entries;
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${OUT_JSON} — ${Object.keys(result.cars).length} models`);
}

main();
