const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "hr",
  "span",
  "sub",
  "sup",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "colgroup",
  "col",
  "div",
  "iframe",
]);

const SAFE_STYLE_PROPS = new Set([
  "color",
  "text-align",
  "font-size",
  "font-family",
  "background-color",
  "margin-left",
]);

const SAFE_FONT_FAMILIES = new Set([
  "arial, helvetica, sans-serif",
  '"times new roman", times, serif',
  "georgia, serif",
  "verdana, geneva, sans-serif",
  "tahoma, sans-serif",
  '"courier new", courier, monospace',
]);

function isSafeColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    /^#[0-9a-f]{3,8}$/i.test(v) ||
    /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(v) ||
    /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/i.test(v) ||
    /^(black|white|red|blue|green|orange|purple|gray|grey|zinc|inherit|currentcolor)$/i.test(v)
  );
}

function isSafeTextAlign(value: string): boolean {
  return /^(left|center|right|justify)$/i.test(value.trim());
}

function isSafeFontSize(value: string): boolean {
  const match = value
    .trim()
    .toLowerCase()
    .match(/^(\d{1,3}(?:\.\d+)?)(px|pt|rem|em)$/);
  if (!match) return false;
  const n = Number(match[1]);
  if (match[2] === "px" || match[2] === "pt") return n >= 8 && n <= 72;
  return n >= 0.5 && n <= 4.5;
}

function normalizeFontFamily(value: string): string {
  return value.trim().toLowerCase().replace(/\s+,/g, ",").replace(/,\s+/g, ", ");
}

function isSafeFontFamily(value: string): boolean {
  return SAFE_FONT_FAMILIES.has(normalizeFontFamily(value));
}

function isSafeMarginLeft(value: string): boolean {
  const match = value
    .trim()
    .toLowerCase()
    .match(/^(\d{1,3})px$/);
  if (!match) return false;
  const n = Number(match[1]);
  return n >= 0 && n <= 192 && n % 24 === 0;
}

function sanitizeStyleAttribute(raw: string): string | null {
  const cleaned = raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => {
      const colon = part.indexOf(":");
      if (colon <= 0) return [];
      const prop = part.slice(0, colon).trim().toLowerCase();
      const value = part.slice(colon + 1).trim();
      if (!SAFE_STYLE_PROPS.has(prop) || !value || /expression|url\s*\(|javascript:/i.test(value)) {
        return [];
      }
      if ((prop === "color" || prop === "background-color") && !isSafeColor(value)) return [];
      if (prop === "text-align" && !isSafeTextAlign(value)) return [];
      if (prop === "font-size" && !isSafeFontSize(value)) return [];
      if (prop === "font-family" && !isSafeFontFamily(value)) return [];
      if (prop === "margin-left" && !isSafeMarginLeft(value)) return [];
      return [`${prop}: ${value}`];
    });

  return cleaned.length ? cleaned.join("; ") : null;
}

function stripDangerousAttributes(html: string): string {
  return html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/javascript:/gi, "");
}

function attrValue(attrs: string, name: string): string {
  const match = attrs.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match?.[2] ?? match?.[3] ?? match?.[4] ?? "";
}

function isSafeYoutubeEmbed(src: string): boolean {
  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "youtube.com" && host !== "youtube-nocookie.com") return false;
    return url.pathname.startsWith("/embed/");
  } catch {
    return false;
  }
}

function sanitizeSpanInteger(value: string, max = 20): string | null {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1 || n > max) return null;
  return String(n);
}

export function sanitizeArticleHtml(html: string): string {
  if (!html.trim()) return "";

  const withSafeAttrs = stripDangerousAttributes(html).replace(
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    "",
  );

  return withSafeAttrs.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tag: string, attrs: string) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";
    if (match.startsWith("</")) return `</${lower}>`;

    if (lower === "a") {
      const href = attrValue(attrs, "href") || "#";
      const safeHref = href.startsWith("/") || href.startsWith("http") ? href : "#";
      return `<a href="${safeHref}" rel="noopener noreferrer" target="_blank">`;
    }

    if (lower === "img") {
      const src = attrValue(attrs, "src");
      const alt = attrValue(attrs, "alt");
      if (!src.startsWith("/") && !src.startsWith("http")) return "";
      return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }

    if (lower === "iframe") {
      const src = attrValue(attrs, "src");
      if (!isSafeYoutubeEmbed(src)) return "";
      return `<iframe src="${src}" title="YouTube video" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`;
    }

    if (lower === "div") {
      const hasYoutube = /\sdata-youtube-video(\s|=|>|$)/i.test(attrs);
      const className = attrValue(attrs, "class");
      if (hasYoutube || className.includes("vf-youtube-embed")) {
        return `<div class="vf-youtube-embed" data-youtube-video>`;
      }
      return "";
    }

    if (lower === "hr") {
      const className = attrValue(attrs, "class");
      const pageBreak =
        className.includes("page-break") || /\sdata-page-break(\s|=|>|$)/i.test(attrs);
      return pageBreak ? `<hr class="page-break" data-page-break="true" />` : "<hr />";
    }

    if (lower === "th" || lower === "td") {
      const colspan = sanitizeSpanInteger(attrValue(attrs, "colspan"));
      const rowspan = sanitizeSpanInteger(attrValue(attrs, "rowspan"));
      const parts = [`<${lower}`];
      if (colspan) parts.push(`colspan="${colspan}"`);
      if (rowspan) parts.push(`rowspan="${rowspan}"`);
      return `${parts.join(" ")}>`;
    }

    if (lower === "col") {
      const span = sanitizeSpanInteger(attrValue(attrs, "span"));
      return span ? `<col span="${span}" />` : "<col />";
    }

    const styleMatch = attrs.match(/\sstyle\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const rawStyle = styleMatch?.[2] ?? styleMatch?.[3] ?? styleMatch?.[4] ?? "";
    const safeStyle = rawStyle ? sanitizeStyleAttribute(rawStyle) : null;
    const indentAttr = attrValue(attrs, "data-indent");
    const indent = sanitizeSpanInteger(indentAttr, 8);

    if (lower === "span") {
      return safeStyle ? `<span style="${safeStyle}">` : "<span>";
    }

    if (lower === "p" || lower.startsWith("h")) {
      const parts = [`<${lower}`];
      if (indent) parts.push(`data-indent="${indent}"`);
      if (safeStyle) parts.push(`style="${safeStyle}"`);
      else if (indent) parts.push(`style="margin-left: ${Number(indent) * 24}px"`);
      return `${parts.join(" ")}>`;
    }

    if (lower === "table") {
      return `<table class="vf-article-table">`;
    }

    if (lower === "pre" || lower === "code") {
      return `<${lower}>`;
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
