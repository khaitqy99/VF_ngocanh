import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VF Ngọc Anh Admin CMS',
  description: 'Quản trị nội dung website đại lý VinFast VF Ngọc Anh',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/icon.png', sizes: '32x32', type: 'image/png' }],
    shortcut: ['/favicon.ico', '/icon.png'],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
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
