"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView, type UseInViewOptions } from "framer-motion";

const IN_VIEW_FALLBACK_MS = 2000;

/**
 * IntersectionObserver + timeout fallback for in-app browsers (Zalo, FB)
 * where whileInView sometimes never fires.
 */
export function useInViewReveal<T extends Element = HTMLDivElement>(options?: UseInViewOptions) {
  const ref = useRef<T | null>(null);
  const isInView = useInView(ref as RefObject<Element | null>, options);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setTimedOut(true), IN_VIEW_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, []);

  return {
    ref,
    show: isInView || timedOut,
  };
}
