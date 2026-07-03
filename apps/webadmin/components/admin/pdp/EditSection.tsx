import { cn, Card, CardContent } from "@/components/ui/core";

export function EditSection({
  id,
  title,
  subtitle,
  alt,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`edit-${id}`}
      className={cn("scroll-mt-32 border-b border-zinc-200 py-8", alt && "bg-zinc-50/60 -mx-4 px-4 sm:-mx-6 sm:px-6")}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function EditField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-900">{label}</label>
      {children}
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export function EditCardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
