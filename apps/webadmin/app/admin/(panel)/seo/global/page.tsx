import { redirect } from "next/navigation";

export default function GlobalSeoPage() {
  redirect("/admin/seo?tab=global");
}
