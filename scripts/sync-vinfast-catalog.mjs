import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(__dirname, "vinfast-vehicles.json");
const DETAILS_FILE = path.join(__dirname, "vinfast-details.json");
const BROWSER_PATCH = path.join(__dirname, "vinfast-details-browser.json");
const COLOR_IMAGES_FILE = path.join(__dirname, "vinfast-color-images.json");
const OUT_HOME = path.join(ROOT, "src", "lib", "vinfast-home.ts");
const OUT_CARS = path.join(ROOT, "src", "lib", "cars.ts");
const OUT_SCOOTERS = path.join(ROOT, "src", "lib", "scooters.ts");
const IMG_DIR = path.join(ROOT, "public", "images", "vinfast");

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

const CAR_IMAGE_FILES = {
  vf9: "vf9.webp",
  "vf8-all-new": "vf8-all-new.png",
  "vf-mpv7": "vf-mpv7.webp",
  "ec-van": "ec-van.webp",
  "minio-green": "minio-green.webp",
  "herio-green": "herio-green.png",
  "nerio-green": "nerio-green.webp",
  "limo-green": "limo-green.png",
  vf3: "vf3.webp",
  vf5: "vf5.webp",
  vf6: "vf6.webp",
  vf7: "vf7.webp",
  vf8: "vf8.webp",
};

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

/** Preserve detailed specs from prior catalog where VinFast homepage only shows summary */
const CAR_ENRICHMENT = {
  vf9: {
    subtitle: "SUV điện cao cấp hạng E",
    power: 402,
    torque: 620,
    batteryCapacity: 123,
    chargingTime: "35 phút (10-70%)",
    dimensions: "5.118 x 2.254 x 1.696 mm",
    batteryPurchasePrice: 218_000_000,
    rentBatteryPrice: 3_200_000,
    acceleration: "7.5 giây (0-100 km/h)",
    drive: "awd",
    isBestSeller: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Cam Sunset Orange", hex: "#D97706" },
    ],
  },
  "vf8-all-new": {
    subtitle: "SUV điện D-SUV thế hệ mới",
    power: 402,
    torque: 620,
    batteryCapacity: 88.3,
    chargingTime: "31 phút (10-70%)",
    dimensions: "4.750 x 1.934 x 1.667 mm",
    batteryPurchasePrice: 159_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.5 giây (0-100 km/h)",
    drive: "awd",
    isNew: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
    ],
  },
  "vf-mpv7": {
    subtitle: "MPV điện đa dụng rộng rãi gia đình",
    power: 201,
    torque: 310,
    batteryCapacity: 75.3,
    chargingTime: "28 phút (10-70%)",
    dimensions: "4.620 x 1.860 x 1.720 mm",
    batteryPurchasePrice: 120_000_000,
    rentBatteryPrice: 2_500_000,
    acceleration: "8.0 giây (0-100 km/h)",
    drive: "fwd",
    isNew: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Xanh dương", hex: "#2563EB" },
    ],
  },
  "ec-van": {
    subtitle: "Xe van điện thương mại giao hàng",
    power: 60,
    torque: 150,
    batteryCapacity: 35.8,
    chargingTime: "45 phút (10-70%)",
    dimensions: "4.200 x 1.680 x 1.900 mm",
    batteryPurchasePrice: 55_000_000,
    rentBatteryPrice: 1_100_000,
    acceleration: "14.0 giây (0-100 km/h)",
    drive: "fwd",
    colors: [
      { name: "Trắng công sở", hex: "#FFFFFF" },
      { name: "Bạc công nghiệp", hex: "#D1D5DB" },
    ],
  },
  "minio-green": {
    subtitle: "MiniCar điện đô thị thời thượng",
    power: 50,
    torque: 110,
    batteryCapacity: 22,
    chargingTime: "40 phút (10-70%)",
    dimensions: "3.520 x 1.610 x 1.510 mm",
    batteryPurchasePrice: 45_000_000,
    rentBatteryPrice: 850_000,
    acceleration: "15.0 giây (0-100 km/h)",
    drive: "fwd",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Vàng cá tính", hex: "#FBBF24" },
      { name: "Hồng mộng mơ", hex: "#F472B6" },
      { name: "Xanh lá sáng", hex: "#34D399" },
    ],
  },
  "herio-green": {
    subtitle: "SUV điện A-SUV tiết kiệm và linh hoạt",
    power: 134,
    torque: 135,
    batteryCapacity: 37.23,
    chargingTime: "30 phút (10-70%)",
    dimensions: "3.965 x 1.720 x 1.580 mm",
    batteryPurchasePrice: 80_000_000,
    rentBatteryPrice: 1_600_000,
    acceleration: "10.9 giây (0-100 km/h)",
    drive: "fwd",
    isNew: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh dương", hex: "#2563EB" },
    ],
  },
  "nerio-green": {
    subtitle: "SUV điện B-SUV công nghệ và tiện nghi",
    power: 201,
    torque: 250,
    batteryCapacity: 59.6,
    chargingTime: "30 phút (10-70%)",
    dimensions: "4.238 x 1.820 x 1.594 mm",
    batteryPurchasePrice: 90_000_000,
    rentBatteryPrice: 1_800_000,
    acceleration: "8.5 giây (0-100 km/h)",
    drive: "fwd",
    isNew: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
    ],
  },
  "limo-green": {
    subtitle: "MPV điện dịch vụ đa dụng 7 chỗ",
    power: 201,
    torque: 310,
    batteryCapacity: 75.3,
    chargingTime: "28 phút (10-70%)",
    dimensions: "4.620 x 1.860 x 1.720 mm",
    batteryPurchasePrice: 120_000_000,
    rentBatteryPrice: 2_500_000,
    acceleration: "8.5 giây (0-100 km/h)",
    drive: "fwd",
    colors: [
      { name: "Trắng công sở", hex: "#FFFFFF" },
      { name: "Bạc công nghiệp", hex: "#D1D5DB" },
      { name: "Xanh lá thương mại", hex: "#059669" },
    ],
  },
  vf3: {
    subtitle: "Mini SUV điện độc đáo và cá tính",
    power: 40,
    torque: 110,
    batteryCapacity: 18.64,
    chargingTime: "36 phút (10-70%)",
    dimensions: "3.190 x 1.679 x 1.622 mm",
    batteryPurchasePrice: 50_000_000,
    rentBatteryPrice: 900_000,
    acceleration: "19.3 giây (0-100 km/h)",
    drive: "rwd",
    isNew: true,
    isBestSeller: true,
    colors: [
      { name: "Vàng cá tính", hex: "#FBBF24" },
      { name: "Xanh lá sáng", hex: "#34D399" },
      { name: "Hồng mộng mơ", hex: "#F472B6" },
      { name: "Xanh biển nhạt", hex: "#22D3EE" },
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
    ],
  },
  vf5: {
    subtitle: "SUV điện đô thị nhỏ gọn",
    power: 134,
    torque: 135,
    batteryCapacity: 37.23,
    chargingTime: "30 phút (10-70%)",
    dimensions: "3.965 x 1.720 x 1.580 mm",
    batteryPurchasePrice: 80_000_000,
    rentBatteryPrice: 1_600_000,
    acceleration: "10.9 giây (0-100 km/h)",
    drive: "fwd",
    isBestSeller: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh dương", hex: "#2563EB" },
      { name: "Vàng cát", hex: "#D97706" },
      { name: "Đỏ tươi", hex: "#DC2626" },
    ],
  },
  vf6: {
    subtitle: "SUV điện đô thị lý tưởng hạng B",
    power: 201,
    torque: 250,
    batteryCapacity: 59.6,
    chargingTime: "30 phút (10-70%)",
    dimensions: "4.238 x 1.820 x 1.594 mm",
    batteryPurchasePrice: 90_000_000,
    rentBatteryPrice: 1_800_000,
    acceleration: "8.5 giây (0-100 km/h)",
    drive: "fwd",
    isPromo: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Cam Sunset Orange", hex: "#D97706" },
    ],
  },
  vf7: {
    subtitle: "SUV cỡ C thời thượng và thể thao",
    power: 349,
    torque: 500,
    batteryCapacity: 75.3,
    chargingTime: "26 phút (10-70%)",
    dimensions: "4.545 x 1.890 x 1.635 mm",
    batteryPurchasePrice: 149_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.8 giây (0-100 km/h)",
    drive: "fwd",
    isNew: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Đỏ Crimson Red", hex: "#B91C1C" },
    ],
  },
  vf8: {
    subtitle: "SUV điện thông minh hạng D",
    power: 402,
    torque: 620,
    batteryCapacity: 88.3,
    chargingTime: "31 phút (10-70%)",
    dimensions: "4.750 x 1.934 x 1.667 mm",
    batteryPurchasePrice: 159_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.5 giây (0-100 km/h)",
    drive: "awd",
    isBestSeller: true,
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Đỏ Crimson Red", hex: "#B91C1C" },
    ],
  },
};

