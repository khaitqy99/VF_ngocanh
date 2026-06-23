import fs from "fs";
import path from "path";

const OUT_DIR = "public/images/banners";

const BANNERS = [
  {
    id: "01-1-trieu-xuat-xuong",
    desktop:
      "https://static-cms-prod.vinfastauto.com/vinfast-1-trieu-xe-may-dien-xuat-xuong-desktop.jpg",
    mobile:
      "https://static-cms-prod.vinfastauto.com/vinfast-1-trieu-xe-may-dien-xuat-xuong-mobile.jpg",
  },
  {
    id: "02-xmd-uu-dai-16-1",
    desktop:
      "https://static-cms-prod.vinfastauto.com/vinfast-xe-may-dien-uu-dai-he-16-1-desktop.jpg",
    mobile:
      "https://static-cms-prod.vinfastauto.com/vinfast-xe-may-dien-uu-dai-he-16-1-mobile.jpg",
  },
  {
    id: "03-xmd-uu-dai-16",
    desktop:
      "https://static-cms-prod.vinfastauto.com/vinfast-xe-may-dien-uu-dai-he-16-desktop.jpg",
    mobile:
      "https://static-cms-prod.vinfastauto.com/vinfast-xe-may-dien-uu-dai-he-16-mobile.jpg",
  },
  {
    id: "04-vinfascination-vinpearl",
    desktop:
      "https://static-cms-prod.vinfastauto.com/vinfast-vinfascination-uu-dai-3-vinpearl-desktop.jpg",
    mobile:
      "https://static-cms-prod.vinfastauto.com/vinfast-vinfascination-uu-dai-3-vinpearl-mobile.jpg",
  },
  {
    id: "05-vf3-vinpearl",
    desktop:
      "https://static-cms-prod.vinfastauto.com/vinfast-vf3-uu-dai-he-vinpearl-desktop.jpg",
    mobile:
      "https://static-cms-prod.vinfastauto.com/vinfast-vf3-uu-dai-he-vinpearl-mobile.jpg",
  },
  {
    id: "06-vf-mpv7",
    desktop:
      "https://static-cms-prod.vinfastauto.com/vinfast-vf-mpv7-uu-dai-124-trieu-desktop.jpg",
    mobile:
      "https://static-cms-prod.vinfastauto.com/vinfast-vf-mpv7-uu-dai-124-trieu-mobile.jpg",
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`OK ${dest} (${(buf.length / 1024).toFixed(0)} KB)`);
}

for (const banner of BANNERS) {
  await download(banner.desktop, path.join(OUT_DIR, `${banner.id}-desktop.jpg`));
  await download(banner.mobile, path.join(OUT_DIR, `${banner.id}-mobile.jpg`));
}

console.log("\nDone:", BANNERS.length, "banners");
