import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  parseShopPdpContent,
  parseShopListingProduct,
  decodeHtml,
} from "./parse-shop-pdp-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VEHICLES_FILE = path.join(__dirname, "vinfast-vehicles.json");
const OUT_FILE = path.join(__dirname, "vinfast-details.json");
const BROWSER_PATCH = path.join(__dirname, "vinfast-details-browser.json");

const CAR_ID_MAP = {
  "VF 3": "vf3",
  "VF 5": "vf5",
  "VF 6": "vf6",
  "VF 7": "vf7",
  "VF 8": "vf8",
  "VF 8 All New": "vf8-all-new",
  "VF 9": "vf9",
  "VF MPV 7": "vf-mpv7",
  "Minio Green": "minio-green",
  "Herio Green": "herio-green",
  "Limo Green": "limo-green",
  "Nerio Green": "nerio-green",
  "EC VAN": "ec-van",
};

const SCOOTER_ID_MAP = {
  "FLAZZ MAX": "flazz-max",
  "AMIO S": "amio-s",
  "EVO Lite": "evo-lite",
  Amio: "amio",
  Viper: "viper",
  "Feliz II": "feliz-ii",
  EVO: "evo",
  zgoo: "zgoo",
  Flazz: "flazz",
  "Vero X": "vero-x",
  "Feliz 2025": "feliz-2025",
  "Evo Grand": "evo-grand",
  "Evo Grand Lite": "evo-grand-lite",
  DrgnFly: "drgnfly",
  "EVO Lite Neo": "evo-lite-neo",
};

const TECH_LABEL =
  /động cơ|công suất|mô men|quãng đường|thời gian nạp|dẫn động|dung lượng pin|chiều dài cơ sở|dài x rộng|tăng tốc|tốc độ tối đa|cốp xe|công suất động cơ|pin lithium|trọng lượng/i;

const MODAL_NOISE =
  /email|mật khẩu|đăng ký thành công|kiểm tra email|tài khoản vinfast|đổi mật khẩu/i;

const COLOR_HEX = {
  "Summer Yellow": "#FBBF24",
  "Jet Black": "#111827",
  "Infinity Blanc": "#FFFFFF",
  "Zenith Grey": "#6B7280",
  "Urban Mint": "#34D399",
  "Ivy Green": "#065F46",
  "Desat Silver": "#D1D5DB",
  "Crimson Red": "#B91C1C",
  "Solar Ruby": "#DC2626",
  "Deep Ocean": "#0b1f5b",
  "Brahminy White": "#FFFFFF",
  "Sunset Orange": "#D97706",
  "Astral Blue": "#2563EB",
  "Dragon Forged": "#7F1D1D",
};

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "vi-VN,vi;q=0.9",
  Referer: "https://shop.vinfastauto.com/vn_vi/",
};

function stripHtml(html) {
  return decodeHtml(
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function parseMetaOverview(html) {
  const og = html.match(/property="og:description"\s+content="([^"]+)"/i)?.[1];
  const meta = html.match(/<meta name="description"\s+content="([^"]+)"/i)?.[1];
  const lead = stripHtml(og || meta || "");
  if (
    !lead ||
    MODAL_NOISE.test(lead) ||
    /so sánh giữa|nhận báo giá|đăng ký thành công/i.test(lead)
  ) {
    return null;
  }
  return {
    title: lead.split(/[,.]/)[0].slice(0, 120),
    subtitle: lead.slice(0, 300),
  };
}

function parsePrice(text) {
  const digits = String(text).replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function filterTechSpecs(rows) {
  return rows.filter(
    (s) => TECH_LABEL.test(s.label) && s.label.length < 60 && s.value.length < 120,
  );
}

function parseTableSpecs(html) {
  const specs = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = rowRe.exec(html)) !== null) {
    const cells = [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) =>
      stripHtml(c[1]),
    );
    if (cells.length >= 2 && cells[0] && cells[1]) specs.push({ label: cells[0], value: cells[1] });
  }
  return filterTechSpecs(specs);
}

