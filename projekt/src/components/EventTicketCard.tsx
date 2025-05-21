'use client';

import { Loader2, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DB_EventType } from '../server/db/schema';
import { getEventDateInfo } from '../utils/eventUtils';
import { Button } from './ui/button';
import { Card } from './ui/card';

type EventTicketCardProps = DB_EventType & {
  cardType: 'ticket' | 'pass';
};

export default function EventTicketCard(props: EventTicketCardProps) {
  const { cardType, ...event } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    fullDayName,
    priceInPLN,
    shortMonthWithoutYear,
    shortMonthWithYear,
    fullMonthWithYear,
    shortDayName,
    shortDayNameTo,
  } = getEventDateInfo(event);

  const handleBuy = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stripe?eventId=${event.id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        toast.error(
          'Wystąpił błąd podczas przetwarzania zakupu. Spróbuj ponownie później.'
        );
      }

      const data = await response.json();

      if (data.exists) {
        if (cardType === 'ticket') {
          if (data.priceId) {
            router.push(`/events/pay?priceId=${data.priceId}`);
          } else {
            toast.error('Bilety dla tego wydarzenia nie są jeszcze dostępne.');
          }
        } else if (cardType === 'pass') {
          if (data.passPriceId) {
            router.push(`/events/pay?priceId=${data.passPriceId}`);
          } else {
            toast.error('Karnet nie jest dostępny dla tego wydarzenia.');
          }
        }
      } else {
        toast.error('Bilety dla tego wydarzenia nie są jeszcze dostępne.');
      }
    } catch (error) {
      console.error('Error buying ticket:', error);
      toast.error(
        'Wystąpił błąd podczas przetwarzania zakupu. Spróbuj ponownie później.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isMultiDayDisplay = event.dateFrom !== event.dateTo;
  return (
    <Card className="relative w-full bg-card rounded-lg shadow-sm overflow-hidden px-4">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-muted rounded-r-full z-10"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-muted rounded-l-full z-10"></div>
      <div className="rounded-lg">
        <div className="flex flex-col items-stretch md:flex-row">
          <div className="md:py-6 px-6 md:w-1/6 relative flex flex-col justify-center">
            <div className="text-muted-foreground">
              {!isMultiDayDisplay
                ? fullDayName
                : `${shortDayName} - ${shortDayNameTo}`}
            </div>
            <div className="text-xl font-bold text-foreground">
              {!isMultiDayDisplay
                ? fullMonthWithYear
                : `${shortMonthWithoutYear} - ${shortMonthWithYear}`}
            </div>
            <div className="text-muted-foreground">
              {event.time.slice(0, 5)}
            </div>
            <div className="absolute right-0 inset-y-4 w-px border-r border-dashed text-muted-foreground hidden md:block"></div>
          </div>

          <div className="md:py-6 px-6 md:w-3/6 relative flex flex-col justify-center">
            <div className="text-muted-foreground text-sm mb-1 line-clamp-1">
              {event.organizer}
            </div>
            <h2 className="text-2xl font-bold mb-1 text-foreground">
              {event.title}
            </h2>
            <div className="text-muted-foreground">{event.location}</div>
            <div className="absolute right-0 inset-y-4 w-px border-r border-dashed text-muted-foreground hidden md:block"></div>
          </div>

          <div className="py-6 px-6 md:w-2/6 flex flex-col items-center justify-center bg-card">
            <Button
              className="bg-primary transition-colors py-6 flex items-center gap-2 w-full justify-center "
              onClick={handleBuy}
              disabled={loading || priceInPLN === 0}
            >
              {!loading && <Ticket className="size-5 text-white" />}
              {loading ? (
                <>
                  <Loader2 className="size-5 text-white animate-spin" />
                  <span>Przetwarzanie...</span>
                </>
              ) : priceInPLN === 0 ? (
                <span>To wydarzenie jest darmowe</span>
              ) : cardType === 'pass' ? (
                <span>
                  Kup karnet od{' '}
                  <span className="font-bold">{priceInPLN} zł</span>
                </span>
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
