import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images", "vinfast", "charging");

const IMAGES = [
  {
    file: "pin-oto.webp",
    url: "https://vinfastauto.com/themes/porto/img/homepage-v2/pin-oto-2.webp",
  },
  {
    file: "pin-xe-may.webp",
    url: "https://vinfastauto.com/themes/porto/img/homepage-v2/pin-xe-may.webp",
  },
  {
    file: "mobile-charger.webp",
    url: "https://vinfastauto.com/themes/porto/img/homepage-v2/mobile-charger.webp",
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { file, url } of IMAGES) {
  const res = await fetch(url, {
    headers: {
      Referer: "https://vinfastauto.com/vn_vi",
      "User-Agent": "Mozilla/5.0",
    },
  });
  if (!res.ok) {
    console.warn(
      `Failed ${url}: ${res.status} — VinFast may block server-side fetch; open vinfastauto.com in a browser and save manually to public/images/vinfast/charging/`,
    );
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(OUT_DIR, file);
  fs.writeFileSync(out, buf);
  console.log(`Saved ${out} (${buf.length} bytes)`);
}
