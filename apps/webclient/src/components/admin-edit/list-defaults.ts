export const DEFAULT_FEATURE_CARD = (fallbackImage: string) => ({
  title: "Điểm nhấn mới",
  desc: "Mô tả ngắn cho mục này...",
  image: fallbackImage,
});

export const DEFAULT_TECH_ITEM = () => ({
  icon: "app" as const,
  title: "Tính năng mới",
  desc: "Mô tả tính năng...",
});

export const DEFAULT_REVIEW = () => ({
  name: "Khách hàng",
  variant: "Phiên bản",
  date: "2025",
  rating: 5,
  content: "Nội dung đánh giá...",
});

export const DEFAULT_SPEC_ITEM = () => ({ label: "Thông số", value: "Giá trị" });

export const DEFAULT_SPEC_GROUP = () => ({
  category: "Nhóm thông số mới",
  items: [{ label: "Thông số", value: "Giá trị" }],
});

export const DEFAULT_DRIVE_MODE = () => ({ name: "Chế độ mới", desc: "Mô tả chế độ lái..." });

export const DEFAULT_COLOR = (fallbackImage?: string) => ({
  id: `color-${Date.now()}`,
  name: "Màu mới",
  hex: "#94a3b8",
  ...(fallbackImage ? { image: fallbackImage } : {}),
});

export const DEFAULT_GALLERY_IMAGE = (fallback: string) => fallback;
