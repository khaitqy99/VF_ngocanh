export type HeroBannerSlide = {
  desktop: string;
  mobile: string;
  alt: string;
};

export const HERO_BANNERS: HeroBannerSlide[] = [
  {
    desktop: "/images/banners/01-1-trieu-xuat-xuong-desktop.webp",
    mobile: "/images/banners/01-1-trieu-xuat-xuong-mobile.webp",
    alt: "VinFast chính thức xuất xưởng 1 triệu xe máy điện - Mãnh liệt chuyển đổi xanh 12/06/2026",
  },
  {
    desktop: "/images/banners/02-xmd-uu-dai-16-1-desktop.webp",
    mobile: "/images/banners/02-xmd-uu-dai-16-1-mobile.webp",
    alt: "VinFast xe máy điện - Phố thêm xanh lướt hè phơi phới, tổng ưu đãi lên đến 16%",
  },
  {
    desktop: "/images/banners/03-xmd-uu-dai-16-desktop.webp",
    mobile: "/images/banners/03-xmd-uu-dai-16-mobile.webp",
    alt: "VinFast xe máy điện - Phố thêm xanh lướt hè phơi phới, tổng ưu đãi lên đến 16%",
  },
  {
    desktop: "/images/banners/04-vinfascination-vinpearl-desktop.webp",
    mobile: "/images/banners/04-vinfascination-vinpearl-mobile.webp",
    alt: "VinFast Vinfascination đón hè rực rỡ - Ưu đãi giá bán lên đến 3%, tặng voucher Vinpearl",
  },
  {
    desktop: "/images/banners/05-vf3-vinpearl-desktop.webp",
    mobile: "/images/banners/05-vf3-vinpearl-mobile.webp",
    alt: "VinFast VF 3 Vinfascination mùa hè rực rỡ - Tặng voucher Vinpearl hoặc ưu đãi 2% giá bán",
  },
  {
    desktop: "/images/banners/06-vf-mpv7-desktop.webp",
    mobile: "/images/banners/06-vf-mpv7-mobile.webp",
    alt: "VinFast VF MPV 7 - Gia đình sum vầy hành trình trọn vẹn, tổng ưu đãi lên tới 124 triệu đồng",
  },
];

/** Banner ô tô — nguồn https://vinfastauto.com/vn_vi (static-cms-prod) */
export const CAR_HERO_BANNERS: HeroBannerSlide[] = [
  HERO_BANNERS[5],
  HERO_BANNERS[4],
  HERO_BANNERS[3],
];

/** Banner xe máy điện — nguồn https://vinfastauto.com/vn_vi (static-cms-prod) */
export const SCOOTER_HERO_BANNERS: HeroBannerSlide[] = [
  HERO_BANNERS[0],
  HERO_BANNERS[1],
  HERO_BANNERS[2],
];

/** Banner phụ kiện — nguồn https://shop.vinfastauto.com/vn_vi/phu-kien (VinFast) */
export const ACCESSORY_HERO_BANNERS: HeroBannerSlide[] = [
  {
    desktop: "/images/banners/accessories/phu-kien-banner-desktop.webp",
    mobile: "/images/banners/accessories/phu-kien-banner-desktop.webp",
    alt: "Phụ kiện chính hãng VinFast — Nâng tầm trải nghiệm xe điện",
  },
];

/** Banner dịch vụ hậu mãi — nguồn vinfastauto.com/vn_vi (thong-tin-bao-hanh, dich-vu-bao-duong, dich-vu-sua-chua) */
export const AFTER_SALES_HERO_BANNERS: HeroBannerSlide[] = [
  {
    desktop: "/images/banners/after-sales/01-bao-hanh-sua-chua-desktop.webp",
    mobile: "/images/banners/after-sales/01-bao-hanh-sua-chua-desktop.webp",
    alt: "Bảo hành - sửa chữa VinFast",
  },
  {
    desktop: "/images/banners/after-sales/02-bao-duong-dinh-ky-desktop.webp",
    mobile: "/images/banners/after-sales/02-bao-duong-dinh-ky-desktop.webp",
    alt: "Bảo dưỡng định kỳ VinFast",
  },
  {
    desktop: "/images/banners/after-sales/03-dich-vu-sua-chua-desktop.webp",
    mobile: "/images/banners/after-sales/03-dich-vu-sua-chua-mobile.webp",
    alt: "Dịch vụ sửa chữa VinFast",
  },
];

/** Banner pin & trạm sạc — nguồn vinfastauto.com/vn_vi/dich-vu-pin-oto-dien & dich-vu-pin-xe-may-dien */
export const CHARGING_HERO_BANNERS: HeroBannerSlide[] = [
  {
    desktop: "/images/banners/charging/01-tram-sac-vinfast-desktop.webp",
    mobile: "/images/banners/charging/01-tram-sac-vinfast-mobile.webp",
    alt: "Hệ thống trạm sạc VinFast — Lợi ích thuê pin & sạc công cộng",
  },
  {
    desktop: "/images/banners/charging/02-quy-hoach-tram-sac-desktop.webp",
    mobile: "/images/banners/charging/02-quy-hoach-tram-sac-desktop.webp",
    alt: "Quy hoạch trạm sạc VinFast toàn quốc",
  },
  {
    desktop: "/images/banners/charging/03-pin-xe-may-dien-desktop.webp",
    mobile: "/images/banners/charging/03-pin-xe-may-dien-desktop.webp",
    alt: "Pin và trạm sạc xe máy điện VinFast",
  },
];

export const IMAGES = {
  heroBanner: HERO_BANNERS[0].desktop,
  vinfastLogo: "/images/vinfast/vinfast-logo-header.webp",
  vfMpv7: "/images/vf-mpv7.webp",
  evoScooter: "/images/evo-scooter.webp",
  vf9Suv: "/images/vinfast/gallery/vf9/img-vf9-top-side.webp",
  warrantyService: "/images/vinfast/service-2.webp",
  brandStory: "/images/vinfast/mlttvn.webp",
  accModel: "/images/acc-model.webp",
  accCharger: "/images/acc-charger.webp",
  accMat: "/images/acc-mat.webp",
  accUmbrella: "/images/acc-umbrella.webp",
  chargingStations: "/images/vinfast/charging/pin-oto.webp",
  chargingScooter: "/images/vinfast/charging/pin-xe-may.webp",
  portableCharger: "/images/vinfast/charging/mobile-charger.webp",
  showroom: "/images/vinfast/showroom.webp",
  aboutShowroomBanner: "/images/about/showroom-ngoc-anh-camau.webp",
  community: "/images/vinfast/community.webp",
  herioGreen: "/images/herio-green.webp",
  newsletterBg: "/images/vinfast/join-the-charge.webp",
  otoHero: "/images/cars/oto-hero.webp",
} as const;
