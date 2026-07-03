/** Parse VinFast PDP innerText / DOM extract into detail record shape */

const COLOR_HEX = {
  "Summer Yellow": "#FBBF24",
  "Jet Black": "#111827",
  "Infinity Blanc": "#FFFFFF",
  "Zenith Grey": "#6B7280",
  "Urban Mint": "#34D399",
  "Solar Ruby": "#DC2626",
  "Starburst Blue": "#2563EB",
  "Vitality Orange": "#D97706",
  "Mysterioso Purple": "#7C3AED",
};

function parsePrice(text) {
  const digits = String(text ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function parseSpecBlock(specBlock = []) {
  const specs = [];
  const pairs = [
    [/Công suất tối đa/i, "Công suất tối đa (kW)"],
    [/Mô men xoắn/i, "Mô men xoắn cực đại (Nm)"],
    [/Quãng đường|Tốc độ tối đa/i, null],
    [/Dung lượng pin/i, "Dung lượng pin (kWh)"],
    [/Dài x rộng x Cao/i, "Dài x Rộng x Cao (mm)"],
    [/Chiều dài cơ sở/i, "Chiều dài cơ sở (mm)"],
    [/Khoảng sáng gầm/i, "Khoảng sáng gầm (mm)"],
    [/Cốp xe/i, "Cốp xe (lít)"],
    [/Công suất động cơ/i, "Công suất động cơ (W)"],
  ];
  for (let i = 0; i < specBlock.length - 1; i++) {
    const a = specBlock[i];
    const b = specBlock[i + 1];
    if (/^\d/.test(a) && /[a-zA-ZÀ-ỹ]/.test(b) && b.length < 50) {
      specs.push({ label: b, value: a });
      continue;
    }
    if (/[a-zA-ZÀ-ỹ]/.test(a) && a.length < 60 && b && b.length < 80) {
      if (/\(mm\)|\(kW\)|\(Nm\)|ghế|Kwh|Inch|phút/i.test(a)) {
        specs.push({ label: a, value: b });
      }
    }
  }
  return specs;
}

export function domExtractToDetail(meta, catalogVehicle) {
  const { id, name, type, sourceUrl } = meta;
  const hero = meta.heroLines?.find((l) => l.length > 80) ?? "";
  const h2 = meta.h2?.[0] ?? name;
  const specTable = parseSpecBlock(meta.specBlock ?? []);
  const catalogPrice = catalogVehicle?.specs?.find((s) => /giá/i.test(s.label))?.value;
  const price = parsePrice(catalogPrice ?? meta.priceLine);

  const fields = {};
  for (const { label, value } of specTable) {
    const l = label.toLowerCase();
    if (l.includes("công suất") && /kW/i.test(label)) {
      const n = value.match(/(\d+)/);
      if (n) {
        fields.powerKw = Number(n[1]);
        fields.power = Math.round(Number(n[1]) * 1.341);
      }
    }
    if (l.includes("mô men")) {
      const n = value.match(/(\d+)/);
      if (n) fields.torque = Number(n[1]);
    }
    if (l.includes("quãng đường") || /km/.test(value)) {
      const n = value.match(/(\d+)/);
      if (n) fields.range = Number(n[1]);
    }
    if (l.includes("pin") && /kwh/i.test(label + value)) {
      const n = value.match(/([\d,]+)/);
      if (n) fields.batteryCapacity = parseFloat(n[1].replace(",", "."));
    }
    if (l.includes("tốc độ")) {
      const n = value.match(/(\d+)/);
      if (n) fields.topSpeed = Number(n[1]);
    }
    if (l.includes("cốp")) {
      const n = value.match(/(\d+)/);
      if (n) fields.trunk = Number(n[1]);
    }
    if (l.includes("công suất động cơ") || (l.includes("công suất") && /w/i.test(value))) {
      const n = value.match(/(\d+)/);
      if (n) fields.motorPower = Number(n[1]);
    }
  }

  const colors = (meta.colors ?? []).filter((c) => c.length < 50).slice(0, 12);
  const exterior = (meta.features ?? []).map((f) => ({ title: f.title, desc: f.desc }));

  return {
    id,
    name,
    type,
    sourceUrl: sourceUrl ?? meta.url,
    variants: price ? [{ name, price }] : [],
    overview: {
      title: h2.replace(/\n/g, " ").slice(0, 120),
      subtitle: hero.slice(0, 300),
    },
    highlights: specTable.slice(0, 3).map((s) => `${s.label}: ${s.value}`),
    exterior: exterior.length ? exterior : undefined,
    specTable,
    fields,
    colors: colors.length ? colors : undefined,
    colorHex: colors.map((c) => ({ name: c, hex: COLOR_HEX[c.split(" ")[0]] ?? "#888888" })),
    tagline: h2.replace(/\n/g, " ").slice(0, 80),
    slogan: hero.slice(0, 200),
  };
}
