import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Image from "next/image"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link", size?: "default" | "sm" | "lg" | "icon" }>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      outline: "border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900",
      ghost: "hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
      link: "text-zinc-900 underline-offset-4 hover:underline",
    }
    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    }
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm", className)} {...props} />
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-zinc-500", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
}

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }) {
  const variants = {
    default: "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80",
    secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
    destructive: "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80",
    outline: "text-zinc-950",
    success: "border-transparent bg-emerald-100 text-emerald-800",
    warning: "border-transparent bg-amber-100 text-amber-800",
  }
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2", variants[variant], className)} {...props} />
  )
}

export function Avatar({ className, src, fallback }: { className?: string; src?: string; fallback: string }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-100", className)}>
      {src ? <Image src={src} alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" /> : null}
      {!src && <div className="flex h-full w-full items-center justify-center font-medium text-zinc-600">{fallback}</div>}
    </div>
  )
}

export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" ref={ref} {...props} />
      <div className={cn("w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600", className)}></div>
    </label>
  )
)
Switch.displayName = "Switch"

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"
