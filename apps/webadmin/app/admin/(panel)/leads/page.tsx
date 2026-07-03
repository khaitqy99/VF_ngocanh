"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Input, Badge, Card, Button } from "@/components/ui/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/complex";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  fetchLeads,
  MOCK_LEADS,
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
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [dbConfigured, setDbConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads()
      .then((data) => {
        if (data.configured && data.leads.length >= 0) {
          setLeads(data.leads);
          setDbConfigured(true);
        }
      })
      .catch(() => {
        setLeads(MOCK_LEADS);
      })
      .finally(() => setLoading(false));
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
          loading ? " (đang tải...)" : dbConfigured ? "" : " (demo — chưa kết nối DB)"
        }`}
      />

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
}: {
  leads: Lead[];
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: LeadStatus | "all";
  onStatusFilterChange: (v: LeadStatus | "all") => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center bg-zinc-50/50 rounded-t-xl">
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
        <p className="p-8 text-center text-sm text-zinc-500">Không có lead phù hợp.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Loại lead</TableHead>
              <TableHead>Quan tâm</TableHead>
              <TableHead>Nguồn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-zinc-50">
                <TableCell>
                  <div className="font-medium text-zinc-900">{lead.fullName}</div>
                  <div className="text-xs text-zinc-500">{lead.phone}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getLeadTypeLabel(lead.type)}</Badge>
                </TableCell>
                <TableCell className="max-w-[140px] truncate text-zinc-600">
                  {lead.vehicleInterest ?? "—"}
                </TableCell>
                <TableCell className="text-zinc-500">{getLeadSourceLabel(lead.source)}</TableCell>
                <TableCell>
                  <Badge variant={getLeadStatusVariant(lead.status)}>
                    {getLeadStatusLabel(lead.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                  {formatLeadDate(lead.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Xem
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
