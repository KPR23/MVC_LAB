import { Queries } from '@/src/server/db/queries';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Heart,
  MapPin,
  Bell,
  Share2,
  ChevronRight,
  Clock,
  Ticket,
} from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';

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
    <div className="mx-64 px-10 py-6">
      {/* Breadcrumb */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <h1 className="text-5xl font-bold">{event.title}</h1>
        <div className="flex items-center gap-6">
          {/* <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="flex flex-col items-center">
            <Heart className="w-5 h-5 text-gray-700" />
            <span className="text-sm">777</span>
          </button>
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="ml-2 text-sm">Obserwuj</span>
          </button> */}
          <Link
            href="/bilety"
            className="bg-primary hover:bg-yellow-500 font-medium py-3 px-4 rounded-md flex items-center gap-2 whitespace-nowrap"
          >
            <Ticket />
            Sprawdź bilety
          </Link>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="space-y-6">
          <div className="relative max-w-80 aspect-[3/4]">
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

        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Bilety</h2>
            </div>

            <h3 className="text-2xl font-bold mb-6">{event.city}</h3>

            <div className="border border-muted-foreground rounded-lg overflow-hidden mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <div className="space-y-1">
                  <div className="text-muted-foreground">{dayName}</div>
                  <div className="text-xl font-medium">{formattedDate}</div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time.slice(0, 5)}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {event.artists}
                    </div>
                    <div className="text-xl font-medium">{event.title}</div>
                    <div className="text-muted-foreground">
                      {event.location}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Link
                      href="/kup-bilety"
                      className="bg-primary  font-medium py-3 px-4 rounded-md flex items-center gap-2 whitespace-nowrap"
                    >
                      Kup bilety od 165,50 zł
                    </Link>
                    <div className="text-xs text-muted-foreground mt-2">
                      Cena zawiera wszystkie opłaty obowiązkowe.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