const SCOOTER_ENRICHMENT = {
  "evo-lite-neo": {
    subtitle: "Xe máy điện học sinh nhỏ gọn, không cần bằng lái",
    type: "xe-co-ban",
    batteryType: "LFP",
    chargingTime: "4 giờ (0-100%)",
    dimensions: "1.750 x 680 x 1.100 mm",
    weight: 85,
    batteryPurchasePrice: 12_000_000,
    rentBatteryPrice: 150_000,
    acceleration: "0-45 km/h trong 8 giây",
    colors: [
      { name: "Cam Sunset", hex: "#EA580C" },
      { name: "Xanh dương", hex: "#1D4ED8" },
      { name: "Trắng", hex: "#FFFFFF" },
    ],
    isNew: true,
  },
  "flazz-max": {
    subtitle: "Xe máy điện phổ thông công suất cao",
    type: "xe-co-ban",
    batteryType: "LFP",
    chargingTime: "4 giờ (0-100%)",
    dimensions: "1.720 x 680 x 1.080 mm",
    weight: 88,
    batteryPurchasePrice: 12_500_000,
    rentBatteryPrice: 150_000,
    acceleration: "0-45 km/h trong 7.5 giây",
    colors: [{ name: "Trắng", hex: "#FFFFFF" }, { name: "Đen", hex: "#111827" }],
  },
  "amio-s": {
    subtitle: "Xe máy điện an toàn tốc độ 25 km/h",
    type: "xe-dap-dien",
    batteryType: "Lithium-ion",
    chargingTime: "4 giờ (0-100%)",
    dimensions: "1.650 x 650 x 1.050 mm",
    weight: 65,
    batteryPurchasePrice: 8_000_000,
    rentBatteryPrice: 120_000,
    acceleration: "0-25 km/h trong 5 giây",
    colors: [{ name: "Trắng", hex: "#FFFFFF" }, { name: "Xanh", hex: "#2563EB" }],
  },
  "evo-lite": {
    subtitle: "Xe máy điện phổ thông quãng đường dài",
    type: "xe-co-ban",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.804 x 680 x 1.127 mm",
    weight: 97,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 250_000,
    acceleration: "0-49 km/h trong 8 giây",
    colors: [{ name: "Đỏ", hex: "#DC2626" }, { name: "Trắng", hex: "#FFFFFF" }],
    isBestSeller: true,
  },
  amio: {
    subtitle: "Xe máy điện đô thị tiện lợi",
    type: "xe-co-ban",
    batteryType: "Lithium-ion",
    chargingTime: "4 giờ (0-100%)",
    dimensions: "1.650 x 650 x 1.050 mm",
    weight: 68,
    batteryPurchasePrice: 8_600_000,
    rentBatteryPrice: 150_000,
    acceleration: "0-30 km/h trong 5 giây",
    colors: [{ name: "Trắng", hex: "#FFFFFF" }, { name: "Xanh", hex: "#2563EB" }],
  },
  viper: {
    subtitle: "Xe máy điện thể thao mạnh mẽ",
    type: "xe-ga-cao-cap",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.900 x 700 x 1.150 mm",
    weight: 120,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 4.5 giây",
    colors: [{ name: "Đen", hex: "#111827" }, { name: "Đỏ", hex: "#DC2626" }],
  },
  "feliz-ii": {
    subtitle: "Xe ga điện thanh lịch châu Âu",
    type: "xe-ga",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.912 x 693 x 1.128 mm",
    weight: 110,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.8 giây",
    colors: [{ name: "Xanh lục", hex: "#065F46" }, { name: "Trắng", hex: "#FFFFFF" }],
    isBestSeller: true,
  },
  evo: {
    subtitle: "Mẫu xe máy điện quốc dân đa dụng",
    type: "xe-co-ban",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.804 x 680 x 1.127 mm",
    weight: 100,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 250_000,
    acceleration: "0-50 km/h trong 6 giây",
    colors: [{ name: "Xanh dương", hex: "#1D4ED8" }, { name: "Đỏ", hex: "#DC2626" }],
    isBestSeller: true,
  },
  zgoo: {
    subtitle: "Xe máy điện đô thị nhỏ gọn",
    type: "xe-co-ban",
    batteryType: "LFP",
    chargingTime: "5 giờ (0-100%)",
    dimensions: "1.700 x 680 x 1.100 mm",
    weight: 90,
    batteryPurchasePrice: 15_000_000,
    rentBatteryPrice: 200_000,
    acceleration: "0-39 km/h trong 7 giây",
    colors: [{ name: "Trắng", hex: "#FFFFFF" }, { name: "Xanh", hex: "#34D399" }],
  },
  flazz: {
    subtitle: "Xe máy điện phổ thông 2 pin",
    type: "xe-co-ban",
    batteryType: "LFP",
    chargingTime: "5 giờ (0-100%)",
    dimensions: "1.720 x 680 x 1.080 mm",
    weight: 92,
    batteryPurchasePrice: 16_000_000,
    rentBatteryPrice: 200_000,
    acceleration: "0-39 km/h trong 7 giây",
    colors: [{ name: "Trắng", hex: "#FFFFFF" }, { name: "Đen", hex: "#111827" }],
  },
  "vero-x": {
    subtitle: "Xe ga điện cao cấp quãng đường dài",
    type: "xe-ga-cao-cap",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.950 x 720 x 1.180 mm",
    weight: 125,
    batteryPurchasePrice: 22_000_000,
    rentBatteryPrice: 390_000,
    acceleration: "0-50 km/h trong 4.2 giây",
    colors: [{ name: "Đen", hex: "#111827" }, { name: "Trắng", hex: "#FFFFFF" }],
    isBestSeller: true,
  },
  "feliz-2025": {
    subtitle: "Xe ga điện thế hệ mới 2025",
    type: "xe-ga",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.912 x 693 x 1.128 mm",
    weight: 112,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.5 giây",
    colors: [{ name: "Xanh lục", hex: "#065F46" }, { name: "Đỏ", hex: "#991B1B" }],
    isNew: true,
  },
  "evo-grand": {
    subtitle: "Xe ga điện cỡ lớn tiện nghi",
    type: "xe-ga",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.920 x 700 x 1.140 mm",
    weight: 115,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.8 giây",
    colors: [{ name: "Trắng", hex: "#FFFFFF" }, { name: "Đen", hex: "#111827" }],
  },
  "evo-grand-lite": {
    subtitle: "Xe ga điện tiết kiệm, dễ sử dụng",
    type: "xe-ga",
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.920 x 700 x 1.140 mm",
    weight: 110,
    batteryPurchasePrice: 18_000_000,
    rentBatteryPrice: 300_000,
    acceleration: "0-48 km/h trong 7 giây",
    colors: [{ name: "Trắng", hex: "#FFFFFF" }, { name: "Xanh", hex: "#2563EB" }],
  },
  drgnfly: {
    subtitle: "Xe đạp điện thông minh đa dụng",
    type: "xe-dap-dien",
    batteryType: "Lithium-ion",
    chargingTime: "5 giờ (0-100%)",
    dimensions: "1.750 x 600 x 1.100 mm",
    weight: 28,
    batteryPurchasePrice: 10_000_000,
    rentBatteryPrice: 0,
    acceleration: "Hỗ trợ pedal-assist",
    colors: [{ name: "Đen", hex: "#111827" }, { name: "Xám", hex: "#6B7280" }],
    isNew: true,
  },
};

