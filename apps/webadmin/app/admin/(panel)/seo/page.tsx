import { Suspense } from "react";
import { SeoHubClient } from "@/components/admin/seo/SeoHubClient";
import { SeoProductsSection } from "@/components/admin/seo/SeoProductsSection";

function ProductsTabFallback() {
  return <p className="text-sm text-zinc-500">Đang tải danh sách sản phẩm…</p>;
}

function SeoHubFallback() {
  return <p className="p-6 text-sm text-zinc-500">Đang tải SEO…</p>;
}

export default function SeoHubPage() {
  return (
    <Suspense fallback={<SeoHubFallback />}>
      <SeoHubClient
        productsSection={
          <Suspense fallback={<ProductsTabFallback />}>
            <SeoProductsSection />
          </Suspense>
        }
      />
    </Suspense>
  );
}
