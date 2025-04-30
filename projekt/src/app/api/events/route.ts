import db from '@/src/server/db/drizzle';
import { events } from '@/src/server/db/schema';

export async function POST(NextRequest: Request) {
  const { title, description, location, imageUrl, date, capacity, price } =
    await NextRequest.json();

  try {
    const event = await db
      .insert(events)
      .values({
        title,
        description,
        location,
        imageUrl,
        date,
        capacity,
        price,
      })
      .returning();

    return new Response(JSON.stringify(event), { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
