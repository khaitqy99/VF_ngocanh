"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Wrench,
  Shield,
  Truck,
  Package,
  Stethoscope,
  Clock,
  Check,
  ChevronRight,
  ChevronDown,
  Phone,
  Calendar,
  MapPin,
  Users,
  Cpu,
  Award,
  Car,
  Bike,
  Battery,
} from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IMAGES } from "@/lib/images";

const STATS = [
  { icon: MapPin, value: "63+", label: "Tỉnh thành phủ sóng dịch vụ" },
  { icon: Users, value: "500+", label: "Kỹ thuật viên được đào tạo chuẩn VinFast" },
  { icon: Clock, value: "24/7", label: "Cứu hộ & hỗ trợ khách hàng" },
] as const;

const SERVICES = [
  {
    icon: Wrench,
    title: "Bảo dưỡng định kỳ",
    desc: "Thực hiện theo lịch bảo dưỡng chính hãng, đảm bảo xe vận hành ổn định, an toàn và tiết kiệm năng lượng.",
    items: [
      "Kiểm tra tổng thể",
      "Thay dầu & lọc",
      "Kiểm tra hệ thống phanh",
      "Cập nhật phần mềm FOTA",
    ],
  },
  {
    icon: Stethoscope,
    title: "Sửa chữa chính hãng",
    desc: "Xưởng dịch vụ đạt chuẩn VinFast với trang thiết bị hiện đại, chẩn đoán chính xác và sửa chữa nhanh chóng.",
    items: ["Chẩn đoán điện tử", "Sửa thân vỏ & sơn", "Hệ thống điện & pin", "Hệ thống treo & lái"],
  },
  {
    icon: Shield,
    title: "Bảo hành xe",
    desc: "Chính sách bảo hành toàn diện cho ô tô và xe máy điện VinFast, minh bạch và rõ ràng theo tiêu chuẩn hãng.",
    items: [
      "Bảo hành lên tới 10 năm",
      "Bảo hành pin riêng biệt",
      "Miễn phí bảo dưỡng định kỳ",
      "Hỗ trợ xử lý nhanh",
    ],
  },
  {
    icon: Truck,
    title: "Cứu hộ 24/7",
    desc: "Đội ngũ cứu hộ VinFast sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi trên toàn quốc khi gặp sự cố.",
    items: [
      "Hotline cứu hộ 24/7",
      "Kéo xe miễn phí (theo chính sách)",
      "Hỗ trợ tại hiện trường",
      "Xe thay thế (nếu có)",
    ],
  },
  {
    icon: Package,
    title: "Phụ tùng chính hãng",
    desc: "100% phụ tùng chính hãng VinFast, đảm bảo chất lượng, độ bền và tương thích hoàn hảo với xe của bạn.",
    items: ["Linh kiện chính hãng", "Bảo hành phụ tùng", "Tồn kho đa dạng", "Giá minh bạch"],
  },
  {
    icon: Cpu,
    title: "Cập nhật phần mềm FOTA",
    desc: "Cập nhật phần mềm không dây (FOTA) giúp xe luôn được nâng cấp tính năng mới, cải thiện hiệu suất vận hành.",
    items: ["Cập nhật từ xa", "Nâng cấp ADAS", "Tối ưu pin & tiêu thụ", "Hỗ trợ tại xưởng dịch vụ"],
  },
] as const;

