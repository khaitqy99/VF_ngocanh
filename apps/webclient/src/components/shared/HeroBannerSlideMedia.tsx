import type { HeroBannerSlide } from "@/lib/images";

/** Giữ chiều cao banner = chiều cao ảnh (in-flow, không hiển thị). */
export function HeroBannerHeightSpacer({ slide }: { slide: HeroBannerSlide }) {
  return (
    <div aria-hidden className="pointer-events-none select-none">
      {}
      <img src={slide.mobile} alt="" className="block h-auto w-full opacity-0 lg:hidden" />
      {}
      <img src={slide.desktop} alt="" className="hidden h-auto w-full opacity-0 lg:block" />
    </div>
  );
}

export function HeroBannerSlideImages({
  slide,
  priority = false,
  variant = "cover",
}: {
  slide: HeroBannerSlide;
  priority?: boolean;
  /** cover — lớp animate absolute; contain — hiển thị đúng tỷ lệ ảnh */
  variant?: "cover" | "contain";
}) {
  const imgClass = variant === "cover" ? "h-full w-full object-cover" : "h-auto w-full";

  return (
    <>
      {}
      <img
        src={slide.mobile}
        alt={slide.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`block lg:hidden ${imgClass}`}
      />
      {}
      <img
        src={slide.desktop}
        alt={slide.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`hidden lg:block ${imgClass}`}
      />
    </>
  );
}
