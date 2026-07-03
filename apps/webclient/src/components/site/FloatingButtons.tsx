"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";
import { HOTLINE_TEL } from "@/lib/contact";
import { floatEntrance, springSnappy } from "@/lib/motion";

const floatBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors sm:h-12 sm:w-12";

export default function FloatingButtons() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const f = () => setShow(window.scrollY > 400);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <div className="fixed right-3 bottom-24 z-40 flex flex-col gap-2.5 sm:right-4 sm:gap-3 lg:bottom-6">
      <motion.a
        href={HOTLINE_TEL}
        custom={0}
        initial="hidden"
        animate="visible"
        variants={floatEntrance}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className={`${floatBtn} relative border border-brand/20 bg-brand hover:bg-brand/90`}
        aria-label="Hotline"
      >
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-brand/40"
          animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
        <Phone size={20} />
      </motion.a>
      <motion.a
        href="#"
        custom={1}
        initial="hidden"
        animate="visible"
        variants={floatEntrance}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className={`${floatBtn} border border-blue-600/20 bg-[#0084FF] hover:bg-[#0073e6]`}
        aria-label="Messenger"
      >
        <MessageCircle size={20} />
      </motion.a>
      <motion.a
        href="#"
        custom={2}
        initial="hidden"
        animate="visible"
        variants={floatEntrance}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className={`${floatBtn} border border-blue-700/20 bg-[#0068FF] text-[10px] font-black hover:bg-[#0058d6]`}
        aria-label="Zalo"
      >
        Zalo
      </motion.a>
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 8 }}
            transition={springSnappy}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
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
