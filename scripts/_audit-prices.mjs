import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VEHICLES = JSON.parse(fs.readFileSync(path.join(__dirname, "vinfast-vehicles.json"), "utf8"));
const CARS_TS = fs.readFileSync(path.join(ROOT, "src/lib/cars.ts"), "utf8");
const SCOOTERS_TS = fs.readFileSync(path.join(ROOT, "src/lib/scooters.ts"), "utf8");
const OVERRIDES_TS = fs.readFileSync(path.join(ROOT, "src/lib/vinfast-detail-overrides.ts"), "utf8");

function parsePrice(s) {
  const n = String(s ?? "").replace(/[^\d]/g, "");
  return n ? parseInt(n, 10) : 0;
}

function fmt(n) {
  return n ? n.toLocaleString("vi-VN") + " đ" : "—";
}

function extractCatalog(ts) {
  const models = [];
  for (const block of ts.split(/\n  \{/)) {
    const id = block.match(/id:\s*["']?([^"',\n]+)["']?/)?.[1];
    const name = block.match(/name:\s*"([^"]+)"/)?.[1];
    const price = block.match(/price:\s*([\d_]+)/)?.[1];
    if (id && name && price) models.push({ id, name, price: parseInt(price.replace(/_/g, ""), 10) });
  }
  return models;
}

function parseOverridesExport(exportName) {
  const start = OVERRIDES_TS.indexOf(`export const ${exportName}`);
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
  return eval(`(${OVERRIDES_TS.slice(brace, end)})`);
}

const catalog = [...extractCatalog(CARS_TS), ...extractCatalog(SCOOTERS_TS)];
const carOv = parseOverridesExport("VINFAST_CAR_DETAIL_OVERRIDES");
const scooterOv = parseOverridesExport("VINFAST_SCOOTER_DETAIL_OVERRIDES");

const homeById = {};
for (const raw of [...(VEHICLES.cars ?? []), ...(VEHICLES.scooters ?? [])]) {
  const spec = raw.specs?.find((s) => /giá/i.test(s.label));
  if (!raw.localId || !spec) continue;
  homeById[raw.localId] = {
    name: raw.name,
    sale: parsePrice(spec.value),
    list: parsePrice(spec.listPrice),
    saleRaw: spec.value,
    listRaw: spec.listPrice,
  };
}

console.log(`\n=== BÁO CÁO GIÁ ${catalog.length} SẢN PHẨM ===`);
console.log(`Nguồn homepage: vinfast-vehicles.json`);
console.log(`Quy tắc: catalog = giá sale (value), không dùng listPrice gạch ngang\n`);

let ok = 0;
let mismatch = 0;

console.log(
  "ID".padEnd(18) +
    "Tên".padEnd(22) +
    "Catalog".padEnd(18) +
    "Home sale".padEnd(18) +
    "Home list".padEnd(18) +
    "Variant min".padEnd(18) +
    "OK?",
);
console.log("-".repeat(110));

for (const m of catalog) {
  const home = homeById[m.id];
  const ov = carOv[m.id] ?? scooterOv[m.id] ?? {};
  const variants = ov.variants ?? [];
  const minVar = variants.length ? Math.min(...variants.map((v) => v.price)) : null;

  const saleOk = home?.sale && m.price === home.sale;
  const varOk = !variants.length || minVar === m.price || (variants.length === 1 && minVar === home?.sale);
  const allOk = saleOk && varOk;

  if (allOk) ok++;
  else mismatch++;

  const flag = allOk ? "✓" : "✗";
  console.log(
    m.id.padEnd(18) +
      (home?.name ?? m.name).slice(0, 20).padEnd(22) +
      fmt(m.price).padEnd(18) +
      fmt(home?.sale ?? 0).padEnd(18) +
      fmt(home?.list ?? 0).padEnd(18) +
      (minVar ? fmt(minVar) : "—").padEnd(18) +
      flag,
  );

  if (!saleOk && home?.sale) {
    console.log(`  → Lệch catalog: ${fmt(m.price)} vs sale ${fmt(home.sale)} (list ${home.listRaw ?? "—"})`);
  }
  if (variants.length > 1 && minVar !== m.price) {
    console.log(`  → Min variant ${fmt(minVar)} ≠ catalog ${fmt(m.price)}`);
  }
}

console.log(`\nKết quả: ${ok}/${catalog.length} đúng, ${mismatch} lệch`);
process.exit(mismatch ? 1 : 0);
