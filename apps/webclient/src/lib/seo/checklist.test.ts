import assert from "node:assert/strict";
import { test } from "node:test";

import { buildSeoChecklist } from "./checklist";

test("buildSeoChecklist scores complete SEO highly", () => {
  const result = buildSeoChecklist(
    {
      metaTitle: "VinFast VF 3 Cà Mau — Giá tốt",
      metaDescription:
        "Mua VinFast VF 3 tại Cà Mau với ưu đãi hấp dẫn, hỗ trợ trả góp và bảo hành chính hãng tại Vinfast 3S Cà Mau.",
      focusKeyword: "vf 3",
      ogImage: "/images/cars/vf3/hero.webp",
    },
    { path: "/oto/vf3", image: "/images/cars/vf3/hero.webp" },
  );
  assert.ok(result.score >= 70);
  assert.equal(result.optimized, true);
});

test("buildSeoChecklist fails when meta title and description missing", () => {
  const result = buildSeoChecklist({}, { title: "Fallback", description: "Short", path: "/" });
  assert.equal(result.optimized, false);
  assert.ok(result.items.some((item) => item.id === "meta-title" && item.status !== "pass"));
});
