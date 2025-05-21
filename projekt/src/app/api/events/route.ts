import { EventModel } from '@/src/models/EventModel';
import { verifyApiSession } from '@/src/server/db/dal';
import { Mutations } from '@/src/server/db/queries';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await verifyApiSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const events = await EventModel.getAllEvents();
    return new Response(
      JSON.stringify({
        events,
        message: 'Successful response with a list of events',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyApiSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const eventData = await request.json();
    const event = await Mutations.createEvent({
      event: eventData,
    });
    return new Response(
      JSON.stringify({ event, message: 'Event created successfully' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response(JSON.stringify({ error: 'Failed to create event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: NextRequest) {
  const session = await verifyApiSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const eventData = await request.json();
    console.log('Received data in API:', eventData);
    const event = await Mutations.updateEvent({
      event: eventData,
    });
    console.log('Update result:', event);
    return new Response(
      JSON.stringify({ event, message: 'Event updated successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return new Response(JSON.stringify({ error: 'Failed to update event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await verifyApiSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const eventData = await request.json();
    const event = await Mutations.deleteEvent({
      event: eventData,
    });
    return new Response(
      JSON.stringify({ event, message: 'Event deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting event:', error);

    const errorMessage = (error as Error).message;
    if (
      errorMessage.includes('foreign key constraint') ||
      errorMessage.includes('violates foreign key') ||
      errorMessage.includes('referenced from table "bookings"')
    ) {
      return new Response(
        JSON.stringify({
          error:
            'Nie można usunąć wydarzenia, które ma dokonane rezerwacje. Najpierw usuń wszystkie rezerwacje.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ error: 'Failed to delete event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
