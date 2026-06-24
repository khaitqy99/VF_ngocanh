"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { ArrowRight, Gauge, Leaf, Timer, Wind, Zap } from "lucide-react";

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
    <div key={spec.label} className="flex flex-col items-center text-center">
      <spec.icon
        className={`mb-1.5 text-brand sm:mb-2 ${embedded ? "size-4 sm:size-5" : "size-5"}`}
        strokeWidth={1.5}
      />
      <p
        className={`font-black tabular-nums text-brand-dark ${
          embedded ? "text-xs sm:text-sm lg:text-base" : "text-sm sm:text-base"
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
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-white px-3 py-4 sm:mt-6 sm:grid-cols-3 sm:gap-4 sm:px-4 sm:py-5">
        {items}
      </div>
    );
  }

  return (
    <div className="border-y border-border/50 bg-[#f4f6fa]">
      <div className="container-vf grid grid-cols-2 gap-x-4 gap-y-5 py-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4 lg:py-6">
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
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-black tracking-tight text-brand-dark sm:text-2xl lg:text-[1.75rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-[15px]">{subtitle}</p>
        )}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline sm:text-sm"
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
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-xl font-black uppercase leading-tight tracking-tight text-brand-dark sm:text-2xl lg:text-[1.65rem]">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {description}
        </p>
        <ul className="mt-6 space-y-4">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/5">
                <span className="size-2 rounded-full bg-brand" />
              </span>
              <span className="pt-1 text-sm leading-relaxed text-foreground/90">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-2xl bg-[#f4f6fa]">
        <img
          src={image}
          alt={imageAlt}
          className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[5/4]"
        />
      </div>
    </div>
  );
}

export function PdpImageFeatureGrid({ items }: { items: PdpFeatureCard[] }) {
  const grid = items.slice(0, 4);
  if (!grid.length) return null;

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
      {grid.map((item) => (
        <article
          key={`${item.title}-${item.image}`}
          className="group overflow-hidden rounded-2xl border border-border/50 bg-white transition hover:shadow-soft"
        >
          <div className="overflow-hidden bg-[#f4f6fa]">
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="p-4">
            <h3 className="text-sm font-bold text-brand-dark sm:text-[15px]">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
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
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 xl:gap-8">
      {items.map((item) => (
        <article key={item.title} className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border-2 border-brand/25 bg-brand/5 text-brand sm:size-16">
            <item.icon className="size-6 sm:size-7" strokeWidth={1.5} />
          </div>
          <h3 className="mt-4 text-sm font-bold text-brand-dark sm:text-[15px]">{item.title}</h3>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {item.desc}
          </p>
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
    <div className="mt-8 overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-[#f4f6fa] via-white to-[#f8f9fc] lg:mt-10">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[260px] bg-[#eef1f6] lg:min-h-[400px]">
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-contain p-6 sm:p-10"
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{lead}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border/50 bg-white px-4 py-4 shadow-soft"
              >
                <m.icon className="size-5 text-brand" strokeWidth={1.5} />
                <p className="mt-2 text-base font-black tabular-nums text-brand-dark sm:text-lg">
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
        <div className="mt-5 flex flex-wrap gap-2">
          {highlights.map((h) => (
            <span
              key={h}
              className="rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1.5 text-[11px] font-semibold text-brand"
            >
              {h}
            </span>
          ))}
        </div>
      )}
      <div className="mt-8 overflow-hidden rounded-3xl border border-border/50 bg-white lg:mt-10">
        <div className="grid lg:grid-cols-5">
          <div className="relative min-h-[240px] bg-[#f4f6fa] lg:col-span-2 lg:min-h-[420px]">
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-contain p-6 sm:p-8"
            />
          </div>
          <div className="border-t border-border/40 p-5 sm:p-6 lg:col-span-3 lg:border-t-0 lg:border-l lg:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
            <ul className="mt-5 divide-y divide-border/40">
              {features.map((f) => (
                <li key={f.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand">
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
      <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-5">
        {solutions.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-2xl border border-border/50 bg-white shadow-soft"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[#f4f6fa]">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-sm font-bold text-brand-dark sm:text-[15px]">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-[#f4f6fa] lg:hidden">
        <img src={heroImage} alt={title} className="aspect-[16/9] w-full object-cover" />
      </div>
      <div className="mt-6 text-center">
        <Link
          href={moreHref}
          className="inline-flex items-center gap-2 rounded-xl border border-brand bg-white px-5 py-2.5 text-xs font-bold text-brand transition hover:bg-brand/5"
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
