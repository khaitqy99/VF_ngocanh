import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { PDFParse } from "pdf-parse";

import { parseBrochureContent } from "./parse-brochure-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PDP_URLS = path.join(__dirname, "vinfast-pdp-urls.json");
const DETAILS_FILE = path.join(__dirname, "vinfast-details.json");
const BROWSER_PATCH = path.join(__dirname, "vinfast-details-browser.json");
const OUT_BROCHURES = path.join(__dirname, "vinfast-brochure-specs.json");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "vi-VN,vi;q=0.9",
};

/** Known brochure PDFs from VinFast product / warranty pages */
const BROCHURE_FALLBACK = {
  vf3: "https://static-cms-prod.vinfastauto.com/vfvn-brochure-vf-3-ban-ngang.pdf",
  vf5: "https://static-cms-prod.vinfastauto.com/250618_vf5_vn_vn_2.2_svc73000155aa.pdf",
  vf6: "https://static-cms-prod.vinfastauto.com/250618_vf6_vn_vi_1.5_svc70001295aa.pdf",
  vf7: "https://static-cms-prod.vinfastauto.com/250924_wb_lh-900lx_vn_vi_v1.pdf",
  vf8: "https://static-cms-prod.vinfastauto.com/250618_vf8_vn_1.5_svc30000460aa.pdf",
  vf9: "https://storage.googleapis.com/vinfast-data-01/brochure/VF%209_%20Brochure.pdf",
  "vf8-all-new": "https://static-cms-prod.vinfastauto.com/250618_vf8_vn_1.5_svc30000460aa.pdf",
  "vf-mpv7": "https://static-cms-prod.vinfastauto.com/260325_wb_mpv7_vn_vi_1.0.pdf",
  "ec-van": "https://static-cms-prod.vinfastauto.com/260115_ecvan-wb_vn_vi_v2.pdf",
  "minio-green": "https://storage.googleapis.com/vinfast-data-01/251108_WB_Mgreen_VN_VI_2.0.pdf",
  "herio-green": "https://static-cms-prod.vinfastauto.com/250618_herio_vn_vn_1.2_svc73000217aa.pdf",
  "nerio-green": "https://static-cms-prod.vinfastauto.com/250618_nerio-green_vn_vi_1.1_svc20000368aa.pdf",
  "limo-green": "https://static-cms-prod.vinfastauto.com/250618_wb_limogreen_vn_vi_1.0.pdf",
  "flazz-max": "https://static-cms-prod.vinfastauto.com/espcnf2bol001-01-flazz_max_vn_espc_bol_owner_manual.pdf",
  "amio-s": "https://static-cms-prod.vinfastauto.com/espcnf1bol003-01-hs_bol_owner_manual_amio_s_ver01.pdf",
  "evo-lite": "https://storage.googleapis.com/vinfast-data-01/hdsd/26022026/BOL00009869-User%20manual%20EVO%20200%20LITE_Rev%2008-HDSD%20xe%20Evo200%20Lite.pdf",
  amio: "https://static-cms-prod.vinfastauto.com/espcnf1bol00201-hs_bol_owner_manual_ver02.pdf",
  viper: "https://static-cms-prod.vinfastauto.com/espcne9bol001-06-evo_max_vn_owner_manual_vie.pdf",
  "feliz-ii": "https://static-cms-prod.vinfastauto.com/feliz-s-2022.pdf",
  evo: "https://storage.googleapis.com/vinfast-data-01/hdsd/BOL00009361-%20EVO%20200.pdf",
  zgoo: "https://storage.googleapis.com/vinfast-data-01/hdsd/26022026/ESPCNECBOL001-04-DG1_ZGOO_OWNER_MANUAL-HDSD%20xe%20ZGOO.pdf",
  flazz: "https://storage.googleapis.com/vinfast-data-01/hdsd/26022026/ESPCNEDBOL001-04-DG2_FLAZZ_OWNER_MANUAL-HDSD%20xe%20FLAZZ.pdf",
  "vero-x": "https://storage.googleapis.com/vinfast-data-01/hdsd/26022026/BOL00011310AA-Owner%20Manual%20Vero%20X-rev09-HDSD%20xe%20Vero%20X.pdf",
  "feliz-2025": "https://storage.googleapis.com/vinfast-data-01/hdsd/26022026/BOL00011287AA-User%20manual%20FELIZ%20NEO_2025-07-HDSD%20xe%20Feliz%202025.pdf",
  "evo-grand": "https://storage.googleapis.com/vinfast-data-01/hdsd/26022026/BOL00011286AA%20-User%20manual%20EVO%20GRAND-v7-HDSD%20xe%20Evo%20Grand.pdf",
  "evo-grand-lite":
    "https://storage.googleapis.com/vinfast-data-01/hdsd/26022026/BOL00011314AA%20-User%20manual%20EVO%20GRAND%20Lite_v7-BOL00011314AA%20-HDSD%20xe%20Evo%20Grand%20Lite.pdf",
  drgnfly: "https://static-cms-prod.vinfastauto.com/bol00011007-user-manual-e-bike-vie.pdf",
  "evo-lite-neo": "https://storage.googleapis.com/vinfast-data-01/hdsd/BOL00011233%20-%20EVO%20LITE%20NEO.pdf",
};