function parsePrice(text) {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function parseRange(text) {
  const rangeMatch = text.match(/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)/);
  if (rangeMatch) {
    const a = parseFloat(rangeMatch[1].replace(",", "."));
    const b = parseFloat(rangeMatch[2].replace(",", "."));
    return Math.round((a + b) / 2);
  }
  const single = text.match(/(\d+(?:[.,]\d+)?)/);
  return single ? Math.round(parseFloat(single[1].replace(",", "."))) : 0;
}

function parseSeats(text) {
  if (text.includes("6-7") || text.includes("6–7")) return 7;
  const m = text.match(/(\d+)/);
  return m ? Number(m[1]) : 5;
}

function parseMotorPower(specs) {
  for (const s of specs) {
    if (/công suất/i.test(s.label)) {
      const m = s.value.match(/(\d+)/);
      if (m) return Number(m[1]);
    }
  }
  return 1500;
}

function parseTrunk(specs) {
  for (const s of specs) {
    if (/cốp/i.test(s.label)) {
      const m = s.value.match(/(\d+)/);
      if (m) return Number(m[1]);
    }
  }
  return 0;
}

function parseTopSpeed(specs) {
  for (const s of specs) {
    if (/tốc độ/i.test(s.label)) {
      const m = s.value.match(/(\d+)/);
      if (m) return Number(m[1]);
    }
  }
  return 49;
}

