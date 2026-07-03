import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "images", "vinfast", "cars");

const CMS_CARS = [
  { id: "vf8-all-new", url: "https://static-cms-prod.vinfastauto.com/vf8-all-new.png" },
  {
    id: "vf-mpv7",
    url: "https://storage.googleapis.com/vinfast-data-01/pdp/vf_mpv_7/Homepage_MPV7.webp",
  },
  { id: "ec-van", url: "https://static-cms-prod.vinfastauto.com/ecvan-02.webp" },
  { id: "herio-green", url: "https://static-cms-prod.vinfastauto.com/he.png" },
  { id: "limo-green", url: "https://static-cms-prod.vinfastauto.com/limo.png" },
];

fs.mkdirSync(OUT, { recursive: true });

for (const { id, url } of CMS_CARS) {
  const ext = path.extname(url.split("?")[0]).toLowerCase();
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.warn("skip", id, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(OUT, `${id}${ext}`);
  fs.writeFileSync(dest, buf);
  console.log(`saved ${id}${ext} (${(buf.length / 1024).toFixed(0)} KB)`);
}
