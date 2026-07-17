import { Suspense } from "react";
import { NewsEditorClient } from "@/components/admin/NewsEditorClient";

export default function AdminNewPostPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Đang tải trình soạn thảo...</p>}>
      <NewsEditorClient />
    </Suspense>
  );
}
