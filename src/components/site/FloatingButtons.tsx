"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";

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
      <a
        href="tel:19002323"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/20 bg-brand text-white transition-colors hover:bg-brand/90 sm:h-12 sm:w-12"
        aria-label="Hotline"
      >
        <Phone size={20} />
      </a>
      <a
        href="#"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-600/20 bg-[#0084FF] text-white transition-colors hover:bg-[#0073e6] sm:h-12 sm:w-12"
        aria-label="Messenger"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href="#"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-700/20 bg-[#0068FF] text-[10px] font-black text-white transition-colors hover:bg-[#0058d6] sm:h-12 sm:w-12"
        aria-label="Zalo"
      >
        Zalo
      </a>
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-dark/20 bg-brand-dark text-white transition-colors hover:bg-brand-dark/90 sm:h-12 sm:w-12"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
