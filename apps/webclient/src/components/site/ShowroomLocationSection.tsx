import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { MotionLinkButton } from "@/components/motion/MotionButton";
import { type DealershipContact, resolveDealershipContact } from "@/lib/dealership";

type ShowroomLocationSectionProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  contact?: DealershipContact;
};

export default function ShowroomLocationSection({
  className = "section-y bg-white",
  eyebrow = "Liên hệ & địa chỉ",
  title = "Ghé thăm showroom tại Cà Mau",
  contact = resolveDealershipContact(),
}: ShowroomLocationSectionProps) {
  return (
    <section className={className} aria-labelledby="showroom-location-heading">
      <div className="container-vf">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand">
            {eyebrow}
          </p>
          <h2
            id="showroom-location-heading"
            className="mt-2 text-2xl font-black tracking-tight text-brand-dark sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-sm font-medium text-slate-500">
            {contact.businessName} — đại lý ủy quyền VinFast 3S tại địa đầu cực Nam, tư vấn ô tô
            điện và xe máy điện chính hãng.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="font-bold text-brand-dark">Địa chỉ showroom</p>
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-medium text-slate-600 transition-colors hover:text-brand"
                    >
                      {contact.address}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="font-bold text-brand-dark">Hotline tư vấn</p>
                    <a
                      href={contact.phoneTel}
                      className="mt-1 block font-semibold text-brand transition-opacity hover:opacity-80"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="font-bold text-brand-dark">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 block break-all font-medium text-slate-600 transition-colors hover:text-brand"
                    >
                      {contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="font-bold text-brand-dark">Giờ mở cửa</p>
                    <p className="mt-1 font-medium text-slate-600">
                      Hàng ngày · {contact.opening.opens} – {contact.opening.closes}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <MotionLinkButton
              href={contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-soft transition-opacity hover:opacity-90 sm:w-auto"
            >
              Chỉ đường trên Google Maps
            </MotionLinkButton>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-soft lg:col-span-3">
            <iframe
              title={`Bản đồ ${contact.businessName}`}
              src={contact.mapEmbed}
              className="aspect-[4/3] h-full min-h-[280px] w-full border-0 sm:min-h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
