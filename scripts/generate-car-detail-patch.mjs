/**
 * Sinh nội dung PDP chỉnh tay cho tất cả xe ô tô.
 * Chạy: node scripts/generate-car-detail-patch.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DETAILS_FILE = path.join(__dirname, "vinfast-details.json");
const GALLERY_FILE = path.join(__dirname, "vinfast-gallery-images.json");
const MANUAL_FILE = path.join(__dirname, "car-detail-patch-manual.json");
const OUT_FILE = path.join(ROOT, "src", "lib", "vinfast-car-detail-patch.ts");

const SKIP_GENERATE = new Set(["vf8", "vf8-all-new"]);

const DRIVE_MODES = [
  { name: "Eco", desc: "Tiết kiệm năng lượng tối đa" },
  { name: "Normal", desc: "Cân bằng giữa hiệu suất và tiết kiệm" },
  { name: "Sport", desc: "Tăng tốc mạnh mẽ, phản hồi nhanh" },
];

/** Catalog specs — đồng bộ src/lib/cars.ts */
const CATALOG = {
  "vf8-all-new": {
    name: "VF 8 All New",
    subtitle: "SUV điện D-SUV thế hệ mới",
    image: "/images/vinfast/cars/vf8-all-new.png",
    range: 490,
    power: 228,
    torque: 330,
    chargingTime: "Dưới 30 phút (10%-70%)",
    acceleration: "5.5 giây (0-100 km/h)",
    seats: 5,
    tagline: "VF 8 Thế Hệ Mới",
  },
  "vf-mpv7": {
    name: "VF MPV 7",
    subtitle: "MPV điện đa dụng rộng rãi gia đình",
    image: "/images/vinfast/cars/vf-mpv7.webp",
    range: 450,
    power: 201,
    torque: 280,
    chargingTime: "30 phút (10%-70%)",
    acceleration: "8.0 giây (0-100 km/h)",
    seats: 7,
    tagline: "VF MPV 7",
  },
  "ec-van": {
    name: "EC VAN",
    subtitle: "Xe van điện thương mại giao hàng",
    image: "/images/vinfast/cars/ec-van.webp",
    range: 175,
    power: 40,
    torque: 110,
    chargingTime: "45 phút (10-70%)",
    acceleration: "14.0 giây (0-100 km/h)",
    seats: 2,
    tagline: "EC VAN",
  },
  "minio-green": {
    name: "Minio Green",
    subtitle: "MiniCar điện đô thị thời thượng",
    image: "/images/vinfast/cars/minio-green.webp",
    range: 210,
    power: 40,
    torque: 65,
    chargingTime: "40 phút (10-70%)",
    acceleration: "15.0 giây (0-100 km/h)",
    seats: 4,
    tagline: "MINIO GREEN",
  },
  "herio-green": {
    name: "Herio Green",
    subtitle: "SUV điện A-SUV tiết kiệm và linh hoạt",
    image: "/images/vinfast/cars/herio-green.png",
    range: 326,
    power: 134,
    torque: 135,
    chargingTime: "30 phút (10-70%)",
    acceleration: "10.9 giây (0-100 km/h)",
    seats: 5,
    tagline: "HERIO GREEN",
  },
  "nerio-green": {
    name: "Nerio Green",
    subtitle: "SUV điện B-SUV công nghệ và tiện nghi",
    image: "/images/vinfast/cars/nerio-green.webp",
    range: 319,
    power: 201,
    torque: 250,
    chargingTime: "30 phút (10-70%)",
    acceleration: "8.5 giây (0-100 km/h)",
    seats: 5,
    tagline: "NERIO GREEN",
  },
  "limo-green": {
    name: "Limo Green",
    subtitle: "MPV điện dịch vụ đa dụng 7 chỗ",
    image: "/images/vinfast/cars/limo-green.png",
    range: 450,
    power: 201,
    torque: 310,
    chargingTime: "30 phút (10%-70%)",
    acceleration: "8.5 giây (0-100 km/h)",
    seats: 7,
    tagline: "LIMO GREEN",
  },
  vf3: {
    name: "VF 3",
    subtitle: "Mini SUV điện độc đáo và cá tính",
    image: "/images/vinfast/cars/vf3.webp",
    range: 210,
    power: 40,
    torque: 110,
    chargingTime: "36 phút (10% - 70%)",
    acceleration: "19.3 giây (0-100 km/h)",
    seats: 4,
    tagline: "Mini car quốc dân",
  },
  vf5: {
    name: "VF 5",
    subtitle: "SUV điện đô thị nhỏ gọn",
    image: "/images/vinfast/cars/vf5.webp",
    range: 326,
    power: 134,
    torque: 135,
    chargingTime: "30 phút (10-70%)",
    acceleration: "10.9 giây (0-100 km/h)",
    seats: 5,
    tagline: "Cá nhân vượt trội",
  },
  vf6: {
    name: "VF 6",
    subtitle: "SUV điện đô thị lý tưởng hạng B",
    image: "/images/vinfast/cars/vf6.webp",
    range: 480,
    power: 201,
    torque: 310,
    chargingTime: "25 phút (10%-70%)",
    acceleration: "8.5 giây (0-100 km/h)",
    seats: 5,
    tagline: "SUV đô thị hạng B",
  },
  vf7: {
    name: "VF 7",
    subtitle: "SUV cỡ C thời thượng và thể thao",
    image: "/images/vinfast/cars/vf7.webp",
    range: 496,
    power: 349,
    torque: 500,
    chargingTime: "26 phút (10-70%)",
    acceleration: "5.8 giây (0-100 km/h)",
    seats: 5,
    tagline: "SUV cỡ C thể thao",
  },
  vf8: {
    name: "VF 8",
    subtitle: "SUV điện thông minh hạng D",
    image: "/images/vinfast/cars/vf8.webp",
    range: 562,
    power: 402,
    torque: 620,
    chargingTime: "31 phút (10%-70%)",
    acceleration: "5.5 giây (0-100 km/h)",
    seats: 5,
    tagline: "Sự lựa chọn xứng tầm",
  },
  vf9: {
    name: "VF 9",
    subtitle: "SUV điện cao cấp hạng E",
    image: "/images/vinfast/cars/vf9.webp",
    range: 626,
    power: 402,
    torque: 620,
    chargingTime: "35 phút (10%-70%)",
    acceleration: "7.5 giây (0-100 km/h)",
    seats: 7,
    tagline: "Sự lựa chọn của người thành đạt",
  },
};

