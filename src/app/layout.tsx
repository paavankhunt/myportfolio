import ToastProvider from '@/components/core/ToastProvider';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Paavan',
  description: 'Paavan Khunt',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ToastProvider />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
