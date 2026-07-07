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
import { toast } from "sonner";

import type { HomeEditorData } from "@/lib/cms/home-editor";
import type { HomeSectionsContent } from "@/lib/cms/home-content";
import type {
  HomeBannerInput,
  HomeFeaturedPriceOverride,
  HomeFeaturedPrices,
  HomeFeaturedSlideOverride,
  HomeFeaturedSlideOverrides,
} from "@/lib/cms/home-content";

type HomeAdminEditContextValue = {
  editMode: boolean;
  draft: HomeEditorData;
  initial: HomeEditorData;
  hasUnsavedChanges: boolean;
  updateSections: (updater: (sections: HomeSectionsContent) => HomeSectionsContent) => void;
  setBanners: (banners: HomeBannerInput[]) => void;
  updateBanner: (index: number, patch: Partial<HomeBannerInput>) => void;
  setFeaturedCarIds: (ids: string[]) => void;
  setFeaturedScooterIds: (ids: string[]) => void;
  setFeaturedAccessoryIds: (ids: string[]) => void;
  updateFeaturedCarPrice: (id: string, patch: Partial<HomeFeaturedPriceOverride>) => void;
  updateFeaturedScooterPrice: (id: string, patch: Partial<HomeFeaturedPriceOverride>) => void;
  updateFeaturedCarSlide: (id: string, patch: Partial<HomeFeaturedSlideOverride>) => void;
  updateFeaturedScooterSlide: (id: string, patch: Partial<HomeFeaturedSlideOverride>) => void;
  setStatus: (status: "draft" | "published") => void;
  save: () => void;
  reset: () => void;
  requestImage: (path: string) => void;
};

const HomeAdminEditContext = createContext<HomeAdminEditContextValue | null>(null);

export function useHomeAdminEdit() {
  return useContext(HomeAdminEditContext);
}

function isSameData(a: HomeEditorData, b: HomeEditorData): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function pruneSlideOverrides(
  overrides: HomeFeaturedSlideOverrides,
  ids: Set<string>,
): HomeFeaturedSlideOverrides {
  return Object.fromEntries(Object.entries(overrides).filter(([id]) => ids.has(id)));
}

