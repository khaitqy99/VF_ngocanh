"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Ban, KeyRound, Search, ShieldCheck, Trash2, UserPlus, X } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/complex";
import { PageHeader } from "@/components/admin/PageHeader";
import { PasswordInput } from "@/components/admin/PasswordInput";
import { useToast } from "@/components/admin/ToastProvider";
import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  fetchSessionAdmin,
  formatUserDate,
  updateAdminUser,
  type AdminUser,
  type SessionAdmin,
} from "@/lib/users";

const EMPTY_CREATE_FORM = {
  email: "",
  password: "",
  fullName: "",
};

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [session, setSession] = useState<SessionAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(q) ||
        (user.fullName?.toLowerCase().includes(q) ?? false),
    );
  }, [users, search]);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const [data, current] = await Promise.all([fetchAdminUsers(), fetchSessionAdmin()]);
      setUsers(data.users);
      setConfigured(data.configured);
      setSession(current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function togglePasswordPanel(userId: string) {
    setPasswordUserId((current) => (current === userId ? null : userId));
    setPasswordForm({ password: "", confirmPassword: "" });
    setError(null);
  }

  function closePasswordPanel() {
    setPasswordUserId(null);
    setError(null);
  }

  async function handleToggleBlock(user: AdminUser) {
    const nextBlocked = !user.blocked;
    const action = nextBlocked ? "chặn" : "mở chặn";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản ${user.email}?`)) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateAdminUser(user.id, { blocked: nextBlocked });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      toast(nextBlocked ? "Đã chặn tài khoản" : "Đã mở chặn tài khoản");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không cập nhật được trạng thái");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await createAdminUser({
        email: createForm.email,
        password: createForm.password,
        fullName: createForm.fullName || undefined,
      });
      setUsers((prev) => [user, ...prev]);
      setCreateForm(EMPTY_CREATE_FORM);
      setShowForm(false);
      toast("Đã tạo tài khoản mới");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tạo được tài khoản");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`Xóa tài khoản ${user.email}?`)) return;
    setError(null);
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (passwordUserId === user.id) closePasswordPanel();
      toast("Đã xóa tài khoản");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không xóa được tài khoản");
    }
  }

  async function handlePassword(user: AdminUser) {
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError("Mật khẩu mới và xác nhận không khớp");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await updateAdminUser(user.id, {
        password: passwordForm.password,
      });
      closePasswordPanel();
      toast(session?.id === user.id ? "Đã đổi mật khẩu" : `Đã đổi mật khẩu cho ${user.email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không đổi được mật khẩu");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tài khoản admin"
        description={`Quản lý tài khoản đăng nhập webadmin — ${users.length} tài khoản${
          loading ? " (đang tải...)" : configured ? "" : " (chưa kết nối DB)"
        }`}
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            <UserPlus className="mr-2 h-4 w-4" />
            {showForm ? "Đóng form" : "Thêm tài khoản"}
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tạo tài khoản mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Họ tên</label>
                <Input
                  placeholder="Nguyễn Văn A"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm((f) => ({ ...f, fullName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Email *</label>
                <Input
                  type="email"
                  required
                  placeholder="admin@vinfast3scamau.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-zinc-900">Mật khẩu *</label>
                <PasswordInput
                  required
                  minLength={8}
                  placeholder="Tối thiểu 8 ký tự"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang tạo..." : "Tạo tài khoản"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <div className="border-b border-zinc-200 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              className="bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 && !loading ? (
          <p className="p-8 text-center text-sm text-zinc-500">
            {search ? "Không tìm thấy tài khoản phù hợp." : "Chưa có tài khoản admin nào."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tạo lúc</TableHead>
                <TableHead>Đăng nhập gần nhất</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const isSelf = session?.id === user.id;
                const isPasswordOpen = passwordUserId === user.id;

                return (
                  <Fragment key={user.id}>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium text-zinc-900">
                          {user.fullName ?? user.email}
                          {isSelf ? (
                            <span className="ml-2 text-xs text-zinc-400">(bạn)</span>
                          ) : null}
                        </div>
                        {user.fullName ? (
                          <div className="text-xs text-zinc-500">{user.email}</div>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            user.blocked
                              ? "inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                              : "inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                          }
                        >
                          {user.blocked ? "Đã chặn" : "Hoạt động"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                        {formatUserDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                        {formatUserDate(user.lastSignInAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              isPasswordOpen
                                ? "bg-zinc-100 text-zinc-900"
                                : "text-zinc-600 hover:text-zinc-900"
                            }
                            onClick={() => togglePasswordPanel(user.id)}
                            title="Đổi mật khẩu"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              user.blocked
                                ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                : "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                            }
                            onClick={() => handleToggleBlock(user)}
                            disabled={isSelf || submitting}
                            title={
                              isSelf
                                ? "Không thể chặn tài khoản đang đăng nhập"
                                : user.blocked
                                  ? "Mở chặn"
                                  : "Chặn tài khoản"
                            }
                          >
                            {user.blocked ? (
                              <ShieldCheck className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(user)}
                            disabled={isSelf}
                            title={isSelf ? "Không thể xóa tài khoản đang đăng nhập" : "Xóa"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isPasswordOpen ? (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-zinc-50">
                          <ActionPanelShell
                            title={`Đổi mật khẩu — ${user.email}`}
                            onClose={closePasswordPanel}
                          >
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-900">
                                  Mật khẩu mới *
                                </label>
                                <PasswordInput
                                  minLength={8}
                                  placeholder="Tối thiểu 8 ký tự"
                                  value={passwordForm.password}
                                  onChange={(e) =>
                                    setPasswordForm((f) => ({ ...f, password: e.target.value }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-900">
                                  Xác nhận mật khẩu *
                                </label>
                                <PasswordInput
                                  minLength={8}
                                  value={passwordForm.confirmPassword}
                                  onChange={(e) =>
                                    setPasswordForm((f) => ({
                                      ...f,
                                      confirmPassword: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button disabled={submitting} onClick={() => handlePassword(user)}>
                                {submitting ? "Đang lưu..." : "Lưu mật khẩu"}
                              </Button>
                              <Button variant="outline" onClick={closePasswordPanel}>
                                Hủy
                              </Button>
                            </div>
                          </ActionPanelShell>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function ActionPanelShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-900">{title}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
