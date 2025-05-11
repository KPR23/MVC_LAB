import { EventTicketCard } from '@/src/components';
import { Badge } from '@/src/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/components/ui/breadcrumb';
import { Button } from '@/src/components/ui/button';
import { Queries } from '@/src/server/db/queries';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EventPage(props: {
  params: Promise<{ category: string; title: string }>;
}) {
  const params = await props.params;
  const events = await Queries.getEvents();

  const category = decodeURIComponent(params.category);
  const title = decodeURIComponent(params.title);

  const event = events.find(
    (e) =>
      e.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category &&
      e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === title
  );

  if (!event) {
    notFound();
  }

  const dateFrom = new Date(event.dateFrom);
  const dateTo = new Date(event.dateTo);

  const formattedDateFrom = dateFrom.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
  });
  const formattedDateTo = dateTo.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedDateFromWithYear = dateFrom.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const daysDifference = Math.ceil(
    (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)
  );

  const eventDates = Array.from({ length: daysDifference + 1 }, (_, i) => {
    const currentDate = new Date(dateFrom);
    currentDate.setDate(dateFrom.getDate() + i);
    return currentDate;
  });

  return (
    <div className="mx-64 px-10 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Wydarzenia</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">{event.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{event.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 my-6">
        <h1 className="text-5xl font-bold">{event.title}</h1>
        <Link href="#tickets">
          <Button size="xl" className="font-bold">
            <Ticket className="size-5" />
            Sprawdź bilety
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Badge className="rounded-full">{event.category}</Badge>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span>
            {event.dateFrom === event.dateTo
              ? `${formattedDateFromWithYear}`
              : `${formattedDateFrom} - ${formattedDateTo}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-5 h-5" />
          <span>{event.city}</span>
        </div>
      </div>

      <div className="lg:flex gap-x-12 mb-12">
        <div className="w-80 shrink-0 space-y-6">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              objectFit="cover"
              className="rounded-xl"
            />
          </div>

          <nav className="border-l-2 border-muted-foreground">
            <ul className="space-y-3">
              <li className="pl-4 font-medium text-muted-foreground hover:text-primary">
                <Link href="#tickets">
                  <span className="cursor-pointer">Bilety</span>
                </Link>
              </li>
              <li className="pl-4 text-muted-foreground hover:text-primary">
                <Link href="#event-info">
                  <span className="cursor-pointer">O wydarzeniu</span>
                </Link>
              </li>
              <li className="pl-4 text-muted-foreground hover:text-primary">
                <Link href="#artists">
                  <span className="cursor-pointer">Artyści</span>
                </Link>
              </li>
              <li className="pl-4 text-muted-foreground hover:text-primary">
                <Link href="#location">
                  <span className="cursor-pointer">Lokalizacja</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1 space-y-8 mt-6 lg:mt-0">
          <section id="tickets">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Bilety</h2>
            </div>

            <h3 className="text-2xl font-bold mb-6">
              {event.dateFrom === event.dateTo ? event.city : 'Karnety'}
            </h3>

            {event.dateFrom !== event.dateTo ? (
              <>
                <div className="mb-8">
                  <EventTicketCard
                    {...event}
                    dateFrom={event.dateFrom}
                    dateTo={event.dateTo}
                    title={`${event.title} - Karnet na wszystkie dni`}
                    price={Math.round(event.price * daysDifference * 0.8)}
                    availableSeats={Math.min(
                      ...eventDates.map(() => event.availableSeats)
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">
                    Bilety jednodniowe
                  </h3>
                  {eventDates.map((date) => {
                    const dayName = date.toLocaleDateString('pl-PL', {
                      weekday: 'long',
                    });
                    return (
                      <div className="mb-6" key={date.toISOString()}>
                        <EventTicketCard
                          {...event}
                          dateFrom={date.toISOString()}
                          dateTo={date.toISOString()}
                          title={`${event.title} - ${dayName}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <EventTicketCard {...event} />
            )}
          </section>

          <section id="event-info">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">O wydarzeniu</h2>
            </div>
            <h3 className="text-lg mb-6">{event.description}</h3>
          </section>
          <section id="artists">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Artyści</h2>
            </div>
            <h3 className="text-lg mb-6">
              {event.artists.length > 1
                ? event.artists
                    .split(',')
                    .map((artist) => <span key={artist}>{artist}</span>)
                : event.artists}
            </h3>
          </section>
          <section id="location">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Lokalizacja</h2>
            </div>
            <h3 className="text-lg mb-6">{event.location}</h3>
          </section>
        </div>
      </div>
    </div>
  );
}
