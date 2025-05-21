import EventListPage from '@/src/components/EventListPage';
import TitleBox from '@/src/components/TitleBox';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { EventController } from '../controllers/EventController';

export default async function Home() {
  const events = await EventController.getAllEvents();

  return (
    <div>
      <TitleBox
        action="Wszystkie wydarzenia w jednym miejscu."
        featuredTitle="W Eventix"
        description="Znajdź i kup bilety na najlepsze wydarzenia w Twojej okolicy"
        button={false}
      />

      <div className="container mx-auto px-30">
        <h1 className="text-2xl font-bold">Popularne wydarzenia</h1>
        <EventListPage events={events} />

        <div className="flex justify-center mt-8 mb-16">
          <Link href="/events">
            <Button>Zobacz wszystkie wydarzenia</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
