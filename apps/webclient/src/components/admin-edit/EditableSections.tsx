"use client";

import type { ElementType } from "react";
import { EditableImage, ImagePickerFab } from "@/components/admin-edit/EditableImage";
import { EditableListControls } from "@/components/admin-edit/EditableListControls";
import { InlineText } from "@/components/admin-edit/EditablePath";
import { DEFAULT_FEATURE_CARD, DEFAULT_TECH_ITEM } from "@/components/admin-edit/list-defaults";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { EditableSvgIcon } from "@/components/admin-edit/EditableColorPicker";
import { getImageAtPath } from "@/components/admin-edit/vehicle-edit-paths";
import { vfCardTitle } from "@/lib/typography";
import {
  expandGalleryToGrid,
  PdpImageFeatureGrid,
  PdpTechIconGrid,
  type PdpFeatureCard,
  type PdpTechCard,
} from "@/components/shared/PdpContentBlocks";

type FeatureItem = { title: string; desc: string; image: string };

export function expandFeatureItemsForGrid(items: FeatureItem[], labels: string[]): FeatureItem[] {
  return expandGalleryToGrid(
    items as Parameters<typeof expandGalleryToGrid>[0],
    labels,
  ) as FeatureItem[];
}

export function EditableFeatureGridSection({
  path,
  items,
  adminEditable,
  fallbackImage,
  labels,
  expandToGrid,
}: {
  path: string;
  items: FeatureItem[];
  adminEditable?: boolean;
  fallbackImage: string;
  labels?: string[];
  expandToGrid?: (items: FeatureItem[], labels: string[]) => FeatureItem[];
}) {
  const edit = useAdminEdit();
  const base = expandToGrid && labels ? expandToGrid(items, labels) : items;

  const gridItems: PdpFeatureCard[] = base.map((item, i) => ({
    title: (
      <InlineText
        path={`${path}.${i}.title`}
        fallback={item.title}
        adminEditable={adminEditable}
        className={`${vfCardTitle} text-white`}
      />
    ),
    desc: (
      <InlineText
        path={`${path}.${i}.desc`}
        fallback={item.desc}
        adminEditable={adminEditable}
        className="text-xs leading-relaxed text-white/75 sm:text-sm"
        multiline
      />
    ),
    image: getImageAtPath(edit?.values, `${path}.${i}.image`, item.image),
    imageSlot:
      adminEditable && edit?.editMode ? (
        <img
          src={getImageAtPath(edit?.values, `${path}.${i}.image`, item.image)}
          alt={typeof item.title === "string" ? item.title : ""}
          className="absolute inset-0 z-[1] h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : undefined,
    imagePickerSlot:
      adminEditable && edit?.editMode ? <ImagePickerFab path={`${path}.${i}.image`} /> : undefined,
    editSlot:
      adminEditable && edit?.editMode ? (
        <EditableListControls
          path={path}
          index={i}
          minItems={1}
          adminEditable
          label="thẻ"
          onAdd={() => undefined}
        />
      ) : undefined,
  }));

  return (
    <>
      <PdpImageFeatureGrid items={gridItems} />
      {adminEditable && edit?.editMode ? (
        <EditableListControls
          path={path}
          adminEditable
          label="thẻ"
          onAdd={() => edit.addListItem(path, DEFAULT_FEATURE_CARD(fallbackImage))}
        />
      ) : null}
    </>
  );
}

export function EditableTechGridSection({
  path,
  items,
  adminEditable,
}: {
  path: string;
  items: { icon: ElementType; iconSvg?: string; title: string; desc: string }[];
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();

  const gridItems: PdpTechCard[] = items.map((item, i) => ({
    iconSlot: (
      <EditableSvgIcon
        path={`${path}.${i}.iconSvg`}
        iconSvg={item.iconSvg}
        fallbackIcon={item.icon}
        adminEditable={adminEditable}
      />
    ),
    title: (
      <InlineText
        path={`${path}.${i}.title`}
        fallback={item.title}
        adminEditable={adminEditable}
        className={vfCardTitle}
      />
    ),
    desc: (
      <InlineText
        path={`${path}.${i}.desc`}
        fallback={item.desc}
        adminEditable={adminEditable}
        className="text-sm leading-relaxed text-muted-foreground"
        multiline
      />
    ),
    editSlot:
      adminEditable && edit?.editMode ? (
        <EditableListControls
          path={path}
          index={i}
          minItems={1}
          adminEditable
          label="mục"
          onAdd={() => undefined}
        />
      ) : undefined,
  }));

  return (
    <>
      <PdpTechIconGrid items={gridItems} />
      {adminEditable && edit?.editMode ? (
        <EditableListControls
          path={path}
          adminEditable
          label="tính năng"
          onAdd={() => edit.addListItem(path, DEFAULT_TECH_ITEM())}
        />
      ) : null}
    </>
  );
}

export function EditableBulletList({
  bullets,
  path,
  adminEditable,
}: {
  bullets: string[];
  path: string;
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();

  return (
    <>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {bullets.map((bullet, i) => (
          <li
            key={`bullet-${path}-${i}`}
            className="relative flex items-start gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3.5 shadow-soft"
          >
            {adminEditable && edit?.editMode ? (
              <EditableListControls
                path={path}
                index={i}
                minItems={0}
                adminEditable
                label="điểm"
                onAdd={() => undefined}
              />
            ) : null}
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">
              ✓
            </span>
            <span className="text-sm leading-snug text-foreground/90">
              <InlineText
                path={`${path}.${i}`}
                fallback={bullet}
                adminEditable={adminEditable}
                className="text-sm leading-snug text-foreground/90"
              />
            </span>
          </li>
        ))}
      </ul>
      {adminEditable && edit?.editMode ? (
        <EditableListControls
          path={path}
          adminEditable
          label="điểm nổi bật"
          onAdd={() => edit.addListItem(path, "Điểm nổi bật mới")}
        />
      ) : null}
    </>
  );
}

export function EditableOverviewImage({
  path,
  src,
  alt,
  adminEditable,
}: {
  path: string;
  src: string;
  alt: string;
  adminEditable?: boolean;
}) {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand/15 to-transparent blur-sm" />
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#eef2f8] shadow-card ring-1 ring-border/40">
        <EditableImage
          path={path}
          src={src}
          alt={alt}
          adminEditable={adminEditable}
          className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/5] lg:min-h-[420px]"
          imgClassName="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/5] lg:min-h-[420px]"
        />
      </div>
    </div>
  );
}
