import { Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

function Logo() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brand-dark">
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <path
          d="M6 24 L16 6 L26 24 Z"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M11 24 L21 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-footer pt-14 pb-8">
      <div className="container-vf grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-2.5">
            <Logo />
            <span className="font-black tracking-tight text-brand-dark">VF NGỌC ANH</span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Đại lý ủy quyền chính thức của VinFast. Mang đến trải nghiệm xe điện thông minh, thân
            thiện và dịch vụ tận tâm.
          </p>
          <div className="flex items-center gap-3 text-brand-dark">
            <a href="#" aria-label="Facebook" className="hover:text-brand">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Youtube" className="hover:text-brand">
              <Youtube size={18} />
            </a>
            <a href="#" aria-label="Tiktok" className="text-[13px] font-bold hover:text-brand">
              TikTok
            </a>
          </div>
        </div>
        <FCol
          title="SẢN PHẨM"
          items={["VF 3", "VF 5", "VF 6", "VF 7", "VF 8", "VF e34", "Xe máy điện"]}
        />
        <FCol
          title="DỊCH VỤ"
          items={["Đăng ký lái thử", "Bảo dưỡng - Sửa chữa", "Bảo hành", "Dịch vụ khác"]}
        />
        <FCol title="VỀ CHÚNG TÔI" items={["Giới thiệu", "Tin tức", "Tuyển dụng", "Liên hệ"]} />
        <div>
          <h4 className="mb-4 text-[13px] font-bold tracking-wider text-brand-dark">LIÊN HỆ</h4>
          <ul className="space-y-3 text-xs text-foreground/80">
            <li className="flex gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-brand" />
              Số 123 Nguyễn Văn Linh, Long Biên, Hà Nội
            </li>
            <li className="flex gap-2">
              <Phone size={14} className="mt-0.5 shrink-0 text-brand" />
              1900 2323 89
            </li>
            <li className="flex gap-2">
              <Mail size={14} className="mt-0.5 shrink-0 text-brand" />
              ngocanh@vinfast.vn
            </li>
          </ul>
        </div>
      </div>
      <div className="container-vf mt-10 border-t border-border/60 pt-6 text-center text-[11px] text-muted-foreground">
        © 2026 VF Ngọc Anh. All rights reserved.
      </div>
    </footer>
  );
}

function FCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 text-[13px] font-bold tracking-wider text-brand-dark">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="text-xs text-foreground/80 hover:text-brand">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
