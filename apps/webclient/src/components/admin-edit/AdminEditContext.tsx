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
import type { CarDetail } from "@/lib/car-details";
import type { ScooterDetail } from "@/lib/scooter-details";
import {
  mergeVehicleDraft,
  buildSavePatches,
  type VehicleEditDraft,
  type VehicleEditable,
  type PatchValue,
} from "@/components/admin-edit/vehicle-edit";
import { getAtPath } from "@/components/admin-edit/vehicle-edit-paths";

export type { VehicleEditDraft as CarEditDraft, PatchValue };

type MediaCategory = "cars" | "scooters" | "accessories";

type AdminEditContextValue = {
  isAdmin: true;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  hasUnsavedChanges: boolean;
  values: VehicleEditable;
  patches: Record<string, PatchValue>;
  update: (patch: VehicleEditDraft) => void;
  updateField: (path: string, value: PatchValue) => void;
  addListItem: (path: string, item: unknown) => void;
  removeListItem: (path: string, index: number, minItems?: number) => void;
  hiddenSections: string[];
  toggleSectionHidden: (id: string) => void;
  requestImage: (path: string) => void;
  requestMedia: (path: string, kind?: "image" | "svg") => void;
  save: () => void;
  reset: () => void;
};

const AdminEditContext = createContext<AdminEditContextValue | null>(null);

export function useAdminEdit() {
  return useContext(AdminEditContext);
}

function stripChildPatches(patches: Record<string, PatchValue>, path: string) {
  const next = { ...patches };
  for (const key of Object.keys(next)) {
    if (key === path || key.startsWith(`${path}.`)) {
      delete next[key];
    }
  }
  return next;
}

