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

import type { StaticPageEditorData } from "@/lib/cms/static-page-editor";
import type { CmsBannerInput } from "@/lib/cms/static-pages";
import { setAtPath } from "@/components/admin-edit/static-page/static-page-edit-paths";

type StaticPageAdminEditContextValue = {
  editMode: boolean;
  draft: StaticPageEditorData;
  initial: StaticPageEditorData;
  hasUnsavedChanges: boolean;
  updateField: (path: string, value: unknown) => void;
  updateBanner: (index: number, patch: Partial<CmsBannerInput>) => void;
  setStatus: (status: "draft" | "published") => void;
  setBanners: (banners: CmsBannerInput[]) => void;
  save: () => void;
  reset: () => void;
  requestImage: (path: string) => void;
};

const StaticPageAdminEditContext = createContext<StaticPageAdminEditContextValue | null>(null);

export function useStaticPageAdminEdit() {
  return useContext(StaticPageAdminEditContext);
}

function isSameData(a: StaticPageEditorData, b: StaticPageEditorData): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function StaticPageAdminEditProvider({
  initial,
  children,
}: {
  initial: StaticPageEditorData;
  children: ReactNode;
}) {
  const [draft, setDraft] = useState(initial);

  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  const hasUnsavedChanges = useMemo(() => !isSameData(draft, initial), [draft, initial]);

  const updateField = useCallback((path: string, value: unknown) => {
    setDraft((current) => ({
      ...current,
      content: setAtPath(current.content as Record<string, unknown>, path, value),
    }));
  }, []);

  const setStatus = useCallback((status: "draft" | "published") => {
    setDraft((current) => ({ ...current, status }));
  }, []);

  const setBanners = useCallback((banners: CmsBannerInput[]) => {
    setDraft((current) => ({ ...current, banners }));
  }, []);

  const updateBanner = useCallback((index: number, patch: Partial<CmsBannerInput>) => {
    setDraft((current) => ({
      ...current,
      banners: current.banners.map((banner, i) => (i === index ? { ...banner, ...patch } : banner)),
    }));
  }, []);

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
        productType: "static-page",
        slug: draft.slug,
        payload: {
          content: draft.content,
          banners: draft.banners,
          status: draft.status,
        },
      },
      "*",
    );
    toast.success("Đã gửi thay đổi sang admin — đang lưu…");
  }, [draft, hasUnsavedChanges]);

  const reset = useCallback(() => {
    setDraft(initial);
    toast.message("Đã hoàn tác thay đổi");
  }, [initial]);

  const requestImage = useCallback(
    (path: string) => {
      if (typeof window === "undefined" || window.parent === window) {
        toast.message("Mở từ trang admin để chọn ảnh");
        return;
      }
      window.parent.postMessage(
        {
          type: "vf-admin-pick-image",
          path,
          productType: "static-page",
          slug: draft.slug,
          category: "pages",
        },
        "*",
      );
    },
    [draft.slug],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type !== "vf-admin-image-selected" ||
        event.data?.productType !== "static-page" ||
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
        updateBanner(index, { [key]: imagePath } as Partial<CmsBannerInput>);
        return;
      }

      updateField(fieldPath, imagePath);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [updateField, updateBanner]);

  const value = useMemo(
    () => ({
      editMode: true,
      draft,
      initial,
      hasUnsavedChanges,
      updateField,
      updateBanner,
      setStatus,
      setBanners,
      save,
      reset,
      requestImage,
    }),
    [
      draft,
      initial,
      hasUnsavedChanges,
      updateField,
      updateBanner,
      setStatus,
      setBanners,
      save,
      reset,
      requestImage,
    ],
  );

  return (
    <StaticPageAdminEditContext.Provider value={value}>
      {children}
    </StaticPageAdminEditContext.Provider>
  );
}
