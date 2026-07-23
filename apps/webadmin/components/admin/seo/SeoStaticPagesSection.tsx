import Link from "next/link";
import { Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { STATIC_PAGE_SEO, type StaticPageSeoDefinition } from "@/lib/seo";

const GROUP_LABELS: Record<StaticPageSeoDefinition["group"], string> = {
  core: "Trang chính",
  catalog: "Danh mục sản phẩm",
  service: "Dịch vụ",
  legal: "Pháp lý",
};

const GROUP_ORDER: StaticPageSeoDefinition["group"][] = ["core", "catalog", "service", "legal"];

export function SeoStaticPagesSection() {
  return (
    <div className="space-y-6">
      {GROUP_ORDER.map((group) => {
        const pages = STATIC_PAGE_SEO.filter((page) => page.group === group);
        if (pages.length === 0) return null;
        return (
          <div key={group}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {GROUP_LABELS[group]}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <Link key={page.slug} href={`/admin/seo/pages/${page.slug}`}>
                  <Card className="h-full transition hover:border-red-200 hover:shadow-sm">
                    <CardContent className="p-4">
                      <p className="font-medium text-zinc-900">{page.label}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                        <Globe className="h-3 w-3" />
                        {page.path}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
