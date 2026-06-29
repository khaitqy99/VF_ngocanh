"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Gauge, Leaf, Timer, Wind, Zap } from "lucide-react";

export type PdpSpecItem = {
  icon: ElementType;
  label: string;
  value: string;
};

export type PdpFeatureCard = {
  title: string;
  desc: string;
  image: string;
};

export type PdpTechCard = {
  icon: ElementType;
  title: string;
  desc: string;
};

export function PdpQuickSpecBar({ specs, embedded }: { specs: PdpSpecItem[]; embedded?: boolean }) {
  const items = specs.map((spec) => (
    <div
      key={spec.label}
      className="group flex flex-col items-center rounded-2xl border border-border/40 bg-white px-2 py-3 text-center transition hover:border-brand/30 hover:shadow-soft sm:px-3 sm:py-4"
    >
      <span className="mb-2 flex size-9 items-center justify-center rounded-xl bg-brand/8 text-brand transition group-hover:bg-brand group-hover:text-white sm:size-10">
        <spec.icon className="size-4 sm:size-[18px]" strokeWidth={1.75} />
      </span>
      <p
        className={`font-black tabular-nums text-brand-dark ${
          embedded ? "text-xs sm:text-sm" : "text-sm sm:text-base"
        }`}
      >
        {spec.value}
      </p>
      <p
        className={`mt-0.5 leading-snug text-muted-foreground ${
          embedded ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-[11px]"
        }`}
      >
        {spec.label}
      </p>
    </div>
  ));

  if (embedded) {
    return (
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3">{items}</div>
    );
  }

  return (
    <div className="border-y border-border/40 bg-[linear-gradient(180deg,#f0f4fb_0%,#ffffff_100%)]">
      <div className="container-vf grid grid-cols-2 gap-2.5 py-5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:py-7">
        {items}
      </div>
    </div>
  );
}

