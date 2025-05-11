import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AddEventForm,
  EventCard,
  EventFilter,
  EventListPage,
} from '@/src/components';
import { Button } from '@/src/components/ui/button';
import { Queries } from '@/src/server/db/queries';
import { Plus, Ticket } from 'lucide-react';
import Link from 'next/link';

export default async function EventsPage() {
  const events = await Queries.getEvents();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-between items-center bg-card py-8 px-80 mb-8 w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Przeglądaj <span className="text-primary">wydarzenia.</span>
          </h1>
          <p className="text-muted-foreground">
            Odkryj i zakup bilety na nadchodzące wydarzenia
          </p>
        </div>
        <Link href="/events/add">
          <Button className="gap-1">
            <Plus />
            Dodaj wydarzenie
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-screen-xl mx-auto mb-4">
        <EventFilter />
      </div>
      <div>
        <EventListPage events={events} />
      </div>
    </div>
  );
}
