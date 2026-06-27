import fs from "fs";

const URLS = [
  "https://vinfastauto.com/vn_vi/pin-va-tram-sac",
  "https://vinfastauto.com/vn_vi/dich-vu-pin-oto-dien",
  "https://vinfastauto.com/vn_vi/dich-vu-pin-xe-may-dien",
  "https://vinfastauto.com/vn_vi/tim-kiem-showroom-tram-sac",
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://vinfastauto.com/vn_vi",
};

for (const url of URLS) {
  const res = await fetch(url, { headers: HEADERS });
  const html = await res.text();
  const slug = url.split("/").pop() || "home";
  fs.writeFileSync(`scripts/vinfast-probe-${slug}.html`, html.slice(0, 400000));
  console.log(`\n=== ${res.status} ${url} (${html.length})`);

  const hero =
    html.match(
      /block-bike-battery|page-pin|hero|banner|swiper/i.test(html) &&
        html.match(/content-banner[\s\S]*?src="([^"]+)"/)?.[1],
    ) ?? html.match(/field-warranty-main-img[\s\S]*?src="([^"]+)"/)?.[1];

  const desktopSlides = [...html.matchAll(/class="d-none d-lg-block"[^>]*src="([^"]+)"/g)].map(
    (m) => m[1],
  );
  const mobileSlides = [...html.matchAll(/class="d-block d-lg-none"[^>]*src="([^"]+)"/g)].map(
    (m) => m[1],
  );

  const cms = [
    ...new Set(
      (
        html.match(/https:\/\/static-cms-prod\.vinfastauto\.com\/[^"'\s>]+\.(?:png|jpg|webp)/gi) ||
        []
      ).filter((u) => /pin|tram|sac|charge|battery|banner|hero|pin-va|charging/i.test(u)),
    ),
  ];

  console.log("hero:", hero);
  console.log("desktop slides:", desktopSlides.slice(0, 5));
  console.log("mobile slides:", mobileSlides.slice(0, 5));
  console.log("cms:", cms.slice(0, 20));
}
