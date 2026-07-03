import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdp = JSON.parse(fs.readFileSync(path.join(__dirname, "vinfast-pdp-urls.json"), "utf8"));

async function probe(id, url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", Referer: "https://shop.vinfastauto.com/" },
    });
    const html = await res.text();
    const has360 = html.includes("cloudimage-360");
    const template = html.match(/data-folder-template="([^"]+)"/)?.[1];
    const folder = html.match(/data-folder="([^"]+)"/)?.[1];
    const colors = [];
    const liRe = /<li[^>]*data-id="([^"]+)"[^>]*>[\s\S]*?alt="([^"]+)"/gi;
    let m;
    while ((m = liRe.exec(html)) !== null) {
      if (m[2].length < 50 && /[A-Za-z]/.test(m[2])) colors.push({ id: m[1], name: m[2] });
    }
    const vf8 = [...html.matchAll(/data-variant-label:([^,\s]+)/g)].map((x) => x[1]);
    console.log(
      id,
      res.status,
      has360 ? "360" : "-",
      colors.length,
      template?.slice(-40) ?? "",
      vf8.length ? `vf8:${vf8.length}` : "",
    );
    return { id, url, template, folder, colors, html: has360 ? html : null };
  } catch (e) {
    console.log(id, "ERR", e.message);
    return null;
  }
}

const results = {};
for (const [id, url] of Object.entries(pdp.cars)) {
  const r = await probe(id, url);
  if (r?.colors?.length) results[id] = r;
}
fs.writeFileSync(
  path.join(__dirname, "vinfast-color-probe.json"),
  JSON.stringify(results, null, 2),
);
console.log("saved", Object.keys(results).length, "models with colors");
