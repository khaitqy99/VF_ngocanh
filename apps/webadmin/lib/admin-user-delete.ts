import type { createAdminClient } from "@vinfast3s/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

/** Gỡ liên kết user khỏi CMS trước khi xóa auth.users (tránh FK RESTRICT). */
export async function detachAdminUserReferences(admin: AdminClient, userId: string) {
  const updates = await Promise.all([
    admin.from("site_settings").update({ updated_by: null }).eq("updated_by", userId),
    admin.from("cms_pages").update({ updated_by: null }).eq("updated_by", userId),
    admin.from("news_articles").update({ author_id: null }).eq("author_id", userId),
    admin.from("media_assets").update({ uploaded_by: null }).eq("uploaded_by", userId),
  ]);

  for (const { error } of updates) {
    if (error) {
      throw new Error(`Không gỡ liên kết tài khoản: ${error.message}`);
    }
  }

  const { error: profileError } = await admin.from("admin_users").delete().eq("id", userId);
  if (profileError) {
    throw new Error(`Không xóa hồ sơ admin_users: ${profileError.message}`);
  }
}

export function formatAdminUserDeleteError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("foreign key") || lower.includes("violates")) {
    return "Không xóa được — tài khoản còn được tham chiếu trong dữ liệu CMS. Thử lại sau khi hệ thống cập nhật.";
  }
  if (lower.includes("not found") || lower.includes("user not found")) {
    return "Không tìm thấy tài khoản trong Supabase Auth.";
  }
  return message || "Không xóa được tài khoản";
}
