import { Skeleton } from '@/src/components/ui/skeleton';
import { Card, CardContent } from '../ui/card';

export default function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full pb-6">
      <div className="relative overflow-hidden aspect-[3/4]">
        <Skeleton className="absolute inset-0 w-full h-full" />

        <div className="absolute top-3 right-3 flex">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full ml-2" />
        </div>
      </div>

      <CardContent>
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-3/4 mb-4" />

        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
