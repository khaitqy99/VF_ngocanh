import { renderArticleHtml } from "@/lib/cms/news-sanitize";

function ArticleBody({ body, bodyFormat }: { body: string; bodyFormat: "plain" | "html" }) {
  const html = renderArticleHtml({ body, bodyFormat });
  if (!html) return null;

  return (
    <div
      className="article-body space-y-4 text-base leading-8 text-zinc-700 [&_a]:text-red-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-200 [&_blockquote]:pl-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-4 [&_img]:rounded-2xl [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { ArticleBody };
