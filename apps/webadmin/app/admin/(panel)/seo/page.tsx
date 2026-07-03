import Link from "next/link";
import { Globe, FileText, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { STATIC_PAGE_SEO } from "@/lib/seo";

export default function SeoHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO"
        description="Quản lý meta title, mô tả, Open Graph, robots và canonical cho toàn site"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/seo/global">
          <Card className="transition hover:border-red-200 hover:shadow-md">
            <CardContent className="flex items-start gap-3 p-5">
              <Settings className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-zinc-900">Cài đặt chung</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Title template, OG mặc định, thông tin đại lý (Schema)
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <FileText className="h-4 w-4" />
          Trang tĩnh
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATIC_PAGE_SEO.map((page) => (
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

      <p className="text-sm text-zinc-500">
        SEO từng sản phẩm: mở trang sửa ô tô / xe máy / phụ kiện → tab <strong>SEO</strong>.
      </p>
    </div>
  );
}
