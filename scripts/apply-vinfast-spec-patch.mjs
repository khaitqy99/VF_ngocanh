import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DETAILS_FILE = path.join(__dirname, "vinfast-details.json");
const PATCH_FILE = path.join(__dirname, "vinfast-spec-patch.json");
const BROCHURE_SPECS_FILE = path.join(__dirname, "vinfast-brochure-specs.json");

function mergeFields(existing, patch) {
  return { ...(existing ?? {}), ...(patch ?? {}) };
}

function applyPatchList(details, patchMap, type) {
  const list = type === "car" ? details.cars : details.scooters;
  let count = 0;
  for (const [id, patch] of Object.entries(patchMap ?? {})) {
    const idx = list.findIndex((x) => x?.id === id);
    if (idx < 0) {
      console.warn(`  skip patch ${id}: not in vinfast-details.json`);
      continue;
    }
    const item = list[idx];
    if (patch.specTable?.length) {
      item.specTable = patch.specTable;
    }
    if (patch.fields) {
      item.fields = mergeFields(item.fields, patch.fields);
    }
    if (patch.variants?.length) {
      item.variants = patch.variants;
    }
    count++;
    console.log(`  patched ${id}: ${patch.specTable?.length ?? 0} specs`);
  }
  return count;
}

function backfillFromBrochureSpecs(details) {
  if (!fs.existsSync(BROCHURE_SPECS_FILE)) return 0;
  const brochure = JSON.parse(fs.readFileSync(BROCHURE_SPECS_FILE, "utf8"));
  let count = 0;
  for (const item of [...(brochure.cars ?? []), ...(brochure.scooters ?? [])]) {
    if (!item?.id || !item.specTable?.length) continue;
    const list = item.type === "car" ? details.cars : details.scooters;
    const idx = list.findIndex((x) => x?.id === item.id);
    if (idx < 0) continue;
    const existing = list[idx];
    if (existing.specTable?.length) continue;
    existing.specTable = item.specTable;
    existing.fields = mergeFields(existing.fields, item.fields);
    if (item.brochureContent && !existing.brochureContent) {
      existing.brochureContent = item.brochureContent;
    }
    count++;
    console.log(`  backfill ${item.id} from brochure-specs (${item.specTable.length} rows)`);
  }
  return count;
}

function main() {
  if (!fs.existsSync(DETAILS_FILE)) {
    console.error("Missing vinfast-details.json — run sync:details first");
    process.exit(1);
  }
  const details = JSON.parse(fs.readFileSync(DETAILS_FILE, "utf8"));
  const patch = JSON.parse(fs.readFileSync(PATCH_FILE, "utf8"));

  console.log("Applying curated spec patch...");
  const patched =
    applyPatchList(details, patch.cars, "car") + applyPatchList(details, patch.scooters, "scooter");

  console.log("Backfilling empty specTable from vinfast-brochure-specs.json...");
  const backfilled = backfillFromBrochureSpecs(details);

  details.specPatchedAt = new Date().toISOString();
  fs.writeFileSync(DETAILS_FILE, JSON.stringify(details, null, 2), "utf8");
  console.log(`Done — ${patched} curated patches, ${backfilled} brochure backfills`);
}

main();
