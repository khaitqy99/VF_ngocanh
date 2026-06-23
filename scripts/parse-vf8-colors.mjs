const html = await (
  await fetch("https://shop.vinfastauto.com/vn_vi/car-vf8.html", {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
).text();

const products = [...html.matchAll(/reserves\/VF8\/exterior\/product-([^."']+)\.webp/g)].map((m) => m[1]);
console.log("product codes:", [...new Set(products)]);

for (const code of [...new Set(products)]) {
  const idx = html.indexOf(`product-${code}.webp`);
  console.log("\n---", code, "---\n", html.slice(idx - 300, idx + 200));
}

// vf5 main images
const vf5 = await (
  await fetch("https://shop.vinfastauto.com/vn_vi/dat-coc-xe-dien-vf5.html", {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
).text();
const mains = [...vf5.matchAll(/reserves\/VF5\/2025\/(?:sp\/)?Main[^"']*\.webp/g)].map((m) => m[0]);
console.log("\nVF5 mains:", [...new Set(mains)]);

const vf5colors = [...vf5.matchAll(/<li[^>]*data-id="([^"]+)"[^>]*>[\s\S]*?alt="([^"]+)"/gi)];
console.log("VF5 colors:");
for (const m of vf5colors) if (m[2].length < 40) console.log(m[1], m[2]);
