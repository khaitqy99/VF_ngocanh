"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@vinfast3s/supabase/client";
import { IMAGES } from "@webclient/lib/images";
import { translateAuthError } from "@/lib/auth-errors";
import { clientAssetUrl } from "@/lib/product-utils";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authError ? "Đăng nhập thất bại. Vui lòng thử lại." : null,
  );

  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        setError(translateAuthError(signInError.message));
        return;
      }

      const role = data.user?.app_metadata?.role;
      if (role !== "admin" && role !== "super_admin") {
        await supabase.auth.signOut();
        setError("Tài khoản không có quyền truy cập admin.");
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(
        message.includes("NEXT_PUBLIC_SUPABASE")
          ? "Không thể kết nối Supabase. Kiểm tra file .env và thử lại."
          : `Lỗi đăng nhập: ${message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-md p-2">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex justify-center">
            <Image
              src={clientAssetUrl(IMAGES.vinfastLogo)}
              alt="VinFast — Đại lý VinFast Ngọc Anh Cà Mau"
              width={180}
              height={42}
              priority
              unoptimized
              className="h-9 w-auto sm:h-10"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
            <p className="mt-2 text-sm text-zinc-500">VinFast Ngọc Anh Cà Mau Admin CMS</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="Nhập email của bạn"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
