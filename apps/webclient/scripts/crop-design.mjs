import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "assets", "design-mockup.png");
const outDir = path.join(root, "public", "images");

const meta = await sharp(source).metadata();
const W = meta.width ?? 342;
const H = meta.height ?? 1024;

async function save(name, { top, height, left = 0, width = W, scale = 4 }) {
  const extract = {
    left: Math.max(0, Math.round(left)),
    top: Math.max(0, Math.round(top)),
    width: Math.min(Math.round(width), W - Math.max(0, Math.round(left))),
    height: Math.min(Math.round(height), H - Math.max(0, Math.round(top))),
  };

  await sharp(source)
    .extract(extract)
    .resize({ width: extract.width * scale, withoutEnlargement: false })
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, name));

  console.log(`✓ ${name}`);
}

await save("hero-banner.jpg", { top: H * 0.058, height: H * 0.108, scale: 5 });

await save("vf-mpv7.jpg", {
  top: H * 0.188,
  height: H * 0.072,
  left: W * 0.04,
  width: W * 0.52,
  scale: 8,
});

await save("evo-scooter.jpg", {
  top: H * 0.298,
  height: H * 0.075,
  left: W * 0.44,
  width: W * 0.52,
  scale: 8,
});

const accTop = H * 0.388;
const accImgH = H * 0.041;
const accW = W * 0.19;
const accGap = W * 0.028;
const accStart = W * 0.06;
for (const [i, name] of [
  ["acc-model.jpg", 0],
  ["acc-mat.jpg", 2],
  ["acc-umbrella.jpg", 3],
]) {
  await save(name, {
    top: accTop,
    height: accImgH,
    left: accStart + i * (accW + accGap),
    width: accW,
    scale: 24,
  });
}
// Wall charger: higher-quality crop from portable-charger region
await save("acc-charger.jpg", {
  top: H * 0.49,
  height: H * 0.1,
  width: W * 0.38,
  left: W * 0.56,
  scale: 8,
});

await save("charging-stations.jpg", {
  top: H * 0.482,
  height: H * 0.054,
  width: W * 0.44,
  left: W * 0.04,
  scale: 5,
});
await save("charging-scooter.jpg", {
  top: H * 0.548,
  height: H * 0.054,
  width: W * 0.44,
  left: W * 0.04,
  scale: 5,
});
await save("portable-charger.jpg", {
  top: H * 0.49,
  height: H * 0.1,
  width: W * 0.38,
  left: W * 0.56,
  scale: 6,
});

await save("vf9-suv.jpg", {
  top: H * 0.648,
  height: H * 0.078,
  left: W * 0.38,
  width: W * 0.58,
  scale: 8,
});

await save("brand-story.jpg", { top: H * 0.738, height: H * 0.108, scale: 5 });

await save("showroom.jpg", {
  top: H * 0.854,
  height: H * 0.058,
  width: W * 0.44,
  left: W * 0.04,
  scale: 5,
});
await save("community.jpg", {
  top: H * 0.854,
  height: H * 0.058,
  width: W * 0.44,
  left: W * 0.52,
  scale: 5,
});

await save("herio-green.jpg", {
  top: H * 0.938,
  height: H * 0.068,
  left: W * 0.04,
  width: W * 0.48,
  scale: 8,
});

console.log(`Done — ${W}x${H}`);
