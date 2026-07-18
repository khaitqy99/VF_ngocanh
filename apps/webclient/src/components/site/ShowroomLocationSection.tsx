"use client";

import type { ElementType, ReactNode } from "react";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";

import { FadeIn } from "@/components/motion";
import { MotionLinkButton } from "@/components/motion/MotionButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { HomeEditableSectionHeader } from "@/components/admin-edit/home/HomeEditableSectionHeader";
import { HomeEditableText } from "@/components/admin-edit/home/HomeEditableText";
import {
  useHomeAdminEdit,
  homeEditSectionClass,
} from "@/components/admin-edit/home/HomeAdminEditContext";
import { type DealershipContact } from "@/lib/dealership";
import type { HomeShowroomLocation } from "@/lib/cms/home-content";
import { DEFAULT_HOME_SECTIONS } from "@/lib/cms/home-content";

type ShowroomLocationSectionProps = {
  className?: string;
  contact: DealershipContact;
  showroom?: HomeShowroomLocation;
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
      <span className="flex size-8 shrink-0 items-center justify-center text-brand">
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

function phoneTelFromDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:${digits}` : "tel:";
}

export default function ShowroomLocationSection({
  className = "section-y bg-surface-muted",
  contact,
  showroom = DEFAULT_HOME_SECTIONS.showroomLocation,
}: ShowroomLocationSectionProps) {
  const edit = useHomeAdminEdit();
  const phone = showroom.phone || contact.phone;
  const phoneTel = phoneTelFromDisplay(phone);
  const email = showroom.email || contact.email;
  const address = showroom.address || contact.address;
  const mapUrl = showroom.mapUrl || contact.mapUrl;
  const mapEmbed = showroom.mapEmbed || contact.mapEmbed;
  const opens = showroom.openingOpens || contact.opening.opens;
  const closes = showroom.openingCloses || contact.opening.closes;

  const patchShowroom = (patch: Partial<HomeShowroomLocation>) => {
    edit?.updateSections((sections) => ({
      ...sections,
      showroomLocation: { ...sections.showroomLocation, ...patch },
    }));
  };

  return (
    <section
      className={`${className} ${edit?.editMode ? homeEditSectionClass() : ""}`}
      aria-labelledby="showroom-location-heading"
    >
      <div className="container-vf">
        {edit?.editMode ? (
          <HomeEditableSectionHeader
            align="editorial"
            eyebrow={showroom.eyebrow}
            title={showroom.title}
            description={showroom.description}
            id="showroom-location-heading"
            descriptionClassName="max-w-none"
            onEyebrowChange={(eyebrow) => patchShowroom({ eyebrow })}
            onTitleChange={(title) => patchShowroom({ title })}
            onDescriptionChange={(description) => patchShowroom({ description })}
          />
        ) : (
          <SectionHeader
            align="editorial"
            eyebrow={showroom.eyebrow}
            title={showroom.title}
            id="showroom-location-heading"
            description={showroom.description}
            descriptionClassName="max-w-none"
          />
        )}

        <FadeIn blur>
          <div className="page-showcase-shell overflow-hidden rounded-[1.75rem] p-4 sm:p-5 lg:p-6">
            <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-6">
              <div className="relative min-h-[240px] overflow-hidden rounded-[1.25rem] border border-border/50 bg-surface-muted sm:min-h-[280px] lg:col-span-7 lg:min-h-[360px]">
                <iframe
                  title={`Bản đồ ${contact.businessName}`}
                  src={mapEmbed}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                {edit?.editMode ? (
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-white/95 p-3 backdrop-blur-sm">
                    <HomeEditableText
                      value={mapEmbed}
                      onChange={(value) => patchShowroom({ mapEmbed: value })}
                      className="text-[10px] text-slate-600"
                      label="URL embed bản đồ"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="grid gap-2.5">
                  <ContactChip icon={MapPin} label="Địa chỉ showroom">
                    {edit?.editMode ? (
                      <HomeEditableText
                        value={address}
                        onChange={(value) => patchShowroom({ address: value })}
                        className="text-sm font-medium text-brand-dark"
                        multiline
                        label="Địa chỉ"
                      />
                    ) : (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium transition-colors hover:text-brand"
                      >
                        {address}
                      </a>
                    )}
                  </ContactChip>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <ContactChip icon={Phone} label="Hotline tư vấn">
                      {edit?.editMode ? (
                        <HomeEditableText
                          value={phone}
                          onChange={(value) => patchShowroom({ phone: value })}
                          className="text-base font-extrabold tabular-nums text-brand"
                          label="Số điện thoại"
                        />
                      ) : (
                        <a
                          href={phoneTel}
                          className="text-base font-extrabold tabular-nums text-brand transition-opacity hover:opacity-80"
                        >
                          {phone}
                        </a>
                      )}
                    </ContactChip>

                    <ContactChip icon={Clock} label="Giờ mở cửa">
                      {edit?.editMode ? (
                        <span className="flex flex-wrap items-center gap-1">
                          <HomeEditableText
                            value={opens}
                            onChange={(value) => patchShowroom({ openingOpens: value })}
                            className="text-sm font-semibold text-brand-dark"
                            label="Giờ mở"
                          />
                          <span>–</span>
                          <HomeEditableText
                            value={closes}
                            onChange={(value) => patchShowroom({ openingCloses: value })}
                            className="text-sm font-semibold text-brand-dark"
                            label="Giờ đóng"
                          />
                        </span>
                      ) : (
                        <>
                          Hàng ngày · {opens} – {closes}
                        </>
                      )}
                    </ContactChip>
                  </div>

                  <ContactChip icon={Mail} label="Email">
                    {edit?.editMode ? (
                      <HomeEditableText
                        value={email}
                        onChange={(value) => patchShowroom({ email: value })}
                        className="break-all text-sm font-medium text-brand-dark"
                        label="Email"
                      />
                    ) : (
                      <a
                        href={`mailto:${email}`}
                        className="break-all font-medium transition-colors hover:text-brand"
                      >
                        {email}
                      </a>
                    )}
                  </ContactChip>
                </div>

                {edit?.editMode ? (
                  <HomeEditableText
                    value={mapUrl}
                    onChange={(value) => patchShowroom({ mapUrl: value })}
                    className="text-[10px] text-muted-foreground"
                    label="Link Google Maps"
                  />
                ) : null}

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <MotionLinkButton
                    href={phoneTel}
                    className="home-cta-primary inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0046cc] sm:flex-none"
                  >
                    <Phone className="size-4" aria-hidden />
                    Gọi tư vấn
                  </MotionLinkButton>
                  <MotionLinkButton
                    href={mapUrl}
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
