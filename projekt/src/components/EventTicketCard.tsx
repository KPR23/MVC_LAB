import { Ticket } from 'lucide-react';
import { DB_EventType } from '../server/db/schema';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function EventTicketCard(event: DB_EventType) {
  function capitalizeFirstLetter(word: string) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  const dateFrom = new Date(event.dateFrom);
  const dateTo = new Date(event.dateTo);
  const date = dateFrom < dateTo ? dateFrom : dateTo;
  const formattedDateFrom = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
  });
  const formattedDateTo = dateTo.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedDate = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const dayName = date.toLocaleDateString('pl-PL', { weekday: 'long' });
  const priceInPLN = event.price / 100;
  const displayDayName = capitalizeFirstLetter(dayName);

  return (
    <Card className="relative w-full bg-card rounded-lg shadow-sm overflow-hidden px-4">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-muted rounded-r-full z-10"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-muted rounded-l-full z-10"></div>
      <div className="rounded-lg">
        <div className="flex flex-col items-center md:flex-row">
          <div className="p-6 md:w-1/6 md:border-r border-dashed border-muted">
            <div className="text-muted-foreground">{dayName}</div>
            <div className="text-xl font-bold text-foreground">
              {event.dateFrom === event.dateTo
                ? formattedDate
                : `${formattedDateFrom} - ${formattedDateTo}`}
            </div>
            <div className="text-muted-foreground">
              {event.time.slice(0, 5)}
            </div>
          </div>

          <div className="p-6 items-center md:w-3/6 md:border-r border-dashed border-muted">
            <div className="text-muted-foreground text-sm mb-1 line-clamp-1">
              {event.organizer}
            </div>
            <h2 className="text-2xl font-bold mb-1">{event.title}</h2>
            <div className="text-muted-foreground">{event.location}</div>
          </div>

          <div className="p-6 md:w-2/6 flex flex-col items-center justify-center bg-card">
            <Button className="bg-primary transition-colors py-6 flex items-center gap-2 w-full justify-center">
              <Ticket className="w-5 h-5 text-white" />
              {priceInPLN === 0 ? (
                <span>To wydarzenie jest darmowe</span>
              ) : (
                <span>
                  Kup bilety od{' '}
                  <span className="font-bold">{priceInPLN} zł</span>
                </span>
              )}
            </Button>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Cena zawiera wszystkie opłaty obowiązkowe.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
