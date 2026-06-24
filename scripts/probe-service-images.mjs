import fs from "fs";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

const cssFiles = [
  "https://vinfastauto.com/themes/porto/css/homepage-v2.css",
  "https://vinfastauto.com/themes/porto/css/custom.css",
  "https://vinfastauto.com/themes/porto/css/vinfast/promo.css",
];

for (const url of cssFiles) {
  const res = await fetch(url, { headers: HEADERS });
  const css = await res.text();
  const hits = [...css.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)]
    .map((m) => m[2])
    .filter((u) => /service|aftersales|baohanh|bao-hanh|dvhm|warranty|showroom/i.test(u));
  console.log(`\n=== ${res.status} ${url.split("/").pop()} ===`);
  console.log(hits);
  const blocks = [...css.matchAll(/#(?:block-service|aftersales[^\s{]*|block-aftersales)[^{]*\{[^}]+\}/g)];
  blocks.slice(0, 5).forEach((b) => console.log(b[0].slice(0, 300)));
}

// Try direct image URLs
const candidates = [
  "https://static-cms-prod.vinfastauto.com/baohanh_1755224955_0.png",
  "https://static-cms-prod.vinfastauto.com/baohanh_1755224955-mobile.png",
  "https://static-cms-prod.vinfastauto.com/baohanh_1755224955-desktop.png",
  "https://static-cms-prod.vinfastauto.com/baohanh_1755224955_0-mobile.png",
  "https://static-cms-prod.vinfastauto.com/baohanh_1755224955_0-desktop.png",
  "https://static-cms-prod.vinfastauto.com/bao-hanh-sua-chua-desktop.jpg",
  "https://static-cms-prod.vinfastauto.com/bao-hanh-sua-chua-mobile.jpg",
  "https://static-cms-prod.vinfastauto.com/dich-vu-bao-duong-desktop.jpg",
  "https://static-cms-prod.vinfastauto.com/dich-vu-bao-duong-mobile.jpg",
  "https://static-cms-prod.vinfastauto.com/dich-vu-sua-chua-desktop.jpg",
  "https://static-cms-prod.vinfastauto.com/dich-vu-sua-chua-mobile.jpg",
  "https://static-cms-prod.vinfastauto.com/service-2.webp",
  "https://vinfastauto.com/themes/porto/img/homepage-v2/service-2.webp",
];
for (const u of candidates) {
  const r = await fetch(u, { method: "HEAD", headers: HEADERS });
  console.log(r.status, u);
}
