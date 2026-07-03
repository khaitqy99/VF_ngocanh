"use client";

import type { ElementType, ReactNode } from "react";
import { EditableText, EditableTextBlock } from "@/components/admin-edit/EditableField";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { resolveField } from "@/components/admin-edit/vehicle-edit-paths";
import { resolveNumber } from "@/components/admin-edit/vehicle-edit-paths";
import { EditablePrice } from "@/components/admin-edit/EditableField";
import type { PatchValue } from "@/components/admin-edit/vehicle-edit";
import type { PdpMetric, PdpSpecItem } from "@/components/shared/PdpContentBlocks";
import { vfCardTitle, vfSectionHeadingLeft } from "@/lib/typography";

type InlineProps = {
  path: string;
  fallback?: string;
  className?: string;
  label?: string;
  adminEditable?: boolean;
};

export function InlineText({
  path,
  fallback = "",
  className,
  label,
  adminEditable,
  multiline,
}: InlineProps & { multiline?: boolean }) {
  const edit = useAdminEdit();
  const text = resolveField(edit?.values, edit?.patches, path, fallback);
  const active = adminEditable && edit?.editMode;

  if (!active || !edit) return <>{text}</>;

  const onChange = (v: string) => edit.updateField(path, v);

  if (multiline) {
    return (
      <EditableText
        value={text}
        onChange={onChange}
        className={className}
        multiline
        label={label ?? path}
      />
    );
  }

  return (
    <EditableText value={text} onChange={onChange} className={className} label={label ?? path} />
  );
}

