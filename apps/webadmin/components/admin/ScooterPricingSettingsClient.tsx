"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui/core";
import {
  defaultScooterPricingSettings,
  type ScooterPricingSettings,
  type ScooterProvinceFee,
} from "@/lib/cms/scooter-pricing";

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
  province: ScooterProvinceFee;
  onChange: (patch: Partial<ScooterProvinceFee>) => void;
  onRemove: () => void;
}) {
  const ratePercent = (province.registrationTaxRate * 100).toFixed(2).replace(/\.?0+$/, "");

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 p-3">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[140px] flex-[2]">
          <label className="mb-1 block text-[11px] font-semibold text-zinc-500">Tên khu vực</label>
          <Input
            value={province.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Cà Mau & tỉnh khác"
          />
        </div>
        <div className="min-w-[100px] flex-1">
          <label className="mb-1 block text-[11px] font-semibold text-zinc-500">Mã (id)</label>
          <Input
            value={province.id}
            onChange={(e) => onChange({ id: e.target.value.trim() })}
            placeholder="camau"
          />
        </div>
        <div className="min-w-[100px] flex-1">
          <label className="mb-1 block text-[11px] font-semibold text-zinc-500">
            Trước bạ (%)
          </label>
          <div className="relative">
            <Input
              inputMode="decimal"
              value={ratePercent}
              onChange={(e) => {
                const pct = Number(e.target.value.replace(/[^\d.]/g, ""));
                onChange({
                  registrationTaxRate: Number.isFinite(pct)
                    ? pct / 100
                    : province.registrationTaxRate,
                });
              }}
              className="pr-8"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-zinc-400">
              %
            </span>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Xóa khu vực">
          <Trash2 className="h-4 w-4 text-zinc-400" />
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <MoneyField
          label="Phí biển dưới 15 triệu"
          value={province.plateFeeUnder15m}
          onChange={(v) => onChange({ plateFeeUnder15m: v })}
        />
        <MoneyField
          label="Phí biển 15–40 triệu"
          value={province.plateFeeUnder40m}
          onChange={(v) => onChange({ plateFeeUnder40m: v })}
        />
        <MoneyField
          label="Phí biển trên 40 triệu"
          value={province.plateFeeAbove40m}
          onChange={(v) => onChange({ plateFeeAbove40m: v })}
        />
      </div>
    </div>
  );
}

export function ScooterPricingSettingsClient() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ScooterPricingSettings>(defaultScooterPricingSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/cms/scooter-pricing", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/scooter-pricing", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu bảng giá lăn bánh xe máy");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const updateProvince = (index: number, patch: Partial<ScooterProvinceFee>) => {
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
      provinces: [
        ...s.provinces,
        {
          id: `khu-vuc-${s.provinces.length + 1}`,
          name: "Khu vực mới",
          registrationTaxRate: 0.02,
          plateFeeUnder15m: 150_000,
          plateFeeUnder40m: 400_000,
          plateFeeAbove40m: 800_000,
        },
      ],
    }));
  };

  if (loading) return <p className="text-sm text-zinc-500">Đang tải…</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo giá lăn bánh (Xe máy điện)"
        description="Chỉnh lệ phí trước bạ, phí biển theo mức giá, đăng kiểm và bảo hiểm TNDS dùng cho bảng tính lăn bánh trên trang xe máy điện. Giá bán lấy từ từng dòng xe."
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
            label="Phí đăng kiểm / hỗ trợ đăng ký"
            value={settings.inspectionFee}
            onChange={(v) => setSettings((s) => ({ ...s, inspectionFee: v }))}
          />
          <MoneyField
            label="Bảo hiểm TNDS bắt buộc"
            value={settings.civilInsurance}
            onChange={(v) => setSettings((s) => ({ ...s, civilInsurance: v }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Khu vực đăng ký, trước bạ & phí biển</CardTitle>
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
