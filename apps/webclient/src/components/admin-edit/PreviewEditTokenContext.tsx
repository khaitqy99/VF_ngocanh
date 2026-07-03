"use client";

import { createContext, useContext, type ReactNode } from "react";

const PreviewEditTokenContext = createContext<string | null>(null);

export function PreviewEditTokenProvider({
  token,
  children,
}: {
  token: string | null;
  children: ReactNode;
}) {
  return (
    <PreviewEditTokenContext.Provider value={token}>{children}</PreviewEditTokenContext.Provider>
  );
}

export function usePreviewEditToken(): string | null {
  return useContext(PreviewEditTokenContext);
}

export function previewHrefWithToken(basePath: string, token: string | null): string {
  if (!token) return basePath;
  const joiner = basePath.includes("?") ? "&" : "?";
  return `${basePath}${joiner}edit_token=${encodeURIComponent(token)}`;
}