const DISPLAY_NAMES = {
  vf3: "VF 3",
  vf5: "VF 5",
  vf6: "VF 6",
  vf7: "VF 7",
  vf8: "VF 8",
  "vf8-all-new": "VF 8 All New",
  vf9: "VF 9",
  "vf-mpv7": "VF MPV 7",
  "ec-van": "EC VAN",
  "minio-green": "Minio Green",
  "herio-green": "Herio Green",
  "nerio-green": "Nerio Green",
  "limo-green": "Limo Green",
  "evo-lite-neo": "EVO Lite Neo",
  "flazz-max": "FLAZZ MAX",
  "amio-s": "AMIO S",
  "evo-lite": "EVO Lite",
  amio: "Amio",
  viper: "Viper",
  "feliz-ii": "Feliz II",
  evo: "EVO",
  zgoo: "zgoo",
  flazz: "Flazz",
  "vero-x": "Vero X",
  "feliz-2025": "Feliz 2025",
  "evo-grand": "Evo Grand",
  "evo-grand-lite": "Evo Grand Lite",
  drgnfly: "DrgnFly",
};

const SPEC_LABEL_PATTERNS = [
  /^Chiều dài cơ sở\s*\(mm\)/i,
  /^Dài x Rộng x Cao\s*\(mm\)/i,
  /^Kích thước tổng thể/i,
  /^Khoảng sáng gầm xe/i,
  /^Chiều cao đến yên/i,
  /^Kích thước lốp/i,
  /^Loại vành/i,
  /^Trọng lượng xe/i,
  /^Trọng lượng Pin/i,
  /^Tải trọng tối đa/i,
  /^Dung tích khoang chứa hành lý/i,
  /^Trọng lượng không tải\s*\(kg\)/i,
  /^Tải trọng\s*\(kg\)/i,
  /^Công suất tối đa\s*\(hp/i,
  /^Công suất tối đa\s*\(kW/i,
  /^Công suất tối đa\s*\(W/i,
  /^Công suất danh định/i,
  /^Mô men xoắn/i,
  /^Mô-men xoắn/i,
  /^Tốc độ tối đa/i,
  /^Dung lượng pin/i,
  /^Dung lượng Pin/i,
  /^Quãng đường chạy/i,
  /^Quãng đường\s/i,
  /^Thời gian nạp pin/i,
  /^Thời gian sạc/i,
  /^Dẫn động$/i,
  /^Số ghế ngồi/i,
  /^Sức chứa/i,
  /^Kích thước la-zăng/i,
  /^Kích thước La-zăng/i,
  /^Màn hình giải trí/i,
  /^Màn hình$/i,
  /^Công suất sạc nhanh DC/i,
  /^Công suất sạc AC/i,
  /^Thể tích cốp\s*\(L\)/i,
  /^Cốp xe\s*\(lít\)/i,
  /^Động cơ$/i,
  /^Loại pin$/i,
  /^Loại Pin$/i,
  /^Loại sạc/i,
  /^Khung xe/i,
  /^Phanh trước/i,
  /^Cách chuyển số/i,
  /^Chọn chế độ lái/i,
  /^Giảm xóc/i,
  /^Đèn pha/i,
  /^Đèn hậu/i,
  /^Cảm biến trợ lực/i,
  /^Điều chỉnh chế độ trợ lực/i,
  /^Vị trí lắp Pin/i,
  /^Đổi Pin/i,
];

const CATEGORY_HEADER_RE =
  /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ0-9\s&–-]+$/;

function isCategoryHeader(line) {
  const t = line.trim();
  if (!t || t.length > 60) return false;
  if (/^THÔNG SỐ|^KÍCH THƯỚC|^PIN$|^PHANH$|^KHUNG|^HỆ THỐNG|^VÀNH|^TẢI TRỌNG|^GIẢM XÓC|^TÍNH NĂNG/i.test(t))
    return true;
  return CATEGORY_HEADER_RE.test(t) && !isSpecLabel(t);
}

function isStrongValueLine(line) {
  const t = line.trim();
  if (!t || t.length > 150) return false;
  if (isCategoryHeader(t) || isSpecLabel(t) || isVariantMarker(t)) return false;
  if (/^\d+\s*x\s*[\d.]+\s*x\s*[\d.]+/i.test(t)) return true;
  if (/^[\d.,]+\s*(mm|kg|km\/h|km|W|Nm|Wh|V|Ah|phút|Inch)/i.test(t)) return true;
  if (/Lithium|Thép|Đùi|Cảm biến|^CÓ$|Sạc di động|Vành nhôm|Phanh đĩa|Khung nhôm|Tích hợp|Điều chỉnh chế độ/i.test(t))
    return true;
  if (/^\d+\s*(\/|\+)/.test(t)) return true;
  return false;
}

function normalizeText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isSpecLabel(line) {
  const t = line.trim();
  if (!t || t.length > 80) return false;
  return SPEC_LABEL_PATTERNS.some((re) => re.test(t));
}

function isVariantMarker(line) {
  return /^(VF\s*\d|VF\s*MPV|EC\s*VAN|MINIO|HERIO|NERIO|LIMO|FLAZZ|AMIO|EVO|FELIZ|VERO|ZGOO|DRGN|VIPER)/i.test(
    line.trim(),
  );
}

function isValueLine(line) {
  const t = line.trim();
  if (!t || t.length > 120) return false;
  if (isSpecLabel(t) || isVariantMarker(t)) return false;
  if (/^\d+ of \d+$/i.test(t)) return false;
  if (/^\d{2} \| VinFast$/i.test(t)) return false;
  if (/^--/.test(t)) return false;
  if (/^KÍCH THƯỚC|^PIN$|^PHANH$|^KHUNG|^HỆ THỐNG|^THÔNG SỐ|^VÀNH|^TẢI TRỌNG|^GIẢM XÓC/i.test(t))
    return false;
  return /[\d]/.test(t) || /km|kW|hp|Nm|AWD|FWD|RWD|Inch|inch|phút|CATL|LFP|Có|Không|ghế|chỗ|W/i.test(t);
}

function parseTabSeparatedSpecs(text) {
  const specs = [];
  for (const raw of text.split("\n")) {
    const parts = raw.split("\t").map((s) => s.trim()).filter(Boolean);
    if (parts.length !== 2) continue;
    const [label, value] = parts;
    if (label.length > 70 || value.length > 120) continue;
    if (/vinfastauto\.com|1900/i.test(label)) continue;
    specs.push({ label, value });
  }
  return specs;
}

/** Scooter/e-bike brochures: all labels then all values in two columns */
function parseColumnarSpecs(lines) {
  const specStart = lines.findIndex((l) => /THÔNG SỐ KỸ THUẬT|ĐẶC TÍNH KỸ THUẬT/i.test(l));
  if (specStart < 0) return [];

  const section = lines.slice(specStart + 1);
  const valueStart = section.findIndex((l) => isStrongValueLine(l));
  if (valueStart < 1) return [];

  const labels = section
    .slice(0, valueStart)
    .filter((l) => !isCategoryHeader(l) && !l.includes("\t") && l.length > 1 && l.length < 70);
  const values = section
    .slice(valueStart)
    .filter((l) => isStrongValueLine(l) && !/^\*/.test(l) && !/có thể thay đổi/i.test(l));

  const specs = [];
  for (let i = 0; i < labels.length && i < values.length; i++) {
    specs.push({ label: labels[i], value: values[i] });
  }
  return specs;
}

/** Parse brochure PDF spec section: labels block then values after first variant marker */
function parseBrochureSpecTable(text) {
  const lines = normalizeText(text)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const tabSpecs = parseTabSeparatedSpecs(text);
  const columnarSpecs = parseColumnarSpecs(lines);

  const specStart = lines.findIndex((l) =>
    /KÍCH THƯỚC|THÔNG SỐ KỸ THUẬT|THÔNG SỐ TRUYỀN ĐỘNG|ĐẶC TÍNH KỸ THUẬT/i.test(l),
  );
  const slice = specStart >= 0 ? lines.slice(specStart) : lines;

  const labels = [];
  let valueStart = -1;
  for (let i = 0; i < slice.length; i++) {
    const line = slice[i];
    if (isVariantMarker(line)) {
      valueStart = i + 1;
      break;
    }
    if (isSpecLabel(line)) labels.push(line);
  }

  let tableSpecs = [];
  if (valueStart >= 0) {
    const values = [];
    for (let i = valueStart; i < slice.length; i++) {
      if (isVariantMarker(slice[i])) break;
      if (isValueLine(slice[i])) values.push(slice[i]);
      if (values.length >= labels.length) break;
    }
    for (let i = 0; i < labels.length && i < values.length; i++) {
      tableSpecs.push({ label: labels[i], value: values[i] });
    }
  } else {
    for (let i = 0; i < slice.length - 1; i++) {
      if (isSpecLabel(slice[i]) && isValueLine(slice[i + 1])) {
        tableSpecs.push({ label: slice[i], value: slice[i + 1] });
        i++;
      }
    }
  }

  return mergeSpecs(tabSpecs, columnarSpecs, tableSpecs);
}

/** Additional regex extraction for scattered brochure text */
function extractInlineSpecs(text) {
  const specs = [];
  const patterns = [
    [/Chiều dài\s*\n?\s*([\d.,]+)\s*mm/gi, "Chiều dài (mm)"],
    [/Chiều rộng\s*\n?\s*([\d.,]+)\s*mm/gi, "Chiều rộng (mm)"],
    [/Chiều cao\s*\n?\s*([\d.,]+)\s*mm/gi, "Chiều cao (mm)"],
    [/Chiều dài cơ sở\s*\n?\s*([\d.,]+)\s*mm/gi, "Chiều dài cơ sở (mm)"],
    [/Công suất tối đa\s*\n?\s*([\d.,]+)\s*hp/gi, "Công suất tối đa (hp)"],
    [/Công suất tối đa\s*\n?\s*([\d.,]+)\s*kW/gi, "Công suất tối đa (kW)"],
    [/Mô men xoắn cực đại\s*\n?\s*([\d.,]+)\s*Nm/gi, "Mô men xoắn cực đại (Nm)"],
    [/([\d.,]+)\s*km\*\s*\n?\s*QUÃNG ĐƯỜNG/gi, "Quãng đường (km)"],
    [/QUÃNG ĐƯỜNG[\s\S]{0,40}?([\d.,]+)\s*km/gi, "Quãng đường (km)"],
    [/Tốc độ tối đa\s*\(km\/h\)\s*([\d.,]+)/gi, "Tốc độ tối đa (km/h)"],
    [/Dung lượng pin[^)]*\)\s*([\d.,]+)/gi, "Dung lượng pin (kWh)"],
  ];
  for (const [re, label] of patterns) {
    const m = text.match(re);
    if (m) {
      const val = m[0].match(/([\d.,]+)/)?.[1] ?? m[1];
      if (val) specs.push({ label, value: val });
    }
  }
  return specs;
}

