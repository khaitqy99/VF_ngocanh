import { ProductCreateClient } from "@/components/admin/ProductCreateClient";

export default function AdminNewCarPage() {
  return (
    <ProductCreateClient
      productKind="car"
      listHref="/admin/cars"
      listLabel="Ô tô"
      title="Thêm ô tô mới"
      description="Sao chép cấu trúc từ xe có sẵn. Sản phẩm tạo ở trạng thái nháp — upload ảnh mới trước khi xuất bản."
    />
  );
}
