'use client';
import { AddEventForm } from '@/src/components';

export default function AddEventPage() {
  return (
    <div>
      <div className="flex justify-between items-center bg-card py-8 px-80 mb-8 w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Dodaj <span className="text-primary">wydarzenie.</span>
          </h1>
          <p className="text-muted-foreground">
            Dodaj nowe wydarzenie, aby umożliwić innym użytkownikom zakup
            biletów.
          </p>
        </div>
        {/* <Link href="/events/add">
          <Button className="gap-1">
            <Plus />
            Dodaj wydarzenie
          </Button>
        </Link> */}
      </div>
      <div className="px-80">
        <AddEventForm />
      </div>
    </div>
  );
}