const WARRANTY_POLICIES = [
  {
    icon: Car,
    title: "Ô tô điện VinFast",
    highlight: "Lên tới 10 năm",
    items: [
      "Bảo hành xe: 10 năm hoặc 200.000 km (tùy điều kiện nào đến trước)",
      "Bảo hành pin: 8 năm không giới hạn km",
      "Miễn phí bảo dưỡng định kỳ trong thời gian bảo hành",
      "Hỗ trợ cứu hộ 24/7 trên toàn quốc",
    ],
  },
  {
    icon: Bike,
    title: "Xe máy điện VinFast",
    highlight: "Lên tới 3 năm",
    items: [
      "Bảo hành xe: 3 năm hoặc 50.000 km",
      "Bảo hành pin: 3 năm",
      "Bảo hành ắc quy phụ trợ theo chính sách hãng",
      "Hỗ trợ kỹ thuật tại hệ thống đại lý ủy quyền",
    ],
  },
  {
    icon: Battery,
    title: "Pin & ắc quy",
    highlight: "Chính sách riêng",
    items: [
      "Bảo hành pin theo từng dòng sản phẩm",
      "Kiểm tra sức khỏe pin định kỳ",
      "Chính sách thay thế pin minh bạch",
      "Tư vấn bảo quản pin tại nhà",
    ],
  },
] as const;

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Đặt lịch hẹn",
    desc: "Đặt lịch trực tuyến, qua hotline hoặc tại showroom VF Ngọc Anh.",
  },
  {
    step: "02",
    title: "Tiếp nhận xe",
    desc: "Kỹ thuật viên tiếp nhận, ghi nhận yêu cầu và tình trạng xe ban đầu.",
  },
  {
    step: "03",
    title: "Kiểm tra & báo giá",
    desc: "Chẩn đoán chi tiết, báo giá minh bạch trước khi thực hiện dịch vụ.",
  },
  {
    step: "04",
    title: "Thực hiện dịch vụ",
    desc: "Bảo dưỡng/sửa chữa theo quy trình chuẩn VinFast với phụ tùng chính hãng.",
  },
  {
    step: "05",
    title: "Nghiệm thu & bàn giao",
    desc: "Kiểm tra chất lượng, vệ sinh xe và bàn giao cùng phiếu bảo dưỡng chi tiết.",
  },
] as const;

const MAINTENANCE_INTERVALS = [
  {
    type: "Ô tô điện",
    intervals: ["5.000 km / 6 tháng", "10.000 km / 12 tháng", "20.000 km / 24 tháng"],
  },
  {
    type: "Xe máy điện",
    intervals: ["1.000 km / 3 tháng", "3.000 km / 6 tháng", "6.000 km / 12 tháng"],
  },
] as const;

const WHY_CHOOSE = [
  {
    icon: Award,
    title: "Xưởng dịch vụ chuẩn VinFast",
    desc: "Trang thiết bị hiện đại, quy trình bảo dưỡng theo tiêu chuẩn toàn cầu của VinFast.",
  },
  {
    icon: Users,
    title: "Kỹ thuật viên chuyên nghiệp",
    desc: "Đội ngũ được đào tạo bài bản, chứng nhận trực tiếp từ VinFast.",
  },
  {
    icon: Package,
    title: "Phụ tùng chính hãng 100%",
    desc: "Cam kết linh kiện chính hãng, có tem bảo hành và nguồn gốc rõ ràng.",
  },
  {
    icon: Shield,
    title: "Báo giá minh bạch",
    desc: "Thông báo chi phí trước khi thực hiện, không phát sinh ngoài thỏa thuận.",
  },
] as const;

const FAQS = [
  {
    q: "Tôi có thể đặt lịch bảo dưỡng ở đâu?",
    a: "Quý khách có thể đặt lịch trực tuyến trên website VinFast, gọi hotline 1900 2323 89 hoặc liên hệ trực tiếp showroom VF Ngọc Anh. Chúng tôi sẽ sắp xếp thời gian phù hợp nhất.",
  },
  {
    q: "Bảo dưỡng định kỳ mất bao lâu?",
    a: "Thời gian bảo dưỡng định kỳ thông thường từ 1–3 giờ tùy loại dịch vụ. Với các hạng mục phức tạp hơn, xưởng sẽ thông báo thời gian dự kiến cụ thể khi tiếp nhận xe.",
  },
  {
    q: "Xe điện có cần bảo dưỡng nhiều hơn xe xăng không?",
    a: "Ngược lại, xe điện VinFast có ít hạng mục cần bảo dưỡng hơn xe xăng (không cần thay dầu động cơ, bugi...). Tuy nhiên, kiểm tra pin, hệ thống phanh tái tạo và phần mềm vẫn rất quan trọng.",
  },
  {
    q: "Tôi có được xe thay thế khi sửa chữa lâu không?",
    a: "Chính sách xe thay thế áp dụng theo quy định của VinFast và tình trạng sửa chữa. Vui lòng liên hệ bộ phận dịch vụ VF Ngọc Anh để được tư vấn cụ thể.",
  },
  {
    q: "Sửa chữa ngoài đại lý ủy quyền có ảnh hưởng bảo hành không?",
    a: "Việc sửa chữa tại cơ sở không được ủy quyền có thể ảnh hưởng đến quyền lợi bảo hành nếu gây hư hỏng do lỗi sửa chữa. Quý khách nên mang xe đến xưởng dịch vụ chính hãng để đảm bảo quyền lợi.",
  },
  {
    q: "Làm sao để kiểm tra lịch sử bảo dưỡng của xe?",
    a: "Lịch sử bảo dưỡng được lưu trên hệ thống VinFast. Quý khách có thể yêu cầu tại xưởng dịch vụ hoặc tra cứu qua ứng dụng VinFast (nếu đã liên kết tài khoản).",
  },
] as const;

