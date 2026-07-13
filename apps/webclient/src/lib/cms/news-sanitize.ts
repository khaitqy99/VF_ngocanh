const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
]);

function stripDangerousAttributes(html: string): string {
  return html
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function sanitizeArticleHtml(html: string): string {
  if (!html.trim()) return "";

  const withSafeAttrs = stripDangerousAttributes(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");

  return withSafeAttrs.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tag: string) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";
    if (match.startsWith("</")) return `</${lower}>`;

    if (lower === "a") {
      const hrefMatch = match.match(/\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = hrefMatch?.[2] ?? hrefMatch?.[3] ?? hrefMatch?.[4] ?? "#";
      const safeHref = href.startsWith("/") || href.startsWith("http") ? href : "#";
      return `<a href="${safeHref}" rel="noopener noreferrer" target="_blank">`;
    }

    if (lower === "img") {
      const srcMatch = match.match(/\ssrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const altMatch = match.match(/\salt\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const src = srcMatch?.[2] ?? srcMatch?.[3] ?? srcMatch?.[4] ?? "";
      const alt = altMatch?.[2] ?? altMatch?.[3] ?? altMatch?.[4] ?? "";
      if (!src.startsWith("/") && !src.startsWith("http")) return "";
      return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }

    return `<${lower}>`;
  });
}

export function plainTextToHtml(body: string): string {
  return body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function renderArticleHtml(article: {
  body: string | null;
  bodyFormat: "plain" | "html";
}): string {
  if (!article.body?.trim()) return "";
  if (article.bodyFormat === "html") return sanitizeArticleHtml(article.body);
  return sanitizeArticleHtml(plainTextToHtml(article.body));
}
