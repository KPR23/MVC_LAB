import { Toaster } from '@/src/components/ui/sonner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eventix',
  description: 'Zaloguj się do Eventix',
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
    <section>
      {children}
      <Toaster />
    </section>
  );
}
