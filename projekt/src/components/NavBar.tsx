'use client';

import { cn } from '@/src/utils/utils';
import { Ticket } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const routes = [
    { href: '/', label: 'Strona główna', active: pathname === '/' },
    { href: '/events', label: 'Wydarzenia', active: pathname === '/events' },
    {
      href: '/bookings',
      label: 'Moje bilety',
      active: pathname === '/bookings',
    },
  ];

  return (
    <div className="flex items-center gap-6 md:gap-10 py-6 xl:px-50 2xl:px-80 md:px-60 sm:px-40 border-b border-muted">
      <Link href="/" className="flex items-center gap-2">
        <Ticket className="size-6" />
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
    </div>
  );
}
