"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";
import { HOTLINE_TEL } from "@/lib/contact";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { floatEntrance, springSnappy } from "@/lib/motion";

const MESSENGER_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || "";
const ZALO_URL = process.env.NEXT_PUBLIC_ZALO_URL?.trim() || "";

const floatBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors sm:h-12 sm:w-12";

export default function FloatingButtons() {
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const f = () => setShow(window.scrollY > 400);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  const hoverTap = reduced
    ? {}
    : {
        whileHover: { scale: 1.08, y: -2 } as const,
        whileTap: { scale: 0.94 } as const,
      };

  const floatProps = reduced
    ? {}
    : {
        custom: 0,
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: floatEntrance,
      };

  return (
    <div className="fixed right-3 bottom-24 z-40 flex flex-col gap-2.5 sm:right-4 sm:gap-3 lg:bottom-6">
      <motion.a
        href={HOTLINE_TEL}
        {...floatProps}
        custom={0}
        {...hoverTap}
        className={`${floatBtn} relative border border-brand/20 bg-brand hover:bg-brand/90`}
        aria-label="Hotline"
      >
        {!reduced ? (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-brand/40"
            animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}
        <Phone size={20} />
      </motion.a>
      <motion.a
        href={MESSENGER_URL || "#"}
        {...floatProps}
        custom={1}
        {...hoverTap}
        className={`${floatBtn} border border-brand/25 bg-brand shadow-[var(--shadow-brand)] hover:bg-[#0046cc]${MESSENGER_URL ? "" : " pointer-events-none opacity-50"}`}
        aria-label="Messenger"
        {...(MESSENGER_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <MessageCircle size={20} />
      </motion.a>
      <motion.a
        href={ZALO_URL || "#"}
        {...floatProps}
        custom={2}
        {...hoverTap}
        className={`${floatBtn} border border-blue-700/20 bg-[#0068FF] text-[10px] font-black hover:bg-[#0058d6]${ZALO_URL ? "" : " pointer-events-none opacity-50"}`}
        aria-label="Zalo"
        {...(ZALO_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        Zalo
      </motion.a>
      <AnimatePresence>
        {show && (
          <motion.button
            initial={reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.7, y: 8 }}
            transition={reduced ? { duration: 0 } : springSnappy}
            {...hoverTap}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`${floatBtn} border border-brand-dark/20 bg-brand-dark hover:bg-brand-dark/90`}
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
