"use client";

import { usePathname } from "next/navigation";

import { isPreviewPath } from "@/lib/preview-edit-token";

import Header from "./Header";

/** Persistent site header — lives in root layout so it does not remount on client navigation. */
export default function SiteHeader() {
  const pathname = usePathname();

  if (isPreviewPath(pathname)) {
    return null;
  }

  return <Header />;
}