function sanitizeSpecTable(specs) {
  const TECH =
    /động cơ|công suất|mô men|quãng đường|thời gian nạp|thời gian sạc|dẫn động|dung lượng pin|chiều dài|dài x rộng|tăng tốc|tốc độ|khoảng sáng|cốp|thể tích|trọng lượng|tải trọng|pin|phanh|khung|màn hình|la-zăng|ghế|sạc/i;
  return (specs ?? []).filter((s) => {
    const l = s.label?.trim() ?? "";
    const v = s.value?.trim() ?? "";
    if (!l || !v || l.length > 55 || v.length > 100) return false;
    if (/thay đổi mà không|có thể thay đổi|hình ảnh|vinfast$/i.test(l + v)) return false;
    if (/^Hệ dẫn động$|^PIN$|^PHANH$|^KHUNG/i.test(v)) return false;
    if (/^\d{1,2}$/.test(v) && !/\(/.test(l)) return false;
    return (
      isSpecLabel(l) ||
      TECH.test(l) ||
      /\(mm\)|\(km|\(kW|\(W\)|\(Nm\)|\(hp\)|\(L\)|\(kg\)|\(lít\)/i.test(l)
    );
  });
}

function mergeSpecs(...lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const s of list ?? []) {
      const key = s.label.toLowerCase();
      if (!s.label || !s.value || seen.has(key)) continue;
      seen.add(key);
      out.push({ label: s.label, value: String(s.value).trim() });
    }
  }
  return out;
}

async function fetchPdfText(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const parser = new PDFParse({ data: buf });
  const result = await parser.getText();
  await parser.destroy();
  return { text: result.text, url };
}

function findBrochureUrl(html) {
  const patterns = [
    /href="([^"]*brochure[^"]*\.pdf[^"]*)"/gi,
    /href="([^"]*\/wb[^"]*\.pdf[^"]*)"/gi,
    /href="([^"]*svc[^"]*\.pdf[^"]*)"/gi,
    /href="([^"]*WB[^"]*\.pdf[^"]*)"/gi,
  ];
  for (const re of patterns) {
    for (const m of html.matchAll(re)) {
      let url = m[1];
      if (url.startsWith("/")) url = `https://shop.vinfastauto.com${url}`;
      if (!/app|user.?manual|huong dan/i.test(url)) return url;
    }
  }
  return null;
}

