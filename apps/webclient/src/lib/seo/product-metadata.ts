import type { Metadata } from "next";

import {
  buildProductSeoDefaults,
  carDetailPath,
  resolveSeoContent,
  scooterDetailPath,
  accessoryDetailPath,
  seoToNextMetadata,
} from "@/lib/seo";
import { getSiteSeo, getVehicleSeoById, getAccessorySeoById } from "@/lib/cms/seo";
import { getCarBySlug, getScooterBySlug, getAccessoryBySlugOrId } from "@/lib/cms";

export async function buildCarMetadata(slug: string): Promise<Metadata> {
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Không tìm thấy xe" };

  const [site, seo] = await Promise.all([getSiteSeo(), getVehicleSeoById(car.id)]);
  const path = carDetailPath(car);

  const defaults = buildProductSeoDefaults({
    name: car.name,
    tagline: car.subtitle,
    image: car.image,
    path,
    productLabel: "Ô tô điện VinFast",
  });
  const resolved = resolveSeoContent(seo, defaults, site);
  return seoToNextMetadata(resolved, site);
}

export async function buildScooterMetadata(slug: string): Promise<Metadata> {
  const scooter = await getScooterBySlug(slug);
  if (!scooter) return { title: "Không tìm thấy xe máy" };

  const [site, seo] = await Promise.all([getSiteSeo(), getVehicleSeoById(scooter.id)]);
  const path = scooterDetailPath(scooter);

  const defaults = buildProductSeoDefaults({
    name: scooter.name,
    tagline: scooter.subtitle,
    image: scooter.image,
    path,
    productLabel: "Xe máy điện VinFast",
  });
  const resolved = resolveSeoContent(seo, defaults, site);
  return seoToNextMetadata(resolved, site);
}

export async function buildAccessoryMetadata(slug: string): Promise<Metadata> {
  const product = await getAccessoryBySlugOrId(slug);
  if (!product) return { title: "Không tìm thấy phụ kiện" };

  const [site, seo] = await Promise.all([getSiteSeo(), getAccessorySeoById(product.id)]);
  const path = accessoryDetailPath(product);

  const defaults = buildProductSeoDefaults({
    name: product.name,
    description: product.description,
    image: product.image,
    path,
    productLabel: "Phụ kiện VinFast",
  });
  const resolved = resolveSeoContent(seo, defaults, site);
  return seoToNextMetadata(resolved, site);
}
