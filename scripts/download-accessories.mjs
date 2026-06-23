import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "images", "vinfast", "accessories");

const ITEMS = [
  { file: "vf3-mint.webp", url: "https://static-cms-dev.vinfastauto.com/vf3_mint.webp" },
  { file: "sac-11kw.webp", url: "https://static-cms-dev.vinfastauto.com/sac_11kw.webp" },
  { file: "vf7-che-pin.webp", url: "https://static-cms-dev.vinfastauto.com/vf7_che_pin.webp" },
  { file: "o-golf.webp", url: "https://static-cms-dev.vinfastauto.com/o-golf.webp" },
];

fs.mkdirSync(OUT, { recursive: true });

for (const { file, url } of ITEMS) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(OUT, file), buf);
  console.log(`saved ${file} (${(buf.length / 1024).toFixed(0)} KB)`);
}
