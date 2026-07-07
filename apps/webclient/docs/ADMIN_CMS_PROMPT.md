# PROMPT: Thiết kế UX/UI Web Admin CMS — VinFast Ngọc Anh Cà Mau

> **Phạm vi:** Chỉ tạo **giao diện UX/UI** (frontend prototype). Không làm backend, database, API, auth thật, upload thật.
>
> **Cách dùng:** Copy toàn bộ nội dung trong khối `PROMPT` bên dưới.

---

## PROMPT (bắt đầu copy từ đây)

---

Bạn là senior UI/UX developer chuyên **shadcn/ui**. Hãy thiết kế và code **toàn bộ giao diện Web Admin CMS** cho website đại lý VinFast **VinFast Ngọc Anh Cà Mau** (Cà Mau), tích hợp vào dự án Next.js hiện có.

---

### ⚠️ PHẠM VI LÀM VIỆC — CHỈ UX/UI

**LÀM:**

- Layout admin, sidebar, header, routing `/admin/*`
- Tất cả trang admin với form, table, dialog, tabs…
- Mock data realistic (lấy từ `src/lib/*.ts` hiện có)
- Interactive UI: toggle, filter, sort, pagination (client-side)
- States: empty, loading skeleton, error, success toast (giả lập)
- Responsive desktop + tablet + mobile
- Dark mode toggle (optional)

**KHÔNG LÀM:**

- Supabase, database, API routes, authentication thật
- Upload ảnh lên server (chỉ UI preview local với `URL.createObjectURL`)
- Gọi API, lưu dữ liệu thật
- Middleware bảo vệ route
- Email/notification
- Script migrate, sync VinFast thật

**Submit form / Save button:** Hiện `toast.success("Đã lưu")` rồi giữ nguyên state local — đủ cho prototype.

---

### 1. BỐI CẢNH

**Website public:** VinFast Ngọc Anh Cà Mau — Đại lý VinFast 3S Cà Mau  
**Tech:** Next.js 15, React 19, TypeScript, Tailwind CSS 4  
**UI kit:** shadcn/ui style `new-york`, base `slate`, icons `lucide-react`  
**Font:** Inter (Vietnamese)  
**Config:** `components.json` đã có sẵn

**Admin quản lý nội dung cho các trang public:**

| Trang public                        | Nội dung cần quản lý         |
| ----------------------------------- | ---------------------------- |
| `/`                                 | Banner, xe nổi bật, sections |
| `/oto`, `/oto/[id]`                 | 13 ô tô + PDP                |
| `/xe-may-dien`, `/xe-may-dien/[id]` | 15 xe máy + PDP              |
| `/phu-kien`, `/phu-kien/[id]`       | 83 phụ kiện                  |
| `/gioi-thieu`                       | Stats, timeline, sứ mệnh     |
| `/dich-vu-hau-mai`                  | Dịch vụ, bảo hành, FAQ       |
| `/pin-va-tram-sac`                  | Sản phẩm sạc, FAQ            |
| `/luu-tru-nang-luong`               | Giải pháp ESS                |
| _(chưa có)_ `/tin-tuc`              | Bài viết                     |
| _(chưa có)_ `/tuyen-dung`           | Tuyển dụng                   |
| _(chưa có)_ `/lien-he`              | Liên hệ                      |

**Mock data:** Import từ `src/lib/cars.ts`, `scooters.ts`, `vinfast-accessories.ts`, `contact.ts`, `images.ts`… để UI trông realistic.

---

### 2. DESIGN SYSTEM

#### 2.1 Layout tổng thể

