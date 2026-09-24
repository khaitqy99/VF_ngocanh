import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT, "README.md");
const OUT_DOCX = path.join(
  ROOT,
  process.env.DOCX_OUT || "Huong-dan-Admin-CMS-VinFast-Ngoc-Anh.docx",
);
const OUT_HTML = path.join(ROOT, "Huong-dan-Admin-CMS-VinFast-Ngoc-Anh.html");

const RED = "C8102E";
const ZINC = "52525B";

function parseInline(text) {
  const runs = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), size: 22, font: "Calibri" }));
    }
    const raw = m[0];
    if (raw.startsWith("**")) {
      runs.push(
        new TextRun({
          text: raw.slice(2, -2),
          bold: true,
          size: 22,
          font: "Calibri",
        }),
      );
    } else {
      runs.push(
        new TextRun({
          text: raw.slice(1, -1),
          size: 20,
          font: "Consolas",
          color: "3F3F46",
        }),
      );
    }
    last = m.index + raw.length;
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), size: 22, font: "Calibri" }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text: text || " ", size: 22, font: "Calibri" }));
  }
  return runs;
}

function imageBuffer(rel) {
  const p = path.join(ROOT, rel.replace(/^\.\//, ""));
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p);
}

function makeTable(rows) {
  const colCount = rows[0]?.length ?? 2;
  const totalWidth = 9000;
  const colW = Math.floor(totalWidth / colCount);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    rows: rows.map((cols, ri) => {
      const isHeader = ri === 0;
      return new TableRow({
        children: cols.map(
          (cell) =>
            new TableCell({
              width: { size: colW, type: WidthType.DXA },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: "E4E4E7" },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: "E4E4E7" },
                left: { style: BorderStyle.SINGLE, size: 4, color: "E4E4E7" },
                right: { style: BorderStyle.SINGLE, size: 4, color: "E4E4E7" },
              },
              shading: isHeader ? { fill: "FEF2F2" } : undefined,
              children: [
                new Paragraph({
                  children: parseInline(cell.trim()),
                  spacing: { before: 60, after: 60 },
                }),
              ],
            }),
        ),
      });
    }),
  });
}

function buildDocxChildren(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const children = [];
  let i = 0;
  let skipToc = false;

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "VINFAST NGỌC ANH CÀ MAU",
          bold: true,
          size: 28,
          color: RED,
          font: "Calibri",
        }),
      ],
    }),
  );

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "---") {
      i++;
      continue;
    }

    // Skip mục lục section body (keep heading briefly or skip all)
    if (line.startsWith("## Mục lục")) {
      skipToc = true;
      i++;
      continue;
    }
    if (skipToc) {
      if (line.startsWith("## ")) {
        skipToc = false;
      } else {
        i++;
        continue;
      }
    }

    // Skip file tree at end
    if (line.startsWith("## Cấu trúc file tài liệu")) {
      break;
    }

    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (img) {
      const buf = imageBuffer(img[2]);
      if (buf) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 80 },
            children: [
              new ImageRun({
                type: "png",
                data: buf,
                transformation: { width: 520, height: 310 },
                altText: { title: img[1], description: img[1], name: img[1] },
              }),
            ],
          }),
        );
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: img[1],
                italics: true,
                size: 18,
                color: ZINC,
                font: "Calibri",
              }),
            ],
          }),
        );
      }
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.TITLE,
          spacing: { before: 0, after: 200 },
          children: [
            new TextRun({
              text: line.slice(2).trim(),
              bold: true,
              size: 36,
              color: "18181B",
              font: "Calibri",
            }),
          ],
        }),
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 360, after: 160 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 4 },
          },
          children: [
            new TextRun({
              text: line.slice(3).trim(),
              bold: true,
              size: 28,
              color: RED,
              font: "Calibri",
            }),
          ],
        }),
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 100 },
          children: [
            new TextRun({
              text: line.slice(4).trim(),
              bold: true,
              size: 24,
              color: "27272A",
              font: "Calibri",
            }),
          ],
        }),
      );
      i++;
      continue;
    }

    // Table
    if (line.trim().startsWith("|") && lines[i + 1]?.trim().match(/^\|[-|: ]+\|$/)) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const raw = lines[i].trim();
        if (!raw.match(/^\|[-|: ]+\|$/)) {
          const cells = raw
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim());
          rows.push(cells);
        }
        i++;
      }
      if (rows.length) {
        children.push(makeTable(rows));
        children.push(new Paragraph({ children: [] }));
      }
      continue;
    }

    // Code fence — skip simple
    if (line.trim().startsWith("```")) {
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) i++;
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          indent: { left: 360 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 24, color: RED, space: 8 },
          },
          children: parseInline(line.slice(2).trim()),
        }),
      );
      i++;
      continue;
    }

    // Ordered list
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: `${ol[1]}. `, size: 22, font: "Calibri", bold: true }),
            ...parseInline(ol[2]),
          ],
        }),
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*]\s+/)) {
      const text = line.replace(/^[-*]\s+/, "");
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: "• ", size: 22, font: "Calibri", color: RED }),
            ...parseInline(text),
          ],
        }),
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    children.push(
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: parseInline(line.trim()),
      }),
    );
    i++;
  }

  children.push(
    new Paragraph({
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: "Cập nhật theo bản admin hiện tại (tháng 09/2026).",
          italics: true,
          size: 18,
          color: ZINC,
          font: "Calibri",
        }),
      ],
    }),
  );

  return children;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineHtml(text) {
  let t = escapeHtml(text);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  return t;
}

function buildHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = [];
  let i = 0;
  let skipToc = false;
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "---") {
      i++;
      continue;
    }
    if (line.startsWith("## Mục lục")) {
      skipToc = true;
      i++;
      continue;
    }
    if (skipToc) {
      if (line.startsWith("## ")) skipToc = false;
      else {
        i++;
        continue;
      }
    }
    if (line.startsWith("## Cấu trúc file tài liệu")) break;

    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (img) {
      closeLists();
      const src = path.join(ROOT, img[2]).replace(/\\/g, "/");
      // embed as file:// for local print, also try relative
      html.push(
        `<figure><img src="${escapeHtml(img[2])}" alt="${escapeHtml(img[1])}" /><figcaption>${escapeHtml(img[1])}</figcaption></figure>`,
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      closeLists();
      html.push(`<h1>${inlineHtml(line.slice(2).trim())}</h1>`);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      closeLists();
      html.push(`<h2>${inlineHtml(line.slice(3).trim())}</h2>`);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      closeLists();
      html.push(`<h3>${inlineHtml(line.slice(4).trim())}</h3>`);
      i++;
      continue;
    }

    if (line.trim().startsWith("|") && lines[i + 1]?.trim().match(/^\|[-|: ]+\|$/)) {
      closeLists();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const raw = lines[i].trim();
        if (!raw.match(/^\|[-|: ]+\|$/)) {
          rows.push(
            raw
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((c) => c.trim()),
          );
        }
        i++;
      }
      html.push("<table>");
      rows.forEach((cols, ri) => {
        const tag = ri === 0 ? "th" : "td";
        html.push(
          `<tr>${cols.map((c) => `<${tag}>${inlineHtml(c)}</${tag}>`).join("")}</tr>`,
        );
      });
      html.push("</table>");
      continue;
    }

    if (line.trim().startsWith("```")) {
      closeLists();
      i++;
      const code = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(escapeHtml(lines[i]));
        i++;
      }
      i++;
      html.push(`<pre><code>${code.join("\n")}</code></pre>`);
      continue;
    }

    if (line.startsWith("> ")) {
      closeLists();
      html.push(`<blockquote>${inlineHtml(line.slice(2).trim())}</blockquote>`);
      i++;
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${inlineHtml(ol[1])}</li>`);
      i++;
      continue;
    }

    if (line.match(/^[-*]\s+/)) {
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        html.push("<ul>");
        inUl = true;
      }
      html.push(`<li>${inlineHtml(line.replace(/^[-*]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    if (line.trim() === "") {
      closeLists();
      i++;
      continue;
    }

    closeLists();
    html.push(`<p>${inlineHtml(line.trim())}</p>`);
    i++;
  }
  closeLists();

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>Hướng dẫn Admin CMS — VinFast Ngọc Anh Cà Mau</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", Calibri, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #18181b;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
  }
  h1 { font-size: 22pt; margin: 0 0 12px; color: #18181b; }
  h2 {
    font-size: 15pt;
    color: #c8102e;
    border-bottom: 2px solid #c8102e;
    padding-bottom: 4px;
    margin: 28px 0 12px;
    page-break-after: avoid;
  }
  h3 { font-size: 12.5pt; margin: 18px 0 8px; color: #27272a; page-break-after: avoid; }
  p { margin: 8px 0; }
  ul, ol { margin: 8px 0; padding-left: 22px; }
  li { margin: 3px 0; }
  code {
    font-family: Consolas, "Courier New", monospace;
    font-size: 0.92em;
    background: #f4f4f5;
    padding: 1px 5px;
    border-radius: 3px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
  }
  th, td {
    border: 1px solid #e4e4e7;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
  }
  th { background: #fef2f2; }
  blockquote {
    margin: 10px 0;
    padding: 8px 12px;
    border-left: 4px solid #c8102e;
    background: #fafafa;
    color: #3f3f46;
  }
  figure {
    margin: 14px 0;
    text-align: center;
    page-break-inside: avoid;
  }
  figure img {
    max-width: 100%;
    height: auto;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
  }
  figcaption {
    font-size: 9pt;
    color: #71717a;
    font-style: italic;
    margin-top: 6px;
  }
  .brand {
    text-align: center;
    color: #c8102e;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }
  @media print {
    body { padding: 0; }
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>
<body>
<div class="brand">VINFAST NGỌC ANH CÀ MAU</div>
${html.join("\n")}
<p style="margin-top:32px;font-size:9pt;color:#71717a;font-style:italic">Cập nhật theo bản admin hiện tại (tháng 09/2026).</p>
</body>
</html>`;
}

async function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");

  const doc = new Document({
    creator: "VinFast Ngọc Anh Cà Mau",
    title: "Hướng dẫn sử dụng Admin CMS",
    description: "Tài liệu hướng dẫn vận hành webadmin",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Hướng dẫn Admin CMS — VinFast Ngọc Anh Cà Mau",
                    size: 16,
                    color: ZINC,
                    font: "Calibri",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Trang ", size: 16, color: ZINC, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: ZINC, font: "Calibri" }),
                  new TextRun({ text: " / ", size: 16, color: ZINC, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: ZINC, font: "Calibri" }),
                ],
              }),
            ],
          }),
        },
        children: buildDocxChildren(md),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_DOCX, buffer);
  console.log("Wrote", OUT_DOCX);

  const html = buildHtml(md);
  fs.writeFileSync(OUT_HTML, html, "utf8");
  console.log("Wrote", OUT_HTML);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
