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

export const IMAGES = {
  heroBanner: HERO_BANNERS[0].desktop,
  vfMpv7: "/images/vf-mpv7.png",
  evoScooter: "/images/evo-scooter.png",
  vf9Suv: "/images/vf9-suv.jpg",
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
  community: "/images/vinfast/community.webp",
  herioGreen: "/images/herio-green.jpg",
  newsletterBg: "/images/vinfast/join-the-charge.webp",
  otoHero: "/images/cars/oto-hero.jpg",
} as const;
