import { Skeleton } from '@/src/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { EventCardSkeleton } from '..';

export default function EventsSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-between items-center bg-card py-8 px-80 mb-8 w-full">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div>
          <Button className="gap-1" disabled>
            <Plus />
            Dodaj wydarzenie
          </Button>
        </div>
      </div>

      <div className="w-full max-w-screen-xl mx-auto mb-4">
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 max-w-screen-xl mx-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="w-full max-w-[290px] flex-shrink-0">
            <EventCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
