import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const url = process.argv[2] ?? "https://shop.vinfastauto.com/vn_vi/dat-coc-xe-dien-vf3.html";
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0", Referer: "https://shop.vinfastauto.com/" },
});
const html = await res.text();
console.log("status", res.status, "len", html.length);

const patterns = [
  /color\/car\/[^"'\s]+/gi,
  /data-variant-code[=:]["']?[^"'\s>]+/gi,
  /data-color[^"'\s>]{0,80}/gi,
  /exteriorColor[^"']{0,200}/gi,
  /Jet Black|Infinity Blanc|Summer Yellow/gi,
  /"image"\s*:\s*"([^"]+)"/g,
  /img\/[^"'\s]*color[^"'\s]*/gi,
  /storage\.googleapis\.com[^"'\s]+/gi,
  /static-cms[^"'\s]+\.(webp|png|jpg)/gi,
];

for (const p of patterns) {
  const m = [...html.matchAll(p)].map((x) => x[0] || x[1]).slice(0, 15);
  if (m.length) console.log("\n", p, "\n", m.join("\n"));
}

// JSON blobs
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
for (const s of scripts) {
  if (/exterior|colorCode|variantCode|productImage/i.test(s[1]) && s[1].length < 50000) {
    console.log("\n--- script snippet ---\n", s[1].slice(0, 800));
  }
}
