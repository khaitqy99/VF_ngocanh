import type { CreateLeadInput, LeadSource, LeadType } from "@vinfast3s/supabase/leads";

export type SubmitLeadInput = CreateLeadInput & {
  service?: string;
};

export class SubmitLeadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubmitLeadError";
  }
}

/** Gửi lead từ form public → POST /api/leads */
export async function submitLead(input: SubmitLeadInput): Promise<string> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      type: input.type,
      service: input.service,
      vehicleInterest: input.vehicleInterest,
      source: input.source ?? ("website" satisfies LeadSource),
      message: input.message,
    }),
  });

  const data = (await response.json().catch(() => null)) as { error?: string; id?: string } | null;
  if (!response.ok) {
    throw new SubmitLeadError(data?.error ?? "Gửi thất bại. Vui lòng thử lại.");
  }

  return data?.id ?? "";
}

/** Ghép các trường form thành message cho admin đọc nhanh. */
export function formatLeadMessage(parts: Record<string, string | undefined | null>): string {
  return Object.entries(parts)
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
    .join("\n");
}

export type { LeadType };
