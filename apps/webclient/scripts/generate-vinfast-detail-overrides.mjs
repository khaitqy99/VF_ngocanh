import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { decodeHtml } from "./parse-shop-pdp-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DETAILS_FILE = path.join(__dirname, "vinfast-details.json");
const BROWSER_PATCH = path.join(__dirname, "vinfast-details-browser.json");
const VEHICLES_FILE = path.join(__dirname, "vinfast-vehicles.json");
const GALLERY_FILE = path.join(__dirname, "vinfast-gallery-images.json");
const COLOR_FILE = path.join(__dirname, "vinfast-color-images.json");
const OUT_FILE = path.join(ROOT, "src", "lib", "vinfast-detail-overrides.ts");

const BAD_TEXT_RE =
  /TỶ LỆ MUA LẠI|localStorage|<img|nhận báo giá|đăng ký thành công|typeof\(|BẢO HÀNH & BẢO|đăng ký nhận thông tin|nhận ưu đãi/i;

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

function parsePrice(text) {
  const digits = String(text ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function loadHomepageSalePrices() {
  const prices = {};
  if (!fs.existsSync(VEHICLES_FILE)) return prices;
  const data = JSON.parse(fs.readFileSync(VEHICLES_FILE, "utf8"));
  for (const car of data.cars ?? []) {
    const id = CAR_ID_MAP[car.name];
    if (!id) continue;
    const priceSpec = car.specs?.find((s) => /giá/i.test(s.label));
    if (!priceSpec) continue;
    const sale = parsePrice(priceSpec.value);
    prices[id] = sale || parsePrice(priceSpec.listPrice);
  }
  for (const scooter of data.scooters ?? []) {
    const id = SCOOTER_ID_MAP[scooter.name];
    if (!id) continue;
    const priceSpec = scooter.specs?.find((s) => /giá/i.test(s.label));
    if (!priceSpec) continue;
    const sale = parsePrice(priceSpec.value);
    prices[id] = sale || parsePrice(priceSpec.listPrice);
  }
  return prices;
}

function standardVariantPrice(v, homepagePrice, singleVariant = false) {
  if (singleVariant && homepagePrice) return homepagePrice;
  return v.price ?? homepagePrice ?? v.listPrice;
}

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

const SCOOTER_IMAGE_FILES = {
  "evo-lite-neo": "evo-lite-neo.png",
  "flazz-max": "flazz-max.webp",
  "amio-s": "amio-s.webp",
  "evo-lite": "evo-lite.png",
  amio: "amio.webp",
  viper: "viper.webp",
  "feliz-ii": "feliz-ii.webp",
  evo: "evo.webp",
  zgoo: "zgoo.webp",
  flazz: "flazz.webp",
  "vero-x": "vero-x.webp",
  "feliz-2025": "feliz-2025.webp",
  "evo-grand": "evo-grand.webp",
  "evo-grand-lite": "evo-grand-lite.webp",
  drgnfly: "drgnfly.png",
};

function carImagePath(id) {
  return `/images/vinfast/cars/${id}.webp`
    .replace("vf8-all-new.webp", "vf8-all-new.png")
    .replace("limo-green.webp", "limo-green.png")
    .replace("herio-green.webp", "herio-green.png");
}

function scooterImagePath(id) {
  const file = SCOOTER_IMAGE_FILES[id] ?? `${id}.webp`;
  return `/images/vinfast/scooters/${file}`;
}

function galleryFor(carId, galleries, fallback) {
  const local = (galleries[carId] ?? []).filter((u) => u.startsWith("/"));
  if (local.length) return local;
  return [fallback];
}

function mapFeatureCards(items, images, fallback) {
  if (!items?.length) return undefined;
  const imgs = images.length ? images : [fallback];
  return items
    .filter((e) => e.title && e.desc && !BAD_TEXT_RE.test(e.title + e.desc))
    .slice(0, 4)
    .map((e, i) => ({
      title: e.title.slice(0, 100),
      desc: e.desc.slice(0, 500),
      image: imgs[i % imgs.length] ?? fallback,
    }));
}

function galleryByPattern(gallery, pattern) {
  return gallery.filter((g) => pattern.test(g));
}

function expandExterior(features, gallery, fallback) {
  const extImages = galleryByPattern(gallery, /exterior/i);
  const mapped = mapFeatureCards(
    features,
    extImages.length ? extImages : gallery.filter((_, i) => i % 2 === 0),
    fallback,
  );
  if (!mapped?.length) return mapped;
  if (mapped.length > 1 || extImages.length < 2) return mapped;
  const base = mapped[0];
  return extImages.slice(0, 4).map((image) => ({ ...base, image }));
}

function mapTechnologyItems(items, technologyLead) {
  if (!items?.length) return undefined;
  const lead = sanitizeText(technologyLead, 400);
  return items.slice(0, 6).map((t) => {
    const title = sanitizeText(t.title, 80) || t.title;
    let desc = sanitizeText(t.desc, 400);
    const looksDuplicated =
      desc && (/^Hợp tác cùng những đối tác/i.test(desc) || desc.endsWith(",") || desc.length < 35);
    if (looksDuplicated) {
      if (/trợ lý/i.test(title)) {
        desc =
          "Trợ lý ảo AI hỗ trợ tiếng Việt, điều khiển giọng nói thông minh và kết nối hệ sinh thái dịch vụ trên xe.";
      } else if (/trợ lái/i.test(title)) {
        desc =
          "Hệ thống trợ lái nâng cao cấp độ 2 với các tính năng hỗ trợ giữ làn, kiểm soát tốc độ thông minh và an toàn chủ động.";
      } else if (/dịch vụ thông minh/i.test(title)) {
        desc = "Hệ sinh thái kết nối và dịch vụ tiên tiến trên xe.";
      } else {
        desc = lead || desc || title;
      }
    }
    return { icon: t.icon || "drive", title, desc };
  });
}

function specTableToGroups(specTable) {
  if (!specTable?.length) return undefined;
  const items = specTable
    .filter((s) => s.label && s.value && s.label.length < 80)
    .map((s) => ({ label: s.label, value: s.value }));
  if (!items.length) return undefined;
  return [{ category: "Thông số kỹ thuật (VinFast)", items }];
}

function qualityFeatures(items) {
  return (items ?? []).filter(
    (f) =>
      f?.title &&
      f?.desc &&
      f.title !== f.desc &&
      f.desc.length > 45 &&
      f.title.length < 90 &&
      !BAD_TEXT_RE.test(f.title + f.desc),
  );
}

function pickFeatureSource(brochureList, pdpList, detailList) {
  // PDP/shop pages có mô tả feature cấu trúc tốt hơn; brochure bổ sung khi thiếu
  const fromPdp = qualityFeatures(pdpList);
  if (fromPdp.length) return fromPdp;
  const fromBrochure = qualityFeatures(brochureList);
  if (fromBrochure.length) return fromBrochure;
  return qualityFeatures(detailList);
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

function buildCarOverride(detail, galleries, colorImages, homepagePrices) {
  const fallback = carImagePath(detail.id);
  const gallery = galleryFor(detail.id, galleries, fallback);
  const brochure = detail.brochureContent ?? {};
  const pdp = detail.pdpContent ?? {};
  const useBrochure = Boolean(brochure.tagline || brochure.overview?.title);
  const fields = detail.fields ?? {};
  const homepagePrice = homepagePrices[detail.id];

  const tagline =
    sanitizeText(brochure.tagline || pdp.tagline || detail.tagline, 100) ||
    sanitizeText(parseMetaLeadFromDetail(detail), 100) ||
    sanitizeText(detail.name, 80) ||
    detail.name;
  const slogan =
    sanitizeText(
      brochure.slogan || pdp.slogan || detail.slogan || detail.overview?.subtitle,
      220,
    ) || sanitizeText(detail.overview?.subtitle, 220);

  const badgeSource = useBrochure
    ? (brochure.highlights ?? brochure.overview?.bullets ?? detail.highlights)
    : (detail.highlights ?? pdp.overview?.bullets ?? []);

  const override = {
    tagline,
    badges: badgeSource
      .filter((h) => h.length < 80 && !BAD_TEXT_RE.test(h) && !/BẢO HÀNH & BẢO/i.test(h))
      .slice(0, 2)
      .concat(["Bảo hành chính hãng"])
      .slice(0, 2),
    slogan,
  };

  if (detail.variants?.length) {
    const singleVariant = detail.variants.length === 1;
    override.variants = detail.variants.map((v) => ({
      id: slugify(v.name),
      name: v.name,
      price: standardVariantPrice(v, homepagePrice, singleVariant),
    }));
  } else if (homepagePrice) {
    override.variants = [{ id: detail.id, name: detail.name, price: homepagePrice }];
  }

  const overviewSource = useBrochure ? brochure.overview : (pdp.overview ?? detail.overview);
  if (overviewSource?.title || tagline) {
    override.overview = {
      title: sanitizeText(brochure.tagline || overviewSource?.title || tagline, 120) || detail.name,
      subtitle:
        sanitizeText(brochure.slogan || pdp.slogan || overviewSource?.subtitle, 400) || slogan,
      bullets: (useBrochure
        ? (brochure.highlights ?? pdp.overview?.bullets ?? detail.highlights)
        : (pdp.overview?.bullets ?? detail.highlights ?? [])
      )
        .filter((h) => h.length < 120 && !BAD_TEXT_RE.test(h))
        .slice(0, 4),
      image: gallery[0] ?? fallback,
    };
  }

  const exteriorSource = pickFeatureSource(brochure.exterior, pdp.exterior, detail.exterior);
  const exterior = expandExterior(exteriorSource, gallery, fallback);
  if (exterior?.length) override.exterior = exterior;

  const interiorSource = pickFeatureSource(brochure.interior, pdp.interior, detail.interior);
  const interior = mapFeatureCards(
    interiorSource,
    galleryByPattern(gallery, /interior/i).length
      ? galleryByPattern(gallery, /interior/i)
      : gallery.filter((_, i) => i % 2 === 1),
    gallery[1] ?? fallback,
  );
  if (interior?.length) override.interior = interior;

  const technologySource = useBrochure
    ? (brochure.technology ?? pdp.technology ?? detail.technology)
    : (pdp.technology ?? detail.technology);
  const technology = mapTechnologyItems(
    technologySource,
    useBrochure
      ? (brochure.technologyLead ?? pdp.technologyLead ?? detail.technologyLead)
      : (pdp.technologyLead ?? detail.technologyLead),
  );
  if (technology?.length) override.technology = technology;
  const techLead = useBrochure
    ? (brochure.technologyLead ?? pdp.technologyLead)
    : pdp.technologyLead;
  if (techLead) {
    override.technologySubtitle = sanitizeText(techLead, 220);
  }

  const perfSource = brochure.performance ?? pdp.performance ?? detail.performance;
  if (perfSource) {
    override.performance = {
      title: sanitizeText(perfSource.title, 80) || "HIỆU SUẤT VƯỢT TRỘI",
      subtitle: sanitizeText(perfSource.subtitle, 220) || slogan,
      image: gallery[2] ?? gallery[0] ?? fallback,
      features: (perfSource.features ?? []).slice(0, 4).map((f) => ({
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

  const safeSource = useBrochure
    ? (brochure.safety ?? pdp.safety ?? detail.safety)
    : (pdp.safety ?? detail.safety);
  if (safeSource) {
    const block = {
      title: sanitizeText(safeSource.title, 80) || "AN TOÀN VƯỢT TRỘI",
      subtitle: sanitizeText(safeSource.subtitle, 200) || "Tiêu chuẩn an toàn quốc tế",
      image: gallery[3] ?? gallery[0] ?? fallback,
      features: (safeSource.features ?? []).slice(0, 6).map((f) => ({
        title: f.title.slice(0, 100),
        desc: f.desc.slice(0, 400),
      })),
      highlights: (safeSource.highlights ?? []).slice(0, 6),
    };
    if (/đặc quyền/i.test(block.title)) {
      override.privileges = {
        title: block.title,
        subtitle: block.subtitle,
        image: block.image,
        highlights: block.highlights,
        features:
          mapFeatureCards(safeSource.features, gallery, gallery[3] ?? gallery[0] ?? fallback) ??
          block.features,
      };
    } else {
      override.safety = block;
    }
  }

  if (pdp.charging?.title) {
    override.charging = {
      title: sanitizeText(pdp.charging.title, 80),
      desc: sanitizeText(pdp.charging.desc, 400),
      image: gallery[4] ?? gallery[1] ?? fallback,
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

function buildScooterOverride(detail, homepagePrices) {
  const img = scooterImagePath(detail.id);
  const fields = detail.fields ?? {};
  const brochure = detail.brochureContent ?? {};
  const pdp = detail.pdpContent ?? {};
  const useBrochure = Boolean(brochure.tagline || brochure.overview?.title);
  const homepagePrice = homepagePrices[detail.id];

  const badgeSource = useBrochure
    ? (brochure.highlights ?? brochure.overview?.bullets ?? detail.highlights)
    : (detail.highlights ?? []);

  const override = {
    tagline:
      sanitizeText(brochure.tagline || pdp.tagline || detail.tagline || detail.name, 80) ||
      detail.name,
    badges: badgeSource
      .filter((h) => h.length < 60 && !BAD_TEXT_RE.test(h))
      .slice(0, 2)
      .concat(["Bảo hành chính hãng"])
      .slice(0, 2),
    slogan: sanitizeText(
      brochure.slogan ||
        (detail.slogan &&
        detail.slogan.length < 120 &&
        !/đèn Full LED|thông số, giá bán/i.test(detail.slogan)
          ? detail.slogan
          : pdp.slogan) ||
        detail.slogan ||
        detail.overview?.subtitle,
      200,
    ),
  };

  if (detail.variants?.length) {
    const singleVariant = detail.variants.length === 1;
    override.variants = detail.variants.map((v) => ({
      id: slugify(v.name),
      name: v.name,
      price: standardVariantPrice(v, homepagePrice, singleVariant),
    }));
  } else if (homepagePrice) {
    override.variants = [{ id: detail.id, name: detail.name, price: homepagePrice }];
  }

  const overviewSource = useBrochure ? brochure.overview : (pdp.overview ?? detail.overview);
  if (overviewSource?.title || override.tagline) {
    const o = overviewSource ?? {};
    override.overview = {
      title: sanitizeText(brochure.tagline || o.title, 120) || detail.name,
      subtitle: sanitizeText(brochure.slogan || pdp.slogan || o.subtitle, 300),
      bullets: (brochure.highlights ?? pdp.overview?.bullets ?? detail.highlights ?? []).slice(
        0,
        4,
      ),
      image: img,
    };
  }

  const exteriorSource = pickFeatureSource(brochure.exterior, pdp.exterior, detail.exterior);
  const exterior = mapFeatureCards(exteriorSource, [img], img);
  if (exterior?.length) override.exterior = exterior;

  const designSource = pickFeatureSource(brochure.interior, pdp.interior, detail.interior);
  const design = mapFeatureCards(designSource, [img], img);
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
  const homepagePrices = loadHomepageSalePrices();
  const carOverrides = {};
  const scooterOverrides = {};

  for (const detail of data.cars ?? []) {
    if (!detail?.id || detail.error) continue;
    carOverrides[detail.id] = buildCarOverride(detail, galleries, colorImages, homepagePrices);
  }

  for (const detail of data.scooters ?? []) {
    if (!detail?.id || detail.error) continue;
    scooterOverrides[detail.id] = buildScooterOverride(detail, homepagePrices);
  }

  const content = `// Auto-generated by scripts/generate-vinfast-detail-overrides.mjs
// Source: VinFast brochures + https://vinfastauto.com/vn_vi
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
