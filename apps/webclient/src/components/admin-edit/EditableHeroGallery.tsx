"use client";

import type { ReactNode, RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { EditableImage } from "@/components/admin-edit/EditableImage";
import { EditableListControls } from "@/components/admin-edit/EditableListControls";
import { DEFAULT_GALLERY_IMAGE } from "@/components/admin-edit/list-defaults";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { getImageAtPath } from "@/components/admin-edit/vehicle-edit-paths";
import { detailGalleryImage, detailThumbDot } from "@/lib/detail-motion";

type Props = {
  images: string[];
  path?: string;
  activeImage: number;
  onActiveChange: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onZoom?: () => void;
  adminEditable?: boolean;
  fallbackImage: string;
  altLabel: string;
  reduced?: boolean;
  thumbStripRef?: RefObject<HTMLDivElement | null>;
  onScrollThumbs?: (dir: -1 | 1) => void;
  footer?: ReactNode;
};

export function EditableHeroGallery({
  images,
  path = "gallery",
  activeImage,
  onActiveChange,
  onPrev,
  onNext,
  onZoom,
  adminEditable,
  fallbackImage,
  altLabel,
  reduced,
  thumbStripRef,
  onScrollThumbs,
  footer,
}: Props) {
  const edit = useAdminEdit();
  const active = adminEditable && edit?.editMode;
  const safeIndex = Math.min(activeImage, Math.max(0, images.length - 1));
  const currentSrc = getImageAtPath(
    edit?.values,
    `${path}.${safeIndex}`,
    images[safeIndex] ?? fallbackImage,
  );

  return (
    <>
      <div className="relative w-full max-w-full overflow-hidden rounded-3xl bg-[#eef2f8] shadow-card ring-1 ring-border/40">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
          {active ? (
            <EditableImage
              path={`${path}.${safeIndex}`}
              src={currentSrc}
              alt={altLabel}
              adminEditable
              className="absolute inset-0 z-10 h-full w-full"
              imgClassName="absolute inset-0 h-full w-full object-contain p-2 sm:p-4"
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={safeIndex}
                src={currentSrc}
                alt={`${altLabel} ${safeIndex + 1}`}
                className="absolute inset-0 h-full w-full object-contain p-2 sm:p-4"
                variants={reduced ? undefined : detailGalleryImage}
                initial={reduced ? false : "enter"}
                animate={reduced ? undefined : "center"}
                exit={reduced ? undefined : "exit"}
              />
            </AnimatePresence>
          )}
        </div>
        {onZoom ? (
          <button
            type="button"
            onClick={onZoom}
            className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-border/60 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-dark shadow-sm backdrop-blur transition hover:bg-white sm:top-4 sm:right-4 sm:gap-1.5 sm:px-3 sm:py-1.5"
          >
            <ZoomIn className="size-3.5" /> Phóng to
          </button>
        ) : null}
        <button
          type="button"
          onClick={onPrev}
          className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:left-3 sm:size-10"
          aria-label="Ảnh trước"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:right-3 sm:size-10"
          aria-label="Ảnh sau"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-dark/70 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
          {images.length ? safeIndex + 1 : 0} / {images.length}
        </div>
      </div>

      <div className="relative mt-3">
        {onScrollThumbs ? (
          <button
            type="button"
            onClick={() => onScrollThumbs(-1)}
            className="absolute top-1/2 left-0 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:size-8"
            aria-label="Cuộn ảnh trước"
          >
            <ChevronLeft size={18} />
          </button>
        ) : null}
        <div
          ref={thumbStripRef}
          className="flex gap-2 overflow-x-auto scroll-smooth px-9 py-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => {
            const thumb = getImageAtPath(edit?.values, `${path}.${i}`, img);
            return (
              <div key={`${path}-thumb-${i}`} className="relative shrink-0">
                {active ? (
                  <EditableListControls
                    path={path}
                    index={i}
                    minItems={1}
                    adminEditable
                    label="ảnh"
                    onAdd={() => undefined}
                  />
                ) : null}
                {active ? (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onActiveChange(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onActiveChange(i);
                      }
                    }}
                    className={`relative size-14 cursor-pointer overflow-hidden rounded-lg border-2 sm:size-[72px] sm:rounded-xl ${
                      safeIndex === i
                        ? "border-brand ring-2 ring-brand/20"
                        : "border-border/40 hover:border-border"
                    }`}
                  >
                    <EditableImage
                      path={`${path}.${i}`}
                      src={thumb}
                      adminEditable
                      stopPropagation
                      className="h-full w-full"
                      imgClassName="h-full w-full object-contain bg-[#f4f6fa] p-0.5"
                    />
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => onActiveChange(i)}
                    animate={reduced ? undefined : safeIndex === i ? "active" : "inactive"}
                    variants={reduced ? undefined : detailThumbDot}
                    className={`relative size-14 shrink-0 overflow-hidden rounded-lg border-2 sm:size-[72px] sm:rounded-xl ${
                      safeIndex === i
                        ? "border-brand ring-2 ring-brand/20"
                        : "border-border/40 hover:border-border"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt=""
                      className="h-full w-full object-contain bg-[#f4f6fa] p-0.5"
                    />
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
        {onScrollThumbs ? (
          <button
            type="button"
            onClick={() => onScrollThumbs(1)}
            className="absolute top-1/2 right-0 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:size-8"
            aria-label="Cuộn ảnh sau"
          >
            <ChevronRight size={18} />
          </button>
        ) : null}
      </div>

      {active && edit ? (
        <EditableListControls
          path={path}
          adminEditable
          label="ảnh gallery"
          onAdd={() => {
            edit.addListItem(path, DEFAULT_GALLERY_IMAGE(fallbackImage));
            onActiveChange(images.length);
          }}
        />
      ) : null}

      {footer}
    </>
  );
}
