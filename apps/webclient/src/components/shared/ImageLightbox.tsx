"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useModalMotion } from "@/hooks/use-modal-motion";

type LightboxState = {
  images: string[];
  index: number;
  alt?: string;
};

type ImageLightboxApi = {
  open: (images: string | string[], index?: number, alt?: string) => void;
  close: () => void;
};

const ImageLightboxContext = createContext<ImageLightboxApi | null>(null);

export function useImageLightbox(): ImageLightboxApi {
  const ctx = useContext(ImageLightboxContext);
  return (
    ctx ?? {
      open: () => undefined,
      close: () => undefined,
    }
  );
}

export function ImageLightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null);
  const modalMotion = useModalMotion();

  const close = useCallback(() => setState(null), []);

  const open = useCallback((images: string | string[], index = 0, alt?: string) => {
    const list = (Array.isArray(images) ? images : [images]).filter(Boolean);
    if (!list.length) return;
    setState({
      images: list,
      index: Math.min(Math.max(0, index), list.length - 1),
      alt,
    });
  }, []);

  const go = useCallback((delta: number) => {
    setState((prev) => {
      if (!prev || prev.images.length < 2) return prev;
      const next = (prev.index + delta + prev.images.length) % prev.images.length;
      return { ...prev, index: next };
    });
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [state, close, go]);

  const api = useMemo(() => ({ open, close }), [open, close]);
  const current = state ? state.images[state.index] : null;
  const multi = (state?.images.length ?? 0) > 1;

  return (
    <ImageLightboxContext.Provider value={api}>
      {children}
      <AnimatePresence>
        {state && current ? (
          <motion.div
            {...modalMotion.overlay}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh phóng to"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Đóng"
            >
              <X className="size-5" />
            </button>

            {multi ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute top-1/2 left-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4 sm:size-12"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="size-6" />
              </button>
            ) : null}

            <motion.img
              key={`${state.index}-${current}`}
              src={current}
              alt={state.alt ?? "Ảnh phóng to"}
              {...modalMotion.panel}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {multi ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute top-1/2 right-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:size-12"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="size-6" />
              </button>
            ) : null}

            {multi ? (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold tracking-wider text-white">
                {state.index + 1} / {state.images.length}
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ImageLightboxContext.Provider>
  );
}
