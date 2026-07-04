"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { PreviewEditScope } from "@/lib/preview-edit-token";

const STORAGE_PREFIX = "vf-preview-edit:";
const SESSION_MS = 60 * 60 * 1000;

function storageKey(scope: PreviewEditScope) {
  return `${STORAGE_PREFIX}${scope}`;
}

export function markPreviewEditSession(scope: PreviewEditScope) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(storageKey(scope), String(Date.now()));
}

export function isPreviewEditSessionActive(scope: PreviewEditScope): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(storageKey(scope));
  if (!raw) return false;
  const started = Number(raw);
  if (!Number.isFinite(started)) return false;
  return Date.now() - started < SESSION_MS;
}

type PreviewEditContextValue = {
  scope: PreviewEditScope;
  adminEdit: boolean;
};

const PreviewEditContext = createContext<PreviewEditContextValue | null>(null);

export function PreviewEditScopeProvider({
  scope,
  serverAllowed,
  children,
}: {
  scope: PreviewEditScope;
  serverAllowed: boolean;
  children: ReactNode;
}) {
  const [adminEdit, setAdminEdit] = useState(serverAllowed);

  useEffect(() => {
    if (serverAllowed) {
      markPreviewEditSession(scope);
      setAdminEdit(true);
      return;
    }
    if (isPreviewEditSessionActive(scope)) {
      setAdminEdit(true);
    }
  }, [serverAllowed, scope]);

  useEffect(() => {
    const adminBase = process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, "");
    if (!adminBase) return;

    let adminOrigin: string;
    try {
      adminOrigin = new URL(adminBase).origin;
    } catch {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== adminOrigin) return;
      if (event.data?.type !== "vf-admin-enable-edit") return;
      markPreviewEditSession(scope);
      setAdminEdit(true);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [scope]);

  return (
    <PreviewEditContext.Provider value={{ scope, adminEdit }}>
      {children}
    </PreviewEditContext.Provider>
  );
}

export function usePreviewEditEnabled(): boolean {
  return useContext(PreviewEditContext)?.adminEdit ?? false;
}
