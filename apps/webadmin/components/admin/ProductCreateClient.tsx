"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui/core";
import { slugify } from "@webclient/lib/seo/slugs";

type CatalogItem = { id: string; name: string };
type VehicleOption = { id: string; name: string };

export function ProductCreateClient({
  productKind,
  listHref,
  listLabel,
  title,
  description,
}: {
  productKind: "car" | "scooter" | "accessory";
  listHref: string;
  listLabel: string;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CatalogItem[]>([]);
  const [cars, setCars] = useState<VehicleOption[]>([]);
  const [scooters, setScooters] = useState<VehicleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [idTouched, setIdTouched] = useState(false);
  const [form, setForm] = useState({
    cloneFromId: "",
    name: "",
    id: "",
    slug: "",
    vehicles: [] as string[],
  });

  useEffect(() => {
    const catalogUrl =
      productKind === "accessory"
        ? "/api/accessories"
        : `/api/vehicles?type=${productKind}`;

    const requests: Promise<Response>[] = [fetch(catalogUrl, { credentials: "include" })];
    if (productKind === "accessory") {
      requests.push(fetch("/api/news/catalog", { credentials: "include" }));
    }

    Promise.all(requests)
      .then(async ([templateRes, vehicleRes]) => {
        const templateData = await templateRes.json();
        setTemplates(templateData.items ?? []);
        if (vehicleRes) {
          const vehicleData = await vehicleRes.json();
          setCars(vehicleData.cars ?? []);
          setScooters(vehicleData.scooters ?? []);
        }
      })
      .catch(() => toast("Không tải được danh sách sản phẩm mẫu"))
      .finally(() => setLoading(false));
  }, [productKind, toast]);

  const vehicleOptions = useMemo(
    () => [
      ...cars.map((item) => ({ id: item.id, name: `Ô tô · ${item.name}` })),
      ...scooters.map((item) => ({ id: item.id, name: `Xe máy · ${item.name}` })),
    ],
    [cars, scooters],
  );

  const updateName = (name: string) => {
    setForm((prev) => {
      const next = { ...prev, name };
      const slugBase = slugify(name) || "san-pham";
      if (!slugTouched) next.slug = slugBase;
      if (!idTouched) next.id = slugBase;
      return next;
    });
  };

  const toggleVehicle = (vehicleId: string) => {
    setForm((prev) => ({
      ...prev,
      vehicles: prev.vehicles.includes(vehicleId)
        ? prev.vehicles.filter((id) => id !== vehicleId)
        : [...prev.vehicles, vehicleId],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.cloneFromId) {
      toast("Chọn sản phẩm mẫu để sao chép");
      return;
    }
    if (!form.name.trim()) {
      toast("Nhập tên sản phẩm");
      return;
    }

    setSaving(true);
    try {
      const endpoint = productKind === "accessory" ? "/api/accessories" : "/api/vehicles";
      const payload =
        productKind === "accessory"
          ? {
              cloneFromId: form.cloneFromId,
              name: form.name.trim(),
              id: form.id.trim() || undefined,
              slug: form.slug.trim() || undefined,
              vehicles: form.vehicles,
            }
          : {
              cloneFromId: form.cloneFromId,
              name: form.name.trim(),
              id: form.id.trim() || undefined,
              slug: form.slug.trim() || undefined,
              type: productKind,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Tạo sản phẩm thất bại");

      const createdId =
        productKind === "accessory" ? data.accessory?.id : data.vehicle?.id;
      toast("Đã tạo sản phẩm nháp — upload ảnh trong Thư viện ảnh");
      router.push(`${listHref}/${createdId}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Tạo sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-zinc-500">Đang tải danh sách mẫu...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href={listHref} className="hover:text-zinc-900">
          {listLabel}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-zinc-900">Thêm mới</span>
      </div>

      <PageHeader title={title} description={description} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="cloneFromId" className="text-sm font-medium">
                Sao chép từ sản phẩm mẫu
              </label>
              <select
                id="cloneFromId"
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                value={form.cloneFromId}
                onChange={(e) => setForm((prev) => ({ ...prev, cloneFromId: e.target.value }))}
                required
              >
                <option value="">— Chọn mẫu —</option>
                {templates.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.id})
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">
                Sao chép cấu trúc trang chi tiết. Ảnh không được copy — upload mới sau khi tạo.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Tên hiển thị
              </label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateName(e.target.value)}
                placeholder="VD: VF 9 Plus"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="id" className="text-sm font-medium">
                  ID (nội bộ)
                </label>
                <Input
                  id="id"
                  value={form.id}
                  onChange={(e) => {
                    setIdTouched(true);
                    setForm((prev) => ({ ...prev, id: e.target.value }));
                  }}
                  placeholder="vf9-plus"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug URL (tùy chỉnh)
                </label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  placeholder="vf9-plus"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Định dạng: chữ thường, số, dấu gạch ngang (vd: <code>vf9-plus</code>). Trạng thái mặc định:{" "}
              <strong>nháp</strong>.
            </p>

            {productKind === "accessory" ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Xe tương thích (thư mục ảnh phụ kiện)</p>
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-zinc-200 p-3">
                  {vehicleOptions.length === 0 ? (
                    <p className="text-sm text-zinc-500">Chưa có xe trong hệ thống.</p>
                  ) : (
                    vehicleOptions.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={form.vehicles.includes(item.id)}
                          onChange={() => toggleVehicle(item.id)}
                        />
                        {item.name}
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  Không chọn xe nào → ảnh lưu trong thư mục phụ kiện chung.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="submit" disabled={saving}>
            <Plus className="mr-1.5 h-4 w-4" />
            {saving ? "Đang tạo..." : "Tạo sản phẩm nháp"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(listHref)}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
