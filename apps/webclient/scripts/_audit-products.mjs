import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DETAILS = JSON.parse(fs.readFileSync(path.join(__dirname, "vinfast-details.json"), "utf8"));
const VEHICLES = JSON.parse(fs.readFileSync(path.join(__dirname, "vinfast-vehicles.json"), "utf8"));
const OVERRIDES_TS = fs.readFileSync(
  path.join(ROOT, "src/lib/vinfast-detail-overrides.ts"),
  "utf8",
);
const CARS_TS = fs.readFileSync(path.join(ROOT, "src/lib/cars.ts"), "utf8");
const SCOOTERS_TS = fs.readFileSync(path.join(ROOT, "src/lib/scooters.ts"), "utf8");

function parsePrice(s) {
  const n = String(s ?? "").replace(/[^\d]/g, "");
  return n ? parseInt(n, 10) : 0;
}

function extractCatalog(ts) {
  const models = [];
  for (const block of ts.split(/\n  \{/)) {
    const id = block.match(/id:\s*["']?([^"',\n]+)["']?/)?.[1];
    const name = block.match(/name:\s*"([^"]+)"/)?.[1];
    const price = block.match(/price:\s*([\d_]+)/)?.[1];
    if (id && name && price)
      models.push({ id, name, price: parseInt(price.replace(/_/g, ""), 10) });
  }
  return models;
}

function homePriceMap() {
  const map = {};
  for (const raw of [...(VEHICLES.cars ?? []), ...(VEHICLES.scooters ?? [])]) {
    const id = raw.localId;
    const spec = raw.specs?.find((s) => /giá/i.test(s.label));
    if (!id || !spec) continue;
    map[id] = parsePrice(spec.value) || parsePrice(spec.listPrice);
  }
  return map;
}

function fileExists(urlPath) {
  if (!urlPath || !urlPath.startsWith("/")) return false;
  return fs.existsSync(path.join(PUBLIC, urlPath.replace(/^\//, "")));
}

function parseOverridesExport(exportName) {
  const start = OVERRIDES_TS.indexOf(`export const ${exportName}`);
  if (start < 0) return {};
  const brace = OVERRIDES_TS.indexOf("{", start);
  let depth = 0;
  let end = brace;
  for (let i = brace; i < OVERRIDES_TS.length; i++) {
    if (OVERRIDES_TS[i] === "{") depth++;
    else if (OVERRIDES_TS[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const code = `(${OVERRIDES_TS.slice(brace, end)})`;
  // eslint-disable-next-line no-eval
  return eval(code);
}

function collectImages(obj, out = []) {
  if (!obj || typeof obj !== "object") return out;
  if (typeof obj.image === "string") out.push(obj.image);
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) v.forEach((item) => collectImages(item, out));
    else if (v && typeof v === "object") collectImages(v, out);
  }
  return out;
}

const CAR_IDS = extractCatalog(CARS_TS);
const SCOOTER_IDS = extractCatalog(SCOOTERS_TS);
const ALL = [...CAR_IDS, ...SCOOTER_IDS];
const homePrices = homePriceMap();
const allDetails = [...(DETAILS.cars ?? []), ...(DETAILS.scooters ?? [])];
const carOverrides = parseOverridesExport("VINFAST_CAR_DETAIL_OVERRIDES");
const scooterOverrides = parseOverridesExport("VINFAST_SCOOTER_DETAIL_OVERRIDES");

const issues = [];

for (const m of ALL) {
  const detail = allDetails.find((d) => d.id === m.id);
  const override = carOverrides[m.id] ?? scooterOverrides[m.id] ?? {};
  const home = homePrices[m.id];

  if (home && m.price !== home) {
    issues.push({
      id: m.id,
      type: "price",
      msg: `catalog ${m.price.toLocaleString("vi-VN")} ≠ homepage ${home.toLocaleString("vi-VN")}`,
    });
  }

  if (!detail?.specTable?.length) {
    issues.push({ id: m.id, type: "spec", msg: "specTable trống trong vinfast-details.json" });
  }

  if (!override.specGroups?.length) {
    issues.push({ id: m.id, type: "spec", msg: "thiếu specGroups trong overrides" });
  }

  const variants = override.variants ?? [];
  if (variants.length) {
    const minVariant = Math.min(...variants.map((v) => v.price).filter(Boolean));
    if (home && minVariant !== home && variants.length === 1) {
      issues.push({
        id: m.id,
        type: "variant",
        msg: `1 phiên bản: giá variant ${minVariant.toLocaleString("vi-VN")} ≠ homepage ${home.toLocaleString("vi-VN")}`,
      });
    } else if (variants.length > 1 && minVariant !== m.price) {
      issues.push({
        id: m.id,
        type: "variant",
        msg: `nhiều phiên bản: min variant ${minVariant.toLocaleString("vi-VN")} ≠ catalog ${m.price.toLocaleString("vi-VN")}`,
      });
    }
  }

  for (const key of ["exterior", "interior", "design"]) {
    const arr = override[key];
    if (arr?.length > 4) {
      issues.push({
        id: m.id,
        type: "layout",
        msg: `${key} có ${arr.length} mục (>4, grid chỉ hiển thị 4)`,
      });
    }
  }

  const imgs = [...new Set(collectImages(override))];
  for (const img of imgs) {
    if (img.startsWith("http")) {
      issues.push({ id: m.id, type: "image", msg: `ảnh ngoài site: ${img.slice(0, 80)}…` });
    } else if (img.startsWith("/") && !fileExists(img)) {
      issues.push({ id: m.id, type: "image", msg: `ảnh không tồn tại: ${img}` });
    }
  }
}

const byType = {};
for (const i of issues) {
  byType[i.type] = (byType[i.type] ?? 0) + 1;
}

console.log(`\n=== KIỂM TRA ${ALL.length} SẢN PHẨM ===`);
console.log(`Tổng lỗi: ${issues.length}`);
console.log("Theo loại:", byType);

if (issues.length) {
  console.log("\nChi tiết:");
  for (const i of issues) {
    console.log(`  [${i.type}] ${i.id}: ${i.msg}`);
  }
} else {
  console.log("\n✓ Không phát hiện lỗi giá, spec, ảnh hay layout.");
}

process.exit(issues.length ? 1 : 0);
