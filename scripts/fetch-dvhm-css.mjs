import fs from "fs";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
};

const cssUrls = [
  "https://vinfastauto.com/themes/porto/css/dvhm/dvhm-warranty.css",
  "https://vinfastauto.com/themes/porto/css/dvhm/dvhm-maintenance.css",
  "https://vinfastauto.com/themes/porto/css/dvhm/dvhm-repair.css",
];

for (const url of cssUrls) {
  const res = await fetch(url, { headers: HEADERS });
  const css = res.ok ? await res.text() : "";
  console.log(`\n=== ${res.status} ${url.split("/").pop()} ===`);
  if (!css) continue;
  const urls = [...new Set([...css.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)].map((m) => m[2]))];
  console.log(urls.filter((u) => /static-cms|homepage|service|baohanh|bao-hanh|dvhm/i.test(u)));
  fs.writeFileSync(`scripts/${url.split("/").pop()}`, css);
}