```
┌─────────────────────────────────────────────────────────┐
│ [≡]  Dashboard > Ô tô > VF 8          🔔  [Avatar ▾]   │  ← Header h-14, border-b
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │              Content Area                    │
│ w-64     │              p-6 max-w-7xl                 │
│          │                                              │
│ (collaps │                                              │
│ ible)    │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

- **Sidebar:** Fixed trái, `bg-sidebar`, collapsible icon-only mode
- **Mobile:** Sidebar → `Sheet` slide từ trái, hamburger trong header
- **Content:** `ScrollArea` nếu dài
- **Page header pattern:** Title (h1) + mô tả ngắn + action button bên phải ("Thêm mới")

#### 2.2 Màu sắc & Typography

- Giữ token shadcn hiện có (`--background`, `--foreground`, `--primary`…)
- Accent đại lý: dùng `--brand` từ `globals.css` nếu có, không thì `primary` slate/blue
- Title trang: `text-2xl font-semibold tracking-tight`
- Mô tả: `text-sm text-muted-foreground`
- Label form: `text-sm font-medium`
- Giá tiền: `font-mono tabular-nums`, format `999.000.000 ₫`

#### 2.3 shadcn Components — BẮT BUỘC

Dùng components có sẵn trong `src/components/ui/`. Cài thêm nếu thiếu (`sidebar`, `command`…).

| Pattern    | Components                                                                         |
| ---------- | ---------------------------------------------------------------------------------- |
| Shell      | `Sidebar`, `Sheet`, `Breadcrumb`, `Separator`, `ScrollArea`                        |
| Form       | `Form`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`, `Label` |
| Date/time  | `Calendar`, `Popover`                                                              |
| Table      | `Table`, `Pagination`, `DropdownMenu`, `Checkbox` (row select)                     |
| Feedback   | `Sonner`, `Alert`, `Badge`, `Skeleton`, `Progress`                                 |
| Overlay    | `Dialog`, `AlertDialog`, `Drawer`, `Sheet`                                         |
| Navigation | `Tabs`, `Collapsible`, `Accordion`                                                 |
| Media      | `AspectRatio`, `Avatar`                                                            |
| Charts     | `Chart` (Recharts wrapper) — dashboard                                             |
| Search     | `Command` — command palette Ctrl+K                                                 |
| Misc       | `Card`, `Tooltip`, `Toggle`, `Slider`                                              |

#### 2.4 UX Patterns chuẩn

1. **Mọi DELETE** → `AlertDialog` xác nhận: "Bạn có chắc muốn xóa [tên]? Hành động không thể hoàn tác."
2. **Save** → `Button` với loading spinner 500ms giả → `toast.success`
3. **Empty state** → Icon lớn + "Chưa có dữ liệu" + CTA "Thêm mới"
4. **Loading** → `Skeleton` rows trong table, skeleton cards dashboard
5. **Filter bar** → Hàng trên table: `Input` search + `Select` filters + nút "Xóa bộ lọc"
6. **Row actions** → `DropdownMenu` icon `MoreHorizontal`: Sửa, Xem, Ẩn, Xóa
7. **Bulk select** → Checkbox cột đầu + floating bar "Đã chọn 3 mục" + bulk actions
8. **Unsaved changes** → Badge dot đỏ trên tab hoặc text "Chưa lưu" cạnh nút Save
9. **Breadcrumb** luôn hiển thị vị trí hiện tại
10. **Ngôn ngữ UI:** 100% Tiếng Việt

---

### 3. CẤU TRÚC ROUTES & FILES

```
app/admin/
├── layout.tsx                 # Admin shell
├── page.tsx                   # Dashboard
├── login/page.tsx             # UI login (fake)
├── dealership/page.tsx
├── banners/page.tsx
├── cars/
│   ├── page.tsx               # List
│   └── [id]/page.tsx          # Edit PDP
├── scooters/
│   ├── page.tsx
│   └── [id]/page.tsx
├── accessories/page.tsx
├── homepage/page.tsx
├── about/page.tsx
├── after-sales/page.tsx
├── charging/page.tsx
├── energy-storage/page.tsx
├── leads/
│   ├── page.tsx
│   └── [id]/page.tsx
├── posts/page.tsx
├── careers/page.tsx
├── media/page.tsx
├── seo/page.tsx
├── sync/page.tsx
├── users/page.tsx
└── settings/page.tsx

src/components/admin/
├── AdminShell.tsx
├── AdminSidebar.tsx
├── AdminHeader.tsx
├── PageHeader.tsx             # title + description + action
├── DataTableToolbar.tsx       # search + filters
├── StatusBadge.tsx
├── PriceInput.tsx             # format VNĐ
├── ImageUploadZone.tsx        # drag-drop UI only
├── SortableImageList.tsx      # gallery reorder UI
├── RichTextEditor.tsx         # textarea styled hoặc Tiptap UI
├── StatsCard.tsx
├── EmptyState.tsx
└── mock/                      # mock data helpers
```

---

### 4. SIDEBAR NAVIGATION

