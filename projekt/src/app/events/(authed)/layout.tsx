import { verifySession } from '@/src/server/db/dal';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

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
