"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui/core";
import {
  defaultCarPricingSettings,
  type CarPricingSettings,
  type ProvincePlateFee,
} from "@/lib/cms/car-pricing";

function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN");
}

function parseVnd(raw: string): number {
  const n = Number(raw.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function MoneyField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold">{label}</label>
      <div className="relative">
        <Input
          inputMode="numeric"
          value={formatVnd(value)}
          onChange={(e) => onChange(parseVnd(e.target.value))}
          className="pr-12"
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-zinc-400">
          VNĐ
        </span>
      </div>
      {hint ? <p className="mt-1 text-[11px] text-zinc-400">{hint}</p> : null}
    </div>
  );
}

function ProvinceRow({
  province,
  onChange,
  onRemove,
}: {
  province: ProvincePlateFee;
  onChange: (patch: Partial<ProvincePlateFee>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 p-3">
      <div className="min-w-[120px] flex-[2]">
        <label className="mb-1 block text-[11px] font-semibold text-zinc-500">Tên khu vực</label>
        <Input
          value={province.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Cà Mau (Phí biển ~1 triệu)"
        />
      </div>
      <div className="min-w-[110px] flex-1">
        <label className="mb-1 block text-[11px] font-semibold text-zinc-500">Mã (id)</label>
        <Input
          value={province.id}
          onChange={(e) => onChange({ id: e.target.value.trim() })}
          placeholder="camau"
        />
      </div>
      <div className="min-w-[130px] flex-1">
        <label className="mb-1 block text-[11px] font-semibold text-zinc-500">Phí biển số</label>
        <div className="relative">
          <Input
            inputMode="numeric"
            value={formatVnd(province.plateFee)}
            onChange={(e) => onChange({ plateFee: parseVnd(e.target.value) })}
            className="pr-12"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-zinc-400">
            VNĐ
          </span>
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Xóa khu vực">
        <Trash2 className="h-4 w-4 text-zinc-400" />
      </Button>
    </div>
  );
}

export function CarPricingSettingsClient() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CarPricingSettings>(defaultCarPricingSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/cms/car-pricing", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/car-pricing", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu bảng giá lăn bánh ô tô");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const updateProvince = (index: number, patch: Partial<ProvincePlateFee>) => {
    setSettings((s) => ({
      ...s,
      provinces: s.provinces.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }));
  };

  const removeProvince = (index: number) => {
    setSettings((s) => ({ ...s, provinces: s.provinces.filter((_, i) => i !== index) }));
  };

  const addProvince = () => {
    setSettings((s) => ({
      ...s,
      provinces: [...s.provinces, { id: `khu-vuc-${s.provinces.length + 1}`, name: "Khu vực mới", plateFee: 1_000_000 }],
    }));
  };

  if (loading) return <p className="text-sm text-zinc-500">Đang tải…</p>;

  const ratePercent = (settings.physicalInsuranceRate * 100).toFixed(2).replace(/\.?0+$/, "");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo giá lăn bánh (Ô tô)"
        description="Chỉnh phí đăng ký, bảo trì đường bộ, đăng kiểm, bảo hiểm dùng cho bảng tính lăn bánh trên các trang xe ô tô. Giá bán xe lấy từ từng dòng xe."
        action={
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Phí cố định</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <MoneyField
            label="Phí bảo trì đường bộ (12 tháng)"
            value={settings.roadMaintenanceFee}
            onChange={(v) => setSettings((s) => ({ ...s, roadMaintenanceFee: v }))}
          />
          <MoneyField
            label="Phí đăng kiểm"
            value={settings.inspectionFee}
            onChange={(v) => setSettings((s) => ({ ...s, inspectionFee: v }))}
          />
          <MoneyField
            label="Bảo hiểm TNDS bắt buộc"
            value={settings.civilInsurance}
            onChange={(v) => setSettings((s) => ({ ...s, civilInsurance: v }))}
          />
          <div>
            <label className="mb-1 block text-xs font-semibold">
              Tỉ lệ bảo hiểm vật chất (% theo giá xe)
            </label>
            <div className="relative">
              <Input
                inputMode="decimal"
                value={ratePercent}
                onChange={(e) => {
                  const pct = Number(e.target.value.replace(/[^\d.]/g, ""));
                  setSettings((s) => ({
                    ...s,
                    physicalInsuranceRate: Number.isFinite(pct) ? pct / 100 : s.physicalInsuranceRate,
                  }));
                }}
                className="pr-8"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-zinc-400">
                %
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Ví dụ 1.1 nghĩa là 1.1% giá xe.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Khu vực đăng ký & phí biển số</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.provinces.map((province, index) => (
            <ProvinceRow
              key={index}
              province={province}
              onChange={(patch) => updateProvince(index, patch)}
              onRemove={() => removeProvince(index)}
            />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addProvince}>
            <Plus className="mr-1 h-4 w-4" />
            Thêm khu vực
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
