import { Toaster } from '@/src/components/ui/sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Footer, NavBar } from '../components';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Eventix',
  description: 'Bilety na koncerty, festiwale, wydarzenia - Eventix',
  icons: {
    icon: '/eventix.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <NavBar />
        <main className="flex-1">{children}</main>
        <Toaster />
        <div className="sticky top-0">
          <Footer />
        </div>
      </body>
    </html>
  );
}
