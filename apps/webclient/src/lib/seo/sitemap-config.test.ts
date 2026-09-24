import assert from "node:assert/strict";
import { test } from "node:test";

import { isSitemapExcluded } from "./sitemap-config";

test("isSitemapExcluded matches exact paths", () => {
  assert.equal(isSitemapExcluded("/phu-kien", ["/phu-kien"]), true);
  assert.equal(isSitemapExcluded("/oto", ["/phu-kien"]), false);
});

test("isSitemapExcluded supports prefix wildcard", () => {
  assert.equal(isSitemapExcluded("/tin-tuc/bai-cu-2024", ["/tin-tuc/bai-cu-*"]), true);
  assert.equal(isSitemapExcluded("/tin-tuc/moi", ["/tin-tuc/bai-cu-*"]), false);
  assert.equal(isSitemapExcluded("/phu-kien", ["/phu-kien/*"]), true);
});
