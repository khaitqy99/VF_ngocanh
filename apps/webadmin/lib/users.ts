import type { AdminRole } from "@vinfast3s/supabase/middleware";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: AdminRole;
  blocked: boolean;
  createdAt: string;
  lastSignInAt: string | null;
};

export function formatUserDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export async function fetchAdminUsers(): Promise<{ users: AdminUser[]; configured: boolean }> {
  const response = await fetch("/api/users", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Không tải được danh sách tài khoản");
  }
  return response.json();
}

export type CreateAdminUserInput = {
  email: string;
  password: string;
  fullName?: string;
};

export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Không tạo được tài khoản");
  }
  return data.user;
}

export async function deleteAdminUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Không xóa được tài khoản");
  }
}

export type SessionAdmin = {
  id: string;
  email: string;
  role: AdminRole;
};

export async function fetchSessionAdmin(): Promise<SessionAdmin | null> {
  const response = await fetch("/api/users/me", { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json();
  return data.user ?? null;
}

export type ChangePasswordInput = {
  password: string;
};

export type UpdateAdminUserInput = {
  password?: string;
  blocked?: boolean;
};

export async function updateAdminUser(
  userId: string,
  input: UpdateAdminUserInput,
): Promise<AdminUser> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Không cập nhật được tài khoản");
  }
  return data.user;
}

export async function changeAdminPassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<AdminUser> {
  return updateAdminUser(userId, input);
}
