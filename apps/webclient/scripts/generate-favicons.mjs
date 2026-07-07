import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const VINFAST_LOGO_URL = "https://static-cms-prod.vinfastauto.com/Vinfast-logo.png";
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const webclientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webadminRoot = path.resolve(webclientRoot, "../webadmin");
const sourcePath = path.join(webclientRoot, "scripts", "vinfast-logo-source.png");

const webclientOutputs = [
  { file: "public/favicon.png", size: 32 },
  { file: "public/favicon-16.png", size: 16 },
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "app/icon.png", size: 32 },
  { file: "app/apple-icon.png", size: 180 },
];

const webadminOutputs = [
  { file: "app/icon.png", size: 32 },
  { file: "app/apple-icon.png", size: 180 },
];

async function downloadSource() {
  const response = await fetch(VINFAST_LOGO_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download VinFast logo (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(sourcePath, buffer);
  console.log(`✓ Downloaded ${VINFAST_LOGO_URL}`);
}

async function removeDarkBackground(image) {
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = Math.max(r, g, b);

    if (brightness < 42) {
      data[i + 3] = 0;
      continue;
    }

    if (brightness < 72) {
      const fade = (brightness - 42) / 30;
      data[i + 3] = Math.round(data[i + 3] * fade);
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  });
}

async function emblemPipeline(sourcePath) {
  const meta = await sharp(sourcePath).metadata();
  const width = meta.width ?? 491;
  const height = meta.height ?? 491;
  const cropSize = Math.round(Math.min(width, height) * 0.82);
  const left = Math.round((width - cropSize) / 2);
  const top = Math.round(height * 0.04);

  const cropped = await sharp(sourcePath)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(512, 512, {
      fit: "contain",
      background: TRANSPARENT,
    })
    .png()
    .toBuffer();

  return removeDarkBackground(sharp(cropped));
}

async function renderEmblem(size) {
  const pipeline = await emblemPipeline(sourcePath);
  return pipeline
    .resize(size, size, {
      fit: "contain",
      background: TRANSPARENT,
    })
    .png()
    .toBuffer();
}

async function renderIcon(outputPath, size, rootDir, padding = 0.08) {
  const inset = Math.round(size * padding);
  const inner = size - inset * 2;
  const emblem = await renderEmblem(inner);

  const outDir = path.dirname(path.join(rootDir, outputPath));
  mkdirSync(outDir, { recursive: true });

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: TRANSPARENT,
    },
  })
    .composite([{ input: emblem, gravity: "centre" }])
    .png()
    .toFile(path.join(rootDir, outputPath));
}

async function writeFaviconIco(rootDir, publicDir) {
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map(async (size) => {
      const inset = Math.max(1, Math.round(size * 0.08));
      const inner = size - inset * 2;
      const emblem = await renderEmblem(inner);

      return sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: TRANSPARENT,
        },
      })
        .composite([{ input: emblem, gravity: "centre" }])
        .png()
        .toBuffer();
    }),
  );

  const ico = await toIco(buffers);
  writeFileSync(path.join(publicDir, "favicon.ico"), ico);
  writeFileSync(path.join(rootDir, "app/favicon.ico"), ico);
}

await downloadSource();

mkdirSync(path.join(webclientRoot, "public"), { recursive: true });
mkdirSync(path.join(webclientRoot, "app"), { recursive: true });
mkdirSync(path.join(webadminRoot, "app"), { recursive: true });

for (const { file, size } of webclientOutputs) {
  await renderIcon(file, size, webclientRoot);
  console.log(`✓ webclient/${file} (${size}x${size})`);
}

await writeFaviconIco(webclientRoot, path.join(webclientRoot, "public"));
console.log("✓ webclient/public/favicon.ico");
console.log("✓ webclient/app/favicon.ico");

for (const { file, size } of webadminOutputs) {
  await renderIcon(file, size, webadminRoot);
  console.log(`✓ webadmin/${file} (${size}x${size})`);
}

await writeFaviconIco(webadminRoot, path.join(webadminRoot, "app"));
console.log("✓ webadmin/app/favicon.ico");

console.log("Done.");