export function HomeAdminEditProvider({
  initial,
  children,
}: {
  initial: HomeEditorData;
  children: ReactNode;
}) {
  const [draft, setDraft] = useState(initial);

  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  const hasUnsavedChanges = useMemo(() => !isSameData(draft, initial), [draft, initial]);

  const updateSections = useCallback(
    (updater: (sections: HomeSectionsContent) => HomeSectionsContent) => {
      setDraft((current) => ({ ...current, sections: updater(current.sections) }));
    },
    [],
  );

  const setBanners = useCallback((banners: HomeBannerInput[]) => {
    setDraft((current) => ({ ...current, banners }));
  }, []);

  const updateBanner = useCallback((index: number, patch: Partial<HomeBannerInput>) => {
    setDraft((current) => ({
      ...current,
      banners: current.banners.map((banner, i) => (i === index ? { ...banner, ...patch } : banner)),
    }));
  }, []);

  const setFeaturedCarIds = useCallback((featuredCarIds: string[]) => {
    setDraft((current) => {
      const priceIds = new Set(featuredCarIds);
      return {
        ...current,
        featuredCarIds,
        featuredCarPrices: Object.fromEntries(
          Object.entries(current.featuredCarPrices).filter(([id]) => priceIds.has(id)),
        ),
        featuredCarSlideOverrides: pruneSlideOverrides(current.featuredCarSlideOverrides, priceIds),
      };
    });
  }, []);

  const setFeaturedScooterIds = useCallback((featuredScooterIds: string[]) => {
    setDraft((current) => {
      const priceIds = new Set(featuredScooterIds);
      return {
        ...current,
        featuredScooterIds,
        featuredScooterPrices: Object.fromEntries(
          Object.entries(current.featuredScooterPrices).filter(([id]) => priceIds.has(id)),
        ),
        featuredScooterSlideOverrides: pruneSlideOverrides(
          current.featuredScooterSlideOverrides,
          priceIds,
        ),
      };
    });
  }, []);

  const setFeaturedAccessoryIds = useCallback((featuredAccessoryIds: string[]) => {
    setDraft((current) => ({ ...current, featuredAccessoryIds }));
  }, []);

  const setStatus = useCallback((status: "draft" | "published") => {
    setDraft((current) => ({ ...current, status }));
  }, []);

  const updateFeaturedPrices = useCallback(
    (kind: "car" | "scooter", id: string, patch: Partial<HomeFeaturedPriceOverride>) => {
      const key = kind === "car" ? "featuredCarPrices" : "featuredScooterPrices";
      setDraft((current) => {
        const prices: HomeFeaturedPrices = { ...current[key] };
        const next = { ...prices[id], ...patch };
        if (next.listPrice == null) {
          delete prices[id];
        } else {
          prices[id] = { listPrice: next.listPrice };
        }
        return { ...current, [key]: prices };
      });
    },
    [],
  );

  const updateFeaturedSlide = useCallback(
    (kind: "car" | "scooter", id: string, patch: Partial<HomeFeaturedSlideOverride>) => {
      const key = kind === "car" ? "featuredCarSlideOverrides" : "featuredScooterSlideOverrides";
      setDraft((current) => {
        const overrides: HomeFeaturedSlideOverrides = { ...current[key] };
        const next = { ...overrides[id], ...patch };
        const hasValue =
          Boolean(next.title?.trim()) ||
          Boolean(next.subtitle?.trim()) ||
          Boolean(next.specs?.some((spec) => spec.value?.trim() || spec.label?.trim()));
        if (!hasValue) {
          delete overrides[id];
        } else {
          overrides[id] = next;
        }
        return { ...current, [key]: overrides };
      });
    },
    [],
  );

  const updateFeaturedCarPrice = useCallback(
    (id: string, patch: Partial<HomeFeaturedPriceOverride>) => {
      updateFeaturedPrices("car", id, patch);
    },
    [updateFeaturedPrices],
  );

  const updateFeaturedScooterPrice = useCallback(
    (id: string, patch: Partial<HomeFeaturedPriceOverride>) => {
      updateFeaturedPrices("scooter", id, patch);
    },
    [updateFeaturedPrices],
  );

  const updateFeaturedCarSlide = useCallback(
    (id: string, patch: Partial<HomeFeaturedSlideOverride>) => {
      updateFeaturedSlide("car", id, patch);
    },
    [updateFeaturedSlide],
  );

  const updateFeaturedScooterSlide = useCallback(
    (id: string, patch: Partial<HomeFeaturedSlideOverride>) => {
      updateFeaturedSlide("scooter", id, patch);
    },
    [updateFeaturedSlide],
  );

  const save = useCallback(() => {
    if (!hasUnsavedChanges) {
      toast.message("Không có thay đổi để lưu");
      return;
    }
    if (typeof window === "undefined" || window.parent === window) {
      toast.message("Mở từ trang admin để lưu");
      return;
    }
    window.parent.postMessage(
      {
        type: "vf-admin-saved",
        productType: "home",
        payload: draft,
      },
      "*",
    );
    toast.success("Đã gửi thay đổi sang admin — đang lưu…");
  }, [draft, hasUnsavedChanges]);

  const reset = useCallback(() => {
    setDraft(initial);
    toast.message("Đã hoàn tác thay đổi");
  }, [initial]);

  const requestImage = useCallback((path: string) => {
    if (typeof window === "undefined" || window.parent === window) {
      toast.message("Mở từ trang admin để chọn ảnh");
      return;
    }
    window.parent.postMessage(
      {
        type: "vf-admin-pick-image",
        path,
        productType: "home",
        category: "cars",
        slug: "vf8-all-new",
      },
      "*",
    );
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type !== "vf-admin-image-selected" ||
        event.data?.productType !== "home" ||
        typeof event.data.path !== "string"
      ) {
        return;
      }
      const imagePath = String(event.data.imagePath ?? "");
      const fieldPath = String(event.data.path);
      if (!imagePath) return;

      if (fieldPath.startsWith("banners.")) {
        const [, indexRaw, key] = fieldPath.split(".");
        const index = Number(indexRaw);
        if (!Number.isFinite(index) || !key) return;
        updateBanner(index, { [key]: imagePath } as Partial<HomeBannerInput>);
        return;
      }

      if (fieldPath.startsWith("sections.")) {
        const parts = fieldPath.split(".");
        updateSections((sections) => {
          const next = structuredClone(sections);
          let cursor: unknown = next;
          for (let i = 1; i < parts.length - 1; i += 1) {
            const key = parts[i]!;
            if (typeof cursor !== "object" || cursor === null) return sections;
            cursor = (cursor as Record<string, unknown>)[key];
          }
          if (typeof cursor === "object" && cursor !== null) {
            (cursor as Record<string, unknown>)[parts[parts.length - 1]!] = imagePath;
          }
          return next;
        });
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [updateBanner, updateSections]);

  const value = useMemo(
    () => ({
      editMode: true,
      draft,
      initial,
      hasUnsavedChanges,
      updateSections,
      setBanners,
      updateBanner,
      setFeaturedCarIds,
      setFeaturedScooterIds,
      setFeaturedAccessoryIds,
      updateFeaturedCarPrice,
      updateFeaturedScooterPrice,
      updateFeaturedCarSlide,
      updateFeaturedScooterSlide,
      setStatus,
      save,
      reset,
      requestImage,
    }),
    [
      draft,
      initial,
      hasUnsavedChanges,
      updateSections,
      setBanners,
      updateBanner,
      setFeaturedCarIds,
      setFeaturedScooterIds,
      setFeaturedAccessoryIds,
      updateFeaturedCarPrice,
      updateFeaturedScooterPrice,
      updateFeaturedCarSlide,
      updateFeaturedScooterSlide,
      setStatus,
      save,
      reset,
      requestImage,
    ],
  );

  return <HomeAdminEditContext.Provider value={value}>{children}</HomeAdminEditContext.Provider>;
}

export function homeEditSectionClass(active?: boolean) {
  return active ? "ring-2 ring-amber-300 ring-offset-2" : "ring-1 ring-brand/15 ring-offset-1";
}
