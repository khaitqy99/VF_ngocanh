"use client";

/**
 * Site marketing VinFast — luôn chạy animation đầy đủ, kể cả khi OS bật "Giảm chuyển động".
 * Lớp motion-safe (animate luôn về visible + in-view fallback) vẫn giữ để không kẹt ẩn trên Zalo/WebView.
 */
export function useReducedMotion() {
  return false;
}
