import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">
          Đang tải...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
