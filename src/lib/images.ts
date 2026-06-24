export type HeroBannerSlide = {
  desktop: string;
  mobile: string;
  alt: string;
};

export const HERO_BANNERS: HeroBannerSlide[] = [
  {
    desktop: "/images/banners/01-1-trieu-xuat-xuong-desktop.jpg",
    mobile: "/images/banners/01-1-trieu-xuat-xuong-mobile.jpg",
    alt: "VinFast chính thức xuất xưởng 1 triệu xe máy điện - Mãnh liệt chuyển đổi xanh 12/06/2026",
  },
  {
    desktop: "/images/banners/02-xmd-uu-dai-16-1-desktop.jpg",
    mobile: "/images/banners/02-xmd-uu-dai-16-1-mobile.jpg",
    alt: "VinFast xe máy điện - Phố thêm xanh lướt hè phơi phới, tổng ưu đãi lên đến 16%",
  },
  {
    desktop: "/images/banners/03-xmd-uu-dai-16-desktop.jpg",
    mobile: "/images/banners/03-xmd-uu-dai-16-mobile.jpg",
    alt: "VinFast xe máy điện - Phố thêm xanh lướt hè phơi phới, tổng ưu đãi lên đến 16%",
  },
  {
    desktop: "/images/banners/04-vinfascination-vinpearl-desktop.jpg",
    mobile: "/images/banners/04-vinfascination-vinpearl-mobile.jpg",
    alt: "VinFast Vinfascination đón hè rực rỡ - Ưu đãi giá bán lên đến 3%, tặng voucher Vinpearl",
  },
  {
    desktop: "/images/banners/05-vf3-vinpearl-desktop.jpg",
    mobile: "/images/banners/05-vf3-vinpearl-mobile.jpg",
    alt: "VinFast VF 3 Vinfascination mùa hè rực rỡ - Tặng voucher Vinpearl hoặc ưu đãi 2% giá bán",
  },
  {
    desktop: "/images/banners/06-vf-mpv7-desktop.jpg",
    mobile: "/images/banners/06-vf-mpv7-mobile.jpg",
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
    desktop: "/images/banners/accessories/phu-kien-banner-desktop.jpg",
    mobile: "/images/banners/accessories/phu-kien-banner-desktop.jpg",
    alt: "Phụ kiện chính hãng VinFast — Nâng tầm trải nghiệm xe điện",
  },
];

/** Banner dịch vụ hậu mãi — nguồn vinfastauto.com/vn_vi (thong-tin-bao-hanh, dich-vu-bao-duong, dich-vu-sua-chua) */
export const AFTER_SALES_HERO_BANNERS: HeroBannerSlide[] = [
  {
    desktop: "/images/banners/after-sales/01-bao-hanh-sua-chua-desktop.png",
    mobile: "/images/banners/after-sales/01-bao-hanh-sua-chua-desktop.png",
    alt: "Bảo hành - sửa chữa VinFast",
  },
  {
    desktop: "/images/banners/after-sales/02-bao-duong-dinh-ky-desktop.png",
    mobile: "/images/banners/after-sales/02-bao-duong-dinh-ky-desktop.png",
    alt: "Bảo dưỡng định kỳ VinFast",
  },
  {
    desktop: "/images/banners/after-sales/03-dich-vu-sua-chua-desktop.png",
    mobile: "/images/banners/after-sales/03-dich-vu-sua-chua-mobile.png",
    alt: "Dịch vụ sửa chữa VinFast",
  },
];

/** Banner pin & trạm sạc — nguồn vinfastauto.com/vn_vi/dich-vu-pin-oto-dien & dich-vu-pin-xe-may-dien */
export const CHARGING_HERO_BANNERS: HeroBannerSlide[] = [
  {
    desktop: "/images/banners/charging/01-tram-sac-vinfast-desktop.png",
    mobile: "/images/banners/charging/01-tram-sac-vinfast-mobile.png",
    alt: "Hệ thống trạm sạc VinFast — Lợi ích thuê pin & sạc công cộng",
  },
  {
    desktop: "/images/banners/charging/02-quy-hoach-tram-sac-desktop.png",
    mobile: "/images/banners/charging/02-quy-hoach-tram-sac-desktop.png",
    alt: "Quy hoạch trạm sạc VinFast toàn quốc",
  },
  {
    desktop: "/images/banners/charging/03-pin-xe-may-dien-desktop.png",
    mobile: "/images/banners/charging/03-pin-xe-may-dien-desktop.png",
    alt: "Pin và trạm sạc xe máy điện VinFast",
  },
];

export const IMAGES = {
  heroBanner: HERO_BANNERS[0].desktop,
  vinfastLogo: "/images/vinfast/vinfast-logo-header.webp",
  vfMpv7: "/images/vf-mpv7.png",
  evoScooter: "/images/evo-scooter.png",
  vf9Suv: "/images/vinfast/gallery/vf9/img-vf9-top-side.webp",
  warrantyService: "/images/vinfast/service-2.webp",
  brandStory: "/images/vinfast/mlttvn.webp",
  accModel: "/images/acc-model.jpg",
  accCharger: "/images/acc-charger.jpg",
  accMat: "/images/acc-mat.jpg",
  accUmbrella: "/images/acc-umbrella.jpg",
  chargingStations: "/images/vinfast/charging/pin-oto.webp",
  chargingScooter: "/images/vinfast/charging/pin-xe-may.webp",
  portableCharger: "/images/vinfast/charging/mobile-charger.webp",
  showroom: "/images/vinfast/showroom.webp",
  aboutShowroomBanner: "/images/about/showroom-ngoc-anh-camau.png",
  community: "/images/vinfast/community.webp",
  herioGreen: "/images/herio-green.jpg",
  newsletterBg: "/images/vinfast/join-the-charge.webp",
  otoHero: "/images/cars/oto-hero.jpg",
} as const;
