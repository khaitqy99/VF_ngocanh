import { renderArticleHtml } from "@/lib/cms/news-sanitize";

function ArticleBody({ body, bodyFormat }: { body: string; bodyFormat: "plain" | "html" }) {
  const html = renderArticleHtml({ body, bodyFormat });
  if (!html) return null;

  return (
    <div
      className="article-body space-y-4 text-base leading-8 text-zinc-700 [&_a]:text-red-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:text-lg [&_h4]:font-semibold [&_hr]:my-6 [&_hr]:border-zinc-200 [&_hr.page-break]:my-10 [&_hr.page-break]:border-dashed [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-2xl [&_img]:my-6 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:max-w-full [&_img]:rounded-2xl [&_ol]:list-decimal [&_ol]:pl-6 [&_p:has(>img:only-child)]:my-0 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-zinc-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_s]:line-through [&_sub]:text-[0.75em] [&_sup]:text-[0.75em] [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-200 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_.vf-youtube-embed]:my-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { ArticleBody };
