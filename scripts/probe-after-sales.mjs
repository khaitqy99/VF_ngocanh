const urls = [
  "https://vinfastauto.com/vn_vi/dich-vu-hau-mai",
  "https://vinfastauto.com/vn_vi/dich-vu-hau-mai/bao-hanh-va-bao-duong",
  "https://vinfastauto.com/vn_vi/dat-lich-dich-vu",
];

const headers = {
  "User-Agent": "Mozilla/5.0 Chrome/120",
  Accept: "text/html",
};

for (const url of urls) {
  const res = await fetch(url, { headers });
  console.log("\n===", url, res.status);
  if (!res.ok) continue;
  const html = await res.text();
  const blocks = [...html.matchAll(/id="(block-[^"]+)"/g)].map((m) => m[1]);
  console.log("blocks:", [...new Set(blocks)].filter((b) => /banner|hero|service/i.test(b)).slice(0, 15));
  const imgs = [
    ...new Set(
      (html.match(/https:\/\/static-cms-prod[^\"'\s>]+\.(jpg|webp|png)/gi) || []).concat(
        html.match(/https:\/\/storage\.googleapis\.com[^\"'\s>]+\.(jpg|webp|png)/gi) || [],
      ),
    ),
  ];
  console.log("cms imgs:", imgs.slice(0, 8));
  const og = html.match(/property="og:image"[^>]*content="([^"]+)"/)?.[1];
  if (og) console.log("og:", og);
}