```
[Logo VinFast Ngọc Anh Cà Mau]

📊 Tổng quan

── Nội dung ──
📍 Thông tin đại lý
🖼️ Banner & khuyến mãi

── Sản phẩm ──
🚗 Ô tô điện
🛵 Xe máy điện
🛍️ Phụ kiện

── Trang ──
🏠 Trang chủ
ℹ️ Giới thiệu
🔧 Hậu mãi
⚡ Pin & trạm sạc
🔋 Lưu trữ năng lượng

── Tương tác ──
📋 Lead                    [badge: 12]
📰 Tin tức
💼 Tuyển dụng

── Hệ thống ──
🖼️ Thư viện ảnh
🔍 SEO
🔄 Đồng bộ VinFast
👥 Người dùng
⚙️ Cài đặt

─────────────
[Avatar] Admin User
         Quản trị viên
```

- Active item: `bg-sidebar-accent text-sidebar-accent-foreground`
- Group label: `text-xs uppercase text-muted-foreground px-3 py-2`
- Lead badge: `Badge variant="destructive"` số lead mock

---

### 5. CHI TIẾT TỪNG MÀN HÌNH

---

#### 5.1 Login (`/admin/login`)

**Layout:** Centered card `max-w-sm`, logo trên cùng

**Form fields:**

- Email (`Input type="email"`)
- Mật khẩu (`Input type="password"`)
- Checkbox "Ghi nhớ đăng nhập"
- Button "Đăng nhập" full width

**UX:** Click login → `router.push('/admin')` — không validate thật

**Không có:** OAuth, forgot password backend (có thể link UI "Quên mật khẩu?" không hoạt động)

---

#### 5.2 Dashboard (`/admin`)

**Row 1 — Stats cards (grid 4 cột):**

| Card               | Icon       | Value mock | Subtext           |
| ------------------ | ---------- | ---------- | ----------------- |
| Lead mới hôm nay   | `Inbox`    | 8          | +2 so với hôm qua |
| Chưa xử lý         | `Clock`    | 12         | Cần phản hồi      |
| Banner sắp hết hạn | `Calendar` | 2          | Trong 7 ngày      |
| Hết hàng           | `PackageX` | 5          | Phụ kiện          |

**Row 2 — Charts (grid 2 cột):**

- Trái: Line chart "Lead 30 ngày gần nhất" (Recharts, mock data)
- Phải: Pie chart "Lead theo loại" (lái thử, đặt cọc, bảo dưỡng…)

**Row 3 — Tables (grid 2 cột):**

- Trái: "Lead mới nhất" — 5 rows mini table + link "Xem tất cả"
- Phải: "Hoạt động gần đây" — timeline: "Admin cập nhật banner", "Sync catalog"…

**Quick actions:** 3 `Button outline`: "Thêm banner", "Xem lead", "Đồng bộ VinFast"

---

#### 5.3 Thông tin đại lý (`/admin/dealership`)

**Layout:** `Tabs` 4 tab

**Tab "Showroom":**

```
Địa chỉ          [Input full width                    ]
Hotline showroom [Input          ] Hotline cứu hộ [Input]
Email            [Input                               ]
Giờ mở cửa
  Thứ 2 - Chủ nhật  [08:00 ▾] đến [18:00 ▾]
  [Switch] Mở cửa cả tuần
```

**Tab "Bản đồ":**

- Input URL Google Maps
- Textarea embed iframe
- Preview map placeholder (Card với aspect-video gray)

**Tab "Mạng xã hội":**

- Facebook, Youtube, Zalo, Messenger — mỗi dòng Input URL + icon

**Tab "Nút nổi & Footer":**

- List 4 floating buttons: label + `Switch` bật/tắt
- Footer link groups: nested sortable list (label + href)

**Footer trang:** `Button` "Hủy" + `Button` "Lưu thay đổi"

---

#### 5.4 Banner & Khuyến mãi (`/admin/banners`)

**Header:** "Banner & khuyến mãi" + Button "Thêm banner"

**Filter tabs:** Trang chủ | Ô tô | Xe máy | Phụ kiện | Hậu mãi | Pin & sạc

**View mode:** Grid cards (thumbnail + title + badge trạng thái) HOẶC table — toggle icon

