import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { decodeHtml } from "./parse-shop-pdp-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DETAILS_FILE = path.join(__dirname, "vinfast-details.json");
const BROWSER_PATCH = path.join(__dirname, "vinfast-details-browser.json");
const GALLERY_FILE = path.join(__dirname, "vinfast-gallery-images.json");
const COLOR_FILE = path.join(__dirname, "vinfast-color-images.json");
const OUT_FILE = path.join(ROOT, "src", "lib", "vinfast-detail-overrides.ts");

const BAD_TEXT_RE =
  /TỶ LỆ MUA LẠI|localStorage|<img|nhận báo giá|đăng ký thành công|typeof\(|BẢO HÀNH & BẢO|đăng ký nhận thông tin|nhận ưu đãi/i;

function parseMetaLeadFromDetail(detail) {
  return detail.pdpContent?.slogan || detail.slogan || detail.overview?.subtitle || "";
}

function loadAllDetails() {
  if (!fs.existsSync(DETAILS_FILE)) return { cars: [], scooters: [] };
  const data = JSON.parse(fs.readFileSync(DETAILS_FILE, "utf8"));
  if (fs.existsSync(BROWSER_PATCH)) {
    const patch = JSON.parse(fs.readFileSync(BROWSER_PATCH, "utf8"));
    for (const item of [...(patch.cars ?? []), ...(patch.scooters ?? [])]) {
      if (!item?.id) continue;
      const list = item.type === "car" ? data.cars : data.scooters;
      const idx = list.findIndex((x) => x?.id === item.id);
      if (idx >= 0) list[idx] = { ...list[idx], ...item, error: undefined };
      else list.push(item);
    }
  }
  return data;
}

function loadGalleries() {
  if (!fs.existsSync(GALLERY_FILE)) return {};
  return JSON.parse(fs.readFileSync(GALLERY_FILE, "utf8")).cars ?? {};
}

function loadColorImages() {
  if (!fs.existsSync(COLOR_FILE)) return {};
  return JSON.parse(fs.readFileSync(COLOR_FILE, "utf8")).cars ?? {};
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeText(text, max) {
  const clean = decodeHtml(String(text ?? ""))
    .replace(/localStorage[\s\S]*/i, "")
    .replace(/if \(typeof[\s\S]*/i, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean || BAD_TEXT_RE.test(clean)) return "";
  return clean.slice(0, max);
}

function carImagePath(id) {
  return `/images/vinfast/cars/${id}.webp`
    .replace("vf8-all-new.webp", "vf8-all-new.png")
    .replace("limo-green.webp", "limo-green.png")
    .replace("herio-green.webp", "herio-green.png");
}

function galleryFor(carId, galleries, fallback) {
  const list = galleries[carId];
  if (list?.length) return list;
  return [fallback];
}

function mapFeatureCards(items, images, fallback) {
  if (!items?.length) return undefined;
  const imgs = images.length ? images : [fallback];
  return items
    .filter((e) => e.title && e.desc && !BAD_TEXT_RE.test(e.title + e.desc))
    .slice(0, 4)
    .map((e, i) => ({
      title: e.title.slice(0, 80),
      desc: e.desc.slice(0, 400),
      image: imgs[i] ?? imgs[imgs.length - 1] ?? fallback,
    }));
}

function specTableToGroups(specTable) {
  if (!specTable?.length) return undefined;
  const items = specTable
    .filter((s) => s.label && s.value && s.label.length < 80)
    .map((s) => ({ label: s.label, value: s.value }));
  if (!items.length) return undefined;
  return [{ category: "Thông số kỹ thuật (VinFast)", items }];
}

function matchColorImage(name, scraped) {
  if (!scraped?.length) return undefined;
  const n = name.toLowerCase();
  const hit = scraped.find((s) => {
    const sname = s.name.toLowerCase();
    return n === sname || n.includes(sname) || sname.includes(n);
  });
  return hit?.image;
}

function buildCarOverride(detail, galleries, colorImages) {
  const fallback = carImagePath(detail.id);
  const gallery = galleryFor(detail.id, galleries, fallback);
  const pdp = detail.pdpContent ?? {};
  const fields = detail.fields ?? {};

  const tagline =
    sanitizeText(pdp.tagline || detail.tagline, 100) ||
    sanitizeText(parseMetaLeadFromDetail(detail), 100) ||
    sanitizeText(detail.name, 80) ||
    detail.name;
  const slogan =
    sanitizeText(pdp.slogan || detail.slogan || detail.overview?.subtitle, 220) ||
    sanitizeText(detail.overview?.subtitle, 220);

  const override = {
    tagline,
    badges: (detail.highlights ?? pdp.overview?.bullets ?? [])
      .filter((h) => h.length < 80 && !BAD_TEXT_RE.test(h) && !/BẢO HÀNH & BẢO/i.test(h))
      .slice(0, 2)
      .concat(["Bảo hành chính hãng"])
      .slice(0, 2),
    slogan,
  };

  if (detail.variants?.length) {
    override.variants = detail.variants.map((v) => ({
      id: slugify(v.name),
      name: v.name,
      price: v.price,
    }));
  }

  const overviewSource = pdp.overview ?? detail.overview;
  if (overviewSource?.title) {
    override.overview = {
      title: sanitizeText(overviewSource.title, 120) || detail.name,
      subtitle: sanitizeText(overviewSource.subtitle, 400) || slogan,
      bullets: (pdp.overview?.bullets ?? detail.highlights ?? [])
        .filter((h) => h.length < 120 && !BAD_TEXT_RE.test(h))
        .slice(0, 4),
      image: gallery[0] ?? fallback,
    };
  }

  const exterior = mapFeatureCards(
    pdp.exterior ?? detail.exterior,
    gallery.filter((_, i) => i % 2 === 0),
    fallback,
  );
  if (exterior?.length) override.exterior = exterior;

  const interior = mapFeatureCards(
    pdp.interior ?? detail.interior,
    gallery.filter((_, i) => i % 2 === 1),
    gallery[1] ?? fallback,
  );
  if (interior?.length) override.interior = interior;

  if (pdp.technology?.length || detail.technology?.length) {
    override.technology = (pdp.technology ?? detail.technology).slice(0, 6);
  }
  if (pdp.technologyLead) {
    override.technologySubtitle = sanitizeText(pdp.technologyLead, 220);
  }

  if (pdp.performance || detail.performance) {
    const perf = pdp.performance ?? detail.performance;
    override.performance = {
      title: sanitizeText(perf.title, 80) || "HIỆU SUẤT VƯỢT TRỘI",
      subtitle: sanitizeText(perf.subtitle, 220) || slogan,
      image: gallery[2] ?? gallery[0] ?? fallback,
      features: (perf.features ?? []).slice(0, 4).map((f) => ({
        title: f.title.slice(0, 80),
        desc: f.desc.slice(0, 220),
      })),
      driveModes: [
        { name: "Eco", desc: "Tiết kiệm năng lượng tối đa" },
        { name: "Normal", desc: "Cân bằng giữa hiệu suất và tiết kiệm" },
        { name: "Sport", desc: "Tăng tốc mạnh mẽ, phản hồi nhanh" },
      ],
    };
  }

  if (pdp.safety || detail.safety) {
    const safe = pdp.safety ?? detail.safety;
    override.safety = {
      title: sanitizeText(safe.title, 80) || "AN TOÀN & ĐẶC QUYỀN",
      subtitle: sanitizeText(safe.subtitle, 200) || "Tiêu chuẩn an toàn và dịch vụ cao cấp",
      image: gallery[3] ?? gallery[0] ?? fallback,
      features: (safe.features ?? []).slice(0, 5).map((f) => ({
        title: f.title.slice(0, 80),
        desc: f.desc.slice(0, 220),
      })),
      highlights: (safe.highlights ?? []).slice(0, 4),
    };
  }

  const specGroups = specTableToGroups(detail.specTable);
  if (specGroups) override.specGroups = specGroups;

  if (fields.range || fields.power) {
    override.quickSpecs = {
      range: fields.range ?? 0,
      power: fields.power ?? 0,
      torque: fields.torque ?? 0,
      acceleration: fields.acceleration || "—",
      topSpeed: (fields.power ?? 0) > 300 ? 200 : (fields.power ?? 0) > 150 ? 175 : 160,
      fastCharge: fields.chargingTime || "—",
    };
  }

  if (detail.colorHex?.length) {
    const scrapedColors = colorImages[detail.id] ?? [];
    override.colors = detail.colorHex.map((c, i) => ({
      id: `color-${i}`,
      name: c.name,
      hex: c.hex,
      image: matchColorImage(c.name, scrapedColors),
    }));
  }

  return override;
}

function buildScooterOverride(detail) {
  const img = `/images/vinfast/scooters/${detail.id}.webp`;
  const fields = detail.fields ?? {};
  const pdp = detail.pdpContent ?? {};

  const override = {
    tagline: sanitizeText(pdp.tagline || detail.tagline || detail.name, 80) || detail.name,
    badges: (detail.highlights ?? [])
      .filter((h) => h.length < 60 && !BAD_TEXT_RE.test(h))
      .slice(0, 2)
      .concat(["Bảo hành chính hãng"])
      .slice(0, 2),
    slogan: sanitizeText(pdp.slogan || detail.slogan || detail.overview?.subtitle, 200),
  };

  if (detail.variants?.length) {
    override.variants = detail.variants.map((v) => ({
      id: slugify(v.name),
      name: v.name,
      price: v.price,
    }));
  }

  if (detail.overview?.title || pdp.overview?.title) {
    const o = pdp.overview ?? detail.overview;
    override.overview = {
      title: sanitizeText(o.title, 120) || detail.name,
      subtitle: sanitizeText(o.subtitle, 300),
      bullets: (pdp.overview?.bullets ?? detail.highlights ?? []).slice(0, 4),
      image: img,
    };
  }

  const exterior = mapFeatureCards(pdp.exterior ?? detail.exterior, [img], img);
  if (exterior?.length) override.exterior = exterior;

  const design = mapFeatureCards(pdp.interior ?? detail.interior, [img], img);
  if (design?.length) override.design = design;

  const specGroups = specTableToGroups(detail.specTable);
  if (specGroups) override.specGroups = specGroups;

  if (fields.range || fields.topSpeed) {
    override.quickSpecs = {
      range: fields.range ?? 0,
      topSpeed: fields.topSpeed ?? 0,
      motorPower: fields.motorPower ?? 0,
      trunk: fields.trunk ?? 0,
      chargingTime: fields.chargingTime || "—",
      weight: fields.weight ?? 0,
    };
  }

  return override;
}

function main() {
  const data = loadAllDetails();
  const galleries = loadGalleries();
  const colorImages = loadColorImages();
  const carOverrides = {};
  const scooterOverrides = {};

  for (const detail of data.cars ?? []) {
    if (!detail?.id || detail.error) continue;
    carOverrides[detail.id] = buildCarOverride(detail, galleries, colorImages);
  }

  for (const detail of data.scooters ?? []) {
    if (!detail?.id || detail.error) continue;
    scooterOverrides[detail.id] = buildScooterOverride(detail);
  }

  const content = `// Auto-generated by scripts/generate-vinfast-detail-overrides.mjs
// Source: VinFast product pages — scripts/vinfast-details.json
// Last synced: ${new Date().toISOString()}

export const VINFAST_CAR_DETAIL_OVERRIDES: Partial<Record<string, Record<string, unknown>>> = ${JSON.stringify(carOverrides, null, 2)};

export const VINFAST_SCOOTER_DETAIL_OVERRIDES: Partial<Record<string, Record<string, unknown>>> = ${JSON.stringify(scooterOverrides, null, 2)};
`;

  fs.writeFileSync(OUT_FILE, content, "utf8");
  execSync(`npx prettier --write "${OUT_FILE}"`, { cwd: ROOT, stdio: "inherit" });
  console.log(
    `Wrote ${OUT_FILE} — ${Object.keys(carOverrides).length} cars, ${Object.keys(scooterOverrides).length} scooters`,
  );
}

main();
