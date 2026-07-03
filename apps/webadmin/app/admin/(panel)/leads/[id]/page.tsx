"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Phone, Mail, Car, MessageSquare } from "lucide-react";
import {
  Button,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import {
  fetchLeads,
  getLeadById,
  LEAD_STATUS_OPTIONS,
  LEAD_TYPE_OPTIONS,
  getLeadTypeLabel,
  getLeadStatusLabel,
  getLeadSourceLabel,
  getLeadStatusVariant,
  formatLeadDate,
  type Lead,
  type LeadStatus,
} from "@/lib/leads";

function LeadDetailContent({ id }: { id: string }) {
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads()
      .then((data) => {
        const found = getLeadById(data.leads, id);
        if (found) {
          setLead(found);
          setStatus(found.status);
          setNote(found.message ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="py-12 text-center text-zinc-500">Đang tải lead...</p>;
  }

  if (!lead) {
    return (
      <p className="py-12 text-center text-zinc-500">
        Không tìm thấy lead.{" "}
        <Link href="/admin/leads" className="text-red-600 hover:underline">
          Quay lại
        </Link>
      </p>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          status: status || lead.status,
          message: note || lead.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      toast("Đã cập nhật lead");
      setLead({ ...lead, status: (status || lead.status) as LeadStatus, message: note });
    } catch {
      toast("Không thể lưu — kiểm tra kết nối database");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/leads" className="hover:text-zinc-900">
          Lead
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-zinc-900">{lead.id}</span>
      </div>

      <PageHeader
        title={lead.fullName}
        description={`${getLeadTypeLabel(lead.type)} · ${formatLeadDate(lead.createdAt)}`}
        action={
          <Badge variant={getLeadStatusVariant(lead.status)} className="text-sm px-3 py-1">
            {getLeadStatusLabel(lead.status)}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Thông tin khách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-zinc-400" />
              <a href={`tel:${lead.phone}`} className="font-medium text-red-600 hover:underline">
                {lead.phone}
              </a>
            </div>
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400" />
                <a href={`mailto:${lead.email}`} className="text-zinc-700 hover:underline">
                  {lead.email}
                </a>
              </div>
            )}
            {lead.vehicleInterest && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-zinc-400" />
                <span>{lead.vehicleInterest}</span>
              </div>
            )}
            <div className="border-t pt-3 text-zinc-500">
              <p>
                Nguồn: <strong className="text-zinc-800">{getLeadSourceLabel(lead.source)}</strong>
              </p>
              <p className="mt-1">
                Loại: <strong className="text-zinc-800">{getLeadTypeLabel(lead.type)}</strong>
              </p>
              {lead.assignedTo && (
                <p className="mt-1">
                  Phụ trách: <strong className="text-zinc-800">{lead.assignedTo}</strong>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Xử lý lead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                value={status || lead.status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
              >
                {LEAD_STATUS_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú nội bộ</label>
              <Textarea
                placeholder="Ghi chú sau khi gọi điện, hẹn lái thử..."
                className="min-h-[100px]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={save} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu cập nhật"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {lead.message && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              Nội dung khách gửi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-zinc-700">{lead.message}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-zinc-500">Loại lead trên website</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {LEAD_TYPE_OPTIONS.filter((o) => o.value !== "all").map((o) => (
              <Badge key={o.value} variant={o.value === lead.type ? "default" : "outline"}>
                {o.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => history.back()}>
          Quay lại
        </Button>
        <a
          href={`tel:${lead.phone}`}
          className="inline-flex h-9 items-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Gọi khách
        </a>
      </div>
    </div>
  );
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense fallback={<p className="py-12 text-center text-zinc-500">Đang tải...</p>}>
      <LeadDetailContent id={id} />
    </Suspense>
  );
}
