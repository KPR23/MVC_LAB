import { Queries } from '@/src/server/db/queries';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Ticket } from 'lucide-react';
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

  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const dayName = date.toLocaleDateString('pl-PL', { weekday: 'long' });
  const priceInPLN = event.price / 100;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={20} />
            <span>
              {dayName}, {formattedDate} • {event.time.slice(0, 5)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={20} />
          <span>
            {event.location}, {event.city}
          </span>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg">{event.description}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Ticket size={20} className="text-primary" />
            <span className="font-medium">
              Dostępnych miejsc: {event.availableSeats}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{priceInPLN} PLN</p>
            <p className="text-sm text-muted-foreground">za bilet</p>
          </div>
        </div>

        <Button size="lg" className="w-full">
          Kup bilet
        </Button>
      </div>
    </div>
  );
}
