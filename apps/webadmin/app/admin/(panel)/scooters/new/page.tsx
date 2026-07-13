import { ProductCreateClient } from "@/components/admin/ProductCreateClient";

export default function AdminNewScooterPage() {
  return (
    <ProductCreateClient
      productKind="scooter"
      listHref="/admin/scooters"
      listLabel="Xe máy"
      title="Thêm xe máy mới"
      description="Sao chép cấu trúc từ xe có sẵn. Sản phẩm tạo ở trạng thái nháp — upload ảnh mới trước khi xuất bản."
    />
  );
}
