/**
 * Đồng bộ toàn bộ phụ kiện từ shop VinFast (liên kết vinfastauto.com/vn_vi).
 * Nguồn: Search-ShowAjax VINFAST_PARTS
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_JSON = path.join(__dirname, "vinfast-accessories.json");
const OUT_TS = path.join(ROOT, "src", "lib", "vinfast-accessories.ts");
const IMG_DIR = path.join(ROOT, "public", "images", "vinfast", "accessories");

const SHOP_BASE = "https://shop.vinfastauto.com";
const LIST_URL = `${SHOP_BASE}/on/demandware.store/Sites-app_vinfast_vn-Site/vi_VN/Search-ShowAjax?prefn1=salesType&prefv1=VINFAST_PARTS&start=0&sz=100`;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  Referer: "https://vinfastauto.com/vn_vi",
};

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&ocirc;/g, "ô")
    .replace(/&Ocirc;/g, "Ô")
    .replace(/&aacute;/g, "á")
    .replace(/&Aacute;/g, "Á")
    .replace(/&agrave;/g, "à")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&yacute;/g, "ý")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}

function stripTags(html) {
  return decodeHtml(
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function slugifyPid(pid) {
  return pid
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePrice(text) {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function resolveImageUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${SHOP_BASE}${src}`;
}

function inferCategory(name) {
  const n = name.toLowerCase();
  if (/sạc|sac |charger|bộ sạc|adapter/.test(n) && !/che pin|tấm che/.test(n)) return "sac-pin";
  if (/mô hình|mo hinh|quà|gift|lưu niệm|keychain|móc khóa/.test(n)) return "qua-tang";
  if (/camera|cảm biến|an toàn|radar|cảnh báo/.test(n)) return "an-toan";
  if (/film|cách nhiệt|nóc|ngoại|che pin|bảo vệ|thanh ngang|giá nóc|spoiler|viền/.test(n))
    return "ngoai-that";
  if (/thảm|cốp|nội thất|gối|túi|vô lăng|lót sàn|tấm lót/.test(n)) return "noi-that";
  return "phu-kien-chung";
}

function inferVehicles(name) {
  const vehicles = [];
  const rules = [
    [/vf\s*3|vinfast vf 3/i, "vf3"],
    [/vf\s*5/i, "vf5"],
    [/vf\s*6/i, "vf6"],
    [/vf\s*7/i, "vf7"],
    [/vf\s*8/i, "vf8"],
    [/vf\s*9/i, "vf9"],
    [/mpv\s*7|vf mpv/i, "vf-mpv7"],
    [/ec\s*van/i, "ec-van"],
    [/nerio/i, "nerio-green"],
    [/limo/i, "limo-green"],
    [/herio/i, "herio-green"],
    [/minio/i, "minio-green"],
    [/evo|feliz|flazz|viper|amio|zgoo|vero|drgnfly|xe máy|scooter/i, "all"],
  ];
  for (const [re, id] of rules) {
    if (re.test(name) && !vehicles.includes(id)) vehicles.push(id);
  }
  const carIds = vehicles.filter((v) => v !== "all");
  if (!carIds.length) return ["all"];
  return carIds;
}

function parseListing(html) {
  const items = [];
  const chunks = html.split('<div class="accessories-list-item">').slice(1);
  for (const chunk of chunks) {
    const pid = chunk.match(/data-pid="([^"]+)"/)?.[1];
    const href = chunk.match(/href="(\/vn_vi\/[^"]+\.html)"/)?.[1];
    const nameHtml = chunk.match(/class="accessories-productName"[^>]*>([\s\S]*?)<\/p>/)?.[1];
    const priceText = chunk.match(/class="price-sale"[^>]*>([\s\S]*?)<\/span>/)?.[1];
    const imgSrc =
      chunk.match(/class="tile-image"[^>]*src="([^"]+)"/)?.[1] ??
      chunk.match(/<img[^>]+src="([^"]+Accessory[^"]+)"/i)?.[1];

    if (!pid || !nameHtml) continue;

    const name = stripTags(nameHtml);
    const price = parsePrice(stripTags(priceText ?? ""));
    items.push({
      pid,
      id: slugifyPid(pid),
      name,
      price,
      href: href ? `${SHOP_BASE}${href}` : `${SHOP_BASE}/vn_vi/${pid}.html`,
      imageUrl: resolveImageUrl(imgSrc),
      category: inferCategory(name),
      vehicles: inferVehicles(name),
    });
  }
  return items;
}

async function fetchDescription(url) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return "";
    const html = await res.text();
    const meta =
      html.match(/meta name="description" content="([^"]*)"/i)?.[1] ??
      html.match(/property="og:description" content="([^"]*)"/i)?.[1] ??
      "";
    const cleaned = decodeHtml(meta).trim();
    if (cleaned.length > 20) return cleaned.slice(0, 280);
    const body = html.match(/class="product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
    if (body) return stripTags(body).slice(0, 280);
    return "";
  } catch {
    return "";
  }
}

async function downloadImage(url, dest) {
  if (!url || fs.existsSync(dest)) return true;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

function extFromUrl(url) {
  const m = url.match(/\.(webp|png|jpe?g)(\?|$)/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "png";
}

function tsString(value) {
  return JSON.stringify(value);
}

function generateTs(products, priceMin, priceMax) {
  const lines = products.map((p) => {
    const fields = [
      `id: ${tsString(p.id)}`,
      `shopPid: ${tsString(p.pid)}`,
      `name: ${tsString(p.name)}`,
      `description: ${tsString(p.description)}`,
      `price: ${p.price}`,
      `image: ${tsString(p.image)}`,
      `category: ${tsString(p.category)}`,
      `vehicles: [${p.vehicles.map((v) => tsString(v)).join(", ")}]`,
      `inStock: true`,
    ];
    if (p.badge) fields.push(`badge: ${tsString(p.badge)}`);
    return `  {\n    ${fields.join(",\n    ")},\n  }`;
  });

  return `// Auto-generated by scripts/sync-vinfast-accessories.mjs — do not edit manually
// Source: https://shop.vinfastauto.com/vn_vi/phu-kien (VinFast)
// Last synced: ${new Date().toISOString()}
// Products: ${products.length}

export const VINFAST_ACCESSORIES = [
${lines.join(",\n")},
];

export const VINFAST_ACCESSORY_PRICE_MIN = ${priceMin};
export const VINFAST_ACCESSORY_PRICE_MAX = ${priceMax};
`;
}

// --- main ---
fs.mkdirSync(IMG_DIR, { recursive: true });

console.log("Fetching accessory listing...");
const listRes = await fetch(LIST_URL, { headers: HEADERS });
if (!listRes.ok) throw new Error(`Listing fetch failed: ${listRes.status}`);
const listHtml = await listRes.text();
fs.writeFileSync(path.join(__dirname, "vinfast-shop-accessories-list.html"), listHtml);

let products = parseListing(listHtml);
console.log(`Parsed ${products.length} products`);

const CONCURRENCY = 8;
for (let i = 0; i < products.length; i += CONCURRENCY) {
  const batch = products.slice(i, i + CONCURRENCY);
  await Promise.all(
    batch.map(async (p) => {
      const ext = extFromUrl(p.imageUrl);
      const localFile = `${p.id}.${ext}`;
      const localPath = path.join(IMG_DIR, localFile);
      const ok = await downloadImage(p.imageUrl, localPath);
      p.image = ok ? `/images/vinfast/accessories/${localFile}` : "/images/vinfast/showroom.webp";

      const desc = await fetchDescription(p.href);
      p.description =
        desc ||
        `${p.name} — phụ kiện chính hãng VinFast, phân phối tại đại lý VinFast Ngọc Anh Cà Mau.`;

      if (/mô hình|bán chạy/i.test(p.name) && p.name.toLowerCase().includes("vf 3")) {
        p.badge = "Bán chạy";
      }
    }),
  );
  console.log(`  processed ${Math.min(i + CONCURRENCY, products.length)}/${products.length}`);
}

const prices = products.map((p) => p.price).filter((n) => n > 0);
const priceMin = prices.length ? Math.min(...prices) : 200_000;
const priceMax = prices.length ? Math.max(...prices) : 15_000_000;

const manifest = {
  syncedAt: new Date().toISOString(),
  source: "https://vinfastauto.com/vn_vi → shop phu-kien",
  count: products.length,
  priceMin,
  priceMax,
  products,
};

fs.writeFileSync(OUT_JSON, JSON.stringify(manifest, null, 2));
fs.writeFileSync(OUT_TS, generateTs(products, priceMin, priceMax));

console.log(`\nDone: ${products.length} accessories`);
console.log(`  JSON: scripts/vinfast-accessories.json`);
console.log(`  TS:   src/lib/vinfast-accessories.ts`);
console.log(`  Price range: ${priceMin.toLocaleString()} – ${priceMax.toLocaleString()} VND`);
