"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Filter, Phone, Mail, Car, Clock, StickyNote, Check, Trash2 } from "lucide-react";
import { Input, Badge, Card, Button, Textarea } from "@/components/ui/core";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/complex";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { notifyLeadsUpdated } from "@/lib/use-leads-count";
import {
  fetchLeads,
  updateLead,
  deleteLead,
  deleteLeads,
  LEAD_STATUS_OPTIONS,
  getLeadBadgeLabel,
  getLeadStatusLabel,
  getLeadSourceLabel,
  getLeadStatusVariant,
  formatLeadDate,
  type Lead,
  type LeadStatus,
} from "@/lib/leads";

const TYPE_TABS = [
  { value: "all", label: "Tất cả" },
  { value: "test_drive", label: "Đăng ký lái thử" },
  { value: "deposit", label: "Đặt cọc ngay" },
  { value: "quote", label: "Nhận báo giá" },
  { value: "finance", label: "Tư vấn trả góp" },
  { value: "purchase", label: "Đặt mua ngay" },
  { value: "accessory", label: "Tư vấn phụ kiện" },
  { value: "service", label: "Bảo dưỡng định kỳ" },
  { value: "general", label: "Liên hệ chung" },
] as const;

export default function LeadsListPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dbConfigured, setDbConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

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

  const handleLeadDelete = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleLeadDeleteMany = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setLeads((prev) => prev.filter((l) => !idSet.has(l.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.delete(id);
      return next;
    });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
  const selectedCount = selectedIds.size;

  const handleBulkDelete = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setBulkDeleting(true);
    try {
      await deleteLeads(ids);
      handleLeadDeleteMany(ids);
      notifyLeadsUpdated();
      toast(`Đã xóa ${ids.length} lead`);
      setBulkDeleteOpen(false);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không thể xóa lead");
    } finally {
      setBulkDeleting(false);
    }
  };

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
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelectVisible={(ids) =>
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  for (const id of ids) next.add(id);
                  return next;
                })
              }
              onClearVisible={(ids) =>
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  for (const id of ids) next.delete(id);
                  return next;
                })
              }
              onLeadUpdate={handleLeadUpdate}
              onLeadDelete={handleLeadDelete}
              onRequestBulkDelete={() => setBulkDeleteOpen(true)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmDialog
        open={bulkDeleteOpen}
        title={`Xóa ${selectedCount} lead đã chọn?`}
        description="Các lead này sẽ bị xóa khỏi database và không thể khôi phục."
        confirmLabel={`Xóa ${selectedCount} lead`}
        destructive
        loading={bulkDeleting}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={() => void handleBulkDelete()}
      />
    </div>
  );
}

function LeadsTable({
  leads,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedIds,
  onToggleSelect,
  onSelectVisible,
  onClearVisible,
  onLeadUpdate,
  onLeadDelete,
  onRequestBulkDelete,
}: {
  leads: Lead[];
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: LeadStatus | "all";
  onStatusFilterChange: (v: LeadStatus | "all") => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectVisible: (ids: string[]) => void;
  onClearVisible: (ids: string[]) => void;
  onLeadUpdate: (id: string, patch: Partial<Lead>) => void;
  onLeadDelete: (id: string) => void;
  onRequestBulkDelete: () => void;
}) {
  const visibleIds = leads.map((l) => l.id);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.has(id)).length;
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const selectedCount = selectedIds.size;

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

      {leads.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
              checked={allVisibleSelected}
              ref={(el) => {
                if (el) {
                  el.indeterminate = selectedVisibleCount > 0 && !allVisibleSelected;
                }
              }}
              onChange={() => {
                if (allVisibleSelected) onClearVisible(visibleIds);
                else onSelectVisible(visibleIds);
              }}
            />
            {allVisibleSelected ? "Bỏ chọn trang này" : "Chọn trang này"}
          </label>
          {selectedCount > 0 ? (
            <>
              <span className="text-sm text-zinc-500">
                Đã chọn <strong className="text-zinc-800">{selectedCount}</strong>
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={onRequestBulkDelete}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Xóa đã chọn
              </Button>
              <button
                type="button"
                className="text-sm text-zinc-500 hover:text-zinc-800 hover:underline"
                onClick={() => onClearVisible([...selectedIds])}
              >
                Bỏ chọn tất cả
              </button>
            </>
          ) : null}
        </div>
      ) : null}

      {leads.length === 0 ? (
        <Card>
          <p className="p-8 text-center text-sm text-zinc-500">Không có lead phù hợp.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              selected={selectedIds.has(lead.id)}
              onToggleSelect={onToggleSelect}
              onUpdate={onLeadUpdate}
              onDelete={onLeadDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  selected,
  onToggleSelect,
  onUpdate,
  onDelete,
}: {
  lead: Lead;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Lead>) => void;
  onDelete: (id: string) => void;
}) {
  const { toast } = useToast();
  const [note, setNote] = useState(lead.message ?? "");
  const [noteOpen, setNoteOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(lead.id);
      onDelete(lead.id);
      notifyLeadsUpdated();
      toast("Đã xóa lead");
      setDeleteOpen(false);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không thể xóa lead");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className={`flex h-full flex-col ${selected ? "ring-2 ring-red-500 ring-offset-1" : ""}`}
    >
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-red-600 focus:ring-red-500"
            checked={selected}
            onChange={() => onToggleSelect(lead.id)}
            aria-label={`Chọn lead ${lead.fullName}`}
          />
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
        </div>
        <Badge variant={getLeadStatusVariant(lead.status)} className="shrink-0">
          {getLeadStatusLabel(lead.status)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 text-sm">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <Badge variant="outline">{getLeadBadgeLabel(lead)}</Badge>
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
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            disabled={deleting}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            title="Xóa lead"
          >
            <Trash2 className="h-4 w-4" />
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

      <ConfirmDialog
        open={deleteOpen}
        title={`Xóa lead "${lead.fullName}"?`}
        description="Lead sẽ bị xóa khỏi database và không thể khôi phục."
        bullets={[`SĐT: ${lead.phone}`, getLeadBadgeLabel(lead)]}
        confirmLabel="Xóa lead"
        destructive
        loading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </Card>
  );
}
