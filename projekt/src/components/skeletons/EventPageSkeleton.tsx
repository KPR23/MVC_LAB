import { Skeleton } from '@/src/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/src/components/ui/breadcrumb';

export default function EventPageSkeleton() {
  return (
    <div className="mx-64 px-10 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Skeleton className="h-4 w-20" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Skeleton className="h-4 w-24" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Skeleton className="h-4 w-32" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 my-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="lg:flex gap-x-12 mb-12">
        <div className="w-80 shrink-0 space-y-6">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />

          <div className="border-l-2 border-muted-foreground">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24 ml-4" />
              <Skeleton className="h-5 w-32 ml-4" />
              <Skeleton className="h-5 w-20 ml-4" />
              <Skeleton className="h-5 w-28 ml-4" />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8 mt-6 lg:mt-0">
          <section>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-7 w-40 mb-6" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-5 w-full" />
          </section>
        </div>
      </div>
    </div>
  );
}
