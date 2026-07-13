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
  "Tư vấn trả góp": "finance",
  "Hỗ trợ trả góp 0%": "finance",
  "Đặt lịch bảo dưỡng": "service",
  "Đặt lịch sửa chữa": "service",
  "Tư vấn phụ kiện": "accessory",
  "Tư vấn trạm sạc": "general",
  "Tư vấn lưu trữ năng lượng": "general",
  "Đăng ký nhận tin": "general",
};
