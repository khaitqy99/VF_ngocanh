import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "scripts", "vinfast-logo-source.webp");

const outputs = [
  { file: "public/favicon.png", size: 32 },
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "app/icon.png", size: 32 },
  { file: "app/apple-icon.png", size: 180 },
];

async function renderIcon(outputPath, size, padding = 0.12) {
  const inset = Math.round(size * padding);
  const inner = size - inset * 2;
  const png = await sharp(source)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([{ input: png, gravity: "centre" }])
    .png()
    .toFile(path.join(root, outputPath));
}

mkdirSync(path.join(root, "public"), { recursive: true });
mkdirSync(path.join(root, "app"), { recursive: true });

for (const { file, size } of outputs) {
  await renderIcon(file, size);
  console.log(`✓ ${file} (${size}x${size})`);
}

console.log("Done.");
