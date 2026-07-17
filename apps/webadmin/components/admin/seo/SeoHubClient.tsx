"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlobalSeoClient } from "@/components/admin/seo/GlobalSeoClient";
import { SeoStaticPagesSection } from "@/components/admin/seo/SeoStaticPagesSection";

type SeoHubTab = "global" | "products" | "pages" | "blog";

function parseTab(value: string | null): SeoHubTab {
  if (value === "products" || value === "pages" || value === "blog") return value;
  return "global";
}

const TAB_ITEMS: { value: SeoHubTab; label: string; hint: string }[] = [
  {
    value: "global",
    label: "Cài đặt chung",
    hint: "Title template, OG mặc định, Schema đại lý",
  },
  {
    value: "products",
    label: "Sản phẩm",
    hint: "SEO từng ô tô, xe máy, phụ kiện",
  },
  {
    value: "blog",
    label: "Blog / Tin tức",
    hint: "SEO từng bài viết tại /tin-tuc",
  },
  {
    value: "pages",
    label: "Trang tĩnh",
    hint: "Trang chủ, liên hệ, chính sách…",
  },
];

export function SeoHubClient({
  productsSection,
  blogSection,
}: {
  productsSection: React.ReactNode;
  blogSection: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<SeoHubTab>(() => parseTab(searchParams.get("tab")));

  const changeTab = useCallback(
    (next: SeoHubTab) => {
      setTab(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === "global") params.delete("tab");
      else params.set("tab", next);
      const query = params.toString();
      router.replace(query ? `/admin/seo?${query}` : "/admin/seo", { scroll: false });
    },
    [router, searchParams],
  );

  const activeHint = TAB_ITEMS.find((item) => item.value === tab)?.hint ?? "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO"
        description="Quản lý meta title, mô tả và Open Graph cho toàn site"
      />

      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
        {TAB_ITEMS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => changeTab(item.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-bold ${
              tab === item.value ? "bg-red-600 text-white" : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeHint ? <p className="-mt-2 text-sm text-zinc-500">{activeHint}</p> : null}

      {tab === "global" ? <GlobalSeoClient embedded /> : null}
      {tab === "products" ? productsSection : null}
      {tab === "blog" ? blogSection : null}
      {tab === "pages" ? <SeoStaticPagesSection /> : null}
    </div>
  );
}
