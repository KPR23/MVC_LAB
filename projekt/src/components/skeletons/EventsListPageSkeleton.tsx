import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { EventCardSkeleton } from '..';

export default function EventsSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-card py-6 xl:px-50 2xl:px-80 mb-8 w-full">
        <div className="space-y-2 mb-4 md:mb-0">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Button className="gap-1 w-full md:w-auto" disabled>
          <Plus />
          Dodaj wydarzenie
        </Button>
      </div>
      <div className="w-full xl:px-50 2xl:px-80 mb-4">
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="w-full xl:px-50 2xl:px-80">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-full max-w-[290px] flex-shrink-0">
              <EventCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
