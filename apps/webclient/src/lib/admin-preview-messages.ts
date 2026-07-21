type MediaCategory = "cars" | "scooters" | "accessories" | "news";

type AdminImageMessage = {
  path: string;
  category: MediaCategory;
  slug: string;
  productId?: string;
  kind?: "image" | "svg";
};

function canPostToAdmin(): boolean {
  return typeof window !== "undefined" && window.parent !== window;
}

export function postAdminPickImage(payload: AdminImageMessage) {
  if (!canPostToAdmin()) return false;
  window.parent.postMessage({ type: "vf-admin-pick-image", ...payload }, "*");
  return true;
}

export function postAdminUploadImage(payload: AdminImageMessage) {
  if (!canPostToAdmin()) return false;
  window.parent.postMessage({ type: "vf-admin-upload-image", ...payload }, "*");
  return true;
}
