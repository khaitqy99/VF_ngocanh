import fs from "fs";

const urls = {
  vf9: "https://shop.vinfastauto.com/vn_vi/dat-coc-xe-dien-vf9.html",
  vf8: "https://shop.vinfastauto.com/vn_vi/car-vf8.html",
  vf5: "https://shop.vinfastauto.com/vn_vi/dat-coc-xe-dien-vf5.html",
};
for (const [id, url] of Object.entries(urls)) {
  const html = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();
  const hits = [];
  for (const kw of [
    "exterior/",
    "reserves/VF",
    "color/car",
    "360/",
    "data-id",
    "Infinity Blanc",
    "Jet Black",
  ]) {
    if (html.includes(kw)) hits.push(kw);
  }
  const imgs = [...html.matchAll(/reserves\/VF[^"'\s]+/g)].map((m) => m[0]);
  console.log(
    "\n",
    id,
    hits.join(", "),
    "\n unique reserves:",
    [...new Set(imgs)].slice(0, 20).join("\n  "),
  );
}
