"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@vinfast3s/supabase/client";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/ToastProvider";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const router = useRouter();

  const onLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <ToastProvider>
      <div className="flex h-screen w-full overflow-hidden bg-zinc-50 font-sans">
        <AdminSidebar isOpen={isSidebarOpen} onLogout={onLogout} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader toggleSidebar={() => setIsSidebarOpen((v) => !v)} />
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