async function discoverBrochureUrl(pdpUrl) {
  try {
    const res = await fetch(pdpUrl, { headers: HEADERS });
    if (!res.ok) return null;
    const html = await res.text();
    return findBrochureUrl(html);
  } catch {
    return null;
  }
}

function kwToHp(kw) {
  return Math.round(Number(kw) * 1.341);
}

function extractFields(specs, type) {
  const get = (...keys) => {
    for (const k of keys) {
      const f = specs.find((s) => s.label.toLowerCase().includes(k.toLowerCase()));
      if (f?.value) return f.value;
    }
    return "";
  };
  if (type === "car") {
    const kw = get("công suất tối đa (kw)", "công suất tối đa (hp");
    const hp = get("công suất tối đa (hp");
    const torque = get("mô men");
    const range = get("quãng đường");
    const battery = get("dung lượng pin");
    const kwNum = kw.match(/(\d+)/);
    const hpNum = hp.match(/(\d+)/);
    const torqueNum = torque.match(/(\d+)/);
    const rangeNum = range.match(/(\d+)/);
    const batteryNum = battery.match(/([\d.,]+)/);
    return {
      ...(hpNum ? { power: Number(hpNum[1]) } : kwNum ? { power: kwToHp(kwNum[1]), powerKw: Number(kwNum[1]) } : {}),
      ...(torqueNum ? { torque: Number(torqueNum[1]) } : {}),
      ...(rangeNum ? { range: Number(rangeNum[1]) } : {}),
      ...(batteryNum ? { batteryCapacity: parseFloat(batteryNum[1].replace(",", ".")) } : {}),
      chargingTime: get("thời gian nạp", "thời gian sạc") || undefined,
      dimensions: get("dài x rộng", "kích thước") || undefined,
      drive: get("dẫn động") || undefined,
    };
  }
  const speed = get("tốc độ");
  const range = get("quãng đường");
  const power = get("công suất");
  const trunk = get("cốp", "thể tích cốp");
  return {
    ...(speed.match(/(\d+)/) ? { topSpeed: Number(speed.match(/(\d+)/)[1]) } : {}),
    ...(range.match(/(\d+)/) ? { range: Number(range.match(/(\d+)/)[1]) } : {}),
    ...(power.match(/(\d+)/) ? { motorPower: Number(power.match(/(\d+)/)[1]) } : {}),
    ...(trunk.match(/(\d+)/) ? { trunk: Number(trunk.match(/(\d+)/)[1]) } : {}),
    chargingTime: get("thời gian sạc") || undefined,
  };
}