**Table columns:**
| ☐ | Ảnh thumb | Tiêu đề | Nhóm | Trạng thái | Hiệu lực | ⋮ |

- Trạng thái: `Badge` Đang hiển thị (green) / Ẩn (gray) / Sắp diễn ra (blue)
- Hiệu lực: "01/06 – 30/06/2026"
- Drag handle `GripVertical` để sắp xếp (UI only, reorder local state)

**Dialog "Thêm/Sửa banner":**

```
Tiêu đề         [Input                    ]
Nhóm trang      [Select ▾                 ]
Ảnh desktop     [ImageUploadZone 16:9     ]
Ảnh mobile      [ImageUploadZone 9:16     ]
Alt text        [Input                    ]
Link CTA        [Input                    ]  Mở tab mới [Switch]
[Switch] Đang hiển thị
Thời gian       [Date picker] — [Date picker]
```

Buttons: Hủy | Lưu

---

#### 5.5 Ô tô điện — Danh sách (`/admin/cars`)

**Toolbar:**

- Search "Tìm theo tên…"
- Select: Segment (SUV, MPV…)
- Select: Badge (Mới, KM, Bán chạy)
- Select: Trạng thái (Hiển thị / Ẩn)

**Table:**
| ☐ | Ảnh | Tên | Giá | Segment | Badge | Hiển thị | ⋮ |

- Giá format VNĐ
- Badge: chips `Mới` `KM` `Bán chạy`
- Hiển thị: `Switch`
- Row click → `/admin/cars/[id]`

**Pagination:** 10 / 20 / 50 per page

---

#### 5.6 Ô tô điện — Chỉnh sửa (`/admin/cars/[id]`)

**Page header:**

- Breadcrumb: Ô tô > VF 8
- Title: "VF 8" + badges
- Actions: `Button outline` "Xem trang public" (link `/oto/vf8`) | `Button` "Lưu"

**Layout 2 cột:** Main (flex-1) + Sidebar sticky (w-80)

**Main — `Tabs` vertical hoặc horizontal:**

| Tab                   | Nội dung UI                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Thông tin cơ bản**  | name, subtitle, segment Select, seats Input number, image upload, Switches (Mới/KM/Bán chạy/Hiển thị) |
| **Giá & ưu đãi**      | price, batteryPurchasePrice, rentBatteryPrice — `PriceInput` components                               |
| **Biến thể**          | Inline editable table: Tên, Giá, Chi phí lăn bánh — nút "+ Thêm biến thể"                             |
| **Màu sắc**           | List rows: color picker hex + tên + ảnh thumb upload                                                  |
| **Gallery**           | `SortableImageList` grid 3-4 cột, drag reorder                                                        |
| **Nội dung PDP**      | tagline Input, slogan Input, overview Textarea/RichText                                               |
| **Tính năng**         | Repeatable cards: title, desc, image — add/remove                                                     |
| **Công nghệ**         | Table: icon Select, title, desc                                                                       |
| **Thông số kỹ thuật** | Accordion groups → mỗi group có table label/value, nút thêm dòng                                      |
| **Đánh giá**          | Table: tên, sao (5 stars click), ngày, nội dung                                                       |
| **SEO**               | meta_title, meta_description, og_image upload                                                         |

**Sidebar sticky:**

- Card preview ảnh xe
- Card "Thông tin nhanh": ID slug, ngày cập nhật mock
- Card "Phụ kiện gợi ý": multi-select combobox
- Card actions: Nhân bản, Ẩn, Xóa (đỏ)

---

#### 5.7 Xe máy điện (`/admin/scooters`)

**Giống hệt UI ô tô** — copy pattern, đổi label/icon, mock data từ `scooters.ts`

List: `/admin/scooters`  
Edit: `/admin/scooters/[id]`

---

#### 5.8 Phụ kiện (`/admin/accessories`)

**Toolbar:** Search + Select category (6 danh mục) + Switch "Chỉ hết hàng"

**Table:**
| ☐ | Ảnh | Tên | Danh mục | Giá | Tồn kho | Nổi bật | ⋮ |

- Tồn kho: `Badge` Còn hàng (green) / Hết hàng (red)
- Nổi bật: `Switch` (max 4 — hiện toast warning nếu bật quá 4)

**Dialog/Sheet thêm sửa:**