const BAD_RE =
  /đặt cọc|xem bảng giá|tại đây|100\s*km\/h|-->|\blocalStorage\b|nhận báo giá/i;

function clean(text, max = 280) {
  if (!text) return "";
  return String(text)
    .replace(/\s+/g, " ")
    .replace(/đặt cọc[^.]*\.?/gi, "")
    .replace(/xem bảng giá[^.]*\.?/gi, "")
    .replace(/tại đây!?/gi, "")
    .trim()
    .slice(0, max);
}

function cleanCopy(text, fallback, max = 280) {
  const result = clean(text, max);
  if (!result || BAD_RE.test(result) || result.length < 12) return fallback;
  return result;
}

function isGoodFeature(f) {
  if (!f?.title || !f?.desc) return false;
  const blob = `${f.title} ${f.desc}`;
  if (BAD_RE.test(blob)) return false;
  if (f.title.length < 6 || f.desc.length < 20) return false;
  return true;
}

function pickImages(id, galleryData, fallback) {
  const gallery = galleryData.cars ?? galleryData;
  const imgs = gallery[id]?.length ? [...gallery[id]] : [];
  if (!imgs.includes(fallback)) imgs.unshift(fallback);
  return imgs;
}

function imgAt(imgs, i) {
  return imgs[i] ?? imgs[imgs.length - 1] ?? imgs[0];
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildBadges(meta) {
  return [
    `Quãng đường ${meta.range} km`,
    `Công suất ${meta.power} hp / ${meta.torque} Nm`,
  ];
}

function buildOverviewBullets(meta) {
  return [
    `Quãng đường ${meta.range} km mỗi lần sạc đầy`,
    `Công suất ${meta.power} hp — mô-men xoắn ${meta.torque} Nm`,
    meta.acceleration !== "—" ? `Tăng tốc ${meta.acceleration}` : null,
    `${meta.seats} chỗ ngồi — pin LFP an toàn`,
  ].filter(Boolean);
}

function defaultExterior(name, imgs) {
  return [
    {
      title: "Thiết kế ngoại thất hiện đại",
      desc: `${name} sở hữu ngôn ngữ thiết kế trẻ trung, khí động học tối ưu và đèn LED đặc trưng VinFast.`,
      image: imgAt(imgs, 1),
    },
    {
      title: "Đèn chiếu sáng LED thông minh",
      desc: "Hệ thống đèn full-LED tăng khả năng quan sát ban đêm và tạo dấu ấn nhận diện mạnh mẽ.",
      image: imgAt(imgs, 2),
    },
    {
      title: "La-zăng hợp kim thể thao",
      desc: "Mâm xe hợp kim thiết kế đa chấu, tăng vẻ thể thao và ổn định khi vận hành.",
      image: imgAt(imgs, 3),
    },
    {
      title: "Cảm biến hỗ trợ quan sát",
      desc: "Camera và cảm biến hỗ trợ quan sát, đỗ xe an toàn trong không gian chật hẹp.",
      image: imgAt(imgs, 4),
    },
  ];
}

function defaultInterior(name, imgs) {
  return [
    {
      title: "Không gian nội thất rộng rãi",
      desc: `Cabin ${name} thiết kế tối ưu, vật liệu cao cấp và ánh sáng tự nhiên cho trải nghiệm thoải mái.`,
      image: imgAt(imgs, 5),
    },
    {
      title: "Màn hình giải trí thông minh",
      desc: "Màn hình cảm ứng trung tâm, kết nối VinFast App và điều khiển tiện ích trực quan.",
      image: imgAt(imgs, 6),
    },
    {
      title: "Ghế ngồi ergonomic",
      desc: "Ghế thiết kế ôm lưng, hỗ trợ thoải mái trên hành trình dài trong đô thị và cao tốc.",
      image: imgAt(imgs, 7),
    },
    {
      title: "Tiện nghi hàng ghế sau",
      desc: "Không gian hàng ghế sau và cốp xe linh hoạt, đáp ứng nhu cầu gia đình hàng ngày.",
      image: imgAt(imgs, 8),
    },
  ];
}

function mapFeatureCards(items, imgs, fallback, max = 4) {
  const good = (items || []).filter(isGoodFeature);
  if (good.length < 2) return null;
  return good.slice(0, max).map((f, i) => ({
    title: clean(f.title, 80),
    desc: clean(f.desc, 220),
    image: imgAt(imgs, i + 1) || fallback,
  }));
}

function buildTechnology(name) {
  return [
    {
      icon: "voice",
      title: "Trợ lý ảo ViVi",
      desc: "Điều khiển bằng giọng nói tiếng Việt — điều hòa, giải trí, dẫn đường và tiện ích thông minh.",
    },
    {
      icon: "adas",
      title: "Hệ thống ADAS",
      desc: "Hỗ trợ lái nâng cao với cảnh báo va chạm, giữ làn và camera quan sát toàn cảnh.",
    },
    {
      icon: "app",
      title: "Ứng dụng VinFast",
      desc: "Theo dõi trạng thái xe, điều khiển từ xa và đặt lịch bảo dưỡng qua điện thoại.",
    },
    {
      icon: "fota",
      title: "Cập nhật FOTA",
      desc: "Nâng cấp phần mềm từ xa, luôn cập nhật tính năng mới nhất cho xe.",
    },
  ];
}

function buildSafety(name, img) {
  return {
    title: "AN TOÀN VƯỢT TRỘI",
    subtitle: `Hệ thống an toàn chủ động và thụ động bảo vệ toàn diện trên ${name}`,
    image: img,
    features: [
      {
        title: "Camera quan sát",
        desc: "Hỗ trợ quan sát và đỗ xe an toàn trong không gian hẹp.",
      },
      {
        title: "Cảnh báo va chạm",
        desc: "Phát hiện và cảnh báo nguy cơ va chạm phía trước.",
      },
      {
        title: "Hỗ trợ giữ làn",
        desc: "Cảnh báo lệch làn và hỗ trợ giữ làn đường khi di chuyển.",
      },
      {
        title: "Khung xe vững chắc",
        desc: "Kết cấu thân vỏ chịu lực, túi khí bảo vệ hành khách toàn diện.",
      },
    ],
    highlights: ["ADAS", "Pin LFP an toàn", "ASEAN NCAP"],
  };
}

function buildPerformance(meta, imgs) {
  return {
    title: "HIỆU SUẤT VƯỢT TRỘI",
    subtitle: `Quãng đường ${meta.range} km — công suất ${meta.power} hp`,
    image: imgAt(imgs, 2),
    features: [
      {
        title: `Công suất ${meta.power} hp`,
        desc: `Động cơ điện mạnh mẽ với mô-men xoắn ${meta.torque} Nm, vận hành êm ái và phản hồi nhanh.`,
      },
      {
        title: `Quãng đường ${meta.range} km`,
        desc: "Pin LFP cho phép di chuyển xa trên một lần sạc đầy, phù hợp đô thị và hành trình dài.",
      },
      {
        title: "Sạc nhanh tiện lợi",
        desc: `Sạc DC ${meta.chargingTime} tại trạm V-Green hoặc sạc tại nhà qua đêm.`,
      },
      {
        title: "3 chế độ lái",
        desc: "Eco, Normal và Sport — tùy chỉnh theo phong cách lái của bạn.",
      },
    ],
    driveModes: DRIVE_MODES,
  };
}

function buildCharging(name, img) {
  return {
    title: "Giải pháp Pin và Trạm sạc",
    desc: `VinFast cung cấp đa dạng giải pháp sạc cho ${name} — trạm V-Green, sạc tại nhà và bộ sạc di động tiện lợi.`,
    image: img,
  };
}

function specTableToGroups(specTable) {
  if (!specTable?.length) return undefined;
  const items = specTable
    .filter((r) => r?.label && r?.value)
    .map((r) => ({ label: r.label, value: String(r.value) }));
  if (!items.length) return undefined;
  return [{ category: "Thông số kỹ thuật (VinFast)", items }];
}

function buildVariants(detail) {
  if (!detail?.variants?.length) return undefined;
  const single = detail.variants.length === 1;
  return detail.variants.map((v) => ({
    id: slugify(v.name) || slugify(detail.name),
    name: v.name.replace(/\u200b/g, "").trim(),
    price: v.price,
  }));
}

function buildPatch(id, detail, gallery) {
  const meta = CATALOG[id];
  if (!meta) return null;

  const imgs = pickImages(id, gallery, meta.image);
  const pdp = detail?.pdpContent ?? {};
  const name = meta.name;

  const slogan = cleanCopy(
    pdp.slogan || detail?.slogan || detail?.overview?.subtitle,
    meta.subtitle,
    200,
  );

  const overviewTitle = cleanCopy(
    pdp.overview?.title || detail?.overview?.title,
    meta.subtitle,
    100,
  );
  const overviewSubtitle = cleanCopy(
    pdp.overview?.subtitle || detail?.overview?.subtitle || slogan,
    meta.subtitle,
    220,
  );

  const exterior =
    mapFeatureCards(
      pdp.exterior || detail?.exterior,
      imgs,
      meta.image,
    ) ?? defaultExterior(name, imgs);

  const interior =
    mapFeatureCards(
      pdp.interior || detail?.interior,
      imgs,
      meta.image,
    ) ?? defaultInterior(name, imgs);

  const highlights = (detail?.highlights || pdp.overview?.bullets || [])
    .map((h) => clean(h, 80))
    .filter((h) => h.length > 10 && !BAD_RE.test(h));

  const bullets =
    highlights.length >= 2 ? highlights.slice(0, 4) : buildOverviewBullets(meta);

  const patch = {
    tagline: cleanCopy(pdp.tagline || detail?.tagline, meta.tagline, 80) || meta.tagline,
    badges: buildBadges(meta),
    slogan,
    overview: {
      title: overviewTitle,
      subtitle: overviewSubtitle,
      bullets,
      image: imgAt(imgs, 0),
    },
    exterior,
    interior,
    technology: buildTechnology(name),
    technologySubtitle: `${name} tích hợp hệ sinh thái thông minh VinFast — kết nối, an toàn và tiện nghi trên mọi hành trình.`,
    performance: buildPerformance(meta, imgs),
    safety: buildSafety(name, imgAt(imgs, 3)),
    charging: buildCharging(name, "/images/vinfast/charging/pin-oto.webp"),
    quickSpecs: {
      range: meta.range,
      power: meta.power,
      torque: meta.torque,
      acceleration: meta.acceleration?.includes("giây") ? meta.acceleration : "—",
      topSpeed: meta.power > 300 ? 200 : meta.power > 150 ? 175 : 160,
      fastCharge: meta.chargingTime,
    },
  };

  const variants = buildVariants(detail);
  if (variants) patch.variants = variants;

  const specGroups = specTableToGroups(detail?.specTable);
  if (specGroups) patch.specGroups = specGroups;

  // VF 9: chỉ bổ sung safety nếu thiếu — giữ privileges từ override gốc
  if (id === "vf9") {
    return {
      safety: patch.safety,
      badges: ["Quãng đường 626 km", "Công suất 402 hp / 620 Nm"],
      technologySubtitle: patch.technologySubtitle,
    };
  }

  return patch;
}

function exportManualFromVf8File() {
  const vf8Path = path.join(ROOT, "src", "lib", "vinfast-vf8-detail-patch.ts");
  if (!fs.existsSync(vf8Path)) return {};
  // Đọc manual từ file cũ nếu chưa có JSON
  if (fs.existsSync(MANUAL_FILE)) {
    return JSON.parse(fs.readFileSync(MANUAL_FILE, "utf8"));
  }
  return null;
}

function main() {
  const details = JSON.parse(fs.readFileSync(DETAILS_FILE, "utf8"));
  const gallery = JSON.parse(fs.readFileSync(GALLERY_FILE, "utf8"));

  const detailById = Object.fromEntries((details.cars ?? []).map((c) => [c.id, c]));

  const generated = {};
  for (const id of Object.keys(CATALOG)) {
    if (SKIP_GENERATE.has(id)) continue;
    const patch = buildPatch(id, detailById[id], gallery);
    if (patch) generated[id] = patch;
  }

  let manual = {};
  if (fs.existsSync(MANUAL_FILE)) {
    manual = JSON.parse(fs.readFileSync(MANUAL_FILE, "utf8"));
  } else {
    // Export vf8 từ file TS hiện có lần đầu
    const vf8Ts = path.join(ROOT, "src", "lib", "vinfast-vf8-detail-patch.ts");
    if (fs.existsSync(vf8Ts)) {
      console.log("Note: Tạo scripts/car-detail-patch-manual.json từ vf8 patch — dùng file hiện tại.");
    }
  }

  // Đọc manual vf8 từ file ts bằng dynamic import không khả thi — dùng JSON hoặc inline
  const manualFromVf8 = fs.existsSync(path.join(ROOT, "src", "lib", "vinfast-vf8-detail-patch.ts"))
    ? null
    : null;

  const content = `// Auto-generated by scripts/generate-car-detail-patch.mjs
// Nội dung PDP chỉnh tay — ưu tiên hơn vinfast-detail-overrides.ts
// Last synced: ${new Date().toISOString()}

import type { CarDetail } from "./car-details";

/** VF 8 / VF 8 All New — chỉnh tay chi tiết */
import { VF8_DETAIL_PATCHES } from "./vinfast-vf8-detail-patch";

const GENERATED_PATCHES: Partial<Record<string, Partial<CarDetail>>> = ${JSON.stringify(generated, null, 2)};

export const CAR_DETAIL_PATCHES: Partial<Record<string, Partial<CarDetail>>> = {
  ...GENERATED_PATCHES,
  ...VF8_DETAIL_PATCHES,
};
`;

  fs.writeFileSync(OUT_FILE, content, "utf8");
  execSync(`npx prettier --write "${OUT_FILE}"`, { cwd: ROOT, stdio: "inherit" });
  console.log(
    `Wrote ${OUT_FILE} — ${Object.keys(generated).length} generated + VF8 manual patches`,
  );
}

main();
