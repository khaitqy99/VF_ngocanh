import fs from "fs";

const urls = [
  "https://vinfastauto.com/themes/porto/css/homepage-v2.css",
  "https://vinfastauto.com/themes/porto/css/custom.css",
];

for (const url of urls) {
  const res = await fetch(url);
  const css = await res.text();
  const file = url.split("/").pop();
  fs.writeFileSync(`scripts/${file}`, css);
  const hits = css
    .split("}")
    .filter((chunk) => /battery|block-battery|mobile-charger|col-left|col-right/i.test(chunk));
  console.log(`\n=== ${file} (${hits.length} chunks) ===`);
  for (const chunk of hits.slice(0, 20)) {
    console.log(chunk.trim() + "}");
  }
}
