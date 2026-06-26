/** Parse VinFast brochure PDF text into detail-page marketing content */

const NOISE_RE =
  /^\*+.*hình ảnh|phiên bản cho thị trường|chỉ mang tính chất minh họa|\d+\s*\|\s*VinFast$|^--\s*\d+|^\d+\s+of\s+\d+|vinfastauto\.com|1900\s*23\s*23\s*89|thông số kỹ thuật có thể thay đổi/i;

const SECTION_RULES = [
  { key: "exterior", re: /cảm hứng thiết kế|ngoại thất|diện mạo|thiết kế ngoại|đường nét|dải đèn|cản trước|nóc xe/i },
  { key: "interior", re: /nội thất|buồng lái|hàng ghế|không gian rộng|tiện nghi|ghế ngồi/i },
  {
    key: "technology",
    re: /công nghệ|thông minh|trợ lái|trợ lý ảo|phần mềm|giải trí|điều khiển xe|kết nối/i,
  },
  {
    key: "performance",
    re: /hiệu suất|vận hành|quãng đường|mô men|công suất|tăng tốc|mạnh mẽ|pin|sạc đầy/i,
  },
  { key: "safety", re: /an toàn|adas|túi khí|bảo vệ|phanh|cảnh báo/i },
];

function cleanLines(text) {
  return String(text)
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l && l.length > 1 && !NOISE_RE.test(l));
}

function toParagraphs(lines) {
  const paragraphs = [];
  let buf = [];
  for (const line of lines) {
    if (/^KÍCH THƯỚC|^THÔNG SỐ|^PIN$|^PHANH$|^TẢI TRỌNG|^XE$/i.test(line)) break;
    if (/^\d+\s+of\s+\d+$/.test(line) || /^--/.test(line)) {
      if (buf.length) paragraphs.push(buf.join(" "));
      buf = [];
      continue;
    }
    if (line.length < 50 && buf.length && buf[buf.length - 1].length < 50) {
      buf.push(line);
    } else if (line.length < 45 && !/[.!?]$/.test(line) && line.split(" ").length <= 6) {
      if (buf.length) paragraphs.push(buf.join(" "));
      buf = [line];
    } else {
      if (buf.length) paragraphs.push(buf.join(" "));
      buf = [line];
    }
  }
  if (buf.length) paragraphs.push(buf.join(" "));
  return paragraphs.filter((p) => p.length >= 20 && !NOISE_RE.test(p));
}

function classifySection(text) {
  for (const { key, re } of SECTION_RULES) {
    if (re.test(text)) return key;
  }
  return null;
}

function splitTitleDesc(paragraph) {
  const sentences = paragraph.split(/(?<=[.!?])\s+/);
  if (sentences.length >= 2 && sentences[0].length <= 90) {
    return { title: sentences[0].replace(/\.$/, ""), desc: sentences.slice(1).join(" ") };
  }
  if (paragraph.length > 100) {
    const words = paragraph.split(" ");
    const mid = Math.min(8, Math.floor(words.length / 3));
    return {
      title: words.slice(0, mid).join(" "),
      desc: words.slice(mid).join(" "),
    };
  }
  return { title: paragraph.slice(0, 80), desc: paragraph };
}

function featureFromParagraph(paragraph, defaultTitle) {
  if (!paragraph || paragraph.length < 30) return null;
  const { title, desc } = splitTitleDesc(paragraph);
  if (!desc || desc.length < 25) return null;
  if (title === desc || title.length > 90) return null;
  if (/^\d+\s+of\s+\d+/.test(title)) return null;
  return {
    title: (title || defaultTitle).slice(0, 100),
    desc: desc.slice(0, 500),
  };
}

function extractHighlights(text, name) {
  const highlights = [];
  const patterns = [
    /Quãng đường[^.]{0,30}\d+[\d.,]*\s*km/gi,
    /Công suất[^.]{0,25}\d+[\d.,]*\s*(hp|kW|W)/gi,
    /Mô[\s-]?men[^.]{0,25}\d+[\d.,]*\s*Nm/gi,
    /Tốc độ tối đa[^.]{0,20}\d+\s*km\/h/gi,
    /Dung lượng pin[^.]{0,25}[\d.,]+\s*kWh/gi,
    /Thời gian nạp[^.]{0,40}\d+[^.]{0,20}phút/gi,
    /\d+\s*túi khí/gi,
  ];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      const h = m[0].replace(/\s+/g, " ").trim();
      if (h.length < 80) highlights.push(h);
    }
  }
  return [...new Set(highlights)].slice(0, 5);
}

