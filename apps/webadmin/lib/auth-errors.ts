export function translateAuthError(message: string): string {
  const normalized = message.trim().toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng. Kiểm tra lại hoặc nhờ super admin đổi mật khẩu.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Email chưa được xác nhận. Liên hệ super admin để kích hoạt tài khoản.";
  }

  if (normalized.includes("user is banned") || normalized.includes("banned")) {
    return "Tài khoản đang bị chặn. Liên hệ super admin.";
  }

  return message;
}
