"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { resolveDealershipContact, type DealershipContact } from "@/lib/dealership";
import { IMAGES } from "@/lib/images";
import { FadeIn } from "@/components/motion";

const PRODUCT_LINKS = [
  { label: "VF 3", href: "/oto/vf3" },
  { label: "VF 5", href: "/oto/vf5" },
  { label: "VF 6", href: "/oto/vf6" },
  { label: "VF 7", href: "/oto/vf7" },
  { label: "VF 8", href: "/oto/vf8" },
  { label: "VF 9", href: "/oto/vf9" },
  { label: "Xe máy điện", href: "/xe-may-dien" },
] as const;

const SERVICE_LINKS = [
  { label: "Đăng ký lái thử", href: "/oto" },
  { label: "Bảo dưỡng — Sửa chữa", href: "/dich-vu-hau-mai" },
  { label: "Bảo hành", href: "/dich-vu-hau-mai" },
  { label: "Pin và trạm sạc", href: "/pin-va-tram-sac" },
  { label: "Phụ kiện xe", href: "/phu-kien" },
] as const;

const ABOUT_LINKS = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Tin tức", href: "/gioi-thieu" },
  { label: "Tuyển dụng", href: "/gioi-thieu" },
  { label: "Liên hệ", href: "/gioi-thieu" },
] as const;

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-dark sm:mb-4">
      {children}
    </h4>
  );
}

function FooterLinkList({ items }: { items: readonly { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2">
      {items.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-[13px] leading-snug text-foreground/75 transition-colors hover:text-brand"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ContactItem({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-brand/8 text-brand">
        <Icon size={14} strokeWidth={2} />
      </span>
      <span className="min-w-0 pt-0.5 text-[13px] leading-relaxed text-foreground/80">
        {children}
      </span>
    </li>
  );
}

function SocialIcon({ kind }: { kind: DealershipContact["socialLinks"][number]["kind"] }) {
  if (kind === "facebook") return <Facebook size={16} />;
  if (kind === "youtube") return <Youtube size={16} />;
  return (
    <span className="text-[10px] font-bold uppercase">{kind === "zalo" ? "Zalo" : "Web"}</span>
  );
}

export default function Footer({
  contact = resolveDealershipContact(),
}: {
  contact?: DealershipContact;
}) {
  return (
    <footer className="border-t border-border/60 bg-[#f4f6fa]">
      <div className="container-vf space-y-8 py-8 sm:space-y-10 sm:py-10 lg:py-12">
        <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={IMAGES.vinfastLogo}
                alt="VinFast — Đại lý VF Ngọc Anh"
                width={140}
                height={32}
                className="h-7 w-auto sm:h-8"
              />
            </Link>
            <p className="mt-1 text-xs font-bold tracking-wide text-brand">VF NGỌC ANH</p>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground sm:mt-2.5">
              {contact.businessName}. Trải nghiệm xe điện thông minh cùng dịch vụ 3S tận tâm tại Cà
              Mau.
            </p>
          </div>
          {contact.socialLinks.length > 0 ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              {contact.socialLinks.map(({ label, href, kind }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-white text-brand-dark transition-colors hover:border-brand hover:text-brand"
                >
                  <SocialIcon kind={kind} />
                </a>
              ))}
            </div>
          ) : null}
        </FadeIn>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border/40 pt-8 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-10">
          <FadeIn delay={0.05}>
            <FooterHeading>Sản phẩm</FooterHeading>
            <FooterLinkList items={PRODUCT_LINKS} />
          </FadeIn>

          <FadeIn delay={0.08}>
            <FooterHeading>Dịch vụ</FooterHeading>
            <FooterLinkList items={SERVICE_LINKS} />
          </FadeIn>

          <FadeIn delay={0.11}>
            <FooterHeading>Về chúng tôi</FooterHeading>
            <FooterLinkList items={ABOUT_LINKS} />
          </FadeIn>

          <FadeIn delay={0.14}>
            <FooterHeading>Liên hệ</FooterHeading>
            <ul className="space-y-2.5">
              <ContactItem icon={MapPin}>
                <a
                  href={contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand"
                >
                  {contact.address}
                </a>
              </ContactItem>
              <ContactItem icon={Phone}>
                <a
                  href={contact.phoneTel}
                  className="font-semibold transition-colors hover:text-brand"
                >
                  {contact.phone}
                </a>
              </ContactItem>
              <ContactItem icon={Mail}>
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all transition-colors hover:text-brand"
                >
                  {contact.email}
                </a>
              </ContactItem>
            </ul>
          </FadeIn>
        </div>
      </div>

      <div className="border-t border-border/50 bg-white/60">
        <div className="container-vf flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-muted-foreground sm:flex-row sm:py-5">
          <p>© 2026 VF Ngọc Anh. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/gioi-thieu" className="transition-colors hover:text-brand">
              Chính sách bảo mật
            </Link>
            <Link href="/gioi-thieu" className="transition-colors hover:text-brand">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