function parseScooterRange(specs) {
  for (const s of specs) {
    if (/quãng đường/i.test(s.label)) {
      const val = parseRange(s.value.replace(/~|\/lần sạc/gi, ""));
      if (val) return val;
    }
  }
  return 80;
}

function specValue(specs, labelRe) {
  return specs.find((s) => labelRe.test(s.label))?.value ?? "";
}

function segmentFromLine(line) {
  const map = {
    MiniCar: "suv-nho",
    "A-SUV": "suv-nho",
    "B-SUV": "suv-c",
    "C-SUV": "suv-c",
    "D-SUV": "suv-d",
    "E-SUV": "suv-e",
    MPV: "mpv",
    VAN: "suv",
  };
  return map[line] ?? "suv";
}

function rangeBucket(range) {
  if (range < 400) return "under400";
  if (range <= 600) return "400-600";
  return "over600";
}

function scooterRangeBucket(range) {
  if (range < 50) return "under50";
  if (range <= 80) return "50-80";
  return "over80";
}

function scooterSpeedBucket(speed) {
  if (speed < 50) return "under50";
  if (speed <= 70) return "50-70";
  return "over70";
}

function loadColorImages() {
  if (!fs.existsSync(COLOR_IMAGES_FILE)) return { cars: {}, scooters: {} };
  return JSON.parse(fs.readFileSync(COLOR_IMAGES_FILE, "utf8"));
}

function normalizeColorName(name) {
  return name
    .replace(/^(Trắng|Đen|Xanh|Bạc|Cam|Vàng|Hồng)\s+/i, "")
    .replace(/^Brahminy\s+/i, "")
    .trim();
}

function matchColorName(catalogName, scrapedName) {
  const a = catalogName.toLowerCase();
  const b = scrapedName.toLowerCase();
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const na = normalizeColorName(catalogName).toLowerCase();
  const nb = normalizeColorName(scrapedName).toLowerCase();
  return na === nb || na.includes(nb) || nb.includes(na);
}

function mergeColorImages(carId, colors, colorImages) {
  const scraped = colorImages.cars?.[carId];
  if (!scraped?.length || !colors?.length) return colors;
  return colors.map((c) => {
    const hit = scraped.find((s) => matchColorName(c.name, s.name));
    return hit?.image ? { ...c, image: hit.image } : c;
  });
}

