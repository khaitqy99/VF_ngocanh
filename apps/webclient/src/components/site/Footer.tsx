"use client";

import type { ElementType, ReactNode } from "react";
import Image from "next/image";
import { Building2, Clock, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { resolveDealershipContact, type DealershipContact } from "@/lib/dealership";
import {
  defaultFooterSettings,
  mergeFooterSettings,
  type FooterLink,
  type FooterSettings,
} from "@/lib/cms/footer";
import { IMAGES } from "@/lib/images";
import { FadeIn } from "@/components/motion";
import { ResilientLink } from "@/components/site/ResilientLink";
import { ZaloBrandIcon } from "@/components/icons/SocialBrandIcons";

function phoneTelFromDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:${digits}` : "tel:";
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-3 text-xs font-semibold tracking-[0.12em] text-brand-dark sm:mb-4">
      {children}
    </h4>
  );
}

function FooterLinkList({ items }: { items: readonly FooterLink[] }) {
  return (
    <ul className="space-y-2">
      {items.map(({ label, href }) => (
        <li key={`${label}-${href}`}>
          <ResilientLink
            href={href}
            className="text-[13px] leading-snug text-foreground/75 transition-colors hover:text-brand"
          >
            {label}
          </ResilientLink>
        </li>
      ))}
    </ul>
  );
}

function ContactRow({ icon: Icon, children }: { icon: ElementType; children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center text-brand">
        <Icon size={16} strokeWidth={2} aria-hidden />
      </span>
      <span className="min-w-0 pt-0.5 text-[13px] leading-relaxed text-foreground/80">
        {children}
      </span>
    </li>
  );
}

function SocialIcon({ kind }: { kind: DealershipContact["socialLinks"][number]["kind"] }) {
  if (kind === "facebook") {
    return (
      <Image
        src="/images/icons/facebook-messenger.png"
        alt=""
        width={24}
        height={24}
        aria-hidden
        className="h-6 w-6 rounded-full"
      />
    );
  }
  if (kind === "youtube") return <Youtube size={16} />;
  if (kind === "zalo") return <ZaloBrandIcon size={26} className="h-6.5 w-6.5" />;
  return <span className="text-[10px] font-bold uppercase">Web</span>;
}

export default function Footer({
  contact = resolveDealershipContact(),
  settings: settingsInput,
}: {
  contact?: DealershipContact;
  settings?: FooterSettings;
}) {
  const settings = mergeFooterSettings(settingsInput ?? defaultFooterSettings());
  const rescueHotlineTel = phoneTelFromDisplay(settings.rescueHotline);
  const mapEmbed = settings.mapEmbed || contact.mapEmbed;

  return (
    <footer className="border-t border-border/60 bg-surface-muted">
      <div className="container-vf py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
          <FadeIn className="col-span-2 sm:col-span-3 lg:col-span-1">
            <ResilientLink href="/" className="inline-flex items-center">
              <Image
                src={IMAGES.vinfastLogo}
                alt="VinFast — Đại lý VinFast Ngọc Anh Cà Mau"
                width={140}
                height={32}
                className="h-7 w-auto sm:h-8"
              />
            </ResilientLink>
            <p className="mt-1 text-xs font-bold tracking-wide text-brand">{settings.brandTitle}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {settings.brandDescription}
            </p>
          </FadeIn>

          <FadeIn delay={0.05}>
            <FooterHeading>{settings.columns.products.title}</FooterHeading>
            <FooterLinkList items={settings.columns.products.links} />
          </FadeIn>

          <FadeIn delay={0.08}>
            <FooterHeading>{settings.columns.services.title}</FooterHeading>
            <FooterLinkList items={settings.columns.services.links} />
          </FadeIn>

          <FadeIn delay={0.11}>
            <FooterHeading>{settings.columns.about.title}</FooterHeading>
            <FooterLinkList items={settings.columns.about.links} />
          </FadeIn>

          <FadeIn delay={0.14}>
            <FooterHeading>{settings.columns.policies.title}</FooterHeading>
            <FooterLinkList items={settings.columns.policies.links} />
          </FadeIn>
        </div>

        <div className="my-8 border-t border-border/40 sm:my-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:items-stretch lg:gap-10">
          <FadeIn delay={0.16}>
            <FooterHeading>Liên hệ</FooterHeading>
            <ul className="space-y-2.5">
              <ContactRow icon={Building2}>{contact.businessName}</ContactRow>
              <ContactRow icon={Phone}>
                <span className="block">
                  Hotline tư vấn:{" "}
                  <a
                    href={contact.phoneTel}
                    className="font-semibold transition-colors hover:text-brand"
                  >
                    {contact.phone}
                  </a>
                </span>
                <span className="mt-1 block text-foreground/65">
                  Cứu hộ 24/7:{" "}
                  <a
                    href={rescueHotlineTel}
                    className="font-semibold transition-colors hover:text-brand"
                  >
                    {settings.rescueHotline}
                  </a>
                </span>
              </ContactRow>
              <ContactRow icon={Mail}>
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all transition-colors hover:text-brand"
                >
                  {contact.email}
                </a>
              </ContactRow>
              <ContactRow icon={MapPin}>
                <a
                  href={contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand"
                >
                  {contact.address}
                </a>
              </ContactRow>
              <ContactRow icon={Clock}>
                Hàng ngày · {contact.opening.opens} – {contact.opening.closes}
              </ContactRow>
            </ul>

            {contact.socialLinks.length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {contact.socialLinks.map(({ label, href, kind }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={
                      kind === "zalo" || kind === "facebook"
                        ? "flex size-10 items-center justify-center transition-transform hover:scale-105"
                        : "flex size-9 items-center justify-center rounded-full border border-border/70 bg-white text-brand-dark transition-colors hover:border-brand hover:text-brand"
                    }
                  >
                    <SocialIcon kind={kind} />
                  </a>
                ))}
              </div>
            ) : null}
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-border/50 sm:min-h-[300px] lg:min-h-[320px]">
              <iframe
                title={`Bản đồ ${contact.businessName}`}
                src={mapEmbed}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="border-t border-border/50 bg-white/60">
        <div className="container-vf flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-muted-foreground sm:flex-row sm:py-5">
          <p>{settings.copyright}</p>
          <div className="flex flex-wrap justify-center gap-5">
            {settings.bottomLinks.map(({ label, href }) => (
              <ResilientLink
                key={`${label}-${href}`}
                href={href}
                className="transition-colors hover:text-brand"
              >
                {label}
              </ResilientLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
