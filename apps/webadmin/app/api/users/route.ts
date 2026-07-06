import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
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

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
    user_metadata: fullName ? { full_name: fullName } : {},
  });

  if (error || !data.user) {
    console.error("[api/users] create failed:", error?.message);
    return NextResponse.json({ error: error?.message ?? "Không tạo được tài khoản" }, { status: 400 });
  }

  const { error: profileError } = await admin.from("admin_users").insert({
    id: data.user.id,
    email,
    full_name: fullName || null,
    role,
    created_by: session.id,
  });

  if (profileError) {
    console.error("[api/users] admin_users insert failed:", profileError.message);
    await admin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const user = mapAuthUser(data.user);
  if (!user) {
    return NextResponse.json({ error: "Tạo user thất bại" }, { status: 500 });
  }

  return NextResponse.json({ user }, { status: 201 });
}
