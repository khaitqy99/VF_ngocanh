import type { Tables, TablesInsert, Json } from "./database.types";

export type LeadType =
  | "test_drive"
  | "deposit"
  | "quote"
  | "finance"
  | "purchase"
  | "accessory"
  | "service"
  | "general";

export type LeadSource =
  | "website"
  | "facebook"
  | "zalo"
  | "walk_in"
  | "hotline"
  | "referral";

export type LeadStatus = "new" | "in_progress" | "converted" | "closed";

export type Lead = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  type: LeadType;
  vehicleInterest?: string;
  source: LeadSource;
  status: LeadStatus;
  message?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
};

type LeadMetadata = {
  type?: LeadType;
  assignedTo?: string;
};

function parseMetadata(metadata: unknown): LeadMetadata {
  if (!metadata || typeof metadata !== "object") {
    return {};
  }
  return metadata as LeadMetadata;
}

export function mapLeadRow(row: Tables<"leads">): Lead {
  const metadata = parseMetadata(row.metadata);

  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email ?? undefined,
    type: metadata.type ?? "general",
    vehicleInterest: row.vehicle_interest ?? undefined,
    source: (row.source as LeadSource | null) ?? "website",
    status: row.status,
    message: row.message ?? undefined,
    assignedTo: metadata.assignedTo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CreateLeadInput = {
  fullName: string;
  phone: string;
  email?: string;
  type?: LeadType;
  vehicleInterest?: string;
  source?: LeadSource;
  message?: string;
};

export function toLeadInsert(input: CreateLeadInput): TablesInsert<"leads"> {
  const metadata: Json = {};
  if (input.type) {
    metadata.type = input.type;
  }

  return {
    full_name: input.fullName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    vehicle_interest: input.vehicleInterest?.trim() || null,
    source: input.source ?? "website",
    message: input.message?.trim() || null,
    status: "new",
    metadata,
  };
}

export const SERVICE_TO_LEAD_TYPE: Record<string, LeadType> = {
  "Đăng ký lái thử": "test_drive",
  "Đặt cọc ngay": "deposit",
  "Nhận báo giá": "quote",
  "Nhận báo giá và ưu đãi": "quote",
  "Tư vấn trả góp": "finance",
  "Hỗ trợ trả góp 0%": "finance",
  "Thu cũ đổi mới": "general",
  "Bảo dưỡng - sửa chữa": "service",
  "Bảo dưỡng định kỳ": "service",
  "Sửa chữa điện tử": "service",
  "Sơn sấy vỏ xe": "service",
  "Đặt mua ngay": "purchase",
  "Đặt lịch bảo dưỡng": "service",
  "Đặt lịch sửa chữa": "service",
  "Tư vấn phụ kiện": "accessory",
  "Tư vấn trạm sạc": "general",
  "Tư vấn lưu trữ năng lượng": "general",
  "Đăng ký nhận tin": "general",
};

/** Resolve lead type from service label, including dynamic strings like "Đăng ký lái thử VF 8". */
export function resolveLeadTypeFromService(service?: string | null): LeadType | undefined {
  if (!service?.trim()) return undefined;
  const trimmed = service.trim();

  const exact = SERVICE_TO_LEAD_TYPE[trimmed];
  if (exact) return exact;

  const entries = Object.entries(SERVICE_TO_LEAD_TYPE).sort((a, b) => b[0].length - a[0].length);
  for (const [label, type] of entries) {
    if (trimmed.startsWith(label)) return type;
  }

  if (/^đặt mua\b/i.test(trimmed)) return "purchase";
  if (/^đăng ký lái thử\b/i.test(trimmed)) return "test_drive";
  if (/^đặt cọc\b/i.test(trimmed)) return "deposit";
  if (/^nhận báo giá\b/i.test(trimmed)) return "quote";
  if (/^tư vấn trả góp\b/i.test(trimmed)) return "finance";
  if (/^bảo dưỡng\b|^sửa chữa\b/i.test(trimmed)) return "service";

  return undefined;
}