export function InlineMoney({
  path,
  fallback,
  className,
  adminEditable,
}: {
  path: string;
  fallback: number;
  className?: string;
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();
  const amount = resolveNumber(edit?.values, edit?.patches, path, fallback);
  const active = adminEditable && edit?.editMode;

  if (!active || !edit) {
    return <span className={className}>{new Intl.NumberFormat("vi-VN").format(amount)}</span>;
  }

  return (
    <EditablePrice
      value={amount}
      onChange={(v) => edit.updateField(path, v)}
      className={className}
    />
  );
}

export function InlineTextBlock({
  path,
  fallback = "",
  className,
  label,
  adminEditable,
}: InlineProps) {
  const edit = useAdminEdit();
  const text = resolveField(edit?.values, edit?.patches, path, fallback);
  const active = adminEditable && edit?.editMode;

  if (!active || !edit) return <div className={className}>{text}</div>;

  return (
    <EditableTextBlock
      value={text}
      onChange={(v) => edit.updateField(path, v)}
      className={className}
      label={label ?? path}
    />
  );
}

export function InlineSectionTitle({
  titlePath,
  titleFallback,
  subtitlePath,
  subtitleFallback,
  adminEditable,
  inverted,
}: {
  titlePath: string;
  titleFallback: string;
  subtitlePath?: string;
  subtitleFallback?: string;
  adminEditable?: boolean;
  inverted?: boolean;
}) {
  const titleClass = `mt-4 ${vfSectionHeadingLeft} ${inverted ? "text-white" : "text-brand-dark"}`;
  const subtitleClass = `mt-2.5 text-sm leading-relaxed sm:text-[15px] ${
    inverted ? "text-white/70" : "text-muted-foreground"
  }`;

  return (
    <div className="max-w-3xl">
      <span
        className={`inline-block h-1 w-10 rounded-full ${inverted ? "bg-accent-yellow" : "bg-brand"}`}
      />
      <h2 className={titleClass}>
        <InlineText
          path={titlePath}
          fallback={titleFallback}
          adminEditable={adminEditable}
          className={titleClass}
          label={titleFallback}
        />
      </h2>
      {subtitlePath ? (
        <div className={subtitleClass}>
          <InlineText
            path={subtitlePath}
            fallback={subtitleFallback ?? ""}
            adminEditable={adminEditable}
            className={subtitleClass}
            multiline
            label={subtitleFallback}
          />
        </div>
      ) : subtitleFallback ? (
        <div className={subtitleClass}>{subtitleFallback}</div>
      ) : null}
    </div>
  );
}

export function mapEditableFeatures(
  items: { title: string; desc: string; image: string }[],
  prefix: string,
  adminEditable?: boolean,
): { title: ReactNode; desc: ReactNode; image: string }[] {
  return items.map((item, i) => ({
    title: (
      <InlineText
        path={`${prefix}.${i}.title`}
        fallback={item.title}
        adminEditable={adminEditable}
        className={`${vfCardTitle} text-white`}
      />
    ),
    desc: (
      <InlineText
        path={`${prefix}.${i}.desc`}
        fallback={item.desc}
        adminEditable={adminEditable}
        className="text-xs leading-relaxed text-white/75 sm:text-sm"
        multiline
      />
    ),
    image: item.image,
  }));
}

export function mapEditableTech(
  items: { icon: React.ElementType; title: string; desc: string }[],
  prefix: string,
  adminEditable?: boolean,
) {
  return items.map((item, i) => ({
    icon: item.icon,
    title: (
      <InlineText
        path={`${prefix}.${i}.title`}
        fallback={item.title}
        adminEditable={adminEditable}
        className={vfCardTitle}
      />
    ),
    desc: (
      <InlineText
        path={`${prefix}.${i}.desc`}
        fallback={item.desc}
        adminEditable={adminEditable}
        className="text-sm leading-relaxed text-muted-foreground"
        multiline
      />
    ),
  }));
}

export function editableBullets(
  bullets: string[],
  path: string,
  adminEditable?: boolean,
): ReactNode[] {
  return bullets.map((bullet, i) => (
    <InlineText
      key={`${path}-${i}`}
      path={`${path}.${i}`}
      fallback={bullet}
      adminEditable={adminEditable}
      className="text-sm leading-snug text-foreground/90"
    />
  ));
}

export function editableHighlights(
  highlights: string[],
  path: string,
  adminEditable?: boolean,
  className?: string,
): ReactNode[] {
  return highlights.map((h, i) => (
    <span
      key={`${path}-${i}`}
      className={
        className ??
        "rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-[11px] font-bold text-brand"
      }
    >
      <InlineText
        path={`${path}.${i}`}
        fallback={h}
        adminEditable={adminEditable}
        className="text-[11px] font-bold"
      />
    </span>
  ));
}

export type { PatchValue };

export type QuickSpecDef = {
  icon: ElementType;
  key: string;
  label: string;
  value: string;
};

export function buildQuickSpecBarItems(
  defs: QuickSpecDef[],
  adminEditable?: boolean,
  valueClass = "font-black tabular-nums text-brand-dark text-xs sm:text-sm",
  labelClass = "text-[9px] sm:text-[10px] text-muted-foreground",
): PdpSpecItem[] {
  return defs.map((d) => ({
    icon: d.icon,
    label: adminEditable ? (
      <InlineText
        path={`_quickSpec.${d.key}.label`}
        fallback={d.label}
        adminEditable={adminEditable}
        className={labelClass}
        label={d.label}
      />
    ) : (
      d.label
    ),
    value: adminEditable ? (
      <InlineText
        path={`_quickSpec.${d.key}.value`}
        fallback={d.value}
        adminEditable={adminEditable}
        className={valueClass}
        label={d.label}
      />
    ) : (
      d.value
    ),
  }));
}

export function EditableHighlightStat({
  icon: Icon,
  specKey,
  value,
  label,
  adminEditable,
}: {
  icon: ElementType;
  specKey: string;
  value: string;
  label: string;
  adminEditable?: boolean;
}) {
  const valueClass = "text-sm font-black text-brand-dark";
  const labelClass = "text-[10px] text-muted-foreground";

  return (
    <div className="text-center">
      <Icon className="mx-auto size-4 text-brand" strokeWidth={1.5} />
      <div className="mt-1">
        {adminEditable ? (
          <InlineText
            path={`_quickSpec.${specKey}.value`}
            fallback={value}
            adminEditable={adminEditable}
            className={valueClass}
            label={label}
          />
        ) : (
          <span className={valueClass}>{value}</span>
        )}
      </div>
      <div>
        {adminEditable ? (
          <InlineText
            path={`_quickSpec.${specKey}.label`}
            fallback={label}
            adminEditable={adminEditable}
            className={labelClass}
            label={label}
          />
        ) : (
          <span className={labelClass}>{label}</span>
        )}
      </div>
    </div>
  );
}

export function mapEditableMetrics(
  metrics: { icon: ElementType; label: string; value: string }[],
  prefix: string,
  adminEditable?: boolean,
): PdpMetric[] {
  return metrics.map((m, i) => ({
    icon: m.icon,
    label: adminEditable ? (
      <InlineText
        path={`${prefix}.${i}.label`}
        fallback={m.label}
        adminEditable={adminEditable}
        className="text-[11px] leading-snug text-muted-foreground"
      />
    ) : (
      m.label
    ),
    value: adminEditable ? (
      <InlineText
        path={`${prefix}.${i}.value`}
        fallback={m.value}
        adminEditable={adminEditable}
        className="text-lg font-black tabular-nums text-brand-dark sm:text-xl"
      />
    ) : (
      m.value
    ),
  }));
}