- name, description (textarea), price, category Select
- image upload
- vehicles compatible: multi-select chips (VF 8, VF 9, Feliz…)
- in_stock Switch, badge Input

**Bulk bar:** "Đã chọn 5" → Đổi danh mục | Bật/tắt tồn kho | Xóa

---

#### 5.9 Trang chủ (`/admin/homepage`)

**Layout:** Accordion hoặc sections stack

| Section                | UI                                                |
| ---------------------- | ------------------------------------------------- |
| Xe nổi bật             | 2 cột: Ô tô (drag sort list checkbox)             | Xe máy (drag sort list) |
| Phụ kiện nổi bật       | Grid chọn 4/4 — card selectable                   |
| Hệ sinh thái           | Repeatable: icon picker, title, desc, image, link |
| Bảo hành & DV          | title + rich text + image                         |
| Câu chuyện thương hiệu | title + rich text + image                         |
| Showroom & cộng đồng   | gallery upload + text                             |
| Newsletter             | title + description (preview card bên phải)       |

Mỗi section: Card riêng, collapse được

---

#### 5.10 Giới thiệu (`/admin/about`)

**Tabs:**

| Tab                | UI                                                |
| ------------------ | ------------------------------------------------- |
| Thống kê           | Table editable: Giá trị, Nhãn, Hậu tố — drag sort |
| Timeline           | Cards sortable: Năm, Tiêu đề, Mô tả, Ảnh          |
| Sứ mệnh & Tầm nhìn | 2 cột: rich text + image mỗi bên                  |
| Giá trị cốt lõi    | Grid cards: icon, title, desc — add/remove        |
| Gallery            | SortableImageList                                 |
| SEO                | meta fields                                       |

---

#### 5.11 Hậu mãi (`/admin/after-sales`)

**Tabs:** Dịch vụ | Bảo hành | Quy trình | Lịch BD | FAQ

**Dịch vụ:** Grid 6 cards editable (icon, title, desc, image)

**Bảo hành:** Rich text editor + list điều kiện (add/remove dòng)

**Quy trình:** Stepper UI 5 bước — mỗi bước: số, title, desc, drag reorder

**Lịch bảo dưỡng:** Table: Model, Km, Tháng, Hạng mục (tags)

**FAQ:** Accordion editor — question Input + answer Textarea, drag sort

---

#### 5.12 Pin & trạm sạc (`/admin/charging`)

**Tabs:** Thống kê | Loại trạm | Sản phẩm | FAQ | Quy trình

**Thống kê:** 4 stat cards editable (số, nhãn)

**Loại trạm:** 3 cards lớn (DC, AC, Nhà) — edit inline

**Sản phẩm:** Table + dialog: name, desc, price, image, features list

**FAQ / Quy trình:** Giống pattern hậu mãi

---

#### 5.13 Lưu trữ năng lượng (`/admin/energy-storage`)

**Tabs:** Giải pháp | Lợi ích | Ứng dụng | Quy trình | FAQ | Máy tính

**Giải pháp:** 3 tabs con: Hộ gia đình | Thương mại | Công nghiệp — mỗi tab form đầy đủ

**Máy tính:** 2 Input số: giá điện mặc định, công suất solar mặc định + preview card kết quả mock

---

#### 5.14 Lead — Danh sách (`/admin/leads`)

**Toolbar:**

- Search tên/SĐT
- Select loại: Lái thử, Đặt cọc, Báo giá, Bảo dưỡng, Phụ kiện, Newsletter…
- Select trạng thái: Mới, Đang xử lý, Hoàn thành, Hủy
- Date range picker
- Button "Xuất CSV" (toast "Đã xuất" — không file thật)

**Table:**
| ☐ | Ngày | Loại | Khách hàng | SĐT | Sản phẩm | Trạng thái | NV | ⋮ |

- Loại: `Badge` màu theo type
- Trạng thái: `Badge` Mới (blue) / Đang xử lý (yellow) / Hoàn thành (green) / Hủy (gray)
- Row click → detail

**Stats bar trên table:** Tổng 156 | Mới 12 | Đang xử lý 8 | Hoàn thành 130

---

#### 5.15 Lead — Chi tiết (`/admin/leads/[id]`)

**Layout 2 cột:**

**Trái (2/3):**

