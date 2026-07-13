import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin, requireSuperAdmin } from "@/lib/auth";
import { provisionAdminAuthUser } from "@/lib/admin-auth-provision";
import { mapAuthUser } from "@/lib/auth-users";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ users: [], configured: false });
  }

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });

  if (error) {
    console.error("[api/users] list failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = (data.users ?? [])
    .map(mapAuthUser)
    .filter((user): user is NonNullable<typeof user> => user !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ configured: true, users });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Chỉ super admin mới quản lý tài khoản" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const role = "admin" as const;

  if (!email || !password) {
    return NextResponse.json({ error: "Email và mật khẩu là bắt buộc" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Mật khẩu tối thiểu 8 ký tự" }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    const authUser = await provisionAdminAuthUser({
      email,
      password,
      fullName: fullName || undefined,
      role,
    });

    const { error: profileError } = await admin.from("admin_users").insert({
      id: authUser.id,
      email,
      full_name: fullName || null,
      role,
      created_by: session.id,
    });

    if (profileError) {
      console.error("[api/users] admin_users insert failed:", profileError.message);
      await admin.auth.admin.deleteUser(authUser.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const user = mapAuthUser(authUser);
    if (!user) {
      await admin.auth.admin.deleteUser(authUser.id);
      return NextResponse.json({ error: "Tạo user thất bại" }, { status: 500 });
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không tạo được tài khoản";
    console.error("[api/users] create failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
