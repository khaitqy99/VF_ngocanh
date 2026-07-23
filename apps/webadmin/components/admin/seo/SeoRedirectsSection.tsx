"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui/core";

type SeoRedirectRow = {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  enabled: boolean;
};

export function SeoRedirectsSection() {
  const { toast } = useToast();
  const [rows, setRows] = useState<SeoRedirectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    fromPath: "",
    toPath: "",
    statusCode: 301,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seo/redirects", { credentials: "include" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Không tải được redirects");
      setRows(Array.isArray(data?.redirects) ? data.redirects : []);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không tải được redirects", "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const createRedirect = async () => {
    if (!draft.fromPath.trim() || !draft.toPath.trim()) {
      toast("Nhập from_path và to_path");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/seo/redirects", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Tạo redirect thất bại");
      setDraft({ fromPath: "", toPath: "", statusCode: 301 });
      toast("Đã thêm redirect");
      await load();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Tạo redirect thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const patchRedirect = async (id: string, patch: Partial<SeoRedirectRow>) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/seo/redirects/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPath: patch.from_path,
          toPath: patch.to_path,
          statusCode: patch.status_code,
          enabled: patch.enabled,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Cập nhật thất bại");
      toast("Đã cập nhật redirect");
      await load();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Cập nhật thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteRedirect = async (id: string) => {
    if (!window.confirm("Xóa redirect này?")) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/seo/redirects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Xóa thất bại");
      toast("Đã xóa redirect");
      await load();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Xóa thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-zinc-500">Đang tải redirects…</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Thêm redirect</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_120px_auto]">
          <Input
            value={draft.fromPath}
            onChange={(e) => setDraft((d) => ({ ...d, fromPath: e.target.value }))}
            placeholder="/duong-dan-cu"
            className="font-mono text-xs"
          />
          <Input
            value={draft.toPath}
            onChange={(e) => setDraft((d) => ({ ...d, toPath: e.target.value }))}
            placeholder="/duong-dan-moi"
            className="font-mono text-xs"
          />
          <select
            className="h-10 rounded-md border border-zinc-200 bg-white px-2 text-sm"
            value={draft.statusCode}
            onChange={(e) =>
              setDraft((d) => ({ ...d, statusCode: Number(e.target.value) || 301 }))
            }
          >
            <option value={301}>301</option>
            <option value={302}>302</option>
            <option value={307}>307</option>
            <option value={308}>308</option>
          </select>
          <Button type="button" onClick={createRedirect} disabled={saving}>
            <Plus className="mr-1.5 h-4 w-4" />
            Thêm
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500">Chưa có redirect nào.</p>
        ) : (
          rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_100px_auto_auto] md:items-center">
                <Input
                  defaultValue={row.from_path}
                  className="font-mono text-xs"
                  onBlur={(e) => {
                    const next = e.target.value.trim();
                    if (next && next !== row.from_path) {
                      void patchRedirect(row.id, { ...row, from_path: next });
                    }
                  }}
                />
                <Input
                  defaultValue={row.to_path}
                  className="font-mono text-xs"
                  onBlur={(e) => {
                    const next = e.target.value.trim();
                    if (next && next !== row.to_path) {
                      void patchRedirect(row.id, { ...row, to_path: next });
                    }
                  }}
                />
                <select
                  className="h-10 rounded-md border border-zinc-200 bg-white px-2 text-sm"
                  value={row.status_code}
                  onChange={(e) =>
                    void patchRedirect(row.id, {
                      ...row,
                      status_code: Number(e.target.value) || 301,
                    })
                  }
                >
                  <option value={301}>301</option>
                  <option value={302}>302</option>
                  <option value={307}>307</option>
                  <option value={308}>308</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300"
                    checked={row.enabled}
                    onChange={(e) =>
                      void patchRedirect(row.id, { ...row, enabled: e.target.checked })
                    }
                  />
                  Bật
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => void deleteRedirect(row.id)}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <p className="text-xs text-zinc-500">
        Redirect được áp dụng trên webclient middleware (cache ~60s). Dùng 301/308 cho chuyển hướng
        vĩnh viễn.
      </p>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Save className="h-3.5 w-3.5" />
        Sửa path rồi blur ô input để lưu; bật/tắt và status lưu ngay.
      </div>
    </div>
  );
}