function loadVinFastDetails() {
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

function getDetailById(details, type, id) {
  const list = type === "car" ? details.cars : details.scooters;
  return list?.find((d) => d?.id === id && !d.error);
}

function mergeEnrichment(enrich, fields, detail) {
  if (!fields && !detail) return enrich;
  const merged = { ...enrich };
  if (fields?.power) merged.power = fields.power;
  if (fields?.torque) merged.torque = fields.torque;
  if (fields?.range) merged.range = fields.range;
  if (fields?.batteryCapacity) merged.batteryCapacity = fields.batteryCapacity;
  if (fields?.chargingTime) merged.chargingTime = fields.chargingTime;
  if (fields?.dimensions) merged.dimensions = fields.dimensions;
  if (fields?.drive) merged.drive = fields.drive;
  if (fields?.acceleration) merged.acceleration = fields.acceleration;
  if (detail?.overview?.subtitle && !merged.subtitle) merged.subtitle = detail.overview.subtitle.slice(0, 120);
  if (detail?.colorHex?.length) merged.colors = detail.colorHex;
  return merged;
}

function specsToFeatureSpecs(specs, type) {
  const result = [];
  for (const spec of specs) {
    const label = spec.label.toLowerCase();
    if (label.includes("chỗ ngồi") || label.includes("số chỗ")) {
      const seats = spec.value.replace(/\s*chỗ.*/i, "").trim() || spec.value;
      result.push({ value: seats, label: "chỗ ngồi", seats: true });
    } else if (label.includes("quãng đường") || label.includes("tốc độ tối đa")) {
      result.push({ value: spec.value, label: spec.label });
    } else if (label.includes("công suất") || label.includes("cốp") || label.includes("pin lithium")) {
      result.push({ value: spec.value, label: spec.label });
    } else if (label.includes("giá")) {
      result.push({ value: spec.value, label: spec.label, highlight: true });
    }
  }
  return result.slice(0, 4);
}

function tsString(value) {
  return JSON.stringify(value);
}

function formatObject(obj, indent = 2) {
  const pad = " ".repeat(indent);
  const lines = Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      if (typeof v === "string") return `${pad}${k}: ${JSON.stringify(v)}`;
      if (typeof v === "boolean") return `${pad}${k}: ${v}`;
      if (Array.isArray(v)) return `${pad}${k}: ${JSON.stringify(v, null, 2).replace(/\n/g, `\n${pad}`)}`;
      return `${pad}${k}: ${typeof v === "number" && v > 999 ? v.toLocaleString("en-US").replace(/,/g, "_") : v}`;
    });
  return `{\n${lines.join(",\n")}\n${" ".repeat(indent - 2)}}`;
}

function buildCarModel(raw, details, colorImages) {
  const id = CAR_ID_MAP[raw.name];
  const detail = getDetailById(details, "car", id);
  const enrich = mergeEnrichment(CAR_ENRICHMENT[id] ?? {}, detail?.fields, detail);
  const line = specValue(raw.specs, /dòng xe/i);
  const seats = parseSeats(specValue(raw.specs, /chỗ ngồi/i));
  const range = parseRange(specValue(raw.specs, /quãng đường/i));
  const price = parsePrice(specValue(raw.specs, /giá/i));
  const segment = segmentFromLine(line);
  const imageFile = CAR_IMAGE_FILES[id];
  const image = imageFile ? `/images/vinfast/cars/${imageFile}` : `/images/cars/${id}.jpg`;
  const colors = mergeColorImages(
    id,
    enrich.colors ?? [{ name: "Trắng", hex: "#FFFFFF" }],
    colorImages,
  );

  return {
    id,
    name: raw.name,
    subtitle: enrich.subtitle ?? `${line} điện VinFast`,
    image,
    price,
    seats,
    range,
    power: enrich.power ?? 150,
    segment,
    drive: enrich.drive ?? "fwd",
    rangeBucket: rangeBucket(range),
    torque: enrich.torque ?? 200,
    batteryCapacity: enrich.batteryCapacity ?? 40,
    chargingTime: enrich.chargingTime ?? "30 phút (10-70%)",
    dimensions: enrich.dimensions ?? "—",
    batteryPurchasePrice: enrich.batteryPurchasePrice ?? 50_000_000,
    rentBatteryPrice: enrich.rentBatteryPrice ?? 1_000_000,
    acceleration: enrich.acceleration ?? "—",
    colors,
    isBestSeller: enrich.isBestSeller,
    isPromo: enrich.isPromo,
    isNew: enrich.isNew,
    detailHref: raw.detailHref,
  };
}

function buildScooterModel(raw, details) {
  const id = SCOOTER_ID_MAP[raw.name];
  const detail = getDetailById(details, "scooter", id);
  const enrich = { ...(SCOOTER_ENRICHMENT[id] ?? {}) };
  const fields = detail?.fields ?? {};
  if (fields.topSpeed) enrich.topSpeed = fields.topSpeed;
  if (fields.range) enrich.range = fields.range;
  if (fields.motorPower) enrich.motorPower = fields.motorPower;
  if (fields.trunk !== undefined) enrich.trunk = fields.trunk;
  if (fields.weight) enrich.weight = fields.weight;
  if (fields.chargingTime) enrich.chargingTime = fields.chargingTime;
  if (detail?.overview?.subtitle) enrich.subtitle = detail.overview.subtitle.slice(0, 120);
  const price = parsePrice(specValue(raw.specs, /giá/i));
  const range = parseScooterRange(raw.specs);
  const topSpeed = parseTopSpeed(raw.specs);
  const motorPower = parseMotorPower(raw.specs);
  const trunk = parseTrunk(raw.specs);
  const imageFile = SCOOTER_IMAGE_FILES[id];
  const image = imageFile ? `/images/vinfast/scooters/${imageFile}` : "/images/evo-scooter.png";

  return {
    id,
    name: raw.name,
    subtitle: enrich.subtitle ?? "Xe máy điện VinFast",
    image,
    price,
    range,
    topSpeed,
    trunk,
    type: enrich.type ?? (topSpeed >= 70 ? "xe-ga" : "xe-co-ban"),
    rangeBucket: scooterRangeBucket(range),
    speedBucket: scooterSpeedBucket(topSpeed),
    motorPower,
    batteryType: enrich.batteryType ?? "LFP",
    chargingTime: enrich.chargingTime ?? "6 giờ (0-100%)",
    dimensions: enrich.dimensions ?? "—",
    weight: enrich.weight ?? 95,
    batteryPurchasePrice: enrich.batteryPurchasePrice ?? 15_000_000,
    rentBatteryPrice: enrich.rentBatteryPrice ?? 250_000,
    acceleration: enrich.acceleration ?? `0-${topSpeed} km/h`,
    colors: enrich.colors ?? [{ name: "Trắng", hex: "#FFFFFF" }],
    isBestSeller: enrich.isBestSeller,
    isPromo: enrich.isPromo,
    isNew: enrich.isNew,
    detailHref: raw.detailHref,
  };
}

