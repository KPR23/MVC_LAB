import { EventModel } from '@/src/models/EventModel';
import { Mutations } from '@/src/server/db/queries';

// test
export async function GET() {
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

export async function POST(NextRequest: Request) {
  try {
    const eventData = await NextRequest.json();
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

export async function PUT(NextRequest: Request) {
  try {
    const eventData = await NextRequest.json();
    const event = await Mutations.updateEvent({
      event: eventData,
    });
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

export async function DELETE(NextRequest: Request) {
  try {
    const eventData = await NextRequest.json();
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
    return new Response(JSON.stringify({ error: 'Failed to delete event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
