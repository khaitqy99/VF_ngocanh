import assert from "node:assert/strict";
import { test } from "node:test";

import {
  mergeSiteSeoSettings,
  parseSeoRecord,
  parseSiteSeoSettings,
  resolveSeoContent,
  seoToNextMetadata,
} from "./resolve";

test("parseSeoRecord accepts legacy title/description", () => {
  const seo = parseSeoRecord({ title: "VF 3", description: "Mini car" });
  assert.equal(seo.metaTitle, "VF 3");
  assert.equal(seo.metaDescription, "Mini car");
});

test("parseSeoRecord prefers metaTitle over legacy title", () => {
  const seo = parseSeoRecord({
    title: "Old",
    metaTitle: "New",
    description: "Old desc",
    metaDescription: "New desc",
  });
  assert.equal(seo.metaTitle, "New");
  assert.equal(seo.metaDescription, "New desc");
});

test("mergeSiteSeoSettings does not wipe defaults with undefined", () => {
  const parsed = parseSiteSeoSettings({
    robots: { index: true, follow: true },
    organization: { name: "Showroom" },
  });
  const merged = mergeSiteSeoSettings(parsed);
  assert.ok(merged.siteName);
  assert.ok(merged.defaultTitle);
  assert.ok(merged.titleTemplate);
  assert.equal(merged.organization?.name, "Showroom");
});

test("resolveSeoContent prefers site default OG over page title when ogTitle unset", () => {
  const resolved = resolveSeoContent(
    { metaTitle: "VF 3 custom", metaDescription: "Mô tả VF 3" },
    { title: "Fallback", description: "Fallback desc", path: "/oto/vf3" },
    {
      defaultOgTitle: "Global OG title",
      defaultOgDescription: "Global OG desc",
    },
  );
  assert.equal(resolved.title, "VF 3 custom");
  assert.equal(resolved.ogTitle, "Global OG title");
  assert.equal(resolved.ogDescription, "Global OG desc");
});

test("resolveSeoContent keeps explicit ogTitle when set", () => {
  const resolved = resolveSeoContent(
    {
      metaTitle: "Page title",
      ogTitle: "Social title",
      metaDescription: "Page desc",
      ogDescription: "Social desc",
    },
    { title: "Fallback", description: "Fallback desc", path: "/oto/vf3" },
  );
  assert.equal(resolved.ogTitle, "Social title");
  assert.equal(resolved.ogDescription, "Social desc");
});

test("seoToNextMetadata emits the product image as an absolute OG and Twitter URL", () => {
  const productImage = "/images/cars/vf3/hero.webp";
  const resolved = resolveSeoContent(
    { metaTitle: "VF 3", metaDescription: "Xe điện VF 3" },
    {
      title: "Fallback",
      description: "Fallback desc",
      image: productImage,
      path: "/oto/vf3",
    },
  );
  const metadata = seoToNextMetadata(resolved);
  const expected = `https://vinfast3scamau.com${productImage}`;
  const openGraphImages = metadata.openGraph?.images;
  const firstImage = Array.isArray(openGraphImages) ? openGraphImages[0] : openGraphImages;

  assert.equal(
    typeof firstImage === "object" && "url" in firstImage ? firstImage.url : firstImage,
    expected,
  );
  assert.deepEqual(metadata.twitter?.images, [expected]);
});

test("seoToNextMetadata preserves absolute Supabase product image URLs", () => {
  const productImage = "https://example.supabase.co/storage/v1/object/public/media/vf3.webp";
  const resolved = resolveSeoContent(
    {},
    {
      title: "VF 3",
      description: "Xe điện VF 3",
      image: productImage,
      path: "/oto/vf3",
    },
  );
  const metadata = seoToNextMetadata(resolved);
  const openGraphImages = metadata.openGraph?.images;
  const firstImage = Array.isArray(openGraphImages) ? openGraphImages[0] : openGraphImages;

  assert.equal(
    typeof firstImage === "object" && "url" in firstImage ? firstImage.url : firstImage,
    productImage,
  );
});