function generateCarsTs(cars, details, colorImages) {
  const models = cars.map((c) => buildCarModel(c, details, colorImages));
  const carBlocks = models
    .map((c) => {
      const flags = [];
      if (c.isBestSeller) flags.push("isBestSeller: true");
      if (c.isPromo) flags.push("isPromo: true");
      if (c.isNew) flags.push("isNew: true");
      const flagStr = flags.length ? `,\n    ${flags.join(",\n    ")}` : "";
      return `  {
    id: ${tsString(c.id)},
    name: ${tsString(c.name)},
    subtitle: ${tsString(c.subtitle)},
    image: ${tsString(c.image)},
    price: ${c.price.toLocaleString("en-US").replace(/,/g, "_")},
    seats: ${c.seats},
    range: ${c.range},
    power: ${c.power},
    segment: ${tsString(c.segment)},
    drive: ${tsString(c.drive)},
    rangeBucket: ${tsString(c.rangeBucket)},
    torque: ${c.torque},
    batteryCapacity: ${c.batteryCapacity},
    chargingTime: ${tsString(c.chargingTime)},
    dimensions: ${tsString(c.dimensions)},
    batteryPurchasePrice: ${c.batteryPurchasePrice.toLocaleString("en-US").replace(/,/g, "_")},
    rentBatteryPrice: ${c.rentBatteryPrice.toLocaleString("en-US").replace(/,/g, "_")},
    acceleration: ${tsString(c.acceleration)},
    colors: ${JSON.stringify(c.colors, null, 4).replace(/^/gm, "    ").trim()}${flagStr},
  }`;
    })
    .join(",\n");

  return `// Auto-synced from VinFast — scripts/sync-vinfast-catalog.mjs
// Source: https://vinfastauto.com/vn_vi
// Last synced: ${new Date().toISOString()}

export type CarSegment = "suv" | "suv-nho" | "suv-c" | "suv-d" | "suv-e" | "mpv";

export type DriveType = "fwd" | "rwd" | "awd";

export type RangeBucket = "under400" | "400-600" | "over600";

export type CarColor = {
  name: string;
  hex: string;
  image?: string;
};

export type CarModel = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  price: number;
  seats: number;
  range: number;
  power: number;
  segment: CarSegment;
  drive: DriveType;
  rangeBucket: RangeBucket;
  torque: number;
  batteryCapacity: number;
  chargingTime: string;
  dimensions: string;
  batteryPurchasePrice: number;
  rentBatteryPrice: number;
  acceleration: string;
  colors: CarColor[];
  isBestSeller?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
};

export const CAR_IMAGES = {
  hero: "/images/showroom.jpg",
  promoTestDrive: "/images/cars/promo-test-drive.jpg",
  promoFinance: "/images/cars/promo-finance.jpg",
} as const;

export const CARS: CarModel[] = [
${carBlocks}
];

export const CARS_PER_PAGE = 6;

export const SEGMENT_OPTIONS: { value: CarSegment | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "suv", label: "SUV" },
  { value: "suv-nho", label: "SUV nhỏ" },
  { value: "suv-c", label: "SUV cỡ C" },
  { value: "suv-d", label: "SUV cỡ D" },
  { value: "suv-e", label: "SUV cỡ E" },
  { value: "mpv", label: "MPV" },
];

export const SEAT_OPTIONS = [2, 4, 5, 7] as const;

export const RANGE_OPTIONS: { value: RangeBucket; label: string }[] = [
  { value: "under400", label: "Dưới 400 km" },
  { value: "400-600", label: "400 – 600 km" },
  { value: "over600", label: "Trên 600 km" },
];

export const DRIVE_OPTIONS: { value: DriveType; label: string }[] = [
  { value: "fwd", label: "FWD (Cầu trước)" },
  { value: "rwd", label: "RWD (Cầu sau)" },
  { value: "awd", label: "AWD (2 cầu)" },
];

export const PRICE_MIN = 200_000_000;
export const PRICE_MAX = 1_500_000_000;

export function formatPrice(value: number) {
  return value.toLocaleString("vi-VN");
}
`;
}

