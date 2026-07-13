import type { User } from "@supabase/supabase-js";
import type { AdminRole } from "@vinfast3s/supabase/middleware";
import { createAdminClient } from "@vinfast3s/supabase/admin";

type ProvisionAdminUserInput = {
  email: string;
  password: string;
  role?: AdminRole;
  fullName?: string;
};

function buildUserMetadata(fullName?: string) {
  return fullName ? { full_name: fullName } : {};
}

function hasEmailPasswordIdentity(user: User): boolean {
  return (user.identities ?? []).some((identity) => identity.provider === "email");
}

/**
 * Tạo user auth có thể đăng nhập bằng email/mật khẩu.
 * Gọi updateUserById sau createUser để tránh lỗi Supabase không gắn password identity.
 */
export async function provisionAdminAuthUser(input: ProvisionAdminUserInput): Promise<User> {
  const admin = createAdminClient();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const role = input.role ?? "admin";
  const userMetadata = buildUserMetadata(input.fullName);

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
    user_metadata: userMetadata,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Không tạo được tài khoản");
  }

  const { data: updated, error: updateError } = await admin.auth.admin.updateUserById(data.user.id, {
    password,
    email_confirm: true,
    app_metadata: { role },
    user_metadata: userMetadata,
  });

  if (updateError || !updated.user) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw new Error(updateError?.message ?? "Không kích hoạt mật khẩu cho tài khoản");
  }

  if (!hasEmailPasswordIdentity(updated.user)) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw new Error("Tài khoản chưa có phương thức đăng nhập email/mật khẩu");
  }

  return updated.user;
}
