import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DB_EventType } from '../server/db/schema';
import { createSlug, getEventDateInfo } from '../utils/eventUtils';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface EventCardProps {
  event: DB_EventType;
}

export default function EventCard({ event }: EventCardProps) {
  const {
    shortMonthWithoutYear,
    shortMonthWithYear,
    fullMonthWithYear,
    capitalizedShortDayName,
  } = getEventDateInfo(event);

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
                ? `${capitalizedShortDayName}, ${fullMonthWithYear}`
                : `${shortMonthWithoutYear} - ${shortMonthWithYear}`}
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
