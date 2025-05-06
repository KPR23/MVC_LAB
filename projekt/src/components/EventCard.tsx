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
  function capitalizeFirstLetter(word: string) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  let dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' });
  if (dayName.endsWith('.')) {
    dayName = dayName.slice(0, -1);
  }
  const displayDayName = capitalizeFirstLetter(dayName);
  return (
    <Link
      href={`/events/${encodeURIComponent(event.title)}`}
      className="w-[380px]"
    >
      <Card className="overflow-hidden hover-scale h-full pb-6">
        <div className="relative overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
          <div className="absolute top-3 right-3">
            <Badge className="rounded-full">{event.category}</Badge>
          </div>
        </div>

        <CardContent>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar size={16} />
            <span className="text-sm">
              {displayDayName}, {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={16} />
            <span className="text-sm">{event.city}</span>
          </div>
        </CardContent>

        {/* <CardFooter className="pt-0 grid grid-cols-2 gap-4 w-full">
          <Button variant="outline" className="text-muted-foreground">
            Szczegóły
          </Button>
          <Button className="font-semibold">Kup bilet</Button>
        </CardFooter> */}
      </Card>
    </Link>
  );
}
