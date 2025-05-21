import { Toaster } from '@/src/components/ui/sonner';

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