function extractHero(lines, name) {
  const early = lines.slice(0, 50).filter((l) => l.length > 3 && l.length < 120);
  const taglineParts = [];
  for (const line of early) {
    if (/^SỰ LỰA CHỌN|^Bản lĩnh|^Mẫu SUV|^KHỞI NGHIỆP|^ĐỘC ĐÁO/i.test(line)) {
      taglineParts.push(line);
      if (taglineParts.length >= 2) break;
    }
  }
  const tagline = taglineParts.join(" — ").slice(0, 100) || name;

  const slogan =
    lines.find(
      (l) =>
        l.length > 80 &&
        l.length < 320 &&
        (/[.!?]$/.test(l) || /VinFast/i.test(l)) &&
        new RegExp(name.replace(/\s+/g, "\\s*"), "i").test(l),
    ) ??
    lines.find((l) => l.length > 100 && l.length < 300 && /[.!?]$/.test(l)) ??
    "";

  return { tagline, slogan: slogan.slice(0, 280) };
}

/**
 * @param {string} text - raw PDF text
 * @param {string} name - vehicle display name
 */
export function parseBrochureContent(text, name) {
  if (!text || text.replace(/\s/g, "").length < 400) return null;

  const lines = cleanLines(text);
  const paragraphs = toParagraphs(lines);
  const hero = extractHero(lines, name);
  const highlights = extractHighlights(text, name);

  const sections = { exterior: [], interior: [], technology: [], performance: [], safety: [] };
  let currentSection = "exterior";

  for (const p of paragraphs) {
    const detected = classifySection(p);
    if (detected) {
      currentSection = detected;
      const feature = featureFromParagraph(p, p.split(/[.!?]/)[0].slice(0, 80));
      if (feature && feature.desc.length > 30) sections[currentSection].push(feature);
      continue;
    }
    const feature = featureFromParagraph(p);
    if (feature && feature.desc.length > 35) {
      sections[currentSection].push(feature);
    }
  }

  // Dedupe sections
  for (const key of Object.keys(sections)) {
    const seen = new Set();
    sections[key] = sections[key]
      .filter((f) => {
        const k = f.title.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 6);
  }

  const overviewBullets =
    highlights.length > 0
      ? highlights
      : paragraphs
          .filter((p) => /\d/.test(p) && p.length < 100)
          .slice(0, 4);

  const performance =
    sections.performance.length > 0
      ? {
          title: "HIỆU SUẤT VƯỢT TRỘI",
          subtitle: sections.performance[0]?.desc?.slice(0, 220) || hero.slogan,
          features: sections.performance
            .filter((f) => f?.title && f?.desc)
            .slice(0, 4)
            .map((f) => ({
              title: f.title,
              desc: f.desc.slice(0, 220),
            })),
        }
      : null;

  const safety =
    sections.safety.length > 0
      ? {
          title: "AN TOÀN VƯỢT TRỘI",
          subtitle: sections.safety[0]?.desc?.slice(0, 200) || "",
          features: sections.safety.slice(0, 6),
          highlights: highlights.filter((h) => /túi khí|an toàn/i.test(h)),
        }
      : null;

  const hasContent =
    hero.tagline ||
    sections.exterior.length ||
    sections.interior.length ||
    sections.technology.length ||
    overviewBullets.length;

  if (!hasContent) return null;

  return {
    tagline: hero.tagline,
    slogan: hero.slogan,
    overview: {
      title: hero.tagline || name,
      subtitle: hero.slogan || "",
      bullets: overviewBullets,
    },
    exterior: sections.exterior.length ? sections.exterior : undefined,
    interior: sections.interior.length ? sections.interior : undefined,
    technology: sections.technology.length
      ? sections.technology.map((t) => ({ icon: "voice", title: t.title, desc: t.desc }))
      : undefined,
    technologyLead: sections.technology[0]?.desc?.slice(0, 220),
    performance,
    safety,
    highlights,
  };
}
