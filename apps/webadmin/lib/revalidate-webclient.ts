type RevalidatePayload = {
  tags?: string[];
  paths?: string[];
};

export async function revalidateWebclient(payload: RevalidatePayload) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!siteUrl || !secret) {
    console.warn("[revalidate] Thiếu NEXT_PUBLIC_SITE_URL hoặc REVALIDATION_SECRET — bỏ qua cache invalidation");
    return false;
  }

  try {
    const response = await fetch(`${siteUrl.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[revalidate] Thất bại (${response.status}):`, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[revalidate] Lỗi khi gọi webclient:", error);
    return false;
  }
}

export function vehicleRevalidatePayload(
  id: string,
  vehicleType: "car" | "scooter",
): RevalidatePayload {
  const tags = ["cms", vehicleType === "car" ? "cms-cars" : "cms-scooters", `vehicle-${id}`];
  const paths =
    vehicleType === "car"
      ? [`/oto/${id}`, "/oto", "/oto/preview", "/"]
      : [`/xe-may-dien/${id}`, "/xe-may-dien", "/xe-may-dien/preview", "/"];

  return { tags, paths };
}

export function accessoryRevalidatePayload(id: string): RevalidatePayload {
  return {
    tags: ["cms", "cms-accessories"],
    paths: [`/phu-kien/${id}`, "/phu-kien", "/phu-kien/preview", "/"],
  };
}
