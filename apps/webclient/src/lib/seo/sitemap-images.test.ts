import assert from "node:assert/strict";
import { test } from "node:test";

import { collectSitemapImages, absoluteSiteAssetUrl } from "./sitemap-images";
import { renderImageSitemapXml, type SitemapEntryData } from "./build-sitemap";
import { PRODUCTION_SITE_URL } from "./types";

test("absoluteSiteAssetUrl prefixes relative paths", () => {
  assert.equal(absoluteSiteAssetUrl("/images/a.webp"), `${PRODUCTION_SITE_URL}/images/a.webp`);
  assert.equal(
    absoluteSiteAssetUrl("https://cdn.example.com/a.webp"),
    "https://cdn.example.com/a.webp",
  );
});

test("collectSitemapImages dedupes and skips empty", () => {
  const images = collectSitemapImages("/a.webp", null, "/a.webp", "https://cdn.example.com/b.webp");
  assert.deepEqual(images, [`${PRODUCTION_SITE_URL}/a.webp`, "https://cdn.example.com/b.webp"]);
});

test("renderImageSitemapXml emits Google image namespace", () => {
  const entries: SitemapEntryData[] = [
    {
      path: "/oto/vf3",
      url: `${PRODUCTION_SITE_URL}/oto/vf3`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${PRODUCTION_SITE_URL}/images/vf3.webp`],
    },
  ];
  const xml = renderImageSitemapXml(entries);
  assert.match(xml, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.match(xml, /<image:loc>https:\/\/vinfast3scamau\.com\/images\/vf3\.webp<\/image:loc>/);
  assert.match(xml, /<loc>https:\/\/vinfast3scamau\.com\/oto\/vf3<\/loc>/);
});
