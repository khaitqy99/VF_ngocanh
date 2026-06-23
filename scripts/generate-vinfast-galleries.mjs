import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GALLERY_JSON = path.join(__dirname, "vinfast-gallery-images.json");
const OUT_FILE = path.join(ROOT, "src", "lib", "vinfast-galleries.ts");

function main() {
  if (!fs.existsSync(GALLERY_JSON)) {
    fs.writeFileSync(
      OUT_FILE,
      `// Run: node scripts/download-car-gallery-images.mjs\nexport const CAR_GALLERIES: Record<string, string[]> = {};\n`,
      "utf8",
    );
    return;
  }

  const data = JSON.parse(fs.readFileSync(GALLERY_JSON, "utf8"));
  const lines = Object.entries(data.cars ?? {})
    .map(([id, images]) => `  ${JSON.stringify(id)}: ${JSON.stringify(images, null, 4).replace(/\n/g, "\n  ")},`)
    .join("\n");

  const content = `// Auto-generated — scripts/generate-vinfast-galleries.mjs
// Source: scripts/vinfast-gallery-images.json
// Last synced: ${new Date().toISOString()}

import type { CarModel } from "./cars";

export const CAR_GALLERIES: Record<string, string[]> = {
${lines}
};

/** Hero gallery for car detail — curated PDP shots, then color variants, then catalog image. */
export function getCarGallery(car: CarModel): string[] {
  const curated = CAR_GALLERIES[car.id];
  const colorImages = car.colors.map((c) => c.image).filter(Boolean) as string[];
  const base = curated?.length ? curated : [];
  const merged = [...base];
  for (const img of colorImages) {
    if (!merged.includes(img)) merged.push(img);
  }
  if (!merged.includes(car.image)) merged.unshift(car.image);
  const unique = [...new Set(merged)];
  return unique.length ? unique : [car.image];
}
`;

  fs.writeFileSync(OUT_FILE, content, "utf8");
  console.log(`Wrote ${OUT_FILE} — ${Object.keys(data.cars ?? {}).length} models`);
  execSync(`npx prettier --write "${OUT_FILE}"`, { cwd: ROOT, stdio: "inherit" });
}

main();