function VehicleAdminEditProvider<T extends VehicleEditable>({
  detail,
  productType,
  mediaCategory,
  children,
}: {
  detail: T;
  productType: "car" | "scooter";
  mediaCategory: MediaCategory;
  children: ReactNode;
}) {
  const [editMode, setEditMode] = useState(true);
  const [draft, setDraft] = useState<VehicleEditDraft>({ patches: {} });
  const hasUnsavedChanges = useMemo(() => {
    const hasPatches = Boolean(draft.patches && Object.keys(draft.patches).length > 0);
    return Boolean(
      hasPatches ||
      draft.name !== undefined ||
      draft.tagline !== undefined ||
      draft.slogan !== undefined ||
      draft.badges !== undefined ||
      draft.price !== undefined ||
      draft.overviewTitle !== undefined ||
      draft.overviewSubtitle !== undefined,
    );
  }, [draft]);

  const values = useMemo(() => mergeVehicleDraft(detail, draft), [detail, draft]);

  const update = useCallback((patch: VehicleEditDraft) => {
    if (patch.path !== undefined && patch.value !== undefined) {
      setDraft((prev) => ({
        ...prev,
        patches: { ...prev.patches, [patch.path!]: patch.value! },
      }));
      return;
    }
    const { path: _p, value: _v, patches: newPatches, ...rest } = patch;
    setDraft((prev) => ({
      ...prev,
      ...rest,
      patches: newPatches ? { ...prev.patches, ...newPatches } : prev.patches,
    }));
  }, []);

  const updateField = useCallback(
    (path: string, value: PatchValue) => {
      update({ path, value });
    },
    [update],
  );

  const addListItem = useCallback(
    (path: string, item: unknown) => {
      setDraft((prev) => {
        const merged = mergeVehicleDraft(detail, prev);
        const current = getAtPath(merged, path);
        const list = Array.isArray(current) ? [...current] : [];
        list.push(item);
        const cleaned = stripChildPatches(prev.patches ?? {}, path);
        return {
          ...prev,
          patches: { ...cleaned, [path]: list as PatchValue },
        };
      });
      toast.message("Đã thêm mục mới");
    },
    [detail],
  );

  const removeListItem = useCallback(
    (path: string, index: number, minItems = 0) => {
      setDraft((prev) => {
        const merged = mergeVehicleDraft(detail, prev);
        const current = getAtPath(merged, path);
        if (!Array.isArray(current) || current.length <= minItems) {
          toast.error(minItems > 0 ? `Cần giữ ít nhất ${minItems} mục` : "Không thể xóa mục này");
          return prev;
        }
        const list = [...current];
        list.splice(index, 1);
        const cleaned = stripChildPatches(prev.patches ?? {}, path);
        return {
          ...prev,
          patches: { ...cleaned, [path]: list as PatchValue },
        };
      });
      toast.message("Đã xóa mục");
    },
    [detail],
  );

  const hiddenSections = useMemo(() => {
    const raw = getAtPath(values, "_hiddenSections");
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
  }, [values]);

  const toggleSectionHidden = useCallback(
    (id: string) => {
      setDraft((prev) => {
        const merged = mergeVehicleDraft(detail, prev);
        const raw = getAtPath(merged, "_hiddenSections");
        const current = Array.isArray(raw)
          ? (raw.filter((x) => typeof x === "string") as string[])
          : [];
        const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
        return {
          ...prev,
          patches: { ...(prev.patches ?? {}), _hiddenSections: next as PatchValue },
        };
      });
      toast.message("Đã cập nhật hiển thị mục nội dung");
    },
    [detail],
  );

  const requestMedia = useCallback(
    (path: string, kind: "image" | "svg" = "image") => {
      if (typeof window === "undefined" || window.parent === window) {
        toast.message("Chọn file — mở từ trang admin để dùng thư viện media");
        return;
      }
      window.parent.postMessage(
        {
          type: "vf-admin-pick-image",
          path,
          kind,
          category: mediaCategory,
          slug: detail.id,
        },
        "*",
      );
    },
    [detail.id, mediaCategory],
  );

  const requestImage = useCallback((path: string) => requestMedia(path, "image"), [requestMedia]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "vf-admin-image-selected" || !event.data.path) return;
      updateField(event.data.path, event.data.imagePath);
      toast.success(
        event.data.path.includes("iconSvg") || String(event.data.imagePath).endsWith(".svg")
          ? "Đã cập nhật icon SVG"
          : "Đã cập nhật ảnh",
      );
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [updateField]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  const reset = useCallback(() => {
    setDraft({ patches: {} });
    toast.message("Đã hoàn tác thay đổi chưa lưu");
  }, []);

  const save = useCallback(() => {
    const patches = buildSavePatches(detail, draft);

    if (Object.keys(patches).length === 0) {
      toast.message("Không có thay đổi để lưu");
      return;
    }

    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "vf-admin-saved",
          productType,
          productId: detail.id,
          patches,
        },
        "*",
      );
      setDraft({ patches: {} });
      toast.success("Đã gửi thay đổi sang admin để lưu");
      return;
    }
    toast.message("Chỉ lưu được khi mở từ trang admin đã đăng nhập");
  }, [detail, productType, draft]);

  const ctx = useMemo(
    (): AdminEditContextValue => ({
      isAdmin: true,
      editMode,
      setEditMode,
      hasUnsavedChanges,
      values,
      patches: draft.patches ?? {},
      update,
      updateField,
      addListItem,
      removeListItem,
      hiddenSections,
      toggleSectionHidden,
      requestImage,
      requestMedia,
      save,
      reset,
    }),
    [
      editMode,
      hasUnsavedChanges,
      values,
      draft.patches,
      update,
      updateField,
      addListItem,
      removeListItem,
      hiddenSections,
      toggleSectionHidden,
      requestImage,
      requestMedia,
      save,
      reset,
    ],
  );

  return <AdminEditContext.Provider value={ctx}>{children}</AdminEditContext.Provider>;
}

export function CarAdminEditProvider({
  detail,
  children,
}: {
  detail: CarDetail;
  children: ReactNode;
}) {
  return (
    <VehicleAdminEditProvider detail={detail} productType="car" mediaCategory="cars">
      {children}
    </VehicleAdminEditProvider>
  );
}

export function ScooterAdminEditProvider({
  detail,
  children,
}: {
  detail: ScooterDetail;
  children: ReactNode;
}) {
  return (
    <VehicleAdminEditProvider detail={detail} productType="scooter" mediaCategory="scooters">
      {children}
    </VehicleAdminEditProvider>
  );
}
