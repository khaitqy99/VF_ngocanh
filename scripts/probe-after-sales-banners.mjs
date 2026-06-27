import fs from "fs";

const URLS = [
  "https://shop.vinfastauto.com/vn_vi/dat-lich-dich-vu-bao-duong.html",
  "https://shop.vinfastauto.com/vn_vi/dat-lich-dich-vu.html",
  "https://vinfastauto.com/vn_vi/thong-tin-bao-hanh",
  "https://vinfastauto.com/vn_vi/dich-vu-bao-duong",
  "https://vinfastauto.com/vn_vi/dich-vu-sua-chua",
  "https://vinfastauto.com/vn_vi/chinh-sach-bao-hanh",
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://vinfastauto.com/vn_vi",
};

for (const url of URLS) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    const html = await res.text();
    const slug =
      url
        .split("/")
        .pop()
        .replace(/\.html$/, "") || "home";
    fs.writeFileSync(`scripts/vinfast-probe-${slug}.html`, html.slice(0, 300000));

    const imgs = [
      ...new Set(html.match(/https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s>]*)?/gi) || []),
    ].filter((u) =>
      /banner|service|bao-hanh|dich-vu|dvhm|static-cms|after|warranty|hero|block-service|content-asset/i.test(
        u,
      ),
    );

    const bgUrls = [...html.matchAll(/url\((['"]?)(https?:\/\/[^)'"]+)\1\)/gi)].map((m) => m[2]);

    const swiper = html.includes("swiper-wrapper");
    const blockIds = [...html.matchAll(/id="(block-[^"]+)"/g)].map((m) => m[1]);

    console.log(`\n=== ${res.status} ${url}`);
    console.log("swiper:", swiper, "| blocks:", [...new Set(blockIds)].slice(0, 12).join(", "));
    console.log("imgs:", imgs.slice(0, 15));
    console.log("bg urls:", [...new Set(bgUrls)].slice(0, 10));
  } catch (e) {
    console.log(`\n=== ERR ${url}`, e.message);
  }
}

// Homepage block-service CSS background
const home = fs.readFileSync("scripts/vinfast-home.html", "utf8");
const cssLinks = [...home.matchAll(/href="([^"]+homepage[^"]+\.css[^"]*)"/gi)].map((m) => m[1]);
console.log("\n=== Homepage CSS links ===", cssLinks.slice(0, 5));
