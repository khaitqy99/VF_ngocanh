import { ProductCreateClient } from "@/components/admin/ProductCreateClient";

export default function AdminNewAccessoryPage() {
  return (
    <ProductCreateClient
      productKind="accessory"
      listHref="/admin/accessories"
      listLabel="Phụ kiện"
      title="Thêm phụ kiện mới"
      description="Sao chép cấu trúc từ phụ kiện có sẵn. Sản phẩm tạo ở trạng thái nháp — upload ảnh mới trước khi xuất bản."
    />
  );
}
