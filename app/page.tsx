import type { Metadata } from "next";

import HomePage from "@/components/home/HomePage";
import { SHOWROOM_ADDRESS, SHOWROOM_EMAIL, SHOWROOM_PHONE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "VF Ngọc Anh — Đại lý chính thức VinFast Cà Mau",
  description:
    "VF Ngọc Anh - Khám phá ô tô điện, xe máy điện VinFast với ưu đãi 0% lãi suất, miễn phí sạc, bảo hành dài hạn tại Cà Mau.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VF Ngọc Anh — Đại lý chính thức VinFast Cà Mau",
    description: "Khám phá ô tô điện, xe máy điện VinFast với nhiều ưu đãi hấp dẫn.",
    url: "/",
    images: [
      {
        url: "/images/cars/oto-hero.jpg",
        width: 1200,
        height: 630,
        alt: "VF Ngọc Anh — Đại lý chính thức VinFast Cà Mau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VF Ngọc Anh — Đại lý chính thức VinFast Cà Mau",
    description: "Khám phá ô tô điện, xe máy điện VinFast với nhiều ưu đãi hấp dẫn.",
    images: ["/images/cars/oto-hero.jpg"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "VF Ngọc Anh — Đại lý ủy quyền chính thức VinFast Cà Mau",
    image: "https://vinfast3scamau.com/images/cars/oto-hero.jpg",
    "@id": "https://vinfast3scamau.com/#dealer",
    url: "https://vinfast3scamau.com",
    telephone: SHOWROOM_PHONE.replace(/\s/g, ""),
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SHOWROOM_ADDRESS,
      addressLocality: "Thành phố Cà Mau",
      addressRegion: "Tỉnh Cà Mau",
      postalCode: "94000",
      addressCountry: "VN",
    },
    email: SHOWROOM_EMAIL,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.1764,
      longitude: 105.1524,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "18:00",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
