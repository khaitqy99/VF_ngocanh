import { parseShopPdpContent } from "./parse-shop-pdp-content.mjs";

const h = await (
  await fetch("https://shop.vinfastauto.com/vn_vi/dat-coc-xe-vf9.html", {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
).text();

const stats = [...h.matchAll(/626 km[\s\S]{0,200}/gi)];
console.log("626", stats[0]?.[0]?.slice(0, 150));

const items = [...h.matchAll(/<div class="item[\s\S]{0,300}?<\/div>/gi)].slice(0, 3);
console.log("items", items.length);

const p = parseShopPdpContent(h, "VF 9");
console.log(JSON.stringify(p?.overview?.bullets, null, 2));
console.log("tagline", p?.tagline);