async function scrapeBrochure(id, type, pdpUrl) {
  let brochureUrl = BROCHURE_FALLBACK[id] ?? null;
  if (pdpUrl) {
    const discovered = await discoverBrochureUrl(pdpUrl);
    if (discovered) brochureUrl = discovered;
  }
  if (!brochureUrl) return { id, type, error: "no brochure URL" };

  console.log(`  ${id}: ${brochureUrl.split("/").pop()}`);
  try {
    const { text, url } = await fetchPdfText(brochureUrl);
    if (text.replace(/\s/g, "").length < 300) {
      throw new Error("PDF has no extractable text (image-only brochure)");
    }
    const tableSpecs = parseBrochureSpecTable(text);
    const inlineSpecs = extractInlineSpecs(text);
    const specTable = sanitizeSpecTable(mergeSpecs(tableSpecs, inlineSpecs));
    const brochureContent = parseBrochureContent(text, DISPLAY_NAMES[id] ?? id);
    return {
      id,
      type,
      brochureUrl: url,
      specTable,
      brochureContent,
      fields: extractFields(specTable, type),
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`    skip ${id}: ${err.message}`);
    return { id, type, error: err.message, brochureUrl };
  }
}

function mergeBrowserPatch(details) {
  if (!fs.existsSync(BROWSER_PATCH)) return;
  const patch = JSON.parse(fs.readFileSync(BROWSER_PATCH, "utf8"));
  for (const item of [...(patch.cars ?? []), ...(patch.scooters ?? [])]) {
    if (!item?.id) continue;
    const list = item.type === "car" ? details.cars : details.scooters;
    const idx = list.findIndex((x) => x?.id === item.id);
    if (idx >= 0) {
      const merged = { ...list[idx], ...item, error: undefined };
      if (item.specTable?.length) {
        merged.specTable = sanitizeSpecTable(
          mergeSpecs(item.specTable, list[idx].specTable ?? []),
        );
      }
      list[idx] = merged;
    } else {
      list.push(item);
    }
  }
  console.log(`Merged browser patch from ${BROWSER_PATCH}`);
}

