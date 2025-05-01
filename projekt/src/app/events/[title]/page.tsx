import { Queries } from '@/src/server/db/queries';

export default async function EventPage(props: {
  params: Promise<{ title: string }>;
}) {
  const params = await props.params;
  const events = await Queries.getEvents();
  const decodedTitle = decodeURIComponent(params.title);
  const event = events.find((e) => e.title === decodedTitle);

  if (!event) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Event Not Found</h1>
        <p className="mt-4">The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="mt-4">{event.description}</p>
      <p className="mt-2">Location: {event.location}</p>
      <p className="mt-2">Date: {event.date}</p>
      <p className="mt-2">Capacity: {event.capacity}</p>
      <p className="mt-2">Price: ${event.price}</p>
      <img
        src={event.imageUrl}
        alt={event.title}
        className="mt-4 rounded-lg w-full max-w-2xl"
      />
    </div>
  );
}
