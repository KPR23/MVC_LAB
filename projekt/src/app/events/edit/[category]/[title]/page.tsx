import { TitleBox } from '@/src/components';
import EditEventForm from '@/src/components/EditEventForm';
import { EventModel } from '@/src/models/EventModel';
import { verifySession } from '@/src/server/db/dal';
import { redirect } from 'next/navigation';

export default async function EditEventPage(props: {
  params: Promise<{ category: string; title: string }>;
}) {
  const session = await verifySession();
  if (!session) {
    redirect('/login');
  }
  const { category, title } = await props.params;
  const event = await EventModel.getEventBySlug(
    decodeURIComponent(category),
    decodeURIComponent(title)
  );

  if (event) {
    const formattedEvent = {
      ...event,
      artists: event.artistsData?.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })) || [{ id: crypto.randomUUID(), name: '' }],
    };

    return (
      <div>
        <TitleBox
          action="Edytuj"
          featuredTitle="wydarzenie"
          description="Edytuj wydarzenie, aby umożliwić innym użytkownikom zakup biletów."
          button={false}
        />
        <div className="px-80">
          <EditEventForm {...formattedEvent} />
        </div>
      </div>
    );
  }

  return <div>Event not found</div>;
}
