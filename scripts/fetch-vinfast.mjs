import fs from "fs";

const res = await fetch("https://vinfastauto.com/vn_vi", {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
});
const html = await res.text();
console.log("status", res.status, "length", html.length);

const imgRe = /https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi;
const imgs = [...new Set(html.match(imgRe) || [])];
console.log("\n=== IMAGES (" + imgs.length + ") ===");
imgs.slice(0, 40).forEach((u) => console.log(u));

const scriptRe = /<script[^>]*src="([^"]+)"/gi;
const scripts = [...html.matchAll(scriptRe)].map((m) => m[1]);
console.log("\n=== SCRIPTS ===");
scripts.forEach((s) => console.log(s));

const nextData = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (nextData) {
  const data = JSON.parse(nextData[1]);
  console.log("\n=== __NEXT_DATA__ keys ===", Object.keys(data));
  fs.writeFileSync("scripts/vinfast-next-data.json", JSON.stringify(data, null, 2));
}

// Look for API endpoints in inline scripts
const apiMatches = [...html.matchAll(/https?:\/\/[^"'\s]+(?:api|graphql)[^"'\s]*/gi)].map(
  (m) => m[0],
);
console.log("\n=== API URLs ===");
[...new Set(apiMatches)].slice(0, 20).forEach((u) => console.log(u));

// Save raw HTML snippet for inspection
fs.writeFileSync("scripts/vinfast-home.html", html.slice(0, 200000));
