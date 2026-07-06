"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Filter, Phone, Mail, Car, Clock, StickyNote, Check } from "lucide-react";
import { Input, Badge, Card, Button, Textarea } from "@/components/ui/core";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/complex";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { notifyLeadsUpdated } from "@/lib/use-leads-count";
import {
  fetchLeads,
  updateLead,
  LEAD_STATUS_OPTIONS,
  getLeadTypeLabel,
  getLeadStatusLabel,
  getLeadSourceLabel,
  getLeadStatusVariant,
  formatLeadDate,
  type Lead,
  type LeadStatus,
} from "@/lib/leads";

const TYPE_TABS = [
  { value: "all", label: "Tất cả" },
  { value: "test_drive", label: "Lái thử" },
  { value: "deposit", label: "Đặt cọc" },
  { value: "quote", label: "Báo giá" },
  { value: "finance", label: "Trả góp" },
  { value: "purchase", label: "Đặt mua XMD" },
  { value: "accessory", label: "Phụ kiện" },
  { value: "service", label: "Hậu mãi" },
  { value: "general", label: "Liên hệ" },
] as const;

export default function LeadsListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dbConfigured, setDbConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads()
      .then((data) => {
        if (data.configured) {
          setLeads(data.leads);
          setDbConfigured(true);
        } else {
          setLeads([]);
          setDbConfigured(false);
        }
      })
      .catch((err) => {
        setLeads([]);
        setLoadError(err instanceof Error ? err.message : "Không tải được lead");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLeadUpdate = useCallback((id: string, patch: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          lead.fullName.toLowerCase().includes(q) ||
          lead.phone.includes(q) ||
          (lead.vehicleInterest?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [leads, search, statusFilter]);

  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead khách hàng"
        description={`${leads.length} lead — lái thử, đặt cọc, báo giá, trả góp và các loại khác từ website${
          loading ? " (đang tải...)" : dbConfigured ? "" : " (chưa kết nối DB)"
        }`}
      />

      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Mới", count: leads.filter((l) => l.status === "new").length },
          {
            label: "Đang xử lý",
            count: leads.filter((l) => l.status === "in_progress").length,
          },
          { label: "Chốt đơn", count: leads.filter((l) => l.status === "converted").length },
          { label: "Đóng", count: leads.filter((l) => l.status === "closed").length },
        ].map((s) => (
          <Card key={s.label}>
            <div className="p-4">
              <p className="text-xs text-zinc-500">{s.label}</p>
              <p className="text-2xl font-bold tabular-nums">{s.count}</p>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4 flex h-auto flex-wrap gap-1">
          {TYPE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {tab.value === "all" && newCount > 0 && (
                <span className="ml-1.5 rounded-full bg-red-600 px-1.5 text-[10px] text-white">
                  {newCount}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {TYPE_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <LeadsTable
              leads={
                tab.value === "all"
                  ? filtered
                  : filtered.filter((l) => l.type === tab.value)
              }
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onLeadUpdate={handleLeadUpdate}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function LeadsTable({
  leads,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onLeadUpdate,
}: {
  leads: Lead[];
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: LeadStatus | "all";
  onStatusFilterChange: (v: LeadStatus | "all") => void;
  onLeadUpdate: (id: string, patch: Partial<Lead>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Tìm tên, SĐT, xe..."
            className="bg-white pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as LeadStatus | "all")}
        >
          {LEAD_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Button variant="outline" className="bg-white">
          <Filter className="mr-2 h-4 w-4" /> Lọc
        </Button>
      </div>

      {leads.length === 0 ? (
        <Card>
          <p className="p-8 text-center text-sm text-zinc-500">Không có lead phù hợp.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onUpdate={onLeadUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  onUpdate,
}: {
  lead: Lead;
  onUpdate: (id: string, patch: Partial<Lead>) => void;
}) {
  const { toast } = useToast();
  const [note, setNote] = useState(lead.message ?? "");
  const [noteOpen, setNoteOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const handleStatusChange = async (next: LeadStatus) => {
    if (next === lead.status) return;
    setSavingStatus(true);
    try {
      await updateLead(lead.id, { status: next });
      onUpdate(lead.id, { status: next });
      notifyLeadsUpdated();
      toast("Đã cập nhật trạng thái");
    } catch {
      toast("Không thể cập nhật trạng thái");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await updateLead(lead.id, { message: note });
      onUpdate(lead.id, { message: note });
      notifyLeadsUpdated();
      toast("Đã lưu ghi chú");
      setNoteOpen(false);
    } catch {
      toast("Không thể lưu ghi chú");
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-zinc-900">{lead.fullName}</p>
          <a
            href={`tel:${lead.phone}`}
            className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {lead.phone}
          </a>
        </div>
        <Badge variant={getLeadStatusVariant(lead.status)} className="shrink-0">
          {getLeadStatusLabel(lead.status)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 text-sm">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <Badge variant="outline">{getLeadTypeLabel(lead.type)}</Badge>
          <span className="text-zinc-400">{getLeadSourceLabel(lead.source)}</span>
        </div>

        {lead.vehicleInterest ? (
          <div className="flex items-center gap-1.5 text-zinc-600">
            <Car className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span className="truncate">{lead.vehicleInterest}</span>
          </div>
        ) : null}

        {lead.email ? (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-1.5 text-zinc-600 hover:underline"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span className="truncate">{lead.email}</span>
          </a>
        ) : null}

        {lead.message && !noteOpen ? (
          <p className="line-clamp-2 rounded-md bg-zinc-50 px-2.5 py-1.5 text-zinc-500">
            {lead.message}
          </p>
        ) : null}
      </div>

      <div className="mt-3 space-y-2 p-4 pt-3">
        <div className="flex items-center gap-2">
          <select
            className="h-8 min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-2 text-sm disabled:opacity-50"
            value={lead.status}
            disabled={savingStatus}
            onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
          >
            {LEAD_STATUS_OPTIONS.filter((o) => o.value !== "all").map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setNoteOpen((v) => !v)}
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors ${
              noteOpen
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
            title="Ghi chú"
          >
            <StickyNote className="h-4 w-4" />
          </button>
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700"
          >
            <Phone className="h-3.5 w-3.5" />
            Gọi
          </a>
        </div>

        {noteOpen ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Ghi chú sau khi gọi điện, hẹn lái thử..."
              className="min-h-[68px] resize-none text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button
              size="sm"
              className="w-full"
              onClick={handleSaveNote}
              disabled={savingNote || note === (lead.message ?? "")}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              {savingNote ? "Đang lưu..." : "Lưu ghi chú"}
            </Button>
          </div>
        ) : null}

        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatLeadDate(lead.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}
