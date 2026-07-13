import { NewsEditorClient } from "@/components/admin/NewsEditorClient";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsEditorClient articleId={id} />;
}
