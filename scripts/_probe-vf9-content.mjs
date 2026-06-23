const url = "https://shop.vinfastauto.com/vn_vi/dat-coc-xe-vf9.html";
const h = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();

function strip(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const h2s = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])).filter((t) => t.length > 5 && t.length < 120);
const h3s = [...h.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => strip(m[1])).filter((t) => t.length > 5 && t.length < 120);

console.log("H2:", h2s.slice(0, 20));
console.log("\nH3:", h3s.slice(0, 30));

// section titles from nav
const nav = [...h.matchAll(/href="#([^"]+)"[^>]*>([^<]{3,40})</gi)];
console.log("\nNAV:", [...new Set(nav.map((m) => m[2]))].slice(0, 15));
