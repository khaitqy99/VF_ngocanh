import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const urls = {
  vf9: "https://shop.vinfastauto.com/vn_vi/car-vf9.html",
  vf6: "https://shop.vinfastauto.com/vn_vi/dat-coc-xe-dien-vf6.html",
  vf5: "https://shop.vinfastauto.com/vn_vi/dat-coc-xe-dien-vf5.html",
};

for (const [id, url] of Object.entries(urls)) {
  const html = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();
  const has360 = html.includes("data-folder-template");
  const exterior = [...html.matchAll(/reserves\/VF[^/]+\/exterior\/product-[^."']+\.webp/g)].map((m) => m[0]);
  const colors = [...html.matchAll(/<li[^>]*data-id="([^"]+)"[^>]*>[\s\S]*?alt="([^"]+)"/gi)]
    .map((m) => `${m[1]}:${m[2]}`)
    .filter((x) => x.length < 60);
  console.log(id, "360:", has360, "exterior:", [...new Set(exterior)].length, "colors:", colors.slice(0, 10));
}
