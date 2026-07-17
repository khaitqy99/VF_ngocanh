import { Suspense } from "react";
import { NewsEditorClient } from "@/components/admin/NewsEditorClient";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Đang tải bài viết...</p>}>
      <NewsEditorClient articleId={id} />
    </Suspense>
  );
}