- Card "Thông tin khách": Avatar initials, tên, SĐT (nút copy), email
- Card "Yêu cầu": loại badge, sản phẩm link, ngày hẹn, ghi chú khách
- Card "Chi tiết" (conditional theo loại):
  - Bảo dưỡng: biển số, model, loại DV
  - Phụ kiện: table giỏ hàng mini
  - ESS: địa chỉ, loại giải pháp, hóa đơn điện
- Card "Ghi chú nội bộ": Textarea + timeline comments mock

**Phải (1/3) sticky:**

- Select trạng thái
- Select gán nhân viên
- Card meta: nguồn trang, thời gian gửi, IP mock
- Buttons: Gọi điện (`tel:`) | Gửi email (`mailto:`) | In (window.print)

---

#### 5.16 Tin tức (`/admin/posts`)

**List table:**
| ☐ | Ảnh | Tiêu đề | Danh mục | Trạng thái | Ngày đăng | ⋮ |

- Trạng thái: Nháp (gray) / Đã đăng (green) / Lên lịch (blue)

**Editor (full page hoặc Sheet wide):**

- Title Input
- Slug Input (auto từ title)
- Excerpt Textarea
- Cover image upload
- Category Select
- Content RichTextEditor (toolbar: bold, italic, heading, list, link, image)
- Related products multi-select
- Sidebar: status Select, publish date Calendar, SEO fields
- Preview toggle: xem trước bài viết

---

#### 5.17 Tuyển dụng (`/admin/careers`)

**Tabs:** Vị trí tuyển | Hồ sơ ứng viên

**Vị trí:** Table + dialog (title, department, location, salary, deadline, rich text JD)

**Hồ sơ:** Table: Tên, Vị trí, SĐT, Ngày nộp, Trạng thái, CV (link mock), ⋮

---

#### 5.18 Thư viện ảnh (`/admin/media`)

**Layout:**

- Toolbar: Upload button, search, filter folder Select
- View toggle: Grid | List
- Grid: masonry 4-6 cột, hover overlay (checkbox, copy URL, delete)
- Upload zone: dashed border drag-drop, progress bar mock
- Sidebar khi chọn ảnh: preview lớn, alt text Input, filename, size mock, used-in list

---

#### 5.19 SEO (`/admin/seo`)

**Table tất cả trang:**
| Trang | Title | Description | OG Image | ⋮ |

**Dialog edit:** 3 fields + preview card Google search result + preview OG card

**Section thêm:**

- Redirects table: old path → new path, nút thêm
- Sitemap: read-only list URL mock + nút "Tải sitemap"

---

#### 5.20 Đồng bộ VinFast (`/admin/sync`)

**Grid 6 cards:**

| Catalog ô tô                    | Catalog xe máy | Phụ kiện | Brochure | Gallery | Banner |
| ------------------------------- | -------------- | -------- | -------- | ------- | ------ |
| Lần cuối: mock                  | ...            | ...      | ...      | ...     | ...    |
| [Button] Đồng bộ                |                |          |          |         |        |
| Progress bar (animate on click) |                |          |          |         |        |

**Settings card:** Switch auto-sync, Select tần suất, Switch giữ giá đại lý

**Log table:** Thời gian, Loại, Trạng thái icon ✓/✗, Số bản ghi, Chi tiết

**Diff dialog (mock):** Table so sánh field old → new, checkbox chọn apply

---

#### 5.21 Người dùng (`/admin/users`)

**Table:**
| Avatar | Email | Vai trò | Đăng nhập cuối | Trạng thái | ⋮ |

- Vai trò: `Badge` Admin / Biên tập / Sale / Kỹ thuật

**Dialog thêm user:** email, password, role Select

---

#### 5.22 Cài đặt (`/admin/settings`)

**Tabs:** Chung | Thông báo | Form | Bảo trì

**Chung:** Site name, URL, logo upload, favicon upload  
**Thông báo:** List email nhận lead (tags input)  
**Form:** Showroom mặc định Select, khung giờ hẹn  
**Bảo trì:** Switch maintenance mode + message Textarea

---

### 6. COMPONENTS TÙY CHỈNH CẦN TẠO

#### `ImageUploadZone`

- Dashed border, icon Upload, text "Kéo thả hoặc click"
- Preview ảnh sau chọn file (local only)
- Nút xóa ảnh
- Props: `aspectRatio`, `label`

#### `PriceInput`

