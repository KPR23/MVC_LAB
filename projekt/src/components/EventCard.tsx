import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
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

  function createSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const dateFrom = new Date(event.dateFrom);
  const dateTo = new Date(event.dateTo);
  const date = dateFrom < dateTo ? dateFrom : dateTo;
  const formattedDateFrom = date.toLocaleDateString('pl-PL', {
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
  let dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' });
  if (dayName.endsWith('.')) {
    dayName = dayName.slice(0, -1);
  }
  const displayDayName = capitalizeFirstLetter(dayName);

  const eventSlug = `${createSlug(event.category)}/${createSlug(event.title)}`;

  return (
    <Link href={`/events/${eventSlug}`}>
      <Card className="overflow-hidden hover:scale-105 transition-all h-full pb-6">
        <div className="relative overflow-hidden aspect-[3/4] ">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute top-3 right-3 flex">
            <Badge className="rounded-full">{event.category}</Badge>
            <Badge className="rounded-full ml-2">
              {capitalizeFirstLetter(event.city)}
            </Badge>
          </div>
        </div>

        <CardContent>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar size={16} />
            <span className="text-sm">
              {event.dateFrom === event.dateTo
                ? `${displayDayName}, ${formattedDateFromWithYear}`
                : `${formattedDateFrom} - ${formattedDateTo}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={16} />
            <span className="text-sm">{event.city}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
