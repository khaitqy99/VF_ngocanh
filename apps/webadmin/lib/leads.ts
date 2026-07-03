export type {
  Lead,
  LeadSource,
  LeadStatus,
  LeadType,
} from "@vinfast3s/supabase/leads";

import type { Lead, LeadSource, LeadStatus, LeadType } from "@vinfast3s/supabase/leads";

export const LEAD_TYPE_OPTIONS: { value: LeadType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả loại" },
  { value: "test_drive", label: "Đăng ký lái thử" },
  { value: "deposit", label: "Đặt cọc ngay" },
  { value: "quote", label: "Nhận báo giá" },
  { value: "finance", label: "Tư vấn trả góp" },
  { value: "purchase", label: "Đặt mua xe máy" },
  { value: "accessory", label: "Tư vấn phụ kiện" },
  { value: "service", label: "Bảo dưỡng / cứu hộ" },
  { value: "general", label: "Liên hệ chung" },
];

export const LEAD_STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "new", label: "Mới" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "converted", label: "Chốt đơn" },
  { value: "closed", label: "Đóng" },
];

export const LEAD_SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "facebook", label: "Facebook" },
  { value: "zalo", label: "Zalo" },
  { value: "walk_in", label: "Tại showroom" },
  { value: "hotline", label: "Hotline" },
  { value: "referral", label: "Giới thiệu" },
];

export function getLeadTypeLabel(type: LeadType): string {
  return LEAD_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export function getLeadStatusLabel(status: LeadStatus): string {
  return LEAD_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getLeadSourceLabel(source: LeadSource): string {
  return LEAD_SOURCE_OPTIONS.find((o) => o.value === source)?.label ?? source;
}

export function getLeadStatusVariant(
  status: LeadStatus,
): "default" | "secondary" | "success" | "warning" {
  switch (status) {
    case "new":
      return "default";
    case "in_progress":
      return "warning";
    case "converted":
      return "success";
    case "closed":
      return "secondary";
  }
}

export const MOCK_LEADS: Lead[] = [
  {
    id: "LD-001",
    fullName: "Trần Văn B",
    phone: "0901234567",
    email: "tranvb@gmail.com",
    type: "test_drive",
    vehicleInterest: "VF 8 All New",
    source: "website",
    status: "new",
    message: "Muốn lái thử VF 8 cuối tuần này tại Cà Mau.",
    createdAt: "2026-06-30T08:12:00",
    updatedAt: "2026-06-30T08:12:00",
  },
];

export function formatLeadDate(iso: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export async function fetchLeads(): Promise<{ leads: Lead[]; configured: boolean }> {
  const response = await fetch("/api/leads", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Không tải được danh sách lead");
  }
  return response.json();
}

export function countNewLeads(leads: Lead[]): number {
  return leads.filter((l) => l.status === "new").length;
}

export function getLeadById(leads: Lead[], id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}