export function PdpSectionTitle({
  title,
  subtitle,
  actionHref,
  actionLabel = "Xem tất cả",
  inverted,
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  inverted?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <span
          className={`inline-block h-1 w-10 rounded-full ${inverted ? "bg-accent-yellow" : "bg-brand"}`}
        />
        <h2
          className={`mt-4 text-2xl font-black tracking-tight sm:text-[1.75rem] lg:text-3xl ${
            inverted ? "text-white" : "text-brand-dark"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-2.5 text-sm leading-relaxed sm:text-[15px] ${
              inverted ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm ${
            inverted
              ? "border-white/25 text-white hover:bg-white/10"
              : "border-brand/20 text-brand hover:bg-brand/5"
          }`}
        >
          {actionLabel}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

export function PdpSplitOverview({
  eyebrow,
  title,
  description,
  bullets,
  image,
  imageAlt,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5 lg:order-2">
        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand/15 to-transparent blur-sm" />
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[#eef2f8] shadow-card ring-1 ring-border/40">
            <img
              src={image}
              alt={imageAlt}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/5] lg:min-h-[420px]"
            />
          </div>
        </div>
      </div>
      <div className="lg:col-span-7 lg:order-1">
        {eyebrow && (
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand uppercase">{eyebrow}</p>
        )}
        <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-brand-dark sm:text-3xl lg:text-[2rem]">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px] lg:text-base">
          {description}
        </p>
        {bullets.length > 0 && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3.5 shadow-soft"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">
                  ✓
                </span>
                <span className="text-sm leading-snug text-foreground/90">{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function PdpImageFeatureGrid({ items }: { items: PdpFeatureCard[] }) {
  const grid = items.slice(0, 4);
  if (!grid.length) return null;

  const useBento = grid.length >= 3;

  const spanClass = (i: number) => {
    if (grid.length === 1) return "col-span-full";
    if (grid.length === 2) return "sm:col-span-1";
    if (grid.length === 3) return i === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5";
    return i === 0 ? "lg:col-span-7 lg:row-span-3" : "lg:col-span-5";
  };

  const gridClass = (() => {
    if (!useBento) return "lg:mt-12";
    if (grid.length === 3)
      return "lg:mt-12 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5 lg:min-h-[480px]";
    return "lg:mt-12 lg:grid-cols-12 lg:grid-rows-3 lg:gap-5 lg:min-h-[560px]";
  })();

  const cellMinH = (i: number) => {
    if (!useBento) return "min-h-[220px] sm:min-h-[260px]";
    if (i === 0) return "min-h-[240px] sm:min-h-[280px] lg:min-h-full";
    return "min-h-[200px] sm:min-h-[220px] lg:h-full lg:min-h-[220px]";
  };

  return (
    <div className={`mt-10 grid gap-4 sm:grid-cols-2 ${gridClass}`}>
      {grid.map((item, i) => (
        <article
          key={`${item.title}-${item.image}`}
          className={`group relative overflow-hidden rounded-3xl bg-[#e8edf5] shadow-card ring-1 ring-black/5 ${spanClass(i)} ${cellMinH(i)}`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/55 to-brand-dark/15" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <h3 className="text-base font-bold text-white sm:text-lg">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/75 sm:text-sm">
              {item.desc}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PdpTechIconGrid({ items }: { items: PdpTechCard[] }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
      {items.map((item) => (
        <article
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-border/50 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card"
        >
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-brand/5 transition group-hover:bg-brand/10" />
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-[#0046cc] text-white shadow-lg shadow-brand/20">
            <item.icon className="size-6" strokeWidth={1.5} />
          </div>
          <h3 className="relative mt-5 text-base font-bold text-brand-dark">{item.title}</h3>
          <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
        </article>
      ))}
    </div>
  );
}

export function PdpStatCards({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-border/50 bg-white px-5 py-5 text-center shadow-soft"
        >
          <p className="text-sm font-bold text-brand-dark">{item.title}</p>
          <p className="mt-2 text-lg font-black text-brand">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function PdpDriveModePills({ modes }: { modes: { name: string; desc: string }[] }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {modes.map((mode) => (
        <div
          key={mode.name}
          className="rounded-xl border border-border/50 bg-[#f8f9fc] px-4 py-4 text-center"
        >
          <p className="text-sm font-black text-brand">{mode.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{mode.desc}</p>
        </div>
      ))}
    </div>
  );
}

/** Gán tiêu đề khi scrape chỉ có 1 mục nhưng nhiều ảnh gallery */
export function expandGalleryToGrid(items: PdpFeatureCard[], labels: string[]): PdpFeatureCard[] {
  if (!items.length) return [];
  const uniqueTitles = new Set(items.map((i) => i.title.trim()));
  if (uniqueTitles.size > 1) return items.slice(0, 4);

  const primary = items[0];
  const pool = items.length >= 4 ? items : items;
  return pool.slice(0, 4).map((item, i) => ({
    title: labels[i] ?? primary.title,
    desc: i === 0 ? primary.desc : primary.desc.slice(0, 120),
    image: item.image,
  }));
}

export type PdpMetric = { icon: ElementType; label: string; value: string };

const DRIVE_MODE_ICONS: Record<string, ElementType> = {
  Eco: Leaf,
  Normal: Gauge,
  Sport: Zap,
};

export function PdpPerformanceShowcase({
  lead,
  image,
  imageAlt,
  metrics,
  driveModes,
}: {
  lead: string;
  image: string;
  imageAlt: string;
  metrics: PdpMetric[];
  driveModes: { name: string; desc: string }[];
}) {
  return (
    <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-border/40 bg-gradient-to-br from-[#eef2f9] via-white to-[#f8fafc] shadow-card lg:mt-12">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[280px] bg-[#e8edf5] lg:min-h-[440px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,87,255,0.08),transparent_55%)]" />
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center border-t border-border/40 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10">
          <p className="text-sm font-bold tracking-[0.15em] text-brand uppercase">Hiệu suất</p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-[15px]">
            {lead}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border/50 bg-white px-4 py-4 shadow-soft"
              >
                <m.icon className="size-5 text-brand" strokeWidth={1.75} />
                <p className="mt-2 text-lg font-black tabular-nums text-brand-dark sm:text-xl">
                  {m.value}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {driveModes.map((mode) => {
              const Icon = DRIVE_MODE_ICONS[mode.name] ?? Gauge;
              return (
                <div
                  key={mode.name}
                  className="rounded-xl border border-brand/15 bg-brand/5 px-3 py-3 text-center"
                >
                  <Icon className="mx-auto size-4 text-brand" strokeWidth={1.5} />
                  <p className="mt-1.5 text-xs font-black text-brand">{mode.name}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                    {mode.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PdpSafetyShowcase({
  title,
  subtitle,
  image,
  imageAlt,
  highlights,
  features,
}: {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  features: PdpTechCard[];
}) {
  return (
    <>
      {highlights.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {highlights.map((h) => (
            <span
              key={h}
              className="rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-[11px] font-bold text-brand"
            >
              {h}
            </span>
          ))}
        </div>
      )}
      <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-border/40 bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2f9] shadow-card lg:mt-10">
        <div className="grid lg:grid-cols-12">
          <div className="relative min-h-[260px] overflow-hidden bg-[#e8edf5] lg:col-span-5 lg:min-h-[440px]">
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="border-t border-border/40 p-6 sm:p-8 lg:col-span-7 lg:border-t-0 lg:border-l lg:p-10">
            <p className="text-sm font-bold tracking-[0.15em] text-brand uppercase">An toàn</p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-[15px]">
              {subtitle}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li
                  key={f.title}
                  className="flex gap-3 rounded-2xl border border-border/50 bg-white p-4 shadow-soft"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-[#0046cc] text-white shadow-md shadow-brand/20">
                    <f.icon className="size-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-brand-dark">{f.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export function PdpChargingShowcase({
  title,
  description,
  heroImage,
  solutions,
  moreHref = "/pin-va-tram-sac",
}: {
  title: string;
  description: string;
  heroImage: string;
  solutions: PdpFeatureCard[];
  moreHref?: string;
}) {
  return (
    <>
      <PdpSectionTitle
        title={title}
        subtitle={description}
        actionHref={moreHref}
        actionLabel="Tìm hiểu thêm"
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
        {solutions.map((item) => (
          <article
            key={item.title}
            className="group overflow-hidden rounded-3xl border border-border/50 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#eef2f8]">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-sm font-bold text-brand-dark sm:text-[15px]">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl bg-[#eef2f8] ring-1 ring-border/40 lg:hidden">
        <img src={heroImage} alt={title} className="aspect-[16/9] w-full object-cover" />
      </div>
      <div className="mt-8 text-center">
        <Link
          href={moreHref}
          className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-6 py-3 text-xs font-bold text-brand transition hover:bg-brand hover:text-white sm:text-sm"
        >
          Khám phá dịch vụ pin & trạm sạc
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </>
  );
}

/** Metrics vận hành từ quickSpecs — tránh lặp title/desc từ scrape */
export function buildPerformanceMetrics(quickSpecs: {
  range: number;
  power: number;
  torque: number;
  acceleration: string;
  fastCharge: string;
}): PdpMetric[] {
  return [
    { icon: Gauge, label: "Quãng đường WLTP", value: `${quickSpecs.range} km` },
    { icon: Zap, label: "Công suất tối đa", value: `${quickSpecs.power} Hp` },
    { icon: Wind, label: "Mô-men xoắn", value: `${quickSpecs.torque} Nm` },
    {
      icon: Timer,
      label: "Tăng tốc 0–100 km/h",
      value: quickSpecs.acceleration.replace(/\s*\(.*\)/, ""),
    },
  ];
}

export function buildScooterPerformanceMetrics(quickSpecs: {
  range: number;
  topSpeed: number;
  motorPower: number;
  chargingTime: string;
}): PdpMetric[] {
  return [
    { icon: Gauge, label: "Quãng đường", value: `${quickSpecs.range} km` },
    { icon: Zap, label: "Tốc độ tối đa", value: `${quickSpecs.topSpeed} km/h` },
    { icon: Wind, label: "Công suất motor", value: `${quickSpecs.motorPower} W` },
    {
      icon: BatteryCharging,
      label: "Thời gian sạc",
      value: quickSpecs.chargingTime.split(" (")[0],
    },
  ];
}

export const DEFAULT_CHARGING_SOLUTIONS = (images: {
  station: string;
  home: string;
  portable: string;
}): PdpFeatureCard[] => [
  {
    title: "Trạm sạc công cộng V-Green",
    desc: "Mạng lưới trạm sạc VinFast phủ khắp cả nước, sạc nhanh DC tiện lợi trên mọi hành trình.",
    image: images.station,
  },
  {
    title: "Sạc tại nhà",
    desc: "Lắp đặt bộ sạc AC tại nhà, sạc qua đêm an toàn và tiết kiệm chi phí vận hành.",
    image: images.home,
  },
  {
    title: "Bộ sạc di động",
    desc: "Giải pháp sạc linh hoạt khi di chuyển, hỗ trợ nhu cầu sử dụng đa dạng.",
    image: images.portable,
  },
];
