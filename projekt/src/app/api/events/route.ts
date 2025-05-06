import { Queries } from '@/src/server/db/queries';
import { Mutations } from '@/src/server/db/queries';

export async function GET() {
  const events = await Queries.getEvents();
  return new Response(JSON.stringify(events), { status: 200 });
}

export async function POST(NextRequest: Request) {
  try {
    const {
      title,
      description,
      category,
      city,
      location,
      imageUrl,
      date,
      time,
      capacity,
      availableSeats,
      price,
    } = await NextRequest.json();

    const event = await Mutations.createEvent({
      event: {
        title,
        description,
        category,
        city,
        location,
        imageUrl,
        date,
        time,
        capacity,
        availableSeats,
        price,
      },
    });

    return new Response(JSON.stringify(event), { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
