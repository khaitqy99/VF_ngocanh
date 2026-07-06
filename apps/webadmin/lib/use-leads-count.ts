"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@vinfast3s/supabase/client";

export const LEADS_UPDATED_EVENT = "leads:updated";

export function notifyLeadsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LEADS_UPDATED_EVENT));
  }
}

type LeadsCounts = { new: number; total: number };

async function fetchLeadsCounts(): Promise<LeadsCounts> {
  const response = await fetch("/api/leads/count", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Không tải được số lead");
  }
  const data = await response.json();
  return { new: data.new ?? 0, total: data.total ?? 0 };
}

export function useLeadsCounts() {
  const [counts, setCounts] = useState<LeadsCounts>({ new: 0, total: 0 });

  const refresh = useCallback(async () => {
    try {
      const next = await fetchLeadsCounts();
      setCounts(next);
    } catch {
      // ignore transient errors
    }
  }, []);

  useEffect(() => {
    refresh();

    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let supabase: ReturnType<typeof createBrowserClient> | null = null;
    let channel: ReturnType<ReturnType<typeof createBrowserClient>["channel"]> | null = null;

    try {
      supabase = createBrowserClient();
      channel = supabase
        .channel("admin-leads-count")
        .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
          refresh();
        })
        .subscribe();

      pollTimer = setInterval(refresh, 60_000);
    } catch {
      pollTimer = setInterval(refresh, 30_000);
    }

    const onLocalUpdate = () => refresh();
    window.addEventListener(LEADS_UPDATED_EVENT, onLocalUpdate);

    return () => {
      if (pollTimer) clearInterval(pollTimer);
      if (supabase && channel) supabase.removeChannel(channel);
      window.removeEventListener(LEADS_UPDATED_EVENT, onLocalUpdate);
    };
  }, [refresh]);

  return counts;
}
