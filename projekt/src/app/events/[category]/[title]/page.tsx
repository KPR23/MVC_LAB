import { Queries } from '@/src/server/db/queries';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { EventTicketCard } from '@/src/components';
import { Button } from '@/src/components/ui/button';

export default async function EventPage(props: {
  params: Promise<{ category: string; title: string }>;
}) {
  const params = await props.params;
  const events = await Queries.getEvents();

  const decodedCategory = decodeURIComponent(params.category);
  const decodedTitle = decodeURIComponent(params.title);

  const event = events.find(
    (e) =>
      e.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') ===
        decodedCategory &&
      e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decodedTitle
  );

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-64 px-10 py-6">
      {/* Breadcrumb */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <h1 className="text-5xl font-bold">{event.title}</h1>
        <Button size="xl" className="font-bold">
          <Ticket className="size-5" />
          Sprawdź bilety
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Badge className="rounded-full">{event.category}</Badge>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-5 h-5 text-primary" />
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
              <li className="pl-4 font-medium text-foreground">Bilety</li>
              <li className="pl-4 text-muted-foreground hover:text-primary">
                O wydarzeniu
              </li>
              <li className="pl-4 text-muted-foreground hover:text-primary">
                Artyści
              </li>
              <li className="pl-4 text-muted-foreground hover:text-primary">
                Lokalizacja
              </li>
            </ul>
          </nav>
        </div>

        {/* Prawa kolumna: bilety */}
        <div className="flex-1 space-y-8 mt-6 lg:mt-0">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Bilety</h2>
            </div>

            <h3 className="text-2xl font-bold mb-6">{event.city}</h3>

            <EventTicketCard {...event} />
          </div>
        </div>
      </div>
    </div>
  );
}
