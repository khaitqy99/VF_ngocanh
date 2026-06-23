/** Parse VinFast shop PDP marketing sections from static HTML */

const ENTITY_MAP = {
  "&agrave;": "à",
  "&aacute;": "á",
  "&acirc;": "â",
  "&atilde;": "ã",
  "&egrave;": "è",
  "&eacute;": "é",
  "&ecirc;": "ê",
  "&igrave;": "ì",
  "&iacute;": "í",
  "&ocirc;": "ô",
  "&oacute;": "ó",
  "&ograve;": "ò",
  "&otilde;": "õ",
  "&uacute;": "ú",
  "&uuml;": "ü",
  "&yacute;": "ý",
  "&Agrave;": "À",
  "&Aacute;": "Á",
  "&Acirc;": "Â",
  "&Egrave;": "È",
  "&Eacute;": "É",
  "&Iacute;": "Í",
  "&Ocirc;": "Ô",
  "&Oacute;": "Ó",
  "&Uacute;": "Ú",
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

export function decodeHtml(text) {
  let out = String(text);
  for (const [entity, char] of Object.entries(ENTITY_MAP)) {
    out = out.split(entity).join(char);
  }
  out = out.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  out = out.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return out;
}

function stripHtml(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

const NOISE_RE =
  /TỶ LỆ MUA LẠI|đăng ký tài khoản|đổi mật khẩu|kiểm tra email|quyền riêng tư|cookie|localStorage|nhận báo giá|so sánh giữa|ngân sách|đăng ký thành công|nhận thông tin|giá bán vf|tùy chọn cho ngân sách|vinfast$/i;

function isNoise(text) {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  return !t || NOISE_RE.test(t) || t.length < 12;
}

function isMarketingTitle(title) {
  const t = String(title ?? "").replace(/\s+/g, " ").trim();
  if (!t || t.length < 8 || t.length > 160) return false;
  if (isNoise(t)) return false;
  if (/^vf \d+ (eco|plus)/i.test(t)) return false;
  return true;
}

function parseOgDescription(html) {
  const m = html.match(/property="og:description"\s+content="([^"]+)"/i);
  return m ? stripHtml(m[1]).slice(0, 280) : "";
}

function parseHeroTagline(html, carName) {
  const heroSub = html.match(/Sự Lựa Chọn[\s\S]{0,100}?class="sub"[^>]*>([^<]+)/i);
  if (heroSub) return stripHtml(`Sự Lựa Chọn ${heroSub[1]}`);

  const ttl = html.match(
    /<h3[^>]*class="[^"]*ttl[^"]*"[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*class="[^"]*sub-ttl[^"]*"[^>]*>([\s\S]*?)<\/p>/i,
  );
  if (ttl) {
    const title = stripHtml(ttl[1]);
    const sub = stripHtml(ttl[2]);
    if (isMarketingTitle(title)) return sub ? `${title} — ${sub}` : title;
  }

  const heroAlt = html.match(/class="heading-txt"[^>]*>([\s\S]*?)<\/p>/i);
  if (heroAlt) {
    const t = stripHtml(heroAlt[1]);
    if (!isNoise(t) && t.length < 100) return t;
  }

  const og = parseOgDescription(html);
  if (og && !isNoise(og)) return og.split(/[.—]/)[0].slice(0, 100);

  const titleTag = html.match(/<title>([^<]+)<\/title>/i);
  if (titleTag) {
    const t = stripHtml(titleTag[1]).split("|")[0].replace(/VinFast/gi, "").trim();
    if (t.length > 5 && t.length < 100 && !isNoise(t)) return t;
  }
  return carName;
}

function parseHeroBullets(html) {
  const bullets = [];
  for (const m of html.matchAll(
    /<p class="title"[^>]*>([\s\S]*?)<\/p>[\s\S]{0,200}?<p class="desc"[^>]*>([\s\S]*?)<\/p>/gi,
  )) {
    const title = stripHtml(m[1]);
    const desc = stripHtml(m[2]);
    if (!title || !desc || desc.length > 100) continue;
    bullets.push(desc.includes(title) ? desc : `${desc} — ${title}`);
  }

  const text = stripHtml(html);
  const patterns = [
    /Quãng đường[^.]{0,40}\d+\s*km\*?/i,
    /Vận hành mạnh mẽ\s*\d+\s*hp\s*\/?\s*\d+\s*Nm/i,
    /Bảo hành xe\s*[\d.,]+\s*km hoặc\s*\d+\s*năm/i,
    /Hệ thống trợ lái[^.]{8,80}/i,
    /Mô men xoắn[^.]{8,60}/i,
    /Công suất[^.]{0,20}\d+\s*(hp|kW)/i,
    /Tốc độ tối đa[^.]{5,40}/i,
    /\d+\s*km\/h/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) bullets.push(m[0].trim());
  }
  return [...new Set(bullets)].slice(0, 4);
}

function extractSectionHtml(html, sectionId) {
  const re = new RegExp(
    `<section[^>]*id="${sectionId}"[\\s\\S]*?</section>`,
    "i",
  );
  return html.match(re)?.[0] ?? "";
}

function headingFromBlock(block) {
  const m = block.match(/<p class="heading-txt">([\s\S]*?)<\/p>/i);
  if (!m) return "";
  return stripHtml(m[1].replace(/<br\s*\/?>/gi, " ")).replace(/\s+/g, " ").trim();
}

function parseHeadingSections(html) {
  return [...html.matchAll(/<p class="heading-txt">([\s\S]*?)<\/p>[\s\S]{0,250}?<p>([\s\S]*?)<\/p>/gi)]
    .map((m) => ({
      title: stripHtml(m[1].replace(/<br\s*\/?>/gi, " ")).replace(/\s+/g, " ").trim(),
      desc: stripHtml(m[2]),
    }))
    .filter((s) => s.title && s.desc && s.desc.length > 25 && !isNoise(s.title + s.desc));
}

function parseInteriorSlides(html) {
  return [
    ...new Set(
      [...html.matchAll(/int-slide[\s\S]{0,600}?<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map((m) => stripHtml(m[1]))
        .filter((t) => t.length > 25 && !isNoise(t)),
    ),
  ];
}

function parsePrivilegeSection(html) {
  const block = extractSectionHtml(html, "section-exclusive-rights");
  if (!block) return null;

  const heading = headingFromBlock(block);
  const titleMatch = heading.match(/đặc quyền\s*(.*)/i);
  const title = "Đặc quyền";
  const subtitle = titleMatch?.[1]?.trim() || "Xứng tầm tinh hoa";

  const features = [];
  const highlights = [];

  for (const m of block.matchAll(/<dl>[\s\S]*?<dt>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<\/dt>[\s\S]*?<dd>([\s\S]*?)<\/dd>[\s\S]*?<\/dl>/gi)) {
    const featureTitle = stripHtml(m[1]).replace(/\s+/g, " ").trim();
    const dd = m[2];
    const bullets = [...dd.matchAll(/<li>([\s\S]*?)<\/li>/gi)]
      .map((li) => stripHtml(li[1]).replace(/\s+/g, " ").trim())
      .filter((t) => t.length > 20);
    const plainDesc = stripHtml(dd.replace(/<ul[\s\S]*?<\/ul>/gi, " ")).trim();
    const desc =
      bullets.length > 0 ? bullets.join(" ") : plainDesc.length > 20 ? plainDesc : featureTitle;

    if (!featureTitle || featureTitle.length < 8) continue;
    highlights.push(featureTitle.slice(0, 60));
    features.push({
      title: featureTitle.slice(0, 80),
      desc: desc.slice(0, 320),
    });
  }

  if (!features.length) return null;
  return { title, subtitle, features, highlights: highlights.slice(0, 4) };
}

function parseTechnologySection(html) {
  const block = extractSectionHtml(html, "section-technology");
  if (!block) return null;

  const heading = headingFromBlock(block);
  const titleMatch = heading.match(/công nghệ\s*(.*)/i);
  const title = titleMatch?.[1]?.trim() || heading || "Công nghệ thông minh";

  const descMatch = block.match(/<div class="content[\s\S]*?<p>([\s\S]*?)<\/p>/i);
  const lead = descMatch ? stripHtml(descMatch[1]).replace(/\s+/g, " ").trim() : "";

  const tabs = [...block.matchAll(/<span class="item[^"]*"[^>]*>([\s\S]*?)<\/span>/gi)]
    .map((m) => stripHtml(m[1].replace(/<br\s*\/?>/gi, " ")).replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 5);

  return { title, lead, tabs };
}

function parseChargingSection(html) {
  const block = extractSectionHtml(html, "section-charging-solution");
  if (!block) return null;
  const title = headingFromBlock(block) || "Giải pháp Pin và Trạm sạc";
  const descMatch = block.match(/<div class="content[\s\S]*?<p>([\s\S]*?)<\/p>/i);
  const desc = descMatch ? stripHtml(descMatch[1]).replace(/\s+/g, " ").trim() : "";
  if (!desc || isNoise(desc)) return null;
  return { title: title.replace(/\s+/g, " ").slice(0, 120), desc: desc.slice(0, 400) };
}

function buildPerformanceFromBullets(heroBullets) {
  if (!heroBullets?.length) return null;
  const perfBullets = heroBullets.filter((b) => !/bảo hành/i.test(b));
  if (!perfBullets.length) return null;

  return {
    title: "HIỆU SUẤT VƯỢT TRỘI",
    subtitle: perfBullets[0],
    features: perfBullets.map((b) => {
      const parts = b.split(/\s+\d/);
      return {
        title: (parts[0] || b).replace(/[*—].*$/, "").trim().slice(0, 60) || "Vận hành",
        desc: b.slice(0, 220),
      };
    }),
  };
}

function splitFeatureCards(section, slideTexts, prefix) {
  const cards = [];
  if (section) {
    cards.push({
      title: section.title.replace(/\s+/g, " ").slice(0, 80),
      desc: section.desc.slice(0, 400),
    });
  }
  for (const [i, desc] of slideTexts.slice(0, 4 - cards.length).entries()) {
    const shortTitle = desc.split(/[,.]/)[0].slice(0, 60);
    cards.push({ title: shortTitle || `${prefix} ${i + 1}`, desc: desc.slice(0, 400) });
  }
  return cards.slice(0, 4);
}

function techIconFor(title, desc) {
  const t = title.toLowerCase();
  if (/trợ lái|adas|hỗ trợ lái/i.test(t)) return "adas";
  if (/trợ lý|voice|tiếng việt/i.test(t)) return "voice";
  if (/fota|cập nhật/i.test(t)) return "fota";
  if (/app|ứng dụng|kết nối|dịch vụ thông minh/i.test(t)) return "app";
  if (/màn hình|giải trí/i.test(t)) return "screen";

  const text = `${title} ${desc}`.toLowerCase();
  if (/trợ lái|adas|hỗ trợ lái/i.test(text)) return "adas";
  if (/trợ lý|voice|tiếng việt/i.test(text)) return "voice";
  if (/fota|cập nhật/i.test(text)) return "fota";
  if (/app|ứng dụng|kết nối/i.test(text)) return "app";
  if (/màn hình|giải trí/i.test(text)) return "screen";
  return "drive";
}

function mapTechnology(techParsed, fallbackSection) {
  const items = [];
  const lead = techParsed?.lead || fallbackSection?.desc || "";

  for (const tab of techParsed?.tabs ?? []) {
    items.push({
      icon: techIconFor(tab, lead),
      title: tab.slice(0, 80),
      desc: lead.slice(0, 200) || tab,
    });
  }

  if (lead) {
    if (/trợ lý ảo|voice/i.test(lead) && !items.some((i) => /trợ lý/i.test(i.title))) {
      items.push({ icon: "voice", title: "Trợ lý ảo AI", desc: "Điều khiển bằng giọng nói tiếng Việt thông minh." });
    }
    if (/dịch vụ thông minh/i.test(lead) && !items.some((i) => /dịch vụ/i.test(i.title))) {
      items.push({
        icon: "app",
        title: "Dịch vụ thông minh",
        desc: "Hệ sinh thái kết nối và dịch vụ tiên tiến trên xe.",
      });
    }
    if (/trợ lái|adas/i.test(lead) && !items.some((i) => /trợ lái/i.test(i.title))) {
      items.push({ icon: "adas", title: "Trợ lái nâng cao", desc: "Hệ thống hỗ trợ lái cấp độ 2 an toàn." });
    }
  }

  if (!items.length && fallbackSection) {
    items.push({
      icon: techIconFor(fallbackSection.title, lead),
      title: fallbackSection.title.replace(/\s+/g, " ").slice(0, 60),
      desc: lead.slice(0, 200) || fallbackSection.desc.slice(0, 200),
    });
  }

  return items.slice(0, 6);
}

function cardsToFeatures(cards) {
  return cards.slice(0, 4).map((c) => ({
    title: c.title.replace(/\s+/g, " ").slice(0, 80),
    desc: c.desc.slice(0, 400),
  }));
}

function parseOverviewItemDescCards(html) {
  const cards = [];
  for (const m of html.matchAll(
    /<div class="[^"]*overview-item-desc[^"]*">[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi,
  )) {
    const title = stripHtml(m[1]).replace(/\s+/g, " ").trim();
    const desc = stripHtml(m[2]).replace(/\s+/g, " ").trim();
    if (title && desc.length > 25 && !isNoise(title + desc)) cards.push({ title, desc });
  }
  return cards;
}

function parseMetaLead(html) {
  const og = html.match(/property="og:description"\s+content="([^"]+)"/i)?.[1];
  const meta = html.match(/<meta name="description"\s+content="([^"]+)"/i)?.[1];
  const lead = stripHtml(og || meta || "");
  if (!lead || isNoise(lead)) return "";
  return lead.replace(/\s+/g, " ").trim();
}
function parseTtlSubttlSections(html) {
  const cards = [];
  for (const m of html.matchAll(
    /<h3[^>]*class="[^"]*ttl[^"]*"[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*class="[^"]*sub-ttl[^"]*"[^>]*>([\s\S]*?)<\/p>/gi,
  )) {
    const title = stripHtml(m[1]).replace(/\s+/g, " ").trim();
    const desc = stripHtml(m[2]).replace(/\s+/g, " ").trim();
    if (isMarketingTitle(title) && desc.length > 8 && !isNoise(title + desc)) {
      cards.push({ title, desc });
    }
  }
  return cards;
}

function parseH3ParagraphSections(html) {
  const cards = [];
  for (const m of html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]{0,700})/gi)) {
    const title = stripHtml(m[1]).replace(/\s+/g, " ").trim();
    if (!isMarketingTitle(title)) continue;
    const p = m[2].match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const desc = p ? stripHtml(p[1]).replace(/\s+/g, " ").trim() : "";
    if (desc.length > 25 && !isNoise(desc)) cards.push({ title, desc });
    else if (title.length > 35) cards.push({ title, desc: title });
  }
  return cards;
}

function parseH4ParagraphCards(html) {
  const cards = [];
  for (const m of html.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const title = stripHtml(m[1]).replace(/\s+/g, " ").trim();
    const desc = stripHtml(m[2]).replace(/\s+/g, " ").trim();
    if (isMarketingTitle(title) && desc.length > 25 && !isNoise(title + desc)) {
      cards.push({ title, desc });
    }
  }
  return cards;
}

function uniqueCards(cards) {
  const seen = new Set();
  return cards.filter((c) => {
    const key = c.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function categorizeLegacyCards(cards, carName) {
  const exterior = cards.filter((s) =>
    /ngoại thất|khí động|đầu xe|thân xe|gương|cửa sổ|camera|la-zăng|thiết kế khí|vũ trụ phi|kế thừa và đổi mới|ấn tượng/i.test(
      `${s.title} ${s.desc}`,
    ),
  );
  const interior = cards.filter((s) =>
    /nội thất|ghế|cabin|tiện nghi|buồng|màn hình giải trí|tinh tế|hướng tới người lái|không gian/i.test(
      `${s.title} ${s.desc}`,
    ),
  );
  const technology = cards.filter((s) =>
    /công nghệ|tiện nghi thông minh|trợ lái|màn hình|động cơ|bldc|lốp không săm/i.test(
      `${s.title} ${s.desc}`,
    ),
  );
  const performance = cards.filter((s) =>
    /vận hành|hiệu suất|quãng đường|tốc độ|công suất/i.test(`${s.title} ${s.desc}`),
  );

  const overview =
    cards.find((s) =>
      /là một|xe nhỏ|bước tiến|đồng hành|cá nhân vượt trội|vận hành êm|đi muôn nơi|vận tải|gia đình|khởi nghiệp|a-suv|limo|herio|minio|nerio|ec van/i.test(
        `${s.title} ${s.desc}`,
      ),
    ) ?? cards[0];

  return { overview, exterior, interior, technology, performance };
}

function mapLegacyTechnology(cards, lead) {
  const items = cards.slice(0, 6).map((c) => ({
    icon: techIconFor(c.title, c.desc),
    title: c.title.slice(0, 80),
    desc: c.desc.slice(0, 200),
  }));
  if (!items.length && lead) {
    items.push({ icon: "app", title: "Công nghệ thông minh", desc: lead.slice(0, 200) });
  }
  return items;
}

function mapOverviewItemDescByTitle(cards) {
  const exterior = cards.filter((c) => /^ngoại thất$/i.test(c.title));
  const interior = cards.filter((c) => /^nội thất$/i.test(c.title));
  const technology = cards.filter((c) => /^công nghệ$/i.test(c.title));
  if (!exterior.length && !interior.length && !technology.length) return null;
  return { overview: null, exterior, interior, technology, performance: [] };
}

function parseLegacyPdpContent(html, carName) {
  const ttlCards = parseTtlSubttlSections(html);
  const h3Cards = parseH3ParagraphSections(html);
  const h4Cards = parseH4ParagraphCards(html);
  const overviewCards = parseOverviewItemDescCards(html);
  const cards = uniqueCards([...overviewCards, ...ttlCards, ...h3Cards, ...h4Cards]);
  const metaLead = parseMetaLead(html);
  if (!cards.length && !metaLead) return null;

  const mappedByTitle = mapOverviewItemDescByTitle(overviewCards);
  const { overview, exterior, interior, technology, performance } = mappedByTitle
    ? { ...mappedByTitle, overview: null }
    : cards.length
      ? categorizeLegacyCards(cards, carName)
      : { overview: null, exterior: [], interior: [], technology: [], performance: [] };
  const heroBullets = parseHeroBullets(html);
  const tagline = parseHeroTagline(html, carName);

  const overviewTitle =
    (metaLead ? metaLead.split(/[,.]/)[0].trim() : "") ||
    overview?.title ||
    tagline;
  const overviewSubtitle = metaLead || overview?.desc || overviewTitle;

  const perfFromCards =
    performance.length > 0
      ? {
          title: performance[0].title.slice(0, 80),
          subtitle: performance[0].desc.slice(0, 220),
          features: performance.slice(0, 4).map((p) => ({
            title: p.title.slice(0, 60),
            desc: p.desc.slice(0, 220),
          })),
        }
      : null;

  return {
    tagline: tagline.slice(0, 100),
    slogan: overviewSubtitle.slice(0, 220),
    overview: {
      title: overviewTitle.replace(/\s+/g, " ").slice(0, 120),
      subtitle: overviewSubtitle.slice(0, 400),
      bullets: heroBullets.length ? heroBullets : overview?.desc ? [overview.desc.slice(0, 120)] : [],
    },
    exterior: cardsToFeatures(
      exterior.length ? exterior : cards.filter((c) => c !== overview).slice(0, 2),
    ),
    interior: cardsToFeatures(interior.slice(0, 4)),
    technology: mapLegacyTechnology(technology, metaLead),
    technologyLead: metaLead.slice(0, 220) || technology[0]?.desc?.slice(0, 220) || "",
    performance: buildPerformanceFromBullets(heroBullets) ?? perfFromCards,
    safety: null,
    charging: null,
  };
}

function mergePdpContent(modern, legacy, carName) {
  if (!modern && !legacy) return null;
  if (!modern) return legacy;
  if (!legacy) return modern;

  const pick = (a, b) => (a?.length ? a : b);
  const pickObj = (a, b) => (a && Object.keys(a).length ? a : b);

  return {
    tagline: modern.tagline && !isNoise(modern.tagline) ? modern.tagline : legacy.tagline,
    slogan: modern.slogan || legacy.slogan,
    overview: modern.overview ?? legacy.overview,
    exterior: pick(modern.exterior, legacy.exterior),
    interior: pick(modern.interior, legacy.interior),
    technology: pick(modern.technology, legacy.technology),
    technologyLead: modern.technologyLead || legacy.technologyLead,
    performance: pickObj(modern.performance, legacy.performance),
    safety: modern.safety ?? legacy.safety,
    charging: modern.charging ?? legacy.charging,
  };
}

function parseModernPdpContent(html, carName) {
  const sections = parseHeadingSections(html);
  if (!sections.length) return null;

  const overviewSection =
    sections.find((s) => /eSUV|là mẫu xe|đột phá|bước tiến/i.test(`${s.title} ${s.desc}`)) ?? sections[0];
  const exteriorSection = sections.find((s) =>
    /mạnh mẽ|ngoại thất|khí động|du thuyền|vũ trụ|thiết kế được/i.test(`${s.title} ${s.desc}`),
  );
  const interiorSection = sections.find((s) =>
    /nội thất|tiện nghi|giao hưởng|cabin|ghế/i.test(`${s.title} ${s.desc}`),
  );
  const techSection = sections.find((s) => /công nghệ/i.test(s.title));
  const techParsed = parseTechnologySection(html);
  const privilegeParsed = parsePrivilegeSection(html);
  const chargingParsed = parseChargingSection(html);

  const heroBullets = parseHeroBullets(html);
  const interiorSlides = parseInteriorSlides(html);

  const tagline = parseHeroTagline(html, carName);
  const slogan = overviewSection?.desc?.slice(0, 220) ?? exteriorSection?.desc?.slice(0, 220) ?? "";

  return {
    tagline: tagline.slice(0, 100),
    slogan,
    overview: overviewSection
      ? {
          title: overviewSection.title.replace(/\s+/g, " ").slice(0, 120),
          subtitle: overviewSection.desc.slice(0, 400),
          bullets: heroBullets.length
            ? heroBullets
            : overviewSection.desc
              ? [overviewSection.desc]
              : [],
        }
      : null,
    exterior: splitFeatureCards(exteriorSection, [], "Ngoại thất"),
    interior: splitFeatureCards(interiorSection, interiorSlides, "Nội thất"),
    technology: mapTechnology(techParsed, techSection),
    technologyLead: techParsed?.lead?.slice(0, 220) || techSection?.desc?.slice(0, 220) || "",
    performance: buildPerformanceFromBullets(heroBullets),
    safety: privilegeParsed,
    charging: chargingParsed,
  };
}

export function parseShopPdpContent(html, carName) {
  if (!html || html.length < 5000) return null;
  const modern = parseModernPdpContent(html, carName);
  const legacy = parseLegacyPdpContent(html, carName);
  return mergePdpContent(modern, legacy, carName);
}