function parseCompareSpecs(html) {
  const text = stripHtml(html);
  const specs = [];
  const patterns = [
    [/Chiều dài cơ sở \(mm\)\s*([\d.,]+)/i, "Chiều dài cơ sở (mm)"],
    [/Dài x Rộng x Cao \(mm\)\s*([\d. x,]+)/i, "Dài x Rộng x Cao (mm)"],
    [/Quãng đường chạy một lần sạc đầy \(km\)\*?\s*(\d+)/i, "Quãng đường (km)"],
    [/Công suất tối đa \(kW\)\s*(\d+)/gi, "Công suất tối đa (kW)"],
    [/Mô men xoắn cực đại \(Nm\)\s*(\d+)/gi, "Mô men xoắn (Nm)"],
    [/Dung lượng pin khả dụng \(kWh\)\s*([\d,]+)/i, "Dung lượng pin (kWh)"],
  ];
  for (const [re, label] of patterns) {
    const match = text.match(re);
    if (match) specs.push({ label, value: match[1] });
  }
  if (/Công suất tối đa \(kW\)/i.test(text)) {
    const allKw = [...text.matchAll(/Công suất tối đa \(kW\)\s*(\d+)/gi)].map((x) => x[1]);
    if (allKw.length >= 2) specs.push({ label: "Công suất Plus (kW)", value: allKw[1] });
    if (allKw.length >= 1) specs.push({ label: "Công suất Eco (kW)", value: allKw[0] });
  }
  return specs;
}

function parseVariants(html) {
  const variants = [];
  const text = stripHtml(html);
  const re =
    /(VF \d+[^.]{0,40}?|VF \d+ Plus[^.]{0,20}|EC VAN|Minio Green|Herio Green|Nerio Green|Limo Green|VF MPV 7[^.]{0,10})\s+Giá bán từ\s+([\d.]+)\s*VNĐ\*?\s+([\d.]+)\s*VNĐ/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    variants.push({ name: m[1].trim(), price: parsePrice(m[2]), listPrice: parsePrice(m[3]) });
  }
  if (variants.length === 0) {
    const alt = /(VF \d+ Eco|VF \d+ Plus[^.]{0,30})\s+Giá bán từ\s+([\d.]+)/gi;
    while ((m = alt.exec(text)) !== null) {
      variants.push({ name: m[1].trim(), price: parsePrice(m[2]) });
    }
  }
  const seen = new Set();
  return variants.filter((v) => {
    if (seen.has(v.name) || v.price < 1_000_000) return false;
    seen.add(v.name);
    return true;
  });
}

function parseColors(html) {
  const colors = [];
  for (const name of Object.keys(COLOR_HEX)) {
    if (html.includes(name)) colors.push(name);
  }
  return colors;
}

function parseHighlights(html) {
  const text = stripHtml(html);
  const bullets = [];
  const patterns = [
    /Quãng đường[^.]{8,100}/i,
    /Công suất[^.]{8,100}/i,
    /Bảo hành[^.]{8,80}/i,
    /Mô men xoắn[^.]{8,80}/i,
    /Tốc độ tối đa[^.]{5,40}/i,
    /Hệ thống trợ lái[^.]{8,80}/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && !MODAL_NOISE.test(m[0])) bullets.push(m[0].trim());
  }
  return [...new Set(bullets)].slice(0, 5);
}