export default function AfterSalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BreadcrumbBar />
        <HeroSection />
        <ServicesSection />
        <WarrantySection />
        <ProcessSection />
        <MaintenanceSection />
        <WhyChooseSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function BreadcrumbBar() {
  return (
    <div className="border-b border-border/40 bg-white">
      <div className="container-vf py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-xs text-muted-foreground hover:text-brand">
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-foreground">
                Dịch vụ hậu mãi
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold tracking-[0.15em] text-[#0057ff] uppercase">
              Dịch vụ hậu mãi
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-[2.75rem]">
              CHĂM SÓC XE
              <span className="block mt-1 italic text-[#0057ff]">TOÀN DIỆN &</span>
              <span className="block mt-1 italic text-[#0057ff]">CHUYÊN NGHIỆP</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              VF Ngọc Anh cung cấp hệ thống dịch vụ hậu mãi chuẩn VinFast — từ bảo dưỡng định kỳ,
              sửa chữa chính hãng đến cứu hộ 24/7. Cam kết đồng hành cùng quý khách trong suốt vòng
              đời sản phẩm.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://vinfastauto.com/vn_vi/dat-lich-dich-vu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#0057ff] px-6 py-3 text-xs font-bold tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-600 hover:scale-105 uppercase"
              >
                <Calendar className="size-4" />
                Đặt lịch bảo dưỡng
              </a>
              <a
                href="tel:1900232389"
                className="inline-flex items-center gap-2 rounded-md border border-brand bg-white px-6 py-3 text-xs font-bold tracking-wider text-brand transition-all duration-300 hover:bg-brand/5 uppercase"
              >
                <Phone className="size-4" />
                Hotline 1900 2323 89
              </a>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-start gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                    <Icon className="size-5.5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#0057ff]">{value}</p>
                    <p className="text-[11px] leading-snug text-muted-foreground font-medium mt-0.5">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-end">
            <div className="overflow-hidden rounded-2xl shadow-card w-full lg:max-w-[540px]">
              <img
                src={IMAGES.showroom}
                alt="Xưởng dịch vụ VF Ngọc Anh"
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            DỊCH VỤ HẬU MÃI TOÀN DIỆN
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
          <p className="mt-4 max-w-2xl text-center text-sm text-muted-foreground font-medium">
            Đa dạng dịch vụ chính hãng, đáp ứng mọi nhu cầu bảo dưỡng và sửa chữa xe điện VinFast
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, items }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-border/40 bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1"
            >
              <div className="flex size-12 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                <Icon className="size-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-sm font-black tracking-wide text-brand-dark uppercase">
                {title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground font-medium">
                {desc}
              </p>
              <ul className="mt-5 space-y-2 flex-1">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
                  >
                    <Check size={13} className="shrink-0 text-[#0057ff]" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WarrantySection() {
  return (
    <section className="bg-white py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            CHÍNH SÁCH BẢO HÀNH
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
          <p className="mt-4 max-w-2xl text-center text-sm text-muted-foreground font-medium">
            Quyền lợi bảo hành rõ ràng, minh bạch theo tiêu chuẩn VinFast
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {WARRANTY_POLICIES.map(({ icon: Icon, title, highlight, items }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-border/40 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                  <Icon className="size-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-brand-dark">{title}</h3>
                  <p className="text-xs font-bold text-[#0057ff] mt-0.5">{highlight}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground font-medium"
                  >
                    <Check size={14} className="shrink-0 mt-0.5 text-[#0057ff]" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-muted-foreground font-medium">
          * Chính sách bảo hành chi tiết có thể thay đổi theo từng dòng sản phẩm. Vui lòng liên hệ
          VF Ngọc Anh hoặc tham khảo{" "}
          <a
            href="https://vinfastauto.com/vn_vi/dich-vu-hau-mai/bao-hanh-va-bao-duong"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            chính sách chính thức của VinFast
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="bg-surface py-14 md:py-16 lg:py-20 overflow-hidden">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            QUY TRÌNH DỊCH VỤ
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
          <p className="mt-4 max-w-2xl text-center text-sm text-muted-foreground font-medium">
            5 bước đơn giản — trải nghiệm dịch vụ chuyên nghiệp, minh bạch
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-[22px] right-8 left-8 hidden h-[2px] bg-gray-200 lg:block" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex size-11 items-center justify-center rounded-full border-2 border-[#0057ff] bg-white">
                  <span className="text-xs font-black text-[#0057ff]">{step}</span>
                </div>
                <div className="w-full rounded-2xl border border-border/40 bg-white p-5 shadow-soft h-full transition-shadow duration-300 hover:shadow-md">
                  <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground font-medium">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MaintenanceSection() {
  return (
    <section className="bg-white py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl shadow-card">
            <img
              src={IMAGES.community}
              alt="Bảo dưỡng xe VinFast"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
              LỊCH BẢO DƯỠNG ĐỊNH KỲ
            </h2>
            <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-medium">
              Tuân thủ lịch bảo dưỡng định kỳ giúp xe vận hành ổn định, kéo dài tuổi thọ pin và duy
              trì quyền lợi bảo hành.
            </p>

            <div className="mt-8 space-y-6">
              {MAINTENANCE_INTERVALS.map(({ type, intervals }) => (
                <div key={type} className="rounded-xl border border-border/40 bg-surface p-5">
                  <h3 className="text-sm font-bold text-brand-dark">{type}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {intervals.map((interval) => (
                      <li
                        key={interval}
                        className="rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 px-3.5 py-1.5 text-[11px] font-semibold text-[#0057ff]"
                      >
                        {interval}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-amber-200/60 bg-amber-50/50 p-4">
              <p className="text-xs leading-relaxed text-amber-900/80 font-medium">
                <strong className="font-bold">Lưu ý:</strong> Lịch bảo dưỡng có thể khác nhau tùy
                model xe. Quý khách vui lòng tham khảo sổ bảo hành hoặc liên hệ xưởng dịch vụ VF
                Ngọc Anh để được tư vấn lịch phù hợp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            VÌ SAO CHỌN DỊCH VỤ TẠI VF NGỌC ANH?
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ul className="space-y-6 order-2 lg:order-1">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-4 items-start">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-medium">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white aspect-[4/3] w-full border border-border/40 shadow-soft order-1 lg:order-2">
            <div
              className="absolute inset-0 bg-[#0057ff]"
              style={{ clipPath: "polygon(68% 0, 100% 0, 100% 100%, 45% 100%)" }}
            />
            <img
              src={IMAGES.chargingStations}
              alt="Hệ thống dịch vụ VinFast"
              className="relative z-10 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-14 md:py-16 lg:py-20">
      <div className="container-vf max-w-3xl">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            CÂU HỎI THƯỜNG GẶP
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={q}
                className="rounded-xl border border-border/40 bg-white overflow-hidden shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-brand-dark">{q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-[#0057ff] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/40 px-5 py-4">
                    <p className="text-xs leading-relaxed text-muted-foreground font-medium">{a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#071330] py-14 md:py-16 lg:py-20">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.heroBanner})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071330] via-[#071330]/90 to-[#071330]/40" />

      <div className="container-vf relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="text-white lg:col-span-7">
            <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl uppercase">
              CẦN HỖ TRỢ
              <span className="block mt-1 text-[#0057ff]">DỊCH VỤ HẬU MÃI?</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300 font-medium">
              Đặt lịch bảo dưỡng ngay hôm nay hoặc liên hệ hotline để được tư vấn và hỗ trợ nhanh
              chóng. VF Ngọc Anh luôn sẵn sàng đồng hành cùng quý khách.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://vinfastauto.com/vn_vi/dat-lich-dich-vu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#0057ff] px-8 py-3.5 text-xs font-bold tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-600/30 hover:scale-105 uppercase"
              >
                Đặt lịch bảo dưỡng
                <ChevronRight className="size-4" />
              </a>
              <Link
                href="/gioi-thieu"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-8 py-3.5 text-xs font-bold tracking-wider text-white transition-all duration-300 hover:bg-white/10 uppercase"
              >
                Liên hệ showroom
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-[#0057ff]" />
                Số 123 Nguyễn Văn Linh, Long Biên, Hà Nội
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-4 text-[#0057ff]" />
                1900 2323 89
              </span>
            </div>
          </div>
          <div className="hidden justify-end lg:flex lg:col-span-5">
            <img
              src={IMAGES.vf9Suv}
              alt="VinFast VF 9"
              className="max-h-[240px] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