function generateScootersTs(scooters, details) {
  const models = scooters.map((s) => buildScooterModel(s, details));
  const blocks = models
    .map((s) => {
      const flags = [];
      if (s.isBestSeller) flags.push("isBestSeller: true");
      if (s.isPromo) flags.push("isPromo: true");
      if (s.isNew) flags.push("isNew: true");
      const flagStr = flags.length ? `,\n    ${flags.join(",\n    ")}` : "";
      return `  {
    id: ${tsString(s.id)},
    name: ${tsString(s.name)},
    subtitle: ${tsString(s.subtitle)},
    image: ${tsString(s.image)},
    price: ${s.price.toLocaleString("en-US").replace(/,/g, "_")},
    range: ${s.range},
    topSpeed: ${s.topSpeed},
    trunk: ${s.trunk},
    type: ${tsString(s.type)},
    rangeBucket: ${tsString(s.rangeBucket)},
    speedBucket: ${tsString(s.speedBucket)},
    motorPower: ${s.motorPower},
    batteryType: ${tsString(s.batteryType)},
    chargingTime: ${tsString(s.chargingTime)},
    dimensions: ${tsString(s.dimensions)},
    weight: ${s.weight},
    batteryPurchasePrice: ${s.batteryPurchasePrice.toLocaleString("en-US").replace(/,/g, "_")},
    rentBatteryPrice: ${s.rentBatteryPrice.toLocaleString("en-US").replace(/,/g, "_")},
    acceleration: ${tsString(s.acceleration)},
    colors: ${JSON.stringify(s.colors, null, 4).replace(/^/gm, "    ").trim()}${flagStr},
  }`;
    })
    .join(",\n");

  return `// Auto-synced from VinFast — scripts/sync-vinfast-catalog.mjs
// Source: https://vinfastauto.com/vn_vi
// Last synced: ${new Date().toISOString()}

export type ScooterType = "xe-dap-dien" | "xe-co-ban" | "xe-the-thao" | "xe-ga" | "xe-ga-cao-cap";

export type RangeBucket = "under50" | "50-80" | "over80";

export type SpeedBucket = "under50" | "50-70" | "over70";

export type ScooterColor = {
  name: string;
  hex: string;
};

export type ScooterModel = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  price: number;
  range: number;
  topSpeed: number;
  trunk: number;
  type: ScooterType;
  rangeBucket: RangeBucket;
  speedBucket: SpeedBucket;
  motorPower: number;
  batteryType: "LFP" | "Lithium-ion" | "Ắc quy";
  chargingTime: string;
  dimensions: string;
  weight: number;
  batteryPurchasePrice: number;
  rentBatteryPrice: number;
  acceleration: string;
  colors: ScooterColor[];
  isBestSeller?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
};

export const SCOOTER_IMAGES = {
  hero: "/images/charging-scooter.jpg",
  promoTestDrive: "/images/charging-scooter.jpg",
  promoFinance: "/images/portable-charger.jpg",
} as const;

export const SCOOTERS: ScooterModel[] = [
${blocks}
];

export const SCOOTERS_PER_PAGE = 6;

export const TYPE_OPTIONS: { value: ScooterType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "xe-dap-dien", label: "Xe đạp điện" },
  { value: "xe-co-ban", label: "Xe phổ thông" },
  { value: "xe-the-thao", label: "Xe thể thao" },
  { value: "xe-ga", label: "Xe ga cao cấp" },
  { value: "xe-ga-cao-cap", label: "Siêu xe ga flagship" },
];

export const RANGE_OPTIONS: { value: RangeBucket; label: string }[] = [
  { value: "under50", label: "Dưới 50 km" },
  { value: "50-80", label: "50 – 80 km" },
  { value: "over80", label: "Trên 80 km / sạc đầy" },
];

export const SPEED_OPTIONS: { value: SpeedBucket; label: string }[] = [
  { value: "under50", label: "Dưới 50 km/h (An toàn học sinh)" },
  { value: "50-70", label: "50 – 70 km/h (Đô thị)" },
  { value: "over70", label: "Trên 70 km/h (Mạnh mẽ)" },
];

export const PRICE_MIN = 10_000_000;
export const PRICE_MAX = 70_000_000;

export { formatPrice } from "./cars";
`;
}