async function main() {
  const pdp = JSON.parse(fs.readFileSync(PDP_URLS, "utf8"));
  const results = { cars: [], scooters: [], syncedAt: new Date().toISOString() };

  console.log("Fetching brochure specs from VinFast PDFs...\n");

  for (const [id, url] of Object.entries(pdp.cars ?? {})) {
    results.cars.push(await scrapeBrochure(id, "car", url));
    await new Promise((r) => setTimeout(r, 300));
  }
  for (const [id, url] of Object.entries(pdp.scooters ?? {})) {
    results.scooters.push(await scrapeBrochure(id, "scooter", url));
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(OUT_BROCHURES, JSON.stringify(results, null, 2), "utf8");
  console.log(`\nWrote ${OUT_BROCHURES}`);

  // Merge into vinfast-details.json
  if (fs.existsSync(DETAILS_FILE)) {
    const details = JSON.parse(fs.readFileSync(DETAILS_FILE, "utf8"));
    for (const item of [...results.cars, ...results.scooters]) {
      if (!item.specTable?.length) continue;
      const list = item.type === "car" ? details.cars : details.scooters;
      const idx = list.findIndex((x) => x?.id === item.id);
      if (idx < 0) continue;
      const existing = list[idx].specTable ?? [];
      list[idx] = {
        ...list[idx],
        specTable: sanitizeSpecTable(mergeSpecs(item.specTable, existing)),
        fields: { ...(list[idx].fields ?? {}), ...(item.fields ?? {}) },
        brochureUrl: item.brochureUrl,
        ...(item.brochureContent ? { brochureContent: item.brochureContent } : {}),
      };
    }
    mergeBrowserPatch(details);
    details.brochureSyncedAt = new Date().toISOString();
    fs.writeFileSync(DETAILS_FILE, JSON.stringify(details, null, 2), "utf8");
    console.log(`Merged brochure specs into ${DETAILS_FILE}`);
    execSync("node scripts/apply-vinfast-spec-patch.mjs", { cwd: ROOT, stdio: "inherit" });
  }

  const ok = [...results.cars, ...results.scooters].filter((x) => x.specTable?.length).length;
  console.log(`Vehicles with brochure specs: ${ok}/${results.cars.length + results.scooters.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
