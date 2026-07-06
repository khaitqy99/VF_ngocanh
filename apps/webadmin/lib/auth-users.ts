import { getAdminRole } from "@vinfast3s/supabase/middleware";

export function isUserBlocked(bannedUntil?: string | null): boolean {
  if (!bannedUntil) return false;
  return new Date(bannedUntil).getTime() > Date.now();
}

export function mapAuthUser(user: {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  banned_until?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}) {
  const role = getAdminRole(user);
  if (!role) return null;

  const fullName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName,
    role,
    blocked: isUserBlocked(user.banned_until),
    createdAt: user.created_at ?? new Date().toISOString(),
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}
