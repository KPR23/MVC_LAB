import { TitleBox } from '@/src/components';
import EditEventForm from '@/src/components/EditEventForm';
import { EventModel } from '@/src/models/EventModel';

export default async function EditEventPage(props: {
  params: Promise<{ category: string; title: string }>;
}) {
  const { category, title } = await props.params;
  const event = await EventModel.getEventBySlug(
    decodeURIComponent(category),
    decodeURIComponent(title)
  );

  if (event) {
    const formattedEvent = {
      ...event,
      category: event.category,
      artists: event.artistsData,
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
