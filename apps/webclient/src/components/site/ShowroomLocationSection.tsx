"use client";

import type { ElementType, ReactNode } from "react";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";

import { FadeIn } from "@/components/motion";
import { MotionLinkButton } from "@/components/motion/MotionButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { type DealershipContact, resolveDealershipContact } from "@/lib/dealership";

type ShowroomLocationSectionProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  contact?: DealershipContact;
};

function ContactChip({
  icon: Icon,
  label,
  children,
  className = "",
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`home-stat-chip-light flex gap-3 rounded-xl p-3.5 ${className}`}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/8 text-brand">
        <Icon className="size-4" strokeWidth={2} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold leading-snug text-brand-dark">{children}</div>
      </div>
    </div>
  );
}

export default function ShowroomLocationSection({
  className = "section-y bg-surface-muted",
  eyebrow = "Liên hệ & địa chỉ",
  title = "Ghé thăm showroom tại Cà Mau",
  contact = resolveDealershipContact(),
}: ShowroomLocationSectionProps) {
  return (
    <section className={className} aria-labelledby="showroom-location-heading">
      <div className="container-vf">
        <SectionHeader
          align="editorial"
          eyebrow={eyebrow}
          title={title}
          id="showroom-location-heading"
          description="Đại lý VinFast 3S Cà Mau — tư vấn ô tô và xe máy điện chính hãng."
          descriptionClassName="max-w-none"
        />

        <FadeIn blur>
          <div className="page-showcase-shell overflow-hidden rounded-[1.75rem] p-4 sm:p-5 lg:p-6">
            <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-6">
              <div className="relative min-h-[240px] overflow-hidden rounded-[1.25rem] border border-border/50 bg-surface-muted sm:min-h-[280px] lg:col-span-7 lg:min-h-[360px]">
                <iframe
                  title={`Bản đồ ${contact.businessName}`}
                  src={contact.mapEmbed}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="grid gap-2.5">
                  <ContactChip icon={MapPin} label="Địa chỉ showroom">
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium transition-colors hover:text-brand"
                    >
                      {contact.address}
                    </a>
                  </ContactChip>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <ContactChip icon={Phone} label="Hotline tư vấn">
                      <a
                        href={contact.phoneTel}
                        className="text-base font-extrabold tabular-nums text-brand transition-opacity hover:opacity-80"
                      >
                        {contact.phone}
                      </a>
                    </ContactChip>

                    <ContactChip icon={Clock} label="Giờ mở cửa">
                      Hàng ngày · {contact.opening.opens} – {contact.opening.closes}
                    </ContactChip>
                  </div>

                  <ContactChip icon={Mail} label="Email">
                    <a
                      href={`mailto:${contact.email}`}
                      className="break-all font-medium transition-colors hover:text-brand"
                    >
                      {contact.email}
                    </a>
                  </ContactChip>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <MotionLinkButton
                    href={contact.phoneTel}
                    className="home-cta-primary inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0046cc] sm:flex-none"
                  >
                    <Phone className="size-4" aria-hidden />
                    Gọi tư vấn
                  </MotionLinkButton>
                  <MotionLinkButton
                    href={contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand/20 bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:border-brand/30 hover:bg-surface-muted sm:flex-none"
                  >
                    <Navigation className="size-4" aria-hidden />
                    Chỉ đường
                  </MotionLinkButton>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
