const urls = [
  "https://vinfastauto.com/vn_vi/thong-tin-bao-hanh",
  "https://vinfastauto.com/vn_vi/dich-vu-bao-duong",
  "https://vinfastauto.com/vn_vi/dich-vu-sua-chua",
  "https://vinfastauto.com/vn_vi/dich-vu",
  "https://shop.vinfastauto.com/vn_vi/dat-lich-dich-vu-bao-duong.html",
];

const headers = {
  "User-Agent": "Mozilla/5.0 Chrome/120",
  Referer: "https://vinfastauto.com/vn_vi",
};

import fs from "fs";

for (const url of urls) {
  const res = await fetch(url, { headers });
  console.log("\n===", url, res.status);
  if (!res.ok) continue;
  const html = await res.text();
  const slug = url.split("/").pop()?.replace(".html", "") ?? "page";
  fs.writeFileSync(`scripts/vinfast-${slug}.html`, html.slice(0, 50000));
  const imgs = [
    ...new Set(
      (html.match(/https?:\/\/[^\"'\s>]+\.(jpg|jpeg|webp|png)/gi) || []).filter(
        (u) => /static-cms|demandware|vinfast|service|bao-hanh|warranty/i.test(u),
      ),
    ),
  ];
  console.log("imgs:", imgs.slice(0, 10));
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
  if (h1) console.log("h1:", h1.slice(0, 80));
}