function parseOverview(html, name, pdpContent) {
  if (pdpContent?.overview) {
    return {
      title: pdpContent.overview.title,
      subtitle: pdpContent.overview.subtitle,
    };
  }

  const metaOverview = parseMetaOverview(html);
  if (metaOverview) return metaOverview;

  const titleTag = html.match(/<title>([^<]+)<\/title>/i);
  let pageTitle = titleTag ? stripHtml(titleTag[1]).split("|")[0].trim() : name;
  if (/localStorage|typeof\(/i.test(pageTitle) || pageTitle.length > 100) pageTitle = name;

  const h3blocks = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
  for (const m of h3blocks) {
    const title = stripHtml(m[1]).replace(/\s+/g, " ").trim();
    if (
      title.length > 20 &&
      title.length < 150 &&
      !/ngân sách|tùy chọn|cookie|TỶ LỆ MUA LẠI|nhận báo giá|đăng ký|so sánh giữa|giá bán/i.test(
        title,
      )
    ) {
      const after = stripHtml(html.slice(m.index + m[0].length, m.index + m[0].length + 500));
      return { title, subtitle: after.slice(0, 280) };
    }
  }

  const text = stripHtml(html);
  const heroMatch = text.match(
    new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^.]{15,200}\\.`, "i"),
  );
  if (heroMatch) {
    return { title: heroMatch[0].slice(0, 120), subtitle: heroMatch[0].slice(0, 300) };
  }

  return { title: pageTitle, subtitle: "" };
}

function parseFeatureSections(html) {
  const exterior = [];
  const interior = [];
  const blocks = [...html.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)];
  for (const m of blocks) {
    const title = stripHtml(m[1]);
    const desc = stripHtml(m[2]);
    if (!title || !desc || desc.length < 40 || MODAL_NOISE.test(title + desc)) continue;
    const entry = { title: title.slice(0, 80), desc: desc.slice(0, 400) };
    if (/nội thất|ghế|buồng lái|trần kính|tiện nghi|hàng ghế/i.test(title + desc))
      interior.push(entry);
    else exterior.push(entry);
  }
  return { exterior: exterior.slice(0, 4), interior: interior.slice(0, 4) };
}

function mapDrive(value) {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v.includes("awd") || v.includes("2 cầu")) return "awd";
  if (v.includes("rwd") || v.includes("cầu sau")) return "rwd";
  return "fwd";
}

function kwToHp(kw) {
  return Math.round(Number(kw) * 1.341);
}

function extractCarFields(specs) {
  const get = (...labels) => {
    for (const label of labels) {
      const found = specs.find((s) => s.label.toLowerCase().includes(label.toLowerCase()));
      if (found?.value) return found.value;
    }
    return "";
  };
  const kw = get("công suất plus", "công suất tối đa", "công suất");
  const torque = get("mô men");
  const range = get("quãng đường");
  const battery = get("dung lượng pin", "pin khả dụng");
  const charging = get("thời gian nạp", "sạc nhanh");
  const dimensions = get("dài x rộng", "kích thước");
  const drive = get("dẫn động");
  const kwNum = kw.match(/(\d+)/);
  const torqueNum = torque.match(/(\d+)/);
  const rangeNum = range.match(/(\d+(?:[.,]\d+)?)/);
  const batteryNum = battery.match(/(\d+(?:[.,]\d+)?)/);
  return {
    ...(kwNum ? { power: kwToHp(kwNum[1]), powerKw: Number(kwNum[1]) } : {}),
    ...(torqueNum ? { torque: Number(torqueNum[1]) } : {}),
    ...(rangeNum ? { range: Math.round(parseFloat(rangeNum[1].replace(",", "."))) } : {}),
    ...(batteryNum ? { batteryCapacity: parseFloat(batteryNum[1].replace(",", ".")) } : {}),
    ...(charging ? { chargingTime: charging } : {}),
    ...(dimensions ? { dimensions } : {}),
    ...(drive ? { drive: mapDrive(drive) } : {}),
    acceleration: get("tăng tốc", "0-100") || undefined,
  };
}

function extractScooterFields(specs, text) {
  const get = (...labels) => {
    for (const label of labels) {
      const found = specs.find((s) => s.label.toLowerCase().includes(label.toLowerCase()));
      if (found?.value) return found.value;
    }
    return "";
  };
  const speed = get("tốc độ tối đa");
  const range = get("quãng đường");
  const power = get("công suất");
  const trunk = get("cốp");
  const speedNum = speed.match(/(\d+)/);
  const rangeNum = range.match(/(\d+)/);
  const powerNum = power.match(/(\d+)/);
  const trunkNum = trunk.match(/(\d+)/);
  const weightMatch = text.match(/Trọng lượng[:\s]*(\d+)\s*kg/i);
  return {
    ...(speedNum ? { topSpeed: Number(speedNum[1]) } : {}),
    ...(rangeNum ? { range: Number(rangeNum[1]) } : {}),
    ...(powerNum ? { motorPower: Number(powerNum[1]) } : {}),
    ...(trunkNum ? { trunk: Number(trunkNum[1]) } : {}),
    ...(weightMatch ? { weight: Number(weightMatch[1]) } : {}),
    chargingTime: get("thời gian sạc") || undefined,
  };
}

const SCOOTER_LISTING_URL = "https://shop.vinfastauto.com/vn_vi/xe-may-dien-vinfast.html";
const LISTING_PRODUCT_MAP = {
  "evo-lite": "EvoLite",
};

function mergePdpFields(detail, pdpContent) {
  if (!pdpContent) return detail;
  return {
    ...detail,
    pdpContent,
    exterior: pdpContent.exterior?.length ? pdpContent.exterior : detail.exterior,
    interior: pdpContent.interior?.length ? pdpContent.interior : detail.interior,
    technology: pdpContent.technology?.length ? pdpContent.technology : detail.technology,
    performance: pdpContent.performance ?? detail.performance,
    safety: pdpContent.safety ?? detail.safety,
    tagline: pdpContent.tagline || detail.tagline,
    slogan:
      detail.slogan &&
      detail.slogan.length < 100 &&
      !/đèn Full LED|thông số, giá bán/i.test(detail.slogan)
        ? detail.slogan
        : pdpContent.slogan || detail.slogan,
    overview: pdpContent.overview ?? detail.overview,
    highlights: pdpContent.overview?.bullets?.length
      ? pdpContent.overview.bullets
      : detail.highlights,
  };
}

function supplementFromListing(detail, listingHtml) {
  const listingKey = LISTING_PRODUCT_MAP[detail.id];
  if (!listingKey || !listingHtml) return detail;
  if (detail.pdpContent?.exterior?.length >= 2) return detail;
  const listingPdp = parseShopListingProduct(listingHtml, listingKey);
  if (!listingPdp) return detail;
  const pdpContent = {
    ...(detail.pdpContent ?? {}),
    ...listingPdp,
    exterior: listingPdp.exterior?.length ? listingPdp.exterior : detail.pdpContent?.exterior,
    interior: listingPdp.interior?.length ? listingPdp.interior : detail.pdpContent?.interior,
    technology: listingPdp.technology?.length
      ? listingPdp.technology
      : detail.pdpContent?.technology,
    overview: listingPdp.overview ?? detail.pdpContent?.overview ?? detail.overview,
  };
  return mergePdpFields(detail, pdpContent);
}

function colorsToHex(names) {
  return names.map((name) => ({ name, hex: COLOR_HEX[name] ?? "#888888" }));
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

async function scrapeVehicle(vehicle, type, pdpUrl) {
  const id = type === "car" ? CAR_ID_MAP[vehicle.name] : SCOOTER_ID_MAP[vehicle.name];
  const url = pdpUrl ?? vehicle.detailHref;
  if (!id || !url) return null;

  console.log(`  fetching ${vehicle.name} (${id})...`);
  try {
    const html = await fetchPage(url);
    const pdpContent = parseShopPdpContent(html, vehicle.name);
    const tableSpecs = parseTableSpecs(html);
    const compareSpecs = parseCompareSpecs(html);
    const allSpecs = [...tableSpecs, ...compareSpecs];
    const text = stripHtml(html);
    const fields =
      type === "car" ? extractCarFields(allSpecs) : extractScooterFields(allSpecs, text);
    const overview = parseOverview(html, vehicle.name, pdpContent);
    const featureSections = parseFeatureSections(html);

    return {
      id,
      name: vehicle.name,
      type,
      sourceUrl: url,
      fetchedAt: new Date().toISOString(),
      variants: parseVariants(html),
      colors: parseColors(html),
      colorHex: colorsToHex(parseColors(html)),
      highlights: pdpContent?.overview?.bullets?.length
        ? pdpContent.overview.bullets
        : parseHighlights(html),
      overview,
      pdpContent,
      exterior: pdpContent?.exterior?.length ? pdpContent.exterior : featureSections.exterior,
      interior: pdpContent?.interior?.length ? pdpContent.interior : featureSections.interior,
      technology: pdpContent?.technology,
      performance: pdpContent?.performance,
      safety: pdpContent?.safety,
      specTable: allSpecs,
      fields,
      tagline: (pdpContent?.tagline || overview.title || vehicle.name).slice(0, 100),
      slogan: (pdpContent?.slogan || overview.subtitle || "").slice(0, 220),
    };
  } catch (err) {
    console.warn(`  skip ${vehicle.name}: ${err.message}`);
    return { id, name: vehicle.name, type, error: err.message, sourceUrl: url };
  }
}

function mergeBrowserPatch(results) {
  if (!fs.existsSync(BROWSER_PATCH)) return;
  const patch = JSON.parse(fs.readFileSync(BROWSER_PATCH, "utf8"));
  for (const item of [...(patch.cars ?? []), ...(patch.scooters ?? [])]) {
    if (!item.id || item.error) continue;
    const list = item.type === "car" ? results.cars : results.scooters;
    const idx = list.findIndex((x) => x?.id === item.id);
    const existing = idx >= 0 ? list[idx] : null;
    const merged = existing
      ? {
          ...existing,
          ...item,
          error: undefined,
          pdpContent: item.pdpContent
            ? { ...(existing.pdpContent ?? {}), ...item.pdpContent }
            : existing.pdpContent,
        }
      : { ...item, error: undefined };
    if (idx >= 0) list[idx] = merged;
    else list.push(merged);
  }
  console.log(`Merged browser patch from ${BROWSER_PATCH}`);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(VEHICLES_FILE, "utf8"));
  const pdpUrls = fs.existsSync(path.join(__dirname, "vinfast-pdp-urls.json"))
    ? JSON.parse(fs.readFileSync(path.join(__dirname, "vinfast-pdp-urls.json"), "utf8"))
    : { cars: {}, scooters: {} };
  console.log("Fetching detailed specs from VinFast product pages...\n");

  const results = { cars: [], scooters: [], syncedAt: new Date().toISOString() };

  for (const car of data.cars) {
    const id = CAR_ID_MAP[car.name];
    results.cars.push(await scrapeVehicle(car, "car", pdpUrls.cars?.[id] ?? car.detailHref));
    await new Promise((r) => setTimeout(r, 250));
  }
  for (const scooter of data.scooters) {
    const id = SCOOTER_ID_MAP[scooter.name];
    results.scooters.push(
      await scrapeVehicle(scooter, "scooter", pdpUrls.scooters?.[id] ?? scooter.detailHref),
    );
    await new Promise((r) => setTimeout(r, 250));
  }

  mergeBrowserPatch(results);

  let listingHtml = null;
  try {
    listingHtml = await fetchPage(SCOOTER_LISTING_URL);
    console.log("Loaded scooter listing page for PDP supplement");
  } catch (err) {
    console.warn(`  listing page skip: ${err.message}`);
  }

  if (listingHtml) {
    results.scooters = results.scooters.map((s) =>
      s && !s.error ? supplementFromListing(s, listingHtml) : s,
    );
  }

  if (fs.existsSync(OUT_FILE)) {
    const prev = JSON.parse(fs.readFileSync(OUT_FILE, "utf8"));
    for (const item of [...results.cars, ...results.scooters]) {
      if (!item || item.error) continue;
      const list = item.type === "car" ? prev.cars : prev.scooters;
      const old = list?.find((x) => x?.id === item.id);
      if (!old) continue;
      if (!item.specTable?.length && old.specTable?.length) item.specTable = old.specTable;
      if (!item.brochureContent && old.brochureContent) item.brochureContent = old.brochureContent;
      if (old.brochureUrl && !item.brochureUrl) item.brochureUrl = old.brochureUrl;
      item.fields = { ...(old.fields ?? {}), ...(item.fields ?? {}) };
      if (!item.variants?.length && old.variants?.length) item.variants = old.variants;
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), "utf8");
  const okCars = results.cars.filter((c) => c && !c.error).length;
  const okScooters = results.scooters.filter((s) => s && !s.error).length;
  console.log(`\nWrote ${OUT_FILE}`);
  console.log(
    `Cars: ${okCars}/${data.cars.length}, Scooters: ${okScooters}/${data.scooters.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
