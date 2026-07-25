"use client";

import { useEffect } from "react";

import { formatLeadMessage, submitLead, SubmitLeadError } from "@/lib/submit-lead";
import type { LeadType } from "@/lib/submit-lead";

const NEED_TO_LEAD_TYPE: Record<string, LeadType> = {
  "Nhận báo giá và ưu đãi": "quote",
  "Đăng ký lái thử": "test_drive",
  "Tư vấn trả góp": "finance",
  "Thu cũ đổi mới": "general",
  "Bảo dưỡng - sửa chữa": "service",
};

const PHONE_RE = /^0[0-9]{9}$/;

function fieldEl(id: string): HTMLInputElement | HTMLSelectElement | null {
  return document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
}

function setFieldError(input: HTMLElement | null, message: string | null) {
  if (!input) return;
  let field = input.closest(".vfcm-field") as HTMLElement | null;
  if (!field) field = input.parentElement as HTMLElement | null;
  if (!field) return;

  const hint = field.querySelector("small");
  if (message) {
    if (!field.className.includes("vfcm-invalid")) {
      field.className = `${field.className} vfcm-invalid`.trim();
    }
    if (hint) hint.textContent = message;
  } else {
    field.className = field.className.replace(/\bvfcm-invalid\b/g, "").trim();
    if (hint) hint.textContent = "";
  }
}

function showSuccess() {
  const formView = document.getElementById("vfcmFormView");
  const success = document.getElementById("vfcmSuccess");
  if (formView) formView.style.display = "none";
  if (success) success.style.display = "block";
}

function setSubmitting(busy: boolean) {
  const btn = document.getElementById("vfcmSubmit") as HTMLButtonElement | null;
  const label = document.getElementById("vfcmSubmitText");
  if (btn) btn.disabled = busy;
  if (label) {
    label.textContent = busy ? "ĐANG GỬI THÔNG TIN..." : "NHẬN TƯ VẤN NGAY";
  }
}

function wireForm(form: HTMLFormElement) {
  if (form.dataset.vfcmLeadBridge === "1") {
    form.onsubmit = null;
    return;
  }
  form.dataset.vfcmLeadBridge = "1";

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const nameInput = fieldEl("vfcmName");
    const phoneInput = fieldEl("vfcmPhone");
    const needInput = fieldEl("vfcmNeed");
    const modelInput = fieldEl("vfcmModel");
    const areaInput = fieldEl("vfcmArea");
    const consent = document.getElementById("vfcmConsent") as HTMLInputElement | null;
    const consentError = document.getElementById("vfcmConsentError");

    const fullName = String(nameInput?.value ?? "").trim();
    const phone = String(phoneInput?.value ?? "").trim();
    const need = String(needInput?.value ?? "").trim();
    const model = String(modelInput?.value ?? "").trim();
    const area = String(areaInput?.value ?? "").trim();

    let valid = true;
    setFieldError(nameInput, null);
    setFieldError(phoneInput, null);
    setFieldError(needInput, null);
    setFieldError(modelInput, null);
    if (consentError) consentError.style.display = "none";

    if (fullName.length < 2) {
      setFieldError(nameInput, "Vui lòng nhập họ và tên hợp lệ.");
      valid = false;
    }
    if (!PHONE_RE.test(phone)) {
      setFieldError(phoneInput, "Số điện thoại phải đủ 10 số và bắt đầu bằng 0.");
      valid = false;
    }
    if (!need) {
      setFieldError(needInput, "Vui lòng chọn nhu cầu hỗ trợ.");
      valid = false;
    }
    if (!model) {
      setFieldError(modelInput, "Vui lòng chọn dòng xe quan tâm.");
      valid = false;
    }
    if (!consent?.checked) {
      if (consentError) consentError.style.display = "block";
      valid = false;
    }
    if (!valid) return;

    setSubmitting(true);
    try {
      await submitLead({
        fullName,
        phone,
        type: NEED_TO_LEAD_TYPE[need] ?? "general",
        service: need,
        vehicleInterest: model,
        source: "website",
        message: formatLeadMessage({
          "Nhu cầu": need,
          "Dòng xe": model,
          "Khu vực": area,
          Nguồn: "Popup đăng ký tư vấn (VFCM)",
        }),
      });
      showSuccess();
      form.reset();
    } catch (error) {
      const message =
        error instanceof SubmitLeadError
          ? error.message
          : "Không thể gửi thông tin. Vui lòng kiểm tra kết nối và thử lại.";
      window.alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Capture-phase listener beats GTM bubble/onsubmit handlers.
  form.addEventListener("submit", onSubmit, true);

  // Block GTM from re-assigning form.onsubmit → Google Forms.
  try {
    Object.defineProperty(form, "onsubmit", {
      configurable: true,
      enumerable: true,
      get() {
        return onSubmit as unknown as Exclude<HTMLFormElement["onsubmit"], null>;
      },
      set() {
        /* ignore GTM assignment */
      },
    });
  } catch {
    form.onsubmit = null;
  }
}

/**
 * Rewires the GTM-injected VFCM lead popup to POST /api/leads (Admin CMS)
 * instead of Google Forms.
 */
export default function VfcmLeadBridge() {
  useEffect(() => {
    const tryWire = () => {
      const form = document.getElementById("vfcmLeadForm") as HTMLFormElement | null;
      if (form) wireForm(form);
    };

    tryWire();

    const observer = new MutationObserver(() => tryWire());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // GTM may attach its handler slightly after the form mounts.
    const timers = [300, 800, 1600, 3200].map((ms) => window.setTimeout(tryWire, ms));

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return null;
}
