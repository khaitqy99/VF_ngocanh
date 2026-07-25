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
  { value: "purchase", label: "Đặt mua ngay" },
  { value: "accessory", label: "Tư vấn phụ kiện" },
  { value: "service", label: "Bảo dưỡng định kỳ" },
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

/** Known service labels shown on lead badges (prefer exact wording from forms). */
const LEAD_SERVICE_LABELS = [
  "Đăng ký lái thử",
  "Đặt cọc ngay",
  "Đặt mua ngay",
  "Nhận báo giá và ưu đãi",
  "Nhận báo giá",
  "Tư vấn trả góp",
  "Hỗ trợ trả góp 0%",
  "Thu cũ đổi mới",
  "Bảo dưỡng - sửa chữa",
  "Bảo dưỡng định kỳ",
  "Sửa chữa điện tử",
  "Sơn sấy vỏ xe",
  "Đặt lịch bảo dưỡng",
  "Đặt lịch sửa chữa",
  "Tư vấn phụ kiện",
  "Tư vấn trạm sạc",
  "Tư vấn lưu trữ năng lượng",
  "Đăng ký nhận tin",
] as const;

function extractServiceFromMessage(message?: string | null): string | null {
  if (!message?.trim()) return null;

  const patterns = [
    /(?:^|\n)\s*(?:Dịch vụ|Nhu cầu)\s*:\s*(.+?)(?:\n|$)/i,
    /(?:^|\||\n)\s*service\s*=\s*([^|\n]+)/i,
  ];

  let raw: string | null = null;
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]?.trim()) {
      raw = match[1].trim();
      break;
    }
  }

  if (raw) {
    const corrupted = /�|\?/.test(raw) && !/[ăâêôơưđ]/i.test(raw);
    if (!corrupted) {
      const known = [...LEAD_SERVICE_LABELS]
        .sort((a, b) => b.length - a.length)
        .find((label) => raw === label || raw.startsWith(label));
      return known ?? raw;
    }
  }

  // Recover from LEADTEST messages: ...|expected=deposit|service=...
  const expected = message.match(/(?:^|\||\n)\s*expected\s*=\s*([a-z_]+)/i)?.[1];
  if (expected && LEAD_TYPE_OPTIONS.some((o) => o.value === expected)) {
    return getLeadTypeLabel(expected as LeadType);
  }

  // Heuristics when forms don't write "Dịch vụ:" into message.
  if (/thẻ sạc|trạm sạc|sản phẩm quan tâm:/i.test(message)) {
    return "Tư vấn trạm sạc";
  }
  if (/giải pháp:|tiền điện|điện mặt trời|lưu trữ năng lượng/i.test(message)) {
    return "Tư vấn lưu trữ năng lượng";
  }
  if (/email đăng ký nhận tin|đăng ký nhận tin/i.test(message)) {
    return "Đăng ký nhận tin";
  }
  if (/(?:^|\n)\s*sản phẩm\s*:/i.test(message) && /hình thức nhận/i.test(message)) {
    return "Tư vấn phụ kiện";
  }

  return null;
}

/** Badge text: prefer concrete service from message, else type label. */
export function getLeadBadgeLabel(lead: Pick<Lead, "type" | "message" | "fullName">): string {
  const fromMessage = extractServiceFromMessage(lead.message);
  if (fromMessage) return fromMessage;

  if (lead.fullName?.trim() === "Đăng ký nhận tin") {
    return "Đăng ký nhận tin";
  }

  if (lead.type === "accessory") return "Tư vấn phụ kiện";
  if (lead.type === "service") return "Bảo dưỡng định kỳ";

  return getLeadTypeLabel(lead.type);
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

export async function updateLead(
  id: string,
  updates: { status?: LeadStatus; message?: string; assignedTo?: string; type?: LeadType },
): Promise<void> {
  const response = await fetch("/api/leads", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!response.ok) {
    throw new Error("Không cập nhật được lead");
  }
}

export async function deleteLead(id: string): Promise<void> {
  await deleteLeads([id]);
}

export async function deleteLeads(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const response = await fetch("/api/leads", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids.length === 1 ? { id: ids[0] } : { ids }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Không xóa được lead");
  }
}

export function countNewLeads(leads: Lead[]): number {
  return leads.filter((l) => l.status === "new").length;
}

export function getLeadById(leads: Lead[], id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}
