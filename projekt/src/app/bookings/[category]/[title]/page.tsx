import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
import { Card } from '@/src/components/ui/card';
import { EventModel } from '@/src/models/EventModel';
import { createSlug, getEventDateInfo } from '@/src/utils/eventUtils';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QRCode from 'react-qr-code';

export default async function EventPage(props: {
  params: Promise<{ category: string; title: string }>;
}) {
  const { category, title } = await props.params;
  const event = await EventModel.getEventBySlug(
    decodeURIComponent(category),
    decodeURIComponent(title)
  );

  if (!event) {
    notFound();
  }

  const eventSlug = `${createSlug(event.category)}/${createSlug(event.title)}`;

  const { fullMonthWithoutYear, fullMonthWithYear } = getEventDateInfo(event);

  return (
    <div className="xl:px-50 2xl:px-80 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/bookings">Twoje bilety</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{event.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 my-6">
        <h1 className="text-5xl font-bold">{event.title}</h1>
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="xl" className="font-bold">
              <Ticket className="size-5" />
              Wyświetl swój bilet
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-lg">
              <DrawerHeader>
                <DrawerTitle>
                  Twój bilet na wydarzenie - {event.title}
                </DrawerTitle>
                <DrawerDescription>
                  Nie ma potrzeby drukowania biletu, wystarczy go wyświetlić na
                  ekranie.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Card className="p-4 bg-white">
                    <QRCode
                      value={`${
                        process.env.NEXT_PUBLIC_APP_URL ||
                        'http://localhost:3000'
                      }/ticket/${event.id}`}
                      size={250}
                      className="mx-auto"
                    />
                  </Card>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Kod biletu: {event.id.substring(0, 8).toUpperCase()}</p>
                    <p>Data zakupu: {new Date().toLocaleDateString('pl-PL')}</p>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Zamknij</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <Badge className="rounded-full">{event.category}</Badge>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          <span>
            {event.dateFrom === event.dateTo
              ? fullMonthWithYear
              : `${fullMonthWithoutYear} - ${fullMonthWithYear}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-5 h-5 text-primary" />
          <span>{event.city}</span>
        </div>
      </div>
      <div className="lg:flex gap-x-12 mb-12">
        <div className="w-80 shrink-0 space-y-6 lg:sticky lg:top-6 self-start">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              style={{ objectFit: 'cover' }}
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
          <section id="event-info">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">O wydarzeniu</h2>
            </div>
            <div className="text-lg mb-6 whitespace-pre-line">
              {event.description}
            </div>
          </section>
          <section id="artists">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Artyści</h2>
            </div>
            <div className="space-y-3">
              {event.artistsData && event.artistsData.length > 0 ? (
                event.artistsData.map((artist) => (
                  <div key={artist.id} className="p-4 border rounded-lg">
                    <h3 className="text-xl font-medium">{artist.name}</h3>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  Brak informacji o artystach
                </p>
              )}
            </div>
          </section>
          <section id="location">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Lokalizacja</h2>
            </div>
            <h3 className="text-lg mb-6">{event.location}</h3>
          </section>
        </div>
      </div>
      <div className="flex justify-end">
        <Link href={`/events/edit/${eventSlug}`}>
          <Button variant="outline">Edytuj lub usuń wydarzenie</Button>
        </Link>
      </div>
    </div>
  );
}
