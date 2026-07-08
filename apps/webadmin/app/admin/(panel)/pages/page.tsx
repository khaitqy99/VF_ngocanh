import Link from "next/link";
import { FileText, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { STATIC_PAGE_META, STATIC_PAGE_SLUGS } from "@/lib/cms/static-pages";

export default function PagesHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nội dung trang"
        description="Chỉnh sửa nội dung các trang dịch vụ và giới thiệu trên website"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATIC_PAGE_SLUGS.map((slug) => {
          const page = STATIC_PAGE_META[slug];
          return (
            <Link key={slug} href={`/admin/pages/${slug}`}>
              <Card className="h-full transition hover:border-red-200 hover:shadow-sm">
                <CardContent className="p-4">
                  <p className="flex items-center gap-2 font-medium text-zinc-900">
                    <FileText className="h-4 w-4 text-red-600" />
                    {page.label}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                    <Globe className="h-3 w-3" />
                    {page.path}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
