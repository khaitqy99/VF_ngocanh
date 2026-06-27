import fs from "fs";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "vi-VN,vi;q=0.9",
  Referer: "https://vinfastauto.com/vn_vi",
};

const pages = [
  "https://vinfastauto.com/vn_vi/thong-tin-bao-hanh",
  "https://vinfastauto.com/vn_vi/dich-vu-bao-duong",
  "https://vinfastauto.com/vn_vi/dich-vu-sua-chua",
];

for (const url of pages) {
  const res = await fetch(url, { headers: HEADERS });
  const html = await res.text();
  console.log("\n===", res.status, url);

  const hero =
    html.match(/field-warranty-main-img[\s\S]*?src="([^"]+)"/)?.[1] ??
    html.match(/warranty-intro-img[\s\S]*?src="([^"]+)"/)?.[1] ??
    html.match(/page-hero[\s\S]*?src="([^"]+)"/)?.[1];

  const slides = [...html.matchAll(/class="d-none d-lg-block"[^>]*src="([^"]+)"/g)].map(
    (m) => m[1],
  );
  const mobileSlides = [...html.matchAll(/class="d-block d-lg-none"[^>]*src="([^"]+)"/g)].map(
    (m) => m[1],
  );

  console.log("hero:", hero);
  console.log("desktop slides:", slides.slice(0, 5));
  console.log("mobile slides:", mobileSlides.slice(0, 5));

  const cms = [
    ...new Set(
      (
        html.match(/https:\/\/static-cms-prod\.vinfastauto\.com\/[^"'\s>]+\.(?:png|jpg|webp)/gi) ||
        []
      ).filter((u) => /bao-hanh|baohanh|dich-vu|service|dvhm|sua-chua|bao-duong/i.test(u)),
    ),
  ];
  console.log("cms imgs:", cms);
}

// block-service bg from homepage CSS
const cssRes = await fetch("https://vinfastauto.com/themes/porto/css/homepage-v2.css", {
  headers: HEADERS,
});
const css = await cssRes.text();
const serviceBg = [
  ...css.matchAll(/#block-service[^}]*background(?:-image)?:[^;]+url\((['"]?)([^)'"]+)\1\)/gi),
];
const aftersalesBg = [...css.matchAll(/#aftersales[^}]*background[^}]+/gi)];
console.log(
  "\n=== homepage-v2.css block-service ===",
  serviceBg.map((m) => m[2]),
);
console.log(
  "aftersales:",
  aftersalesBg.map((m) => m[0].slice(0, 200)),
);
