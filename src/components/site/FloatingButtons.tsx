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
    <div className="fixed right-4 bottom-6 z-40 flex flex-col gap-3">
      <a
        href="tel:19002323"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-card hover:scale-105 transition"
        aria-label="Hotline"
      >
        <Phone size={20} />
      </a>
      <a
        href="#"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-card hover:scale-105 transition"
        aria-label="Messenger"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href="#"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0068FF] text-white shadow-card hover:scale-105 transition text-[10px] font-black"
        aria-label="Zalo"
      >
        Zalo
      </a>
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-white shadow-card hover:scale-105 transition"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
