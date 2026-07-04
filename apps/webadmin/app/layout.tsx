import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VF Ngọc Anh Admin CMS',
  description: 'Quản trị nội dung website đại lý VinFast VF Ngọc Anh',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
