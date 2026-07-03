import fs from "fs";

const url = process.argv[2] ?? "https://shop.vinfastauto.com/vn_vi/dat-coc-xe-dien-vf3.html";
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0", Referer: "https://shop.vinfastauto.com/" },
});
const html = await res.text();

const folderMatch = html.match(/data-folder="([^"]+)"/);
const folder = folderMatch?.[1] ?? "";
console.log("folder:", folder);

const colors = [];
const liRe = /<li[^>]*data-id="([^"]+)"[^>]*>[\s\S]*?alt="([^"]+)"/gi;
let m;
while ((m = liRe.exec(html)) !== null) {
  if (m[2].length < 50) colors.push({ id: m[1], name: m[2] });
}

console.log("colors:", colors);

if (folder && colors[0]) {
  const sample = folder.replace("PRODUCT.COLOR", colors[0].id) + "F0.png";
  console.log("sample url:", sample);
  const head = await fetch(sample, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } });
  console.log("sample status:", head.status);
}
