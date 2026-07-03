import * as React from "react"
import { cn } from "./core"

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-zinc-200 transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100", className)} {...props} />
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("h-10 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0", className)} {...props} />
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
}

export function Tabs({ defaultValue, className, children }: { defaultValue: string, className?: string, children: React.ReactNode }) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  return (
    <div className={cn("flex flex-col", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any)
        }
        return child
      })}
    </div>
  )
}

export function TabsList({ className, children, activeTab, setActiveTab }: any) {
  return (
    <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any)
        }
        return child
      })}
    </div>
  )
}

export function TabsTrigger({ className, value, children, activeTab, setActiveTab }: any) {
  const isActive = activeTab === value
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-zinc-950 shadow" : "hover:text-zinc-900",
        className
      )}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ className, value, children, activeTab }: any) {
  if (activeTab !== value) return null
  return (
    <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  )
}
