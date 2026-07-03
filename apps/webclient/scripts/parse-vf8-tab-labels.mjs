const html = await (
  await fetch("https://shop.vinfastauto.com/vn_vi/car-vf8.html", {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
).text();

const tabs = [...html.matchAll(/id="colorExterior([^"]+)-tab"[^>]*>[\s\S]*?<\/button>/gi)];
for (const m of tabs) {
  const id = m[1];
  const label = m[0]
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const img = html.match(new RegExp(`colorExterior${id}[^]*?product-([^."']+)\\.webp`))?.[1];
  console.log(id, "|", label.slice(-60), "|", img);
}

const imgRe = /reserves\/(VF\d[^/]*)\/exterior\/product-([^."']+)\.webp/g;
const byModel = {};
let m;
while ((m = imgRe.exec(html)) !== null) {
  byModel[m[1]] ??= [];
  byModel[m[1]].push(m[2]);
}
console.log("\nmodels", byModel);
