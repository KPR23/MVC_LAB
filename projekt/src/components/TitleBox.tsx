import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ReactNode } from 'react';

export default function TitleBox({
  action,
  featuredTitle,
  description,
  button,
}: {
  action: string;
  featuredTitle: string;
  description: string | ReactNode;
  button: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-card py-6 xl:px-60 2xl:px-80 md:px-20 sm:px-10 mb-8 w-full">
      <div className="space-y-2 mb-4 md:mb-0">
        <h1 className="text-3xl font-bold">
          {action} <span className="text-primary ">{featuredTitle}.</span>
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {button && (
        <Link href="/events/add">
          <Button className="gap-1 w-full md:w-auto">
            <Plus />
            Dodaj wydarzenie
          </Button>
        </Link>
      )}
    </div>
  );
}
