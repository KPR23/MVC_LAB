import { Mutations, Queries } from '@/src/server/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await Queries.getEvents();
    return NextResponse.json(
      { events, message: 'Successful response with a list of events' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(NextRequest: Request) {
  try {
    const eventData = await NextRequest.json();

    const event = await Mutations.createEvent({
      event: eventData,
    });

    return new Response(JSON.stringify(event), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