function generateVinfastHomeTs(data, cars, scooters) {
  const processedBanners = data.banners.map((b, i) => ({
    image: `/images/vinfast/banners/hero-${i + 1}.jpg`,
    alt: b.alt,
    href: b.href,
  }));

  const processedCars = cars.map((c) => {
    const id = CAR_ID_MAP[c.name];
    const imageFile = CAR_IMAGE_FILES[id];
    return {
      ...c,
      localId: id,
      image: imageFile ? `/images/vinfast/cars/${imageFile}` : c.imageSrc,
    };
  });

  const processedScooters = scooters.map((s) => {
    const id = SCOOTER_ID_MAP[s.name];
    const imageFile = SCOOTER_IMAGE_FILES[id];
    return {
      ...s,
      localId: id,
      image: imageFile ? `/images/vinfast/scooters/${imageFile}` : s.imageSrc,
    };
  });

  const toSlide = (item, type) => ({
    title: item.name,
    subtitle: item.specs.find((s) => /dòng xe/i.test(s.label))?.value,
    image: item.image,
    imageAlt: item.name,
    imageClass:
      type === "car"
        ? "h-full w-full object-contain object-left"
        : "h-full w-full object-contain object-right",
    specs: specsToFeatureSpecs(item.specs, type),
    primaryCta: type === "car" ? "KHÁM PHÁ NGAY" : "MUA NGAY",
    secondaryCta: type === "car" ? "ĐẶT LỊCH LÁI THỬ" : "XEM CHI TIẾT",
    href: item.localId ? `${type === "car" ? "/oto" : "/xe-may-dien"}/${item.localId}` : item.detailHref,
    detailHref: item.detailHref,
  });

  return `// Auto-generated by scripts/sync-vinfast-catalog.mjs — do not edit manually
// Source: https://vinfastauto.com/vn_vi
// Last synced: ${new Date().toISOString()}

export type VinFastHomeSpec = {
  value: string;
  label: string;
  highlight?: boolean;
  seats?: boolean;
};

export type VinFastHomeSlide = {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  imageClass: string;
  specs: VinFastHomeSpec[];
  primaryCta: string;
  secondaryCta: string;
  href?: string;
  detailHref?: string;
};

export type VinFastHeroBanner = {
  image: string;
  alt: string;
  href: string;
};

export const VINFAST_HERO_BANNERS: VinFastHeroBanner[] = ${JSON.stringify(processedBanners, null, 2)};

export const VINFAST_FEATURED_CARS: VinFastHomeSlide[] = ${JSON.stringify(processedCars.map((c) => toSlide(c, "car")), null, 2)};

export const VINFAST_FEATURED_SCOOTERS: VinFastHomeSlide[] = ${JSON.stringify(processedScooters.map((s) => toSlide(s, "scooter")), null, 2)};

export const VINFAST_ALL_CARS = ${JSON.stringify(
    processedCars.map((c) => ({
      name: c.name,
      image: c.image,
      specs: c.specs,
      localId: c.localId,
      detailHref: c.detailHref,
    })),
    null,
    2,
  )} as const;

export const VINFAST_ALL_SCOOTERS = ${JSON.stringify(
    processedScooters.map((s) => ({
      name: s.name,
      image: s.image,
      specs: s.specs,
      localId: s.localId,
      detailHref: s.detailHref,
    })),
    null,
    2,
  )} as const;

export const VINFAST_SYNCED_AT = "${new Date().toISOString()}";
`;
}

async function downloadImage(url, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) return;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) return;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
  console.log(`  saved ${path.basename(destPath)}`);
}

async function downloadAssets(data) {
  console.log("Downloading images...");
  for (let i = 0; i < data.banners.length; i++) {
    const b = data.banners[i];
    const ext = path.extname(b.desktopSrc.split("?")[0]) || ".jpg";
    await downloadImage(b.desktopSrc, path.join(IMG_DIR, "banners", `hero-${i + 1}${ext}`));
  }
  for (const car of data.cars) {
    const id = CAR_ID_MAP[car.name];
    const file = CAR_IMAGE_FILES[id];
    if (file) await downloadImage(car.imageSrc, path.join(IMG_DIR, "cars", file));
  }
  for (const s of data.scooters) {
    const id = SCOOTER_ID_MAP[s.name];
    const file = SCOOTER_IMAGE_FILES[id];
    if (file) await downloadImage(s.imageSrc, path.join(IMG_DIR, "scooters", file));
  }
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const details = loadVinFastDetails();
  const colorImages = loadColorImages();
  console.log(`Loaded ${data.cars.length} cars, ${data.scooters.length} scooters from ${DATA_FILE}`);
  console.log(
    `VinFast details: ${details.cars?.filter((c) => !c?.error).length ?? 0} cars, ${details.scooters?.filter((s) => !s?.error).length ?? 0} scooters`,
  );
  console.log(
    `Color images: ${Object.keys(colorImages.cars ?? {}).length} car models with per-color photos`,
  );

  fs.writeFileSync(OUT_CARS, generateCarsTs(data.cars, details, colorImages), "utf8");
  console.log(`Wrote ${OUT_CARS}`);

  fs.writeFileSync(OUT_SCOOTERS, generateScootersTs(data.scooters, details), "utf8");
  console.log(`Wrote ${OUT_SCOOTERS}`);

  fs.writeFileSync(OUT_HOME, generateVinfastHomeTs(data, data.cars, data.scooters), "utf8");
  console.log(`Wrote ${OUT_HOME}`);
}

await downloadAssets(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
main();

try {
  const { execSync } = await import("child_process");
  execSync("node scripts/generate-vinfast-detail-overrides.mjs", { cwd: ROOT, stdio: "inherit" });
  if (fs.existsSync(path.join(ROOT, "scripts", "vinfast-gallery-images.json"))) {
    execSync("node scripts/generate-vinfast-galleries.mjs", { cwd: ROOT, stdio: "inherit" });
  }
  execSync(
    "npx prettier --write src/lib/cars.ts src/lib/scooters.ts src/lib/vinfast-home.ts src/lib/vinfast-detail-overrides.ts src/lib/vinfast-galleries.ts",
    { cwd: ROOT, stdio: "inherit" },
  );
} catch {
  console.warn("Post-sync formatting skipped");
}

console.log("\nDone! Catalog synced from VinFast.");
