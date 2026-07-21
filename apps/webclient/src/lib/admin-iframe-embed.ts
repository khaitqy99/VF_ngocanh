/** Preview chạy trong iframe của webadmin (ProductDetailLiveEditor, v.v.) */
export function isAdminIframeEmbed(): boolean {
  return typeof window !== "undefined" && window.parent !== window;
}

export function postAdminUnsavedChanges(hasUnsavedChanges: boolean) {
  if (!isAdminIframeEmbed()) return;
  window.parent.postMessage({ type: "vf-admin-unsaved-changes", hasUnsavedChanges }, "*");
}
