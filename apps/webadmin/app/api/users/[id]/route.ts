import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { getAdminRole } from "@vinfast3s/supabase/middleware";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { requireSuperAdmin } from "@/lib/auth";
import { mapAuthUser } from "@/lib/auth-users";

function validatePassword(password: string): string | null {
  if (!password) return "Mật khẩu là bắt buộc";
  if (password.length < 8) return "Mật khẩu tối thiểu 8 ký tự";
  return null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Chỉ super admin mới quản lý tài khoản" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const isSelf = id === session.id;
  const hasPassword = typeof body.password === "string" && body.password.length > 0;
  const hasBlocked = typeof body.blocked === "boolean";

  if (!hasPassword && !hasBlocked) {
    return NextResponse.json({ error: "Không có thay đổi nào" }, { status: 400 });
  }

  if (hasBlocked && isSelf) {
    return NextResponse.json({ error: "Không thể chặn tài khoản đang đăng nhập" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing, error: fetchError } = await admin.auth.admin.getUserById(id);

  if (fetchError || !existing.user) {
    return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
  }

  const authUpdate: {
    password?: string;
    ban_duration?: string;
    email_confirm?: boolean;
  } = {};

  if (hasPassword) {
    const password = body.password as string;
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    authUpdate.password = password;
    authUpdate.email_confirm = true;
  }

  if (hasBlocked) {
    authUpdate.ban_duration = body.blocked ? "876000h" : "none";
  }

  const { data, error } = await admin.auth.admin.updateUserById(id, authUpdate);

  if (error || !data.user) {
    console.error("[api/users/[id]] update failed:", error?.message);
    return NextResponse.json({ error: error?.message ?? "Không cập nhật được tài khoản" }, { status: 400 });
  }

  const fullName =
    typeof data.user.user_metadata?.full_name === "string"
      ? data.user.user_metadata.full_name
      : null;
  const role = getAdminRole(data.user) ?? "admin";

  await admin.from("admin_users").upsert(
    {
      id,
      email: data.user.email ?? existing.user.email ?? "",
      full_name: fullName,
      role,
    },
    { onConflict: "id" },
  );

  const user = mapAuthUser(data.user);
  if (!user) {
    return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 500 });
  }

  return NextResponse.json({ user });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Chỉ super admin mới quản lý tài khoản" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  if (id === session.id) {
    return NextResponse.json({ error: "Không thể xóa tài khoản đang đăng nhập" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    console.error("[api/users/[id]] delete failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
