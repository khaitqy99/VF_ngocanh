"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useModalMotion } from "@/hooks/use-modal-motion";

export type ShowroomBookingModalProps = {
  open: boolean;
  onClose: () => void;
  vehicleName: string;
  vehicleImage: string;
  service?: string;
  serviceOptions?: string[];
};

const DEFAULT_SERVICES = ["Đặt cọc ngay", "Đăng ký lái thử", "Nhận báo giá", "Tư vấn trả góp"];

export function ShowroomBookingModal({
  open,
  onClose,
  vehicleName,
  vehicleImage,
  service = "Đặt cọc ngay",
  serviceOptions = DEFAULT_SERVICES,
}: ShowroomBookingModalProps) {
  const modalMotion = useModalMotion();
  const [bookingService, setBookingService] = useState(service);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    if (open) {
      setBookingService(service);
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "" });
    }
  }, [open, service, vehicleName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          service: bookingService,
          vehicleName,
          source: "website",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Gửi thất bại");
      }

      setSubmitted(true);
      toast.success("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm nhất.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gửi thất bại";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...modalMotion.overlay}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            {...modalMotion.panel}
            className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-brand-dark p-5 text-white">
              <div>
                <h3 className="text-sm font-black">{bookingService.toUpperCase()}</h3>
                <p className="mt-1 text-[11px] text-white/75">{vehicleName}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-white/10"
                aria-label="Đóng"
              >
                <X className="size-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="size-8 text-emerald-600" />
                </div>
                <h4 className="mt-4 text-lg font-black text-brand-dark">Gửi yêu cầu thành công!</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cảm ơn {form.name}. Chúng tôi sẽ liên hệ qua {form.phone} trong vòng 24 giờ.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-brand px-6 py-3 text-xs font-bold text-white"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-6 max-h-[70vh]">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                    <img
                      src={vehicleImage}
                      alt={vehicleName}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{vehicleName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Showroom VinFast Ngọc Anh Cà Mau
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => setBookingService(svc)}
                      className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold transition ${
                        bookingService === svc
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-border text-muted-foreground hover:border-brand/40"
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                    Họ và tên *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                    Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                    Email (tùy chọn)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-brand py-3.5 text-xs font-black tracking-wide text-white transition hover:bg-[#0046cc] disabled:opacity-60"
                >
                  {submitting ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
