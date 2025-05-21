'use client';

import { cn } from '@/src/utils/utils';
import { TicketCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { logout, checkSession } from '@/src/app/actions/auth';
import { useEffect, useState } from 'react';

type Session = {
  isAuth: boolean;
  userId: string;
} | null;

export default function NavBar({
  session: initialSession,
}: {
  session?: Session;
}) {
  const [session, setSession] = useState<Session>(initialSession || null);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkSession();
      setSession(result);
    };
    checkAuth();
  }, [pathname]);

  const routes = [
    { href: '/', label: 'Strona główna', active: pathname === '/' },
    {
      href: '/events',
      label: 'Wydarzenia',
      active: pathname === '/events' || pathname.startsWith('/events/'),
    },
    {
      href: '/bookings',
      label: 'Moje bilety',
      active: pathname === '/bookings',
    },
  ];

  return (
    <div className="flex items-center gap-6 md:gap-10 py-6 xl:px-60 2xl:px-80 md:px-50 sm:px-40 border-b border-muted">
      <div className="flex items-center justify-between gap-6 md:gap-10 w-full">
        <section className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <TicketCheck className="size-6 text-primary" />
            <span className="text-xl font-semibold">Eventix</span>
          </Link>

          <nav className="hidden gap-6 md:flex ">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-md font-medium transition-colors hover:text-primary',
                  route.active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </section>
        <section className="flex items-center gap-4">
          {!session?.isAuth ? (
            <>
              <Button asChild>
                <Link href="/login">Zaloguj się</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">Zarejestruj się</Link>
              </Button>
            </>
          ) : (
            <Button onClick={() => logout()}>Wyloguj się</Button>
          )}
        </section>
      </div>
    </div>
  );
}
