"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type ResilientLinkProps = ComponentProps<typeof Link> & {
  fallbackDelayMs?: number;
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function ResilientLink({
  href,
  onClick,
  fallbackDelayMs = 350,
  target,
  ...props
}: ResilientLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (typeof href !== "string") return;
        if (!href.startsWith("/")) return;
        if (target && target !== "_self") return;
        if (isModifiedClick(event)) return;
        if (typeof window === "undefined") return;

        const before = window.location.pathname + window.location.search + window.location.hash;

        window.setTimeout(() => {
          const after = window.location.pathname + window.location.search + window.location.hash;
          if (after === before) {
            window.location.assign(href);
          }
        }, fallbackDelayMs);
      }}
      {...props}
    />
  );
}
