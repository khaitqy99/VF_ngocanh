import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'VF Ngọc Anh Admin CMS',
  description: 'Quản trị nội dung website đại lý VinFast VF Ngọc Anh',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
