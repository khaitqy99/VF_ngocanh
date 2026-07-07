"use client";

import {
  adminFormImageBtn,
  adminFormInput,
  adminFormLabel,
  adminFormTextarea,
} from "@/components/admin-edit/admin-form-styles";
import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";

export function HomeEditField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className={adminFormLabel}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`mt-1 ${adminFormTextarea}`}
          rows={3}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`mt-1 ${adminFormInput}`}
        />
      )}
    </div>
  );
}

export function HomeEditImageField({
  label,
  value,
  imagePath,
  onChange,
}: {
  label: string;
  value: string;
  imagePath: string;
  onChange: (value: string) => void;
}) {
  const edit = useHomeAdminEdit();

  return (
    <div>
      <label className={adminFormLabel}>{label}</label>
      <div className="relative mt-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {value ? (
          <img src={value} alt="" className="aspect-[16/9] w-full object-cover" />
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center text-xs text-slate-400">
            Chưa có ảnh
          </div>
        )}
        <button
          type="button"
          onClick={() => edit?.requestImage(imagePath)}
          className={adminFormImageBtn}
        >
          Đổi ảnh
        </button>
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 ${adminFormInput} font-mono text-xs`}
        placeholder="/images/..."
      />
    </div>
  );
}

export function HomeEditSectionShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-4 backdrop-blur-sm">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-brand">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