- Input number format realtime: gõ `999000000` → hiện `999.000.000`
- Suffix `₫`

#### `SortableImageList`

- Grid ảnh với drag handle
- Dùng `@dnd-kit/core` hoặc simple up/down buttons

#### `PageHeader`

```tsx
<PageHeader
  title="Ô tô điện"
  description="Quản lý 13 mẫu ô tô điện VinFast"
  action={
    <Button>
      <Plus /> Thêm mới
    </Button>
  }
/>
```

#### `EmptyState`

- Icon + title + description + optional action button

#### `StatusBadge`

- Map lead type / status → màu badge thống nhất

---

### 7. MOCK DATA

Tạo `src/components/admin/mock/`:

```typescript
// mock-leads.ts — 20 lead giả các loại
// mock-banners.ts — từ images.ts
// mock-users.ts — 4 user các role
// mock-posts.ts — 8 bài tin tức
// mock-activity.ts — dashboard timeline
```

Import `CARS`, `SCOOTERS`, accessories từ lib hiện có cho table realistic.

---

### 8. RESPONSIVE

| Breakpoint        | Hành vi                                              |
| ----------------- | ---------------------------------------------------- |
| Desktop ≥1280px   | Sidebar full, 2-col layouts                          |
| Tablet 768–1279px | Sidebar collapsed icon-only, 1-col                   |
| Mobile <768px     | Sidebar = Sheet, table → card list view, stack 2-col |

Table trên mobile: chuyển sang **card view** — mỗi row là Card với label-value pairs

---

### 9. COMMAND PALETTE (Ctrl+K)

`CommandDialog` search:

- Trang admin (go to route)
- Xe (VF 8, VF 9…)
- Lead (tên khách)
- Bài viết

Mock kết quả, click → navigate

---

### 10. THỨ TỰ TRIỂN KHAI UI

**Giai đoạn 1 — Shell**

- [ ] Admin layout + sidebar + header + breadcrumb
- [ ] Login page UI
- [ ] Dashboard với mock stats + charts
- [ ] PageHeader, EmptyState, StatusBadge components

**Giai đoạn 2 — Core pages**

- [ ] Dealership form
- [ ] Banners list + dialog
- [ ] Cars list + edit tabs (PDP editor)
- [ ] Scooters (clone cars)
- [ ] Accessories list + dialog

**Giai đoạn 3 — Content pages**

- [ ] Homepage sections
- [ ] About, After-sales, Charging, Energy-storage
- [ ] Leads list + detail

**Giai đoạn 4 — Extended**

- [ ] Posts editor
- [ ] Careers
- [ ] Media library
- [ ] SEO, Sync, Users, Settings
- [ ] Command palette

---

### 11. TIÊU CHÍ HOÀN THÀNH (UI ONLY)

- [ ] Tất cả routes `/admin/*` navigable từ sidebar
- [ ] 100% dùng shadcn/ui — không CSS custom lạ
- [ ] Label tiếng Việt đầy đủ
- [ ] Mock data realistic từ lib hiện có
- [ ] Mọi form có validation UI (zod + react-hook-form) — không cần submit thật
- [ ] Empty / loading / error states có ít nhất 1 ví dụ
- [ ] Responsive mobile usable
- [ ] Toast feedback khi Save/Delete
- [ ] Không break public site (`/admin` tách layout riêng)
- [ ] `npm run build` pass

---

### 12. LƯU Ý KHI CODE

1. `app/admin/layout.tsx` — layout riêng, **không** dùng Header/Footer public site
2. Tái sử dụng `src/components/ui/*` — cài thêm shadcn component nếu thiếu
3. `"use client"` cho interactive pages
4. Giữ types từ `cars.ts`, `car-details.ts` cho form fields
5. `formatPrice()` có sẵn — dùng hiển thị giá
6. Không tạo `app/api/*`
7. Không cài Supabase hay auth library
8. Focus polish: spacing nhất quán, hover states, focus rings

---

Bắt đầu từ **Giai đoạn 1**: tạo admin shell (sidebar + header + dashboard) với shadcn `Sidebar` component, rồi làm tuần tự các trang theo thứ tự trên.

---

## PROMPT (kết thúc)

---

_VinFast Ngọc Anh Cà Mau — Admin CMS UX/UI Prototype Prompt_
