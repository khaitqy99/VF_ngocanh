import Link from "next/link";
import { Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { STATIC_PAGE_SEO } from "@/lib/seo";

export function SeoStaticPagesSection() {
  return (
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
  );
}
