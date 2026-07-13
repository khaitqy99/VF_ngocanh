import { createServerClient } from "@vinfast3s/supabase/server";
import { getAdminRole, type AdminRole } from "@vinfast3s/supabase/middleware";

export async function getSessionAdmin(): Promise<{
  id: string;
  email: string | undefined;
  role: AdminRole;
} | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = getAdminRole(user);
  if (!user || !role) {
    return null;
  }

  return { id: user.id, email: user.email, role };
}

export async function requireSuperAdmin() {
  const session = await getSessionAdmin();
  if (!session || session.role !== "super_admin") {
    return null;
  }
  return session;
}
