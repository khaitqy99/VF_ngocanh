import type { Metadata } from "next";

import HomePage from "@/components/home/HomePage";
import { getHomeData } from "@/lib/cms";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { SHOWROOM_ADDRESS, SHOWROOM_EMAIL, SHOWROOM_PHONE } from "@/lib/contact";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("home");
}

export default async function Page() {
  const home = await getHomeData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "VF Ngọc Anh — Đại lý ủy quyền chính thức VinFast Cà Mau",
    image: "https://vinfast3scamau.com/images/cars/oto-hero.webp",
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
      <HomePage
        heroBanners={home.heroBanners}
        featuredCars={home.featuredCars}
        featuredScooters={home.featuredScooters}
        accessories={home.accessories}
      />
    </>
  );
}
