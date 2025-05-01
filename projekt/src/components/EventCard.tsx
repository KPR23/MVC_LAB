import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import { DB_EventType } from '../server/db/schema';
import Image from 'next/image';

interface EventCardProps {
  event: DB_EventType;
}

export default function EventCard({ event }: EventCardProps) {
  const priceInPLN = event.price / 100;
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' });
  return (
    <Link href={`/events/${encodeURIComponent(event.title)}`}>
      <Card className="overflow-hidden hover-scale">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            width={500}
            height={200}
          />
          <div className="absolute top-3 right-3">
            <Badge className="rounded-full">{event.category}</Badge>
          </div>
        </div>

        <CardContent className="pt-4 pb-2">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">
            {event.title}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground mb-2">
            <Calendar size={16} />
            <span className="text-sm">
              {formattedDate}, {dayName} • {event.time.slice(0, 5)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground mb-2">
            <MapPin size={16} />
            <span className="text-sm">{event.location}</span>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {event.description}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm">
              <Ticket size={16} className="text-ticket-purple" />
              <span className="font-medium">
                zostało {event.availableSeats}
              </span>
            </div>

            <p className="font-bold">{priceInPLN} PLN</p>
          </div>
        </CardContent>

        <CardFooter className="pt-0 grid grid-cols-2 gap-4 w-full">
          <Button variant="outline">Szczegóły</Button>
          <Button>Kup bilet</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
